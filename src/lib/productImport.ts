import ExcelJS from 'exceljs';

/**
 * Bulk product import: spreadsheet -> validated rows.
 *
 * Everything here is pure apart from `readWorkbook`, so the rules that decide
 * whether a row is safe to insert can be read in one place. Nothing in this
 * module writes to the database — the page decides that, after the seller has
 * seen the preview.
 */

export type RowStatus = 'ready' | 'duplicate' | 'invalid';

export interface ParsedRow {
  /** 1-based row number in the sheet, so errors point at something real. */
  rowNumber: number;
  status: RowStatus;
  /** Why it was rejected, or why it is considered a duplicate. */
  issues: string[];
  sku: string | null;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  stock: number;
  categoryName: string;
  categoryId: string | null;
  imageUrl: string | null;
  status_value: ProductStatus;
}

export type ProductStatus = 'active' | 'pending' | 'out_of_stock' | 'draft' | 'archived';

const VALID_STATUSES: ProductStatus[] = [
  'active',
  'pending',
  'out_of_stock',
  'draft',
  'archived',
];

/**
 * Accepted spellings for each column. Headers are matched case-insensitively
 * with punctuation and spacing stripped, so "Product Name", "product_name" and
 * "NAME" all resolve to the same field.
 */
const COLUMN_ALIASES: Record<string, string[]> = {
  sku: ['sku', 'skucode', 'productcode', 'itemcode', 'partnumber', 'mpn', 'barcode'],
  name: ['name', 'productname', 'product', 'title'],
  description: ['description', 'desc', 'details'],
  price: ['price', 'sellingprice', 'amount'],
  originalPrice: ['originalprice', 'wasprice', 'rrp', 'listprice', 'comparefeprice', 'compareatprice'],
  stock: ['stock', 'stockquantity', 'quantity', 'qty', 'inventory'],
  category: ['category', 'categoryname', 'department'],
  imageUrl: ['imageurl', 'image', 'imagelink', 'photo', 'picture'],
  status: ['status', 'state'],
};

/** The header row written into the downloadable template. */
export const TEMPLATE_COLUMNS = [
  'sku',
  'name',
  'description',
  'price',
  'original_price',
  'stock_quantity',
  'category',
  'image_url',
  'status',
] as const;

const normaliseHeader = (h: string) => h.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Comparison key for duplicate detection: case and spacing insensitive. */
export const productKey = (name: string) => name.trim().toLowerCase().replace(/\s+/g, ' ');

/**
 * SKUs are compared case-insensitively with surrounding space removed, so
 * "abc-123", "ABC-123 " and " Abc-123" are one product. Internal punctuation is
 * preserved — "ABC-123" and "ABC123" are different codes and must not merge.
 */
export const skuKey = (sku: string) => sku.trim().toLowerCase();

/**
 * The key a row is deduplicated on. SKU wins when present; rows without one
 * fall back to the product name so they are still protected rather than
 * silently duplicating.
 */
export const dedupeKey = (row: { sku: string | null; name: string }) =>
  row.sku ? `sku:${skuKey(row.sku)}` : `name:${productKey(row.name)}`;

/**
 * Excel cells can arrive as numbers, strings, formula results or rich text.
 * Flatten whatever we got to a trimmed string.
 */
function cellText(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') {
    // ExcelJS's union of cell shapes has no index signature, so widen through
    // unknown rather than asserting one shape over another.
    const v = value as unknown as Record<string, unknown>;
    // formula cell -> use the computed result
    if ('result' in v) return cellText(v.result as ExcelJS.CellValue);
    if ('text' in v) return String(v.text).trim();
    if ('richText' in v && Array.isArray(v.richText)) {
      return (v.richText as { text: string }[]).map(r => r.text).join('').trim();
    }
    if ('hyperlink' in v) return String(v.hyperlink).trim();
  }
  return String(value).trim();
}

/**
 * Money parser. Tolerates currency symbols, thousands separators and stray
 * spaces, but refuses anything that is not cleanly a number — a silently
 * mis-read price is exactly the sort of mistake this import must not make.
 */
function parseMoney(raw: string): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^0-9.-]/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return null;
  // Reject multiple decimal points or embedded minus signs.
  if ((cleaned.match(/\./g) ?? []).length > 1) return null;
  if (cleaned.lastIndexOf('-') > 0) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/**
 * Whole-number parser for stock.
 *
 * The decimal point is deliberately preserved while cleaning. Stripping it
 * first turned "2.5" into "25" — a stock of two and a half silently became
 * twenty-five. Keep the point, parse, then reject anything non-integral.
 */
