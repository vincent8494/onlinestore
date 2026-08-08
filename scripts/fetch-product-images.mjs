/**
 * Sources a photograph for each imported product from Pexels, normalises it,
 * and writes the SQL to attach them.
 *
 *   node scripts/fetch-product-images.mjs
 *
 * Pexels is used because its licence permits commercial use without payment or
 * attribution, and the project already carries a key. Pulling images off
 * retailer sites would be copyright infringement and the URLs would rot.
 *
 * These are representative stock photographs of the product TYPE, not the
 * specific item a seller ships. Fine for launching a catalogue; replace them
 * with photographs of real stock before a customer could be misled about what
 * arrives.
 *
 * Outputs:
 *   public/images/products/<group>/<sku>.jpg
 *   scripts/attach-product-images.sql   (matches on SKU, run in Supabase)
 *   public/images/products/CREDITS.md   (photographer credits)
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

const API = 'https://api.pexels.com/v1/search';
const SIZE = 800;

const PRODUCTS = [
  // --- Sports & Outdoors ---
  ['VMK-SPRT-001', 'sports', 'yoga mat'],
  ['VMK-SPRT-002', 'sports', 'dumbbells weights'],
  ['VMK-SPRT-003', 'sports', 'resistance band fitness'],
  ['VMK-SPRT-004', 'sports', 'camping tent'],
  ['VMK-SPRT-005', 'sports', 'stainless steel water bottle'],
  ['VMK-SPRT-006', 'sports', 'soccer ball'],
  ['VMK-SPRT-007', 'sports', 'jump rope skipping'],
  ['VMK-SPRT-008', 'sports', 'foam roller fitness'],
  ['VMK-SPRT-009', 'sports', 'hiking backpack'],
  ['VMK-SPRT-010', 'sports', 'basketball'],
  // --- Books & Media ---
  ['VMK-BOOK-001', 'books', 'notebook journal'],
  ['VMK-BOOK-002', 'books', 'record player turntable'],
  ['VMK-BOOK-003', 'books', 'bluetooth speaker'],
  ['VMK-BOOK-004', 'books', 'ebook reader'],
  ['VMK-BOOK-005', 'books', 'microphone karaoke'],
  ['VMK-BOOK-006', 'books', 'board game'],
  ['VMK-BOOK-007', 'books', 'jigsaw puzzle'],
  ['VMK-BOOK-008', 'books', 'vinyl records'],
  ['VMK-BOOK-009', 'books', 'reading light book'],
  ['VMK-BOOK-010', 'books', 'sketchbook drawing'],
  // --- Automotive ---
  ['VMK-AUTO-001', 'automotive', 'car vacuum cleaner'],
  ['VMK-AUTO-002', 'automotive', 'dash cam car camera'],
  ['VMK-AUTO-003', 'automotive', 'tire inflator pump'],
  ['VMK-AUTO-004', 'automotive', 'car phone holder'],
  ['VMK-AUTO-005', 'automotive', 'car battery jump start'],
  ['VMK-AUTO-006', 'automotive', 'microfiber cloth car cleaning'],
  ['VMK-AUTO-007', 'automotive', 'car seat interior'],
  ['VMK-AUTO-008', 'automotive', 'car diagnostic tool'],
  ['VMK-AUTO-009', 'automotive', 'car windshield'],
  ['VMK-AUTO-010', 'automotive', 'car air freshener'],
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const env = await readFile('.env', 'utf8');
  const key = env.match(/PEXELS_API_KEY=(.+)/)?.[1]?.trim();
  if (!key) throw new Error('PEXELS_API_KEY missing from .env');

  const credits = [];
  const attach = [];
  let ok = 0;
  let failed = 0;

  for (const [sku, group, query] of PRODUCTS) {
    await mkdir(`public/images/products/${group}`, { recursive: true });

    try {
      const url = `${API}?query=${encodeURIComponent(query)}&per_page=3&orientation=square`;
      const res = await fetch(url, { headers: { Authorization: key } });
      if (!res.ok) throw new Error(`search HTTP ${res.status}`);

      const json = await res.json();
      const photo = json.photos?.[0];
      if (!photo) throw new Error('no results');

      const imgRes = await fetch(photo.src.large ?? photo.src.original);
      if (!imgRes.ok) throw new Error(`download HTTP ${imgRes.status}`);
      const buf = Buffer.from(await imgRes.arrayBuffer());

      // Square cover crop so the product grid stays even.
      const out = `public/images/products/${group}/${sku}.jpg`;
      await sharp(buf)
        .resize(SIZE, SIZE, { fit: 'cover', position: 'attention' })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(out);

      credits.push(`| ${sku} | ${query} | ${photo.photographer} | ${photo.url} |`);
      attach.push(`  ('${sku}', '/images/products/${group}/${sku}.jpg')`);
      console.log(`  ok    ${sku}  ${query}`);
      ok++;
    } catch (err) {
      console.log(`  FAIL  ${sku}  ${query}  — ${err.message}`);
      failed++;
    }

    // Courtesy pause; Pexels allows 200 requests an hour.
    await sleep(350);
  }

  // --- SQL to attach them, matched on SKU ---
  await writeFile(
    'scripts/attach-product-images.sql',
    `-- Attaches the photographs fetched by scripts/fetch-product-images.mjs.
--
-- Matched on SKU, so it does not care about product ids. Run in the Supabase
-- SQL editor. Safe to re-run: an existing primary image is updated rather than
-- duplicated.

with wanted(sku, image_url) as (
  values
${attach.join(',\n')}
)
insert into public.product_images (product_id, image_url, is_primary, display_order)
select p.id, w.image_url, true, 0
from wanted w
join public.products p on p.sku = w.sku
where not exists (
  select 1 from public.product_images pi
  where pi.product_id = p.id and pi.is_primary
);

-- Refresh the URL for any that already had a primary image.
update public.product_images pi
set image_url = w.image_url
from (
  values
${attach.join(',\n')}
) as w(sku, image_url)
join public.products p on p.sku = w.sku
where pi.product_id = p.id and pi.is_primary and pi.image_url <> w.image_url;

-- Confirm
select count(*) as products_with_an_image
from public.products p
join public.product_images pi on pi.product_id = p.id
where p.sku like 'VMK-SPRT%' or p.sku like 'VMK-BOOK%' or p.sku like 'VMK-AUTO%';
`
  );

  await writeFile(
    'public/images/products/CREDITS.md',
    `# Photo credits\n\nStock photographs from [Pexels](https://www.pexels.com), whose licence permits\ncommercial use. Attribution is not required but is recorded here as a courtesy\nand so the source of each file is traceable.\n\nThese show the product **type**, not the specific item shipped. Replace with\nphotographs of real stock before they could mislead a buyer.\n\n| SKU | Search | Photographer | Source |\n| --- | --- | --- | --- |\n${credits.join('\n')}\n`
  );

  console.log(`\n${ok} fetched, ${failed} failed`);
  console.log('wrote scripts/attach-product-images.sql and public/images/products/CREDITS.md');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
