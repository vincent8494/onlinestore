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
-- 1. Seller profile  ->  fixes the Sellers page and the "Sold by" line
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
-- 2. Product features  ->  fixes the empty Features block on product pages
-- ---------------------------------------------------------------------------
-- Category-appropriate rather than one generic line repeated everywhere.

with feature_sets as (
  select
    p.id as product_id,
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
    end as features
  from public.products p
  left join public.categories c on c.id = p.category_id
)
insert into public.product_features (product_id, feature, display_order)
select fs.product_id, f.feature, f.ord - 1
from feature_sets fs
cross join lateral unnest(fs.features) with ordinality as f(feature, ord)
where not exists (
  select 1 from public.product_features pf where pf.product_id = fs.product_id
);


-- ---------------------------------------------------------------------------
-- 3. Discounts  ->  fixes the empty Deals page
-- ---------------------------------------------------------------------------
-- The Deals page reads products where original_price is set and greater than
-- price. Marks roughly a third of the catalogue down by 15-40%, deterministic
-- so re-running does not reshuffle which items are on offer.

-- abs() matters here: bit(32)::bigint is signed, so the hash is often
-- negative. Without it the modulo yields a negative discount and the "sale"
-- price ends up ABOVE the original.
update public.products p
set original_price = round((p.price / (1 - d.discount))::numeric, 2)
from (
  select
    id,
    0.15 + (abs(('x' || substr(md5(id::text), 1, 8))::bit(32)::bigint) % 26) / 100.0 as discount
  from public.products
  where abs(('x' || substr(md5(id::text), 1, 8))::bit(32)::bigint) % 3 = 0
) d
where p.id = d.id
  and p.original_price is null;


-- ---------------------------------------------------------------------------
-- 4. Check what landed
-- ---------------------------------------------------------------------------
select 'seller_profiles' as table_name, count(*) from public.seller_profiles
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
-- If you want the review UI exercised before launch, do it against a staging
-- project rather than this one.
