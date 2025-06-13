import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for each product file and its categories
const PRODUCT_FILES = [
  {
    path: path.join(__dirname, '../src/data/homeProducts.ts'),
    category: 'home',
    missingImages: [
      'Pillow.jpg', 'Pillowcases.jpg', 'Blanket.jpg', 'Duvet.jpg',
      'Shower_Curtain.jpg', 'Towel.jpg', 'Drying_Line.jpg', 'Clothes_Pegs.jpg',
      'Laundry_Basket.jpg', 'Clothes_Hanger.jpg', 'Drying_Rack.jpg', 'Iron.jpg',
      'Shoe_Rack.jpg', 'Storage_Box.jpg', 'Drawer_Organizer.jpg', 'Wall_Shelf.jpg',
      'Lunch_Box.jpg', 'Tablecloth.jpg', 'Wall_Clock.jpg', 'Mirror.jpg',
      'Sofa_Cover.jpg', 'Doormat.jpg', 'Garden_Hose.jpg', 'Watering_Can.jpg',
      'Umbrella.jpg', 'Extension_Cable.jpg', 'Electric_Fan.jpg', 'Mosquito_Net.jpg',
      'Water_Dispenser.jpg', 'Water_Bottle.jpg', 'Iron_Box.jpg', 'Curtain.jpg'
    ]
  },
  {
    path: path.join(__dirname, '../src/data/groceryProducts.ts'),
    category: 'groceries',
    missingImages: [
      'Fresh_Fruits.jpg', 'Fresh_Vegetables.jpg', 'Mineral_Water.jpg', 'Soda.jpg',
      'Juice.jpg', 'Energy_Drink.jpg', 'Biscuits.jpg', 'Cookies.jpg',
      'Cereal.jpg', 'Popcorn.jpg', 'Chocolate_Bar.jpg', 'Ice_Cream.jpg',
      'Baking_Powder.jpg', 'Canned_Beans.jpg', 'Canned_Fish.jpg', 'Tomato_Sauce.jpg',
      'Soy_Sauce.jpg', 'Cooking_Spices.jpg', 'Vinegar.jpg', 'Mayonnaise.jpg',
      'Peanut_Butter.jpg', 'Jam.jpg', 'Honey.jpg', 'Detergent.jpg',
      'Dish_Soap.jpg', 'Laundry_Soap.jpg'
    ]
  },
  {
    path: path.join(__dirname, '../src/data/beautyProducts.ts'),
    category: 'beauty',
    missingImages: [
      'Compact_Powder.jpg', 'Eyeliner.jpg', 'BB_Cream.jpg', 'Eyebrow_Pencil.jpg',
      'Makeup_Palette.jpg', 'Hairbrush.jpg', 'Comb_Set.jpg', 'Makeup_Brushes.jpg',
      'Nail_File_Set.jpg', 'Cosmetic_Bag.jpg', 'Compact_Mirror.jpg', 'Beard_Oil.jpg',
      'Hair_Clipper.jpg', 'Razor.jpg', 'Electric_Shaver.jpg', 'Mens_Grooming_Kit.jpg',
      'Lip_Balm.jpg', 'Nail_Kit.jpg', 'Loofah.jpg', 'Bath_Salts.jpg',
      'Hair_Removal_Cream.jpg', 'Womens_Grooming_Kit.jpg', 'Facial_Steamer.jpg'
    ]
  }
];

async function removeProductsWithMissingImages() {
  try {
    for (const { path: filePath, category, missingImages } of PRODUCT_FILES) {
      try {
        console.log(`\n🔍 Processing: ${path.basename(filePath)}`);
        
        // Read the file content
        let content = await fs.readFile(filePath, 'utf-8');
        
        // Find all product objects with images
        const productRegex = /({[^}]*?name:\s*['"]([^'"]+)['"].*?image:\s*['"]([^'"]+)['"].*?})/gs;
        let match;
        const productsToRemove = [];
        
        // Find products with missing images
        while ((match = productRegex.exec(content)) !== null) {
          const [fullMatch, productBlock, productName, imagePath] = match;
          const imageName = path.basename(imagePath);
          
          if (missingImages.includes(imageName)) {
            console.log(`  ❌ Will remove: ${productName} (${imageName})`);
            productsToRemove.push({
              block: productBlock,
              name: productName,
              image: imageName
            });
          }
        }
        
        if (productsToRemove.length === 0) {
          console.log('  ✅ No products with missing images found to remove');
          continue;
        }
        
        // Remove the products
        let updatedContent = content;
        for (const { block, name, image } of productsToRemove) {
          // Escape special regex characters in the block
          const escapedBlock = block.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`,\s*${escapedBlock}|${escapedBlock}\s*,?`, 'gs');
          
          // Remove the product block and any trailing comma
          updatedContent = updatedContent.replace(regex, '');
          console.log(`  Removed: ${name} (${image})`);
        }
        
        // Clean up any remaining commas at the end of arrays
        updatedContent = updatedContent.replace(/,\s*\]/g, ']');
        
        // Write the updated content back to the file
        await fs.writeFile(filePath, updatedContent, 'utf-8');
        console.log(`\n✅ Successfully removed ${productsToRemove.length} products with missing images from ${path.basename(filePath)}`);
        
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`ℹ️  File not found: ${filePath}`);
        } else {
          console.error(`Error processing ${filePath}:`, error.message);
        }
      }
    }
    
    console.log('\n✅ Product cleanup complete!');
    
  } catch (error) {
    console.error('Error in removeProductsWithMissingImages:', error);
  }
}

// Run the cleanup
removeProductsWithMissingImages().catch(console.error);
