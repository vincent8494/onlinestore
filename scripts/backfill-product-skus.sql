-- Generates SKUs for products that do not have one.
--
-- Run in the Supabase SQL editor, after scripts/add-product-sku.sql.
-- Safe to re-run: only rows where sku is null are touched, so codes already
-- assigned (or entered by hand) are never rewritten.
--
-- Format:  VMK-ELEC-001
--          |   |    |
--          |   |    +-- sequence within that seller and category
--          |   +------- four-letter category code
--          +----------- house prefix
--
-- Numbering is ordered by product name rather than by id or created_at, so the
-- same catalogue always produces the same codes. That matters if you rebuild a
-- staging copy and expect the SKUs to line up.

with base as (
  select
    p.id,
    p.name,
    -- Spelled out per category rather than derived from the name: "Beauty &
    -- Personal Care" and "Books & Media" share their first letters, so any
    -- substring rule would collide.
    case c.name
      when 'Electronics'            then 'ELEC'
      when 'Fashion'                then 'FASH'
      when 'Grocery'                then 'GROC'
      when 'Home & Garden'          then 'HOME'
      when 'Beauty & Personal Care' then 'BEAU'
      when 'Sports & Outdoors'      then 'SPRT'
      when 'Books & Media'          then 'BOOK'
      when 'Automotive'             then 'AUTO'
      else 'GEN'
    end as cat_code,
    p.seller_id
  from public.products p
  left join public.categories c on c.id = p.category_id
  where p.sku is null
),
coded as (
  select
    id,
    cat_code,
    row_number() over (
      partition by seller_id, cat_code
      order by lower(name), id
    ) as seq
  from base
)
update public.products p
set sku = 'VMK-' || coded.cat_code || '-' || lpad(coded.seq::text, 3, '0')
from coded
where p.id = coded.id;


-- ---------------------------------------------------------------------------
-- Report
-- ---------------------------------------------------------------------------
select
  coalesce(c.name, '(uncategorised)') as category,
  count(*)                            as products,
  min(p.sku)                          as first_sku,
  max(p.sku)                          as last_sku
from public.products p
left join public.categories c on c.id = p.category_id
group by c.name
order by c.name;


-- Sanity check.
--
-- The distinct counts are filtered to non-null SKUs on purpose: a row value
-- like (seller, null) is itself non-null, so an unfiltered count(distinct ...)
-- would treat every un-SKU'd product as sharing one value and report phantom
-- duplicates.
select
  count(*)                                                        as total,
  count(sku)                                                      as with_sku,
  count(*) - count(sku)                                           as still_missing,
  count(sku) - count(distinct (seller_id, sku))
    filter (where sku is not null)                                as duplicate_pairs
from public.products;
