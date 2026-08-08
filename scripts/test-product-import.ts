/**
 * Exercises the bulk-import parser against a deliberately awkward sheet.
 *
 *   npx esbuild scripts/test-product-import.ts --bundle --platform=node \
 *     --format=esm --outfile=/tmp/t.mjs && node /tmp/t.mjs
 *
 * Checks the two claims the feature makes: that bad data cannot be committed
 * silently, and that re-importing never duplicates.
 */
import ExcelJS from 'exceljs';
import { readWorkbook, validateRows, dedupeKey } from '../src/lib/productImport';

const categories = new Map([
  ['electronics', 'cat-elec'],
  ['fashion', 'cat-fash'],
]);

async function buildSheet(): Promise<File> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Products');
  // Headers deliberately in mixed case with punctuation, to prove alias matching
  ws.addRow(['SKU', 'Product Name', 'Price', 'Stock Quantity', 'Category', 'Original Price', 'Image URL']);

  ws.addRow(['VMK-001', 'Wireless Earbuds', '$59.99', '25', 'Electronics', '79.99', 'https://x.test/a.jpg']);  // ready
  ws.addRow(['VMK-002', 'Cotton T-Shirt', '15', '120', 'fashion', '', '']);  // ready (lowercase cat)
  ws.addRow([' vmk-001 ', 'Totally Different Name', '20', '5', 'Electronics', '', '']);  // dup by SKU despite different name
  ws.addRow(['VMK-EXIST', 'Existing Widget', '10', '1', 'Electronics', '', '']);  // dup vs DB by SKU
  ws.addRow(['VMK-003', 'Wireless Earbuds', '30', '5', 'Electronics', '', '']);  // same name, new SKU -> allowed
  ws.addRow(['', 'Bad Price', 'twelve', '3', 'Electronics', '', '']);  // invalid price
  ws.addRow(['', 'Bad Category', '10', '3', 'Groceries', '', '']);  // unknown category
  ws.addRow(['', 'Negative Stock', '10', '-4', 'Electronics', '', '']);  // negative stock
  ws.addRow(['', 'Fractional Stock', '10', '2.5', 'Electronics', '', '']);  // non-integer
  ws.addRow(['', '', '10', '3', 'Electronics', '', '']);  // missing name
  ws.addRow(['', 'Bad Discount', '50', '3', 'Electronics', '20', '']);  // original <= price
  ws.addRow(['', 'Bad Image', '10', '3', 'Electronics', '', 'javascript:alert(1)']);  // unsafe image
  ws.addRow(['', 'Thousands', '1,299.00', '7', 'Electronics', '', '']);  // comma separator

  const buf = await wb.xlsx.writeBuffer();
  return new File([buf], 'test.xlsx');
}

function check(label: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok ? '' : `  expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`}`);
  if (!ok) process.exitCode = 1;
}

const main = async () => {
  const file = await buildSheet();
  const sheet = await readWorkbook(file);
  const existingKeys = new Set([dedupeKey({ sku: 'VMK-EXIST', name: 'Existing Widget' })]);

  const res = validateRows(sheet, { categories, existingKeys, defaultStatus: 'active' });
  const byName = (n: string) => res.rows.find(r => r.name.trim().toLowerCase().replace(/\s+/g, ' ') === n);

  console.log(`\nparsed ${res.rows.length} rows | ready ${res.counts.ready} | dup ${res.counts.duplicate} | invalid ${res.counts.invalid}\n`);

  check('header aliases resolved (no missing columns)', res.missingColumns, []);
  check('valid row is ready', byName('wireless earbuds')?.status, 'ready');
  check('currency symbol parsed', byName('wireless earbuds')?.price, 59.99);
  check('lowercase category resolved', byName('cotton t-shirt')?.categoryId, 'cat-fash');
  check('SKU dup within file flagged, even with a different name', byName('totally different name')?.status, 'duplicate');
  check('SKU dup vs database flagged', byName('existing widget')?.status, 'duplicate');
  check('same name with a new SKU is allowed', res.rows.filter(r => r.name === 'Wireless Earbuds').map(r => r.status), ['ready', 'ready']);
  check('SKU comparison ignores case and padding', byName('totally different name')?.issues.some(i => i.includes('appears earlier')), true);
  check('non-numeric price rejected', byName('bad price')?.status, 'invalid');
  check('unknown category rejected', byName('bad category')?.status, 'invalid');
  check('negative stock rejected', byName('negative stock')?.status, 'invalid');
  check('fractional stock rejected', byName('fractional stock')?.status, 'invalid');
  check('missing name rejected', res.rows.find(r => r.name === '')?.status, 'invalid');
  check('nonsense discount rejected', byName('bad discount')?.status, 'invalid');
  check('unsafe image url rejected', byName('bad image')?.status, 'invalid');
  check('thousands separator parsed', byName('thousands')?.price, 1299);
  check('only clean rows are importable', res.counts.ready, 4);

  // Re-import simulation: fold the imported names into the known set.
  const after = new Set([...existingKeys, ...res.rows.filter(r => r.status === 'ready').map(r => dedupeKey(r))]);
  const second = validateRows(sheet, { categories, existingKeys: after, defaultStatus: 'active' });
  check('re-importing the same sheet imports nothing', second.counts.ready, 0);
};

main().catch(e => {
  console.error(e);
  process.exit(1);
});
