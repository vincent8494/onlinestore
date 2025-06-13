import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BEAUTY_PRODUCTS_PATH = path.join(__dirname, '../src/data/beautyProducts.ts');

// Mapping of beauty product names to their image files
const BEAUTY_IMAGE_MAP = {
  'Shampoo (500ml)': 'Shampoo.jpg',
  'Conditioner (500ml)': 'Conditioner.jpg',
  'Hair gel': 'Hair_Gel.jpg',
  'Hair serum': 'Hair_Serum.jpg',
  'Hair dye kit': 'Hair_Dye.jpg',
  'Body lotion': 'Body_Lotion.jpg',
  'Face cream': 'Face_Cream.jpg',
  'Face wash': 'Face_Wash.jpg',
  'Facial mask (sheet)': 'Face_Mask.jpg',
  'Sunscreen (SPF 30+)': 'Sunscreen.jpg',
  'Hand cream': 'Hand_Cream.jpg',
  'Eye cream': 'Eye_Cream.jpg',
  'Anti-aging serum': 'Anti_Aging_Serum.jpg',
  'Face toner': 'Toner.jpg',
  'Pimple patch (pack)': 'Pimple_Patch.jpg',
  'Whitening cream': 'Whitening_Cream.jpg',
  'Foot cream': 'Foot_Cream.jpg',
  'Toothpaste (tube)': 'Toothpaste.jpg',
  'Toothbrush (pack of 2)': 'Toothbrush.jpg',
  'Perfume (50ml)': 'Perfume.jpg',
  'Cologne': 'Cologne.jpg',
  'Body spray': 'Body_Spray.jpg',
  'Foundation': 'Foundation.jpg',
  'Mascara': 'Mascara.jpg',
  'Eyeliner': 'Eyeliner.jpg',
  'BB cream': 'BB_Cream.jpg',
  'Eyebrow pencil': 'Eyebrow_Pencil.jpg',
  'Makeup palette': 'Makeup_Palette.jpg',
  'Lipstick': 'Lipstick.jpg',
  'Nail polish': 'Nail_Polish.jpg',
  'Makeup remover': 'Makeup_Remover.jpg',
  'Hair dryer': 'Hair_Dryer.jpg',
  'Hair straightener': 'Hair_Straightener.jpg',
  'Electric shaver': 'Electric_Shaver.jpg',
  'Beauty blender': 'Beauty_Blender.jpg',
  'Makeup brush set': 'Makeup_Brushes.jpg',
  'Shaving cream': 'Shaving_Cream.jpg',
  'Aftershave': 'Aftershave.jpg',
  'Body wash': 'Body_Wash.jpg',
  'Bath salts': 'Bath_Salts.jpg',
  'Bath bomb': 'Bath_Bomb.jpg',
  'Body scrub': 'Body_Scrub.jpg',
  'Body oil': 'Body_Oil.jpg',
  'Hand sanitizer': 'Hand_Sanitizer.jpg',
  'Lip balm': 'Lip_Balm.jpg'
};

async function updateBeautyProducts() {
  try {
    // Read the beauty products file
    let content = await fs.readFile(BEAUTY_PRODUCTS_PATH, 'utf-8');
    
    // Update each product with its corresponding image
    for (const [productName, imageFile] of Object.entries(BEAUTY_IMAGE_MAP)) {
      const imagePath = `/images/products/beauty_&_personal_care/${imageFile}`;
      
      // Create a regex to find the product by name
      const productRegex = new RegExp(`({[^}]*name: ['"]${productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"][^}]*})`);
      
      // Check if product exists and doesn't already have an image
      if (content.includes(`name: '${productName}'`) || content.includes(`name: "${productName}"`)) {
        if (!content.includes(`name: '${productName}'.*?image:`) && 
            !content.includes(`name: "${productName}".*?image:`)) {
          
          // Add the image property
          content = content.replace(
            productRegex,
            `$1\n  image: "${imagePath}",`
          );
          console.log(`Updated: ${productName} -> ${imagePath}`);
        }
      }
    }
    
    // Write the updated content back to the file
    await fs.writeFile(BEAUTY_PRODUCTS_PATH, content, 'utf-8');
    console.log('Successfully updated beauty products with images');
    
  } catch (error) {
    console.error('Error updating beauty products:', error);
  }
}

// Run the update
updateBeautyProducts().catch(console.error);
