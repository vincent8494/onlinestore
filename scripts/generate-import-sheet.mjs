/**
 * Builds a ready-to-import spreadsheet for the three empty categories.
 *
 *   node scripts/generate-import-sheet.mjs
 *
 * Output: vmk-products-import.xlsx in the project root.
 *
 * Columns match src/lib/productImport.ts exactly, and SKUs continue the
 * VMK-<CAT>-<NNN> scheme from scripts/backfill-product-skus.sql. SPRT, BOOK and
 * AUTO are unused so far, so numbering starts at 001 with no risk of collision.
 *
 * Prices are typical market rates for these product types rather than a quote
 * for any specific branded item — check them against your own suppliers before
 * going live.
 */
import ExcelJS from 'exceljs';

const sports = [
  ['Yoga Mat, 6mm NBR Non-Slip', 'Cushioned 6mm mat with textured non-slip surface and carry strap. 183 x 61 cm.', 18.0, 24.0, 40],
  ['Adjustable Dumbbell Set, 20kg', 'Pair of adjustable dumbbells with spinlock collars. Plates included, 20kg total.', 89.0, null, 15],
  ['Resistance Band Set, 5 Pieces', 'Five latex loop bands from light to extra heavy, with mesh carry bag.', 15.0, 20.0, 60],
  ['Camping Tent, 4 Person Waterproof', 'Double-layer dome tent, 3000mm waterproof rating, taped seams, 2.4kg packed.', 120.0, null, 12],
  ['Insulated Water Bottle, 1L Stainless', 'Double-wall vacuum flask, keeps drinks cold 24h or hot 12h. BPA free.', 22.0, 28.0, 75],
  ['Match Football, Size 5', 'Machine-stitched match ball with butyl bladder. Regulation size and weight.', 28.0, null, 45],
  ['Weighted Skipping Rope', 'Adjustable steel cable rope with weighted handles and ball bearings.', 12.0, null, 80],
  ['Foam Roller, 45cm', 'High-density EVA roller with textured grid for deep tissue release.', 20.0, 26.0, 35],
  ['Hiking Backpack, 40L', 'Ventilated back panel, rain cover, hydration sleeve and load-adjust straps.', 65.0, null, 20],
  ['Basketball, Size 7 Indoor/Outdoor', 'Composite leather cover with deep channels for grip. Indoor and outdoor use.', 32.0, 40.0, 30],
];

const books = [
  ['Hardcover Ruled Notebook, A5', '192 ruled pages, 100gsm cream paper, elastic closure and ribbon marker.', 9.0, null, 120],
  ['Bluetooth Turntable with Speakers', 'Belt-drive turntable, 33/45/78 RPM, built-in stereo speakers and Bluetooth out.', 145.0, 189.0, 8],
  ['Portable Bluetooth Speaker, 20W', 'IPX7 waterproof, 20W output, 24-hour battery and stereo pairing.', 45.0, null, 50],
  ['E-Reader, 6 inch Glare-Free', '6" 300ppi glare-free display, adjustable warm light, weeks of battery.', 110.0, 139.0, 18],
  ['Wireless Karaoke Microphone', 'Handheld mic and speaker in one, Bluetooth, echo control, USB-C charging.', 28.0, null, 40],
  ['Strategy Board Game, 2-4 Players', 'Tile-laying strategy game for 2-4 players. 45 minute play time, ages 10+.', 35.0, 45.0, 25],
  ['Jigsaw Puzzle, 1000 Pieces', '1000-piece puzzle on 2mm board, finished size 68 x 48 cm, poster included.', 18.0, null, 55],
  ['Vinyl Record Storage Crate', 'Solid pine crate holding roughly 80 LPs. Stackable, natural finish.', 40.0, null, 22],
  ['Rechargeable Clip-On Book Light', 'Three brightness levels, warm and cool modes, 60-hour runtime, USB-C.', 14.0, 19.0, 90],
  ['Sketchbook, A4 120gsm', '80 sheets of 120gsm acid-free paper, hardbound, suitable for dry media.', 12.0, null, 70],
];

