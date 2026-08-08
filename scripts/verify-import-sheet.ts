/** Runs the generated sheet through the real importer validation. */
import { readFile } from 'node:fs/promises';
import { readWorkbook, validateRows } from '../src/lib/productImport';

const cats: { id: string; name: string }[] = JSON.parse(
  await readFile('/tmp/cats.json', 'utf8')
);
const categories = new Map(cats.map(c => [c.name.toLowerCase(), c.id]));

const buf = await readFile('vmk-products-import.xlsx');
const file = new File([new Uint8Array(buf)], 'vmk-products-import.xlsx');

const sheet = await readWorkbook(file);
const res = validateRows(sheet, { categories, existingKeys: new Set(), defaultStatus: 'active' });

console.log(`rows ${res.rows.length} | ready ${res.counts.ready} | dup ${res.counts.duplicate} | invalid ${res.counts.invalid}`);
console.log('missing columns:', res.missingColumns.length ? res.missingColumns : 'none');

const bad = res.rows.filter(r => r.status !== 'ready');
if (bad.length) {
  console.log('\nrows that would NOT import:');
  bad.forEach(r => console.log(`  row ${r.rowNumber} "${r.name}" -> ${r.issues.join('; ')}`));
} else {
  console.log('\nall rows validate cleanly');
}
const onSale = res.rows.filter(r => r.originalPrice && r.originalPrice > r.price).length;
console.log(`rows that will appear on the Deals page: ${onSale}`);
