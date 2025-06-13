import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOME_PRODUCTS_PATH = path.join(__dirname, '../src/data/homeProducts.ts');

// Mapping of home product names to their image files
const HOME_IMAGE_MAP = {
  // Cleaning
  'Broom': 'Broom.jpg',
  'Mop': 'Mop.jpg',
  'Bucket': 'Bucket.jpg',
  'Dustpan': 'Dustpan.jpg',
  'Cleaning gloves': 'Cleaning_Gloves.jpg',
  'Detergent': 'Laundry_Detergent.jpg',
  'Toilet brush': 'Toilet_Brush.jpg',
  'Toilet cleaner': 'Toilet_Cleaner.jpg',
  'Dishwashing sponge': 'Sponge.jpg',
  
  // Kitchen
  'Dish rack': 'Dish_Rack.jpg',
  'Electric kettle': 'Electric_Kettle.jpg',
  'Gas cooker': 'Gas_Cooker.jpg',
  'Cooking pot set': 'Cooking_Pot_Set.jpg',
  'Frying pan': 'Frying_Pan.jpg',
  'Knife set': 'Knife_Set.jpg',
  'Chopping board': 'Chopping_Board.jpg',
  'Thermos flask': 'Thermos.jpg',
  'Storage containers': 'Storage_Containers.jpg',
  'Oven mitts': 'Oven_Mitts.jpg',
  
  // Bedding
  'Bed sheets': 'Bed_Sheets.jpg',
  'Pillow': 'Pillow.jpg',
  'Pillowcases': 'Pillowcases.jpg',
  'Blanket': 'Blanket.jpg',
  'Duvet': 'Duvet.jpg',
  
  // Bath
  'Shower curtain': 'Shower_Curtain.jpg',
  'Towel': 'Towel.jpg',
  'Bath mat': 'Bath_Mat.jpg',
  'Toothbrush holder': 'Toothbrush_Holder.jpg',
  'Soap dish': 'Soap_Dish.jpg',
  
  // Furniture
  'Coffee table': 'Coffee_Table.jpg',
  'Dining table': 'Dining_Table.jpg',
  'Chair': 'Chair.jpg',
  'Bookshelf': 'Bookshelf.jpg',
  'Wardrobe': 'Wardrobe.jpg',
  'Bed frame': 'Bed_Frame.jpg',
  'Dresser': 'Dresser.jpg',
  'Nightstand': 'Nightstand.jpg',
  
  // Lighting
  'Table lamp': 'Table_Lamp.jpg',
  'Floor lamp': 'Floor_Lamp.jpg',
  'Desk lamp': 'Desk_Lamp.jpg',
  'Ceiling light': 'Ceiling_Light.jpg',
  'String lights': 'String_Lights.jpg',
  
  // Laundry
  'Laundry basket': 'Laundry_Basket.jpg',
  'Clothes hanger': 'Clothes_Hanger.jpg',
  'Drying rack': 'Drying_Rack.jpg',
  'Iron': 'Iron.jpg',
  'Ironing board': 'Ironing_Board.jpg',
  
  // Organization
  'Shoe rack': 'Shoe_Rack.jpg',
  'Storage box': 'Storage_Box.jpg',
  'Drawer organizer': 'Drawer_Organizer.jpg',
  'Wall shelf': 'Wall_Shelf.jpg',
  
  // Dining
  'Dinnerware set': 'Dinnerware_Set.jpg',
  'Drinking glasses': 'Drinking_Glasses.jpg',
  'Cutlery set': 'Cutlery_Set.jpg',
  'Serving platter': 'Serving_Platter.jpg',
  'Placemats': 'Placemats.jpg',
  
  // Decor
  'Wall art': 'Wall_Art.jpg',
  'Photo frame': 'Photo_Frame.jpg',
  'Vase': 'Vase.jpg',
  'Candles': 'Candles.jpg',
  'Throw pillow': 'Throw_Pillow.jpg',
  
  // Outdoor
  'Patio furniture set': 'Patio_Furniture_Set.jpg',
  'Outdoor rug': 'Outdoor_Rug.jpg',
  'Garden hose': 'Garden_Hose.jpg',
  'Plant pot': 'Plant_Pot.jpg',
  'BBQ grill': 'BBQ_Grill.jpg'
};

async function updateHomeProducts() {
  try {
    // Read the home products file
    let content = await fs.readFile(HOME_PRODUCTS_PATH, 'utf-8');
    
    // Update each product with its corresponding image
    for (const [productName, imageFile] of Object.entries(HOME_IMAGE_MAP)) {
      const imagePath = `/images/products/home_&_kitchen/${imageFile}`;
      
      // Create a regex to find the product by name
      const escapedName = productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const productRegex = new RegExp(`({[^}]*name: ['"]${escapedName}['"][^}]*})`);
      
      // Check if product exists and doesn't already have an image
      if (content.includes(`name: '${productName}'`) || content.includes(`name: "${productName}"`)) {
        const hasImage = new RegExp(`name: ['"]${escapedName}['"][^}]*image:`, 's').test(content);
        
        if (!hasImage) {
          // Add the image property
          content = content.replace(
            productRegex,
            `$1\n  image: "${imagePath}",`
          );
          console.log(`Updated: ${productName} -> ${imagePath}`);
        } else {
          console.log(`Skipping (already has image): ${productName}`);
        }
      } else {
        console.log(`Not found: ${productName}`);
      }
    }
    
    // Write the updated content back to the file
    await fs.writeFile(HOME_PRODUCTS_PATH, content, 'utf-8');
    console.log('Successfully updated home products with images');
    
  } catch (error) {
    console.error('Error updating home products:', error);
  }
}

// Run the update
updateHomeProducts().catch(console.error);
