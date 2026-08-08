-- Fixes bulk import failing with:
--   42P10  there is no unique or exclusion constraint matching the
--          ON CONFLICT specification
--
-- Run this in the Supabase SQL editor. Safe to re-run.
--
-- What went wrong
-- ---------------
-- add-product-sku.sql created a PARTIAL unique index:
--
--     create unique index products_seller_sku_key
--       on public.products (seller_id, sku)
--       where sku is not null;          <-- the problem
--
-- The importer inserts with ON CONFLICT (seller_id, sku) DO NOTHING. Postgres
-- can only match that against a partial index if the statement repeats the
-- index predicate, and PostgREST's onConflict option has no way to express a
-- WHERE clause. So the index existed, the insert could not see it, and every
-- import aborted before writing anything.
--
-- The predicate was never needed. A plain unique index already permits any
-- number of NULLs — two products with no SKU do not collide — which is exactly
-- the behaviour the partial clause was added to get. Dropping it costs nothing
-- and makes the index inferable.

drop index if exists public.products_seller_sku_key;

create unique index if not exists products_seller_sku_key
  on public.products (seller_id, sku);

-- Confirm: expect one row, indexdef with no "WHERE" at the end.
select
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
  and tablename = 'products'
  and indexname = 'products_seller_sku_key';

-- Products without a SKU should still coexist freely. This must return 0.
select count(*) as products_blocked_by_the_index
from (
  select seller_id, sku, count(*)
  from public.products
  where sku is not null
  group by seller_id, sku
  having count(*) > 1
) clashes;
