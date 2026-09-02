-- Attaches photographs to the 30 bulk-imported products that had none.
--
-- Matched on SKU, so product ids do not matter. Run in the Supabase SQL
-- editor. Safe to re-run: a product that already has a primary image is left
-- alone rather than gaining a second one.
--
-- Stock photographs from Pexels, whose licence permits commercial use. Each
-- was reviewed by eye and rejected if it carried a visible trademark or showed
-- the wrong product; see public/images/products/CREDITS.md.
--
-- These show the product TYPE, not the specific item a seller ships. Replace
-- them with photographs of real stock before a buyer could be misled.

-- ---------------------------------------------------------------------------
-- 1. Reviewed and accepted (22 products)
-- ---------------------------------------------------------------------------
with wanted(sku, image_url) as (
  values
  ('VMK-SPRT-001', '/images/products/sports/VMK-SPRT-001.jpg'),
  ('VMK-SPRT-004', '/images/products/sports/VMK-SPRT-004.jpg'),
  ('VMK-SPRT-005', '/images/products/sports/VMK-SPRT-005.jpg'),
  ('VMK-SPRT-006', '/images/products/sports/VMK-SPRT-006.jpg'),
  ('VMK-SPRT-007', '/images/products/sports/VMK-SPRT-007.jpg'),
  ('VMK-SPRT-008', '/images/products/sports/VMK-SPRT-008.jpg'),
  ('VMK-SPRT-009', '/images/products/sports/VMK-SPRT-009.jpg'),
  ('VMK-SPRT-010', '/images/products/sports/VMK-SPRT-010.jpg'),
  ('VMK-BOOK-001', '/images/products/books/VMK-BOOK-001.jpg'),
  ('VMK-BOOK-002', '/images/products/books/VMK-BOOK-002.jpg'),
  ('VMK-BOOK-003', '/images/products/books/VMK-BOOK-003.jpg'),
  ('VMK-BOOK-004', '/images/products/books/VMK-BOOK-004.jpg'),
  ('VMK-BOOK-005', '/images/products/books/VMK-BOOK-005.jpg'),
  ('VMK-BOOK-006', '/images/products/books/VMK-BOOK-006.jpg'),
  ('VMK-BOOK-007', '/images/products/books/VMK-BOOK-007.jpg'),
  ('VMK-BOOK-008', '/images/products/books/VMK-BOOK-008.jpg'),
  ('VMK-BOOK-009', '/images/products/books/VMK-BOOK-009.jpg'),
  ('VMK-BOOK-010', '/images/products/books/VMK-BOOK-010.jpg'),
  ('VMK-AUTO-001', '/images/products/automotive/VMK-AUTO-001.jpg'),
  ('VMK-AUTO-002', '/images/products/automotive/VMK-AUTO-002.jpg'),
  ('VMK-AUTO-003', '/images/products/automotive/VMK-AUTO-003.jpg'),
  ('VMK-AUTO-006', '/images/products/automotive/VMK-AUTO-006.jpg')
)
insert into public.product_images (product_id, image_url, is_primary, display_order)
select p.id, w.image_url, true, 0
from wanted w
join public.products p on p.sku = w.sku
where not exists (
  select 1 from public.product_images pi where pi.product_id = p.id and pi.is_primary
);

-- ---------------------------------------------------------------------------
-- 2. Marginal (4 products) — COMMENTED OUT BY DEFAULT
--
-- Each of these shows the right general category but not quite the product:
--   VMK-SPRT-002  fixed hex dumbbells, listing says "adjustable"
--   VMK-SPRT-003  two loop bands, listing says "5 pieces"
--   VMK-AUTO-004  a clamp cradle, listing says "magnetic"
--   VMK-AUTO-005  jump leads, listing says "jump starter pack"
--
-- The files are on disk either way. Uncomment to use them, or fix the four
-- listings to match what the photographs actually show.
-- ---------------------------------------------------------------------------
/*
with wanted(sku, image_url) as (
  values
  ('VMK-SPRT-002', '/images/products/sports/VMK-SPRT-002.jpg'),
  ('VMK-SPRT-003', '/images/products/sports/VMK-SPRT-003.jpg'),
  ('VMK-AUTO-004', '/images/products/automotive/VMK-AUTO-004.jpg'),
  ('VMK-AUTO-005', '/images/products/automotive/VMK-AUTO-005.jpg')
)
insert into public.product_images (product_id, image_url, is_primary, display_order)
select p.id, w.image_url, true, 0
from wanted w
join public.products p on p.sku = w.sku
where not exists (
  select 1 from public.product_images pi where pi.product_id = p.id and pi.is_primary
);
*/

-- Confirm
select count(*) filter (where pi.id is not null) as with_image,
       count(*) filter (where pi.id is null)     as still_missing
from public.products p
left join public.product_images pi on pi.product_id = p.id and pi.is_primary
where p.sku like 'VMK-SPRT%' or p.sku like 'VMK-BOOK%' or p.sku like 'VMK-AUTO%';
