import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GROCERY_PRODUCTS_PATH = path.join(__dirname, '../src/data/groceryProducts.ts');

// Mapping of grocery product names to their image files
const GROCERY_IMAGE_MAP = {
  // Staples
  'Rice': 'Rice.jpg',
  'Maize flour': 'Maize_Flour.jpg',
  'Sugar': 'Sugar.jpg',
  'Salt': 'Salt.jpg',
  'Cooking oil': 'Cooking_Oil.jpg',
  'Tea leaves': 'Tea_Leaves.jpg',
  'Coffee': 'Coffee.jpg',
  'Instant noodles': 'Instant_Noodles.jpg',
  'Spaghetti': 'Spaghetti.jpg',
  'Baking flour': 'Baking_Flour.jpg',
  
  // Dairy & Eggs
  'Fresh milk': 'Milk.jpg',
  'UHT milk': 'Milk.jpg',
  'Eggs': 'Eggs.jpg',
  'Butter': 'Butter.jpg',
  'Margarine': 'Margarine.jpg',
  'Cheese': 'Cheese.jpg',
  'Yogurt': 'Yogurt.jpg',
  
  // Meat & Seafood
  'Chicken': 'Chicken.jpg',
  'Beef': 'Beef.jpg',
  'Pork': 'Pork.jpg',
  'Fish (tilapia)': 'Tilapia.jpg',
  'Fish (Nile perch)': 'Nile_Perch.jpg',
  'Sausages': 'Sausages.jpg',
  'Minced meat': 'Minced_Meat.jpg',
  
  // Produce
  'Tomatoes': 'Tomatoes.jpg',
  'Onions': 'Onions.jpg',
  'Potatoes': 'Potatoes.jpg',
  'Cabbage': 'Cabbage.jpg',
  'Spinach': 'Spinach.jpg',
  'Kale (Sukuma wiki)': 'Kale.jpg',
  'Carrots': 'Carrots.jpg',
  'Green peppers': 'Green_Peppers.jpg',
  'Bananas': 'Bananas.jpg',
  'Oranges': 'Oranges.jpg',
  'Mangoes': 'Mangoes.jpg',
  'Avocado': 'Avocado.jpg',
  'Lemons': 'Lemons.jpg',
  
  // Beverages
  'Mineral water': 'Mineral_Water.jpg',
  'Soft drinks': 'Soda.jpg',
  'Fruit juice': 'Fruit_Juice.jpg',
  'Beer (local)': 'Beer.jpg',
  'Beer (imported)': 'Beer_Imported.jpg',
  'Wine': 'Wine.jpg',
  'Spirits': 'Spirits.jpg',
  
  // Snacks
  'Biscuits': 'Biscuits.jpg',
  'Chips': 'Chips.jpg',
  'Chocolate': 'Chocolate.jpg',
  'Candy': 'Candy.jpg',
  'Peanuts': 'Peanuts.jpg',
  'Cashew nuts': 'Cashew_Nuts.jpg',
  
  // Canned Goods
  'Baked beans': 'Baked_Beans.jpg',
  'Tuna (canned)': 'Canned_Tuna.jpg',
  'Tomato paste': 'Tomato_Paste.jpg',
  'Canned vegetables': 'Canned_Vegetables.jpg',
  'Canned fruit': 'Canned_Fruit.jpg',
  'Coconut milk': 'Coconut_Milk.jpg',
  
  // Condiments
  'Ketchup': 'Ketchup.jpg',
  'Mayonnaise': 'Mayonnaise.jpg',
  'Hot sauce': 'Hot_Sauce.jpg',
  'Soy sauce': 'Soy_Sauce.jpg',
  'Vinegar': 'Vinegar.jpg',
  'Spices (mixed)': 'Spices.jpg',
  
  // Household
  'Toilet paper': 'Toilet_Paper.jpg',
  'Laundry detergent': 'Laundry_Detergent.jpg',
  'Dish soap': 'Dish_Soap.jpg',
  'Bar soap': 'Bar_Soap.jpg',
  'Toothpaste': 'Toothpaste.jpg',
  'Toothbrush': 'Toothbrush.jpg',
  'Shampoo': 'Shampoo.jpg',
  'Body lotion': 'Body_Lotion.jpg',
  'Sanitary pads': 'Sanitary_Pads.jpg',
  'Razor blades': 'Razor_Blades.jpg'
};

async function updateGroceryProducts() {
  try {
    // Read the grocery products file
    let content = await fs.readFile(GROCERY_PRODUCTS_PATH, 'utf-8');
    
    // Update each product with its corresponding image
    for (const [productName, imageFile] of Object.entries(GROCERY_IMAGE_MAP)) {
      const imagePath = `/images/products/groceries/${imageFile}`;
      
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
    await fs.writeFile(GROCERY_PRODUCTS_PATH, content, 'utf-8');
    console.log('Successfully updated grocery products with images');
    
  } catch (error) {
    console.error('Error updating grocery products:', error);
  }
}

// Run the update
updateGroceryProducts().catch(console.error);
