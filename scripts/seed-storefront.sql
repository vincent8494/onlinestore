-- Populate the tables that are empty, so the features already built in the app
-- have something to show: the Sellers page, the "Sold by" line, the product
-- Features list, and the Deals page.
--
-- Safe to re-run: every statement is idempotent.
-- Run in the Supabase SQL editor (needs elevated rights — the browser
-- publishable key cannot write these).
--
-- Deliberately NOT seeded: public.reviews. See the note at the bottom.


-- ---------------------------------------------------------------------------
-- 1. Seller profile  ->  Sellers page, "Sold by" line, ?seller= filtering
-- ---------------------------------------------------------------------------
-- The catalogue's owner is discovered from the products themselves rather than
-- hard-coded, so this works regardless of which user owns the seed data.

insert into public.seller_profiles (user_id, store_name, store_slug, bio, location, is_verified)
select
  p.seller_id,
  'VMK Store',
  'vmk-store',
  'The house storefront for VMK Store. Electronics, fashion, home, grocery and beauty, shipped worldwide.',
  'Nairobi, Kenya',
  true
from public.products p
group by p.seller_id
on conflict (user_id) do nothing;


-- ---------------------------------------------------------------------------
-- 2. Product features  ->  the empty Features block on product pages
-- ---------------------------------------------------------------------------

insert into public.product_features (product_id, feature, display_order)
select p.id, x.feature, (x.ord - 1)::int
from public.products p
left join public.categories c on c.id = p.category_id
cross join lateral unnest(
  case c.name
    when 'Electronics' then array[
      'Manufacturer warranty included',
      'Tested before dispatch',
      'Compatible with standard accessories',
      'Energy efficient']
    when 'Fashion' then array[
      'True-to-size fit',
      'Machine washable',
      'Breathable fabric',
      'Free size exchange']
    when 'Grocery' then array[
      'Freshness guaranteed on delivery',
      'Sourced from local suppliers',
      'Sealed for transport',
      'Store in a cool, dry place']
    when 'Beauty & Personal Care' then array[
      'Dermatologically tested',
      'Suitable for daily use',
      'Not tested on animals',
      'Sealed for hygiene']
    when 'Home & Garden' then array[
      'Assembly instructions included',
      'Durable everyday materials',
      'Easy to clean',
      'Fits standard fittings']
    else array[
      'Quality checked before dispatch',
      'Backed by buyer protection',
      'Ships within 24 hours']
  end
) with ordinality as x(feature, ord)
where not exists (
  select 1 from public.product_features pf where pf.product_id = p.id
);


-- ---------------------------------------------------------------------------
-- 3. Discounts  ->  the empty Deals page
-- ---------------------------------------------------------------------------
-- The Deals page reads products where original_price is set and greater than
-- price. Every third product (ordered by id, so the choice is stable) gets an
-- original_price 20-50% above its current price, i.e. a 17-33% saving.
--
-- Uses row_number() rather than a hash of the id. The previous version cast
-- bit(32) to bigint; Postgres only defines bit -> int4, so that raised an
-- error and aborted the rest of the script.

with ranked as (
  select id, row_number() over (order by id) as rn
  from public.products
  where original_price is null
)
update public.products p
set original_price = round(p.price * (1 + (((r.rn % 4) + 2) / 10.0)), 2)
from ranked r
where p.id = r.id
  and r.rn % 3 = 0;


-- ---------------------------------------------------------------------------
-- 4. Check what landed
-- ---------------------------------------------------------------------------
select 'seller_profiles' as table_name, count(*) as rows from public.seller_profiles
union all select 'product_features', count(*) from public.product_features
union all select 'products on sale',
  count(*) from public.products where original_price > price
union all select 'products total', count(*) from public.products;


-- ---------------------------------------------------------------------------
-- Note on reviews
-- ---------------------------------------------------------------------------
-- public.reviews is left empty on purpose.
--
-- reviews.user_id references public.users(id), so seeded reviews would have to
-- be attributed to a real account — in practice the seller's own. Invented
-- ratings and testimonials on a live marketplace mislead buyers, and in many
-- jurisdictions publishing fabricated reviews is unlawful, not merely
-- distasteful. The star ratings on cards read from products.average_rating,
-- which stays 0 until genuine reviews arrive; the UI already handles that.
--
-- Note also that the schema's after_review_change trigger recalculates
-- average_rating and review_count automatically, so those columns should never
-- be written by hand.
