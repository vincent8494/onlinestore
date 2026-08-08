-- Adds a SKU to products and makes it the duplicate key for bulk import.
--
-- Run this in the Supabase SQL editor BEFORE using SKU-based import.
-- Safe to re-run.
--
-- Why a database constraint and not just a check in the app
-- --------------------------------------------------------
-- The importer already compares against the seller's existing SKUs before
-- inserting, but that check is a snapshot: two tabs, a double-clicked button or
-- a retried request can each pass it and then both insert. A unique index is
-- the only thing that makes duplicates actually impossible, so the import uses
-- ON CONFLICT DO NOTHING against this index rather than trusting the read.

alter table public.products
  add column if not exists sku text;

-- Scoped to the seller: two different shops may legitimately use the same SKU,
-- but one shop may not use it twice.
--
-- Nulls do not collide in a Postgres unique index, so products without a SKU
-- (everything listed before this migration, and anything added through the
-- single-product form) are unaffected and can coexist freely.
-- NOT partial. A plain unique index already permits any number of NULLs, so
-- products without a SKU coexist freely, and only a plain index can be matched
-- by the importer's ON CONFLICT (seller_id, sku). An earlier version carried a
-- `where sku is not null` predicate, which made the index invisible to that
-- statement and aborted every import with 42P10.
create unique index if not exists products_seller_sku_key
  on public.products (seller_id, sku);

-- Trim to null so that '', '  ' and absent all behave the same way, rather
-- than empty strings colliding with each other in the index.
update public.products
set sku = nullif(btrim(sku), '')
where sku is not null and sku <> btrim(sku);

comment on column public.products.sku is
  'Seller''s own stock keeping unit. Unique per seller when set; used as the duplicate key for bulk import.';

-- Confirm
select
  count(*) as products,
  count(sku) as with_sku,
  count(*) - count(sku) as without_sku
from public.products;