const automotive = [
  ['Car Vacuum Cleaner, 12V', 'Handheld 12V vacuum with HEPA filter, 4.5m cord and crevice attachments.', 38.0, 49.0, 30],
  ['Dash Cam, 1080p', 'Full HD front dash cam, 170-degree lens, loop recording and G-sensor.', 65.0, null, 25],
  ['Digital Tyre Inflator, 12V', 'Preset-and-stop compressor with digital gauge, LED light and adapters.', 42.0, 55.0, 28],
  ['Magnetic Car Phone Mount', 'Vent-clip mount with neodymium magnets and 360-degree rotation.', 15.0, null, 100],
  ['Jump Starter Pack, 1000A', 'Lithium jump starter for engines to 6.0L, USB power bank and torch.', 95.0, 125.0, 14],
  ['Microfibre Cloths, 12 Pack', 'Lint-free 300gsm cloths, 40 x 40 cm, safe for paintwork and glass.', 16.0, null, 85],
  ['Universal Car Seat Covers', 'Full set of breathable covers with airbag-compatible side seams.', 55.0, 70.0, 20],
  ['OBD2 Diagnostic Scanner, Bluetooth', 'Reads and clears engine codes, live data, works with iOS and Android.', 35.0, null, 32],
  ['Foldable Windscreen Sunshade', 'Reflective sunshade with pop-up frame and storage pouch. Fits most cars.', 18.0, 24.0, 60],
  ['Vent Clip Air Fresheners, 4 Pack', 'Four vent-clip fresheners with adjustable scent control. Long lasting.', 10.0, null, 110],
];

const GROUPS = [
  { category: 'Sports & Outdoors', code: 'SPRT', items: sports },
  { category: 'Books & Media', code: 'BOOK', items: books },
  { category: 'Automotive', code: 'AUTO', items: automotive },
];

const COLUMNS = [
  { header: 'sku', key: 'sku', width: 18 },
  { header: 'name', key: 'name', width: 38 },
  { header: 'description', key: 'description', width: 62 },
  { header: 'price', key: 'price', width: 10 },
  { header: 'original_price', key: 'original_price', width: 15 },
  { header: 'stock_quantity', key: 'stock_quantity', width: 15 },
  { header: 'category', key: 'category', width: 24 },
  { header: 'image_url', key: 'image_url', width: 46 },
  { header: 'status', key: 'status', width: 10 },
];

async function main() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'VMK Store';
  const ws = wb.addWorksheet('Products');
  ws.columns = COLUMNS;

  const header = ws.getRow(1);
  header.font = { bold: true, color: { argb: 'FF1A1D23' } };
  header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFD100' } };
  header.height = 22;
  ws.views = [{ state: 'frozen', ySplit: 1 }];

  let count = 0;
  for (const { category, code, items } of GROUPS) {
    items.forEach(([name, description, price, original, stock], i) => {
      ws.addRow({
        sku: `VMK-${code}-${String(i + 1).padStart(3, '0')}`,
        name,
        description,
        price,
        // Blank rather than 0 — the importer rejects an "original" that is not
        // above the price, and a 0 would read as a nonsensical discount.
        original_price: original ?? '',
        stock_quantity: stock,
        category,
        // Left empty on purpose: see the Read me sheet.
        image_url: '',
        status: 'active',
      });
      count++;
    });
  }

  ws.getColumn('price').numFmt = '0.00';
  ws.getColumn('original_price').numFmt = '0.00';
  ws.autoFilter = { from: 'A1', to: `I${count + 1}` };

  // --- guidance sheet -------------------------------------------------------
  const readme = wb.addWorksheet('Read me');
  readme.columns = [{ width: 108 }];
  const lines = [
    ['VMK Store — product import'],
    [''],
    ['How to use'],
    ['1. Sign in as the seller who should own these products.'],
    ['2. Go to Sell -> Bulk Import, or /sell/import.'],
    ['3. Drop this file in. Every row is previewed before anything is saved.'],
    ['4. Check the preview, then confirm. Re-importing later skips them by SKU.'],
    [''],
    ['About the image_url column'],
    ['It is deliberately empty. Product photographs are not something that can be'],
    ["generated, and linking to images hosted on other retailers' sites would both"],
    ['break when they move and use pictures you have no licence to.'],
    [''],
    ['Products import fine without it — they show the site placeholder until an'],
    ['image is added. To add your own, put the files in public/images/products/ and'],
    ['fill this column with the path, for example:'],
    ['    /images/products/sports/yoga-mat.jpg'],
    ['Or paste any https:// link you have the right to use.'],
    [''],
    ['About the prices'],
    ['These are typical market rates for these kinds of product, not quotes for any'],
    ['specific branded item. Check them against your own suppliers and margins'],
    ['before selling.'],
    [''],
    ['Valid categories'],
    ['Electronics, Fashion, Home & Garden, Grocery, Beauty & Personal Care,'],
    ['Sports & Outdoors, Books & Media, Automotive'],
    [''],
    ['Valid statuses'],
    ['active, pending, out_of_stock, draft, archived'],
  ];
  lines.forEach(l => readme.addRow(l));
  readme.getRow(1).font = { bold: true, size: 14 };
  [3, 9, 20, 25, 28].forEach(r => (readme.getRow(r).font = { bold: true }));

  await wb.xlsx.writeFile('vmk-products-import.xlsx');
  console.log(`wrote vmk-products-import.xlsx — ${count} products across ${GROUPS.length} categories`);
  GROUPS.forEach(g => console.log(`  ${g.category.padEnd(22)} ${g.items.length}`));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
