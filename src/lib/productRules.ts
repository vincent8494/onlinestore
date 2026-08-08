/**
 * The rules that decide whether a product is fit to save.
 *
 * Shared deliberately between the bulk importer and the single-product forms.
 * They previously lived only inside the importer, which meant the forms could
 * accept a product the importer would reject — a fractional stock, a discount
 * that is not a discount — and the two would drift apart over time.
 *
 * Everything here is pure and works on already-parsed values, so callers own
 * the job of turning their own input (spreadsheet cells, form fields) into
 * numbers first.
 */

export type ProductStatus = 'active' | 'pending' | 'out_of_stock' | 'draft' | 'archived';

export const VALID_STATUSES: ProductStatus[] = [
  'active',
  'pending',
  'out_of_stock',
  'draft',
  'archived',
];

export const MAX_NAME_LENGTH = 200;
export const MAX_SKU_LENGTH = 64;

export interface ProductFields {
  sku: string | null;
  name: string;
  /** null means "could not be read as a number" — not "zero". */
  price: number | null;
  originalPrice: number | null;
  stock: number | null;
  categoryId: string | null;
  imageUrl: string | null;
}

/** Field-level problems, phrased for a person rather than a log. */
export function validateProductFields(f: ProductFields): string[] {
  const issues: string[] = [];

  if (!f.name?.trim()) issues.push('Name is required');
  else if (f.name.length > MAX_NAME_LENGTH) {
    issues.push(`Name is longer than ${MAX_NAME_LENGTH} characters`);
  }

  if (f.sku && f.sku.length > MAX_SKU_LENGTH) {
    issues.push(`SKU is longer than ${MAX_SKU_LENGTH} characters`);
  }

  if (f.price === null) issues.push('Price is not a number');
  else if (f.price < 0) issues.push('Price cannot be negative');

  if (f.originalPrice !== null && f.price !== null && f.originalPrice <= f.price) {
    // Not a data error as such, but it would render a nonsensical "discount".
    issues.push('Original price must be higher than price to show as a discount');
  }

  if (f.stock === null) issues.push('Stock is not a whole number');
  else if (f.stock < 0) issues.push('Stock cannot be negative');

  if (!f.categoryId) issues.push('Category is required');

  if (f.imageUrl && !isSafeImageUrl(f.imageUrl)) {
    issues.push('Image URL must start with http://, https:// or /');
  }

  return issues;
}

/**
 * Only absolute http(s) URLs and site-relative paths are accepted. This is the
 * check that keeps `javascript:` and `data:` out of an attribute that later
 * becomes an image src.
 */
export function isSafeImageUrl(url: string): boolean {
  return /^(https?:\/\/|\/)/i.test(url.trim());
}

/**
 * Money parser. Tolerates currency symbols, thousands separators and stray
 * spaces, but refuses anything not cleanly numeric — a silently mis-read price
 * is exactly the mistake this must not make.
 */
export function parseMoney(raw: string): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^0-9.-]/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return null;
  if ((cleaned.match(/\./g) ?? []).length > 1) return null;
  if (cleaned.lastIndexOf('-') > 0) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/**
 * Whole-number parser for stock.
 *
 * The decimal point is deliberately preserved while cleaning. Stripping it
 * first turned "2.5" into "25" — two and a half silently became twenty-five.
 * Keep the point, parse, then reject anything non-integral.
 */
export function parseCount(raw: string): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^0-9.-]/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return null;
  if ((cleaned.match(/\./g) ?? []).length > 1) return null;
  if (cleaned.lastIndexOf('-') > 0) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return Number.isInteger(n) ? n : null;
}

/** SKUs compare case-insensitively with surrounding space trimmed. */
export const skuKey = (sku: string) => sku.trim().toLowerCase();

/** Names compare case-insensitively with runs of whitespace collapsed. */
export const productKey = (name: string) =>
  name.trim().toLowerCase().replace(/\s+/g, ' ');

/**
 * The key a product is deduplicated on. SKU wins when present; rows without one
 * fall back to the name so they are still protected rather than duplicating.
 */
export const dedupeKey = (row: { sku: string | null; name: string }) =>
  row.sku ? `sku:${skuKey(row.sku)}` : `name:${productKey(row.name)}`;