function parseCount(raw: string): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^0-9.-]/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return null;
  if ((cleaned.match(/\./g) ?? []).length > 1) return null;
  if (cleaned.lastIndexOf('-') > 0) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return Number.isInteger(n) ? n : null;
}

export interface RawSheet {
  headers: string[];
  rows: { rowNumber: number; cells: Record<string, string> }[];
}

/** Reads the first worksheet of an .xlsx/.csv file into normalised cells. */
export async function readWorkbook(file: File): Promise<RawSheet> {
  const buffer = await file.arrayBuffer();
  const wb = new ExcelJS.Workbook();

  if (file.name.toLowerCase().endsWith('.csv')) {
    const text = new TextDecoder().decode(buffer);
    // ExcelJS's csv reader wants a stream; parsing by hand keeps this simple
    // and avoids pulling a Node stream polyfill into the browser bundle.
    return parseCsv(text);
  }

  await wb.xlsx.load(buffer);
  const ws = wb.worksheets[0];
  if (!ws) throw new Error('That file has no worksheets.');

  const headerRow = ws.getRow(1);
  const headers: string[] = [];
  headerRow.eachCell({ includeEmpty: true }, (cell, col) => {
    headers[col - 1] = cellText(cell.value);
  });

  const rows: RawSheet['rows'] = [];
  ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;
    const cells: Record<string, string> = {};
    let hasAny = false;
    headers.forEach((h, i) => {
      if (!h) return;
      const text = cellText(row.getCell(i + 1).value);
      cells[normaliseHeader(h)] = text;
      if (text) hasAny = true;
    });
    if (hasAny) rows.push({ rowNumber, cells });
  });

  return { headers: headers.filter(Boolean), rows };
}

/** Minimal RFC4180-ish CSV parser: handles quoted fields and embedded commas. */
function parseCsv(text: string): RawSheet {
  const records: string[][] = [];
  let field = '';
  let record: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') {
      record.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      record.push(field);
      field = '';
      if (record.some(f => f.trim() !== '')) records.push(record);
      record = [];
    } else field += c;
  }
  record.push(field);
  if (record.some(f => f.trim() !== '')) records.push(record);

  const [headerRow, ...body] = records;
  if (!headerRow) return { headers: [], rows: [] };
  const headers = headerRow.map(h => h.trim());

  return {
    headers: headers.filter(Boolean),
    rows: body.map((cols, i) => {
      const cells: Record<string, string> = {};
      headers.forEach((h, ci) => {
        if (h) cells[normaliseHeader(h)] = (cols[ci] ?? '').trim();
      });
      return { rowNumber: i + 2, cells };
    }),
  };
}

/** Resolves the sheet's headers to our field names. */
function mapColumns(headers: string[]) {
  const present = headers.map(normaliseHeader);
  const found: Record<string, string | null> = {};
  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    found[field] = present.find(h => aliases.includes(h)) ?? null;
  }
  return found;
}

export interface ValidateOptions {
  /** Category name -> id, from the database. */
  categories: Map<string, string>;
  /**
   * Dedupe keys the seller already has listed, as produced by `dedupeKey` —
   * `sku:...` for products with a SKU, `name:...` for those without.
   */
  existingKeys: Set<string>;
  /** Applied when the sheet has no status column. */
  defaultStatus: ProductStatus;
}

export interface ValidationResult {
  rows: ParsedRow[];
  /** Required columns the sheet is missing entirely. */
  missingColumns: string[];
  counts: { ready: number; duplicate: number; invalid: number };
}

