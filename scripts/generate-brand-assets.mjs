/**
 * Generates the site logo and favicon set from the brand source image.
 *
 *   node scripts/generate-brand-assets.mjs
 *
 * Re-runnable: drop a new source at public/brand/vmk-logo-source.png and run
 * it again.
 *
 * The source is a flat PNG with an off-white background. Two details make a
 * naive colour-key wrong here:
 *
 *   1. the lettering is outlined with a cream keyline that is very close to the
 *      background colour, so keying every near-background pixel would punch
 *      holes through the outline;
 *   2. the counters of the M and K are enclosed, and must stay filled.
 *
 * So the background is removed with a flood fill seeded from the image border:
 * only background-coloured pixels *connected to the edge* are cleared, which
 * leaves interior cream intact.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const SRC = 'public/brand/vmk-logo-source.png';
const OUT = 'public/brand';

/** How far a pixel may sit from the sampled background and still count as it. */
const TOLERANCE = 38;

async function knockOutBackground() {
  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const at = (x, y) => (y * width + x) * channels;

  // Sample the background from the corners rather than assuming pure white.
  const corners = [
    [1, 1],
    [width - 2, 1],
    [1, height - 2],
    [width - 2, height - 2],
  ].map(([x, y]) => {
    const o = at(x, y);
    return [data[o], data[o + 1], data[o + 2]];
  });
  const bg = [0, 1, 2].map(i =>
    Math.round(corners.reduce((s, c) => s + c[i], 0) / corners.length)
  );

  const isBg = o => {
    const d =
      Math.abs(data[o] - bg[0]) +
      Math.abs(data[o + 1] - bg[1]) +
      Math.abs(data[o + 2] - bg[2]);
    return d <= TOLERANCE;
  };

  // Iterative flood fill from every border pixel. A stack, not recursion —
  // 1024x1024 would blow the call stack.
  const seen = new Uint8Array(width * height);
  const stack = [];
  for (let x = 0; x < width; x++) {
    stack.push([x, 0], [x, height - 1]);
  }
  for (let y = 0; y < height; y++) {
    stack.push([0, y], [width - 1, y]);
  }

  let cleared = 0;
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    const idx = y * width + x;
    if (seen[idx]) continue;
    const o = at(x, y);
    if (!isBg(o)) continue;

    seen[idx] = 1;
    data[o + 3] = 0; // transparent
    cleared++;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  const pct = ((cleared / (width * height)) * 100).toFixed(1);
  console.log(`background: rgb(${bg}) — cleared ${cleared} px (${pct}%)`);

  return sharp(data, { raw: { width, height, channels } }).png();
}

async function main() {
  await mkdir(OUT, { recursive: true });

  // 1. Transparent, tightly trimmed master
  const knocked = await knockOutBackground();
  const trimmed = await knocked.trim({ threshold: 1 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  console.log(`trimmed to ${meta.width}x${meta.height}`);

  await sharp(trimmed).toFile(`${OUT}/vmk-logo.png`);

  // 2. Wordmark for the header/footer — height-constrained, transparent
  await sharp(trimmed).resize({ height: 160 }).toFile(`${OUT}/vmk-logo-160.png`);
  await sharp(trimmed).resize({ height: 320 }).toFile(`${OUT}/vmk-logo-320.png`);

  // 3. Favicons. At 16-32px the "ONLINE STORE" strip is unreadable mush, so the
  //    small icons use just the VMK lettering (the top ~62% of the mark).
  const markHeight = Math.round(meta.height * 0.62);
  const mark = await sharp(trimmed)
    .extract({ left: 0, top: 0, width: meta.width, height: markHeight })
    .trim({ threshold: 1 })
    .toBuffer();

  for (const size of [16, 32, 48]) {
    await sharp(mark)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toFile(`${OUT}/favicon-${size}.png`);
  }

  // 4. Platform icons. iOS and Android composite these onto their own
  //    background, so a transparent icon looks broken — matte onto the brand
  //    blue sampled from the logo's outline.
  const BRAND_BLUE = { r: 20, g: 66, b: 143, alpha: 1 };
  for (const size of [180, 192, 512]) {
    const pad = Math.round(size * 0.12);
    await sharp(trimmed)
      .resize(size - pad * 2, size - pad * 2, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: BRAND_BLUE })
      .flatten({ background: BRAND_BLUE })
      .toFile(`${OUT}/icon-${size}.png`);
  }

  // 5. Web app manifest
  await writeFile(
    'public/site.webmanifest',
    JSON.stringify(
      {
        name: 'VMK Online Store',
        short_name: 'VMK Store',
        description: 'Buy and sell on the VMK Store marketplace.',
        start_url: '/',
        display: 'standalone',
        background_color: '#14428f',
        theme_color: '#1a1d23',
        icons: [
          { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/brand/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      null,
      2
    ) + '\n'
  );

  console.log('done');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