export function validateRows(sheet: RawSheet, opts: ValidateOptions): ValidationResult {
  const cols = mapColumns(sheet.headers);
  const missingColumns: string[] = [];
  for (const required of ['name', 'price', 'stock', 'category']) {
    if (!cols[required]) missingColumns.push(required);
  }

  // Names seen earlier in this same file, so one sheet cannot insert the same
  // product twice.
  const seenInFile = new Set<string>();
  const rows: ParsedRow[] = [];

  for (const { rowNumber, cells } of sheet.rows) {
    const issues: string[] = [];
    const get = (field: string) => (cols[field] ? cells[cols[field] as string] ?? '' : '');

    const sku = get('sku');
    const name = get('name');
    const description = get('description');
    const priceRaw = get('price');
    const originalRaw = get('originalPrice');
    const stockRaw = get('stock');
    const categoryName = get('category');
    const imageUrl = get('imageUrl');
    const statusRaw = get('status').toLowerCase().replace(/\s+/g, '_');

    if (!name) issues.push('Name is required');
    else if (name.length > 200) issues.push('Name is longer than 200 characters');

    if (sku && sku.length > 64) issues.push('SKU is longer than 64 characters');

    const price = parseMoney(priceRaw);
    if (price === null) issues.push(`Price "${priceRaw}" is not a number`);
    else if (price < 0) issues.push('Price cannot be negative');

    const originalPrice = originalRaw ? parseMoney(originalRaw) : null;
    if (originalRaw && originalPrice === null) {
      issues.push(`Original price "${originalRaw}" is not a number`);
    } else if (originalPrice !== null && price !== null && originalPrice <= price) {
      // Not fatal, but it would render a nonsensical "discount".
      issues.push('Original price must be higher than price to show as a discount');
    }

    const stock = parseCount(stockRaw);
    if (stock === null) issues.push(`Stock "${stockRaw}" is not a whole number`);
    else if (stock < 0) issues.push('Stock cannot be negative');

    let categoryId: string | null = null;
    if (!categoryName) {
      issues.push('Category is required');
    } else {
      categoryId = opts.categories.get(categoryName.trim().toLowerCase()) ?? null;
      if (!categoryId) {
        issues.push(
          `Category "${categoryName}" does not exist. Valid: ${[...opts.categories.keys()].join(', ')}`
        );
      }
    }

    let statusValue: ProductStatus = opts.defaultStatus;
    if (statusRaw) {
      if ((VALID_STATUSES as string[]).includes(statusRaw)) {
        statusValue = statusRaw as ProductStatus;
      } else {
        issues.push(`Status "${statusRaw}" is not one of: ${VALID_STATUSES.join(', ')}`);
      }
    }

    if (imageUrl && !/^(https?:\/\/|\/)/i.test(imageUrl)) {
      issues.push('Image URL must start with http://, https:// or /');
    }

    const key = dedupeKey({ sku: sku || null, name });
    const bySku = Boolean(sku);
    let status: RowStatus = 'ready';
    if (issues.length > 0) {
      status = 'invalid';
    } else if (opts.existingKeys.has(key)) {
      status = 'duplicate';
      issues.push(
        bySku
          ? `You already have a product with SKU "${sku}" — it will be skipped`
          : 'You already have a product with this name — it will be skipped'
      );
    } else if (seenInFile.has(key)) {
      status = 'duplicate';
      issues.push(
        bySku
          ? `SKU "${sku}" appears earlier in the file — only the first is imported`
          : 'This name appears earlier in the file — only the first is imported'
      );
    }

    if (status === 'ready') seenInFile.add(key);

    rows.push({
      rowNumber,
      status,
      issues,
      sku: sku || null,
      name,
      description: description || null,
      price: price ?? 0,
      originalPrice,
      stock: stock ?? 0,
      categoryName,
      categoryId,
      imageUrl: imageUrl || null,
      status_value: statusValue,
    });
  }

  return {
    rows,
    missingColumns,
    counts: {
      ready: rows.filter(r => r.status === 'ready').length,
      duplicate: rows.filter(r => r.status === 'duplicate').length,
      invalid: rows.filter(r => r.status === 'invalid').length,
    },
  };
}

/** Builds the downloadable .xlsx template, with a couple of example rows. */
export async function buildTemplate(categoryNames: string[]): Promise<Blob> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Products');

  ws.columns = TEMPLATE_COLUMNS.map(key => ({
    header: key,
    key,
    width: key === 'description' ? 46 : key === 'image_url' ? 40 : key === 'sku' ? 22 : 20,
  }));
  ws.getRow(1).font = { bold: true };

  ws.addRow({
    sku: 'VMK-EARB-001',
    name: 'Wireless Earbuds',
    description: 'Bluetooth 5.3 earbuds with charging case',
    price: 59.99,
    original_price: 79.99,
    stock_quantity: 25,
    category: categoryNames[0] ?? 'Electronics',
    image_url: 'https://example.com/earbuds.jpg',
    status: 'active',
  });
  ws.addRow({
    sku: 'VMK-TSHIRT-BLK-M',
    name: 'Cotton T-Shirt',
    description: 'Regular fit, 100% cotton',
    price: 15,
    original_price: '',
    stock_quantity: 120,
    category: categoryNames[1] ?? 'Fashion',
    image_url: '',
    status: 'active',
  });

  // A reference sheet, so sellers do not have to guess the accepted values.
  const ref = wb.addWorksheet('Valid values');
  ref.columns = [
    { header: 'category', key: 'category', width: 30 },
    { header: 'status', key: 'status', width: 20 },
  ];
  ref.getRow(1).font = { bold: true };
  const maxLen = Math.max(categoryNames.length, VALID_STATUSES.length);
  for (let i = 0; i < maxLen; i++) {
    ref.addRow({ category: categoryNames[i] ?? '', status: VALID_STATUSES[i] ?? '' });
  }

  const buf = await wb.xlsx.writeBuffer();
  return new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
