import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manual mapping of product names to image files
const productImageMap = {
  // Beauty & Personal Care
  'Shampoo (500ml)': 'beauty_&_personal_care/Shampoo.jpg',
  'Conditioner (500ml)': 'beauty_&_personal_care/Conditioner.jpg',
  'Sunscreen (SPF 30+)': 'beauty_&_personal_care/Sunscreen.jpg',
  'Toothbrush (pack of 2)': 'beauty_&_personal_care/Toothbrush.jpg',
  'Body lotion': 'beauty_&_personal_care/Body_Lotion.jpg',
  'Deodorant': 'beauty_&_personal_care/Deodorant.jpg',
  'Face wash': 'beauty_&_personal_care/Face_Wash.jpg',
  'Facial mask (sheet)': 'beauty_&_personal_care/Face_Mask.jpg',
  'Foundation': 'beauty_&_personal_care/Foundation.jpg',
  'Hair dryer': 'beauty_&_personal_care/Hair_Dryer.jpg',
  'Lipstick': 'beauty_&_personal_care/Lipstick.jpg',
  'Makeup remover': 'beauty_&_personal_care/Makeup_Remover.jpg',
  'Mascara': 'beauty_&_personal_care/Mascara.jpg',
  'Moisturizer': 'beauty_&_personal_care/Moisturizer.jpg',
  'Nail polish': 'beauty_&_personal_care/Nail_Polish.jpg',
  
  // Electronics
  'Bluetooth speaker': 'electronics/Bluetooth_Speaker.jpg',
  'Desktop computer': 'electronics/Desktop_Computer.jpg',
  'Digital camera': 'electronics/Digital_Camera.jpg',
  'Gaming console': 'electronics/Gaming_Console.jpg',
  'Graphics card': 'electronics/Graphics_Card.jpg',
  'Hard drive': 'electronics/Hard_Drive.jpg',
  'Keyboard': 'electronics/Keyboard.jpg',
  'Laptop': 'electronics/Laptop.jpg',
  'Monitor': 'electronics/Monitor.jpg',
  'Mouse': 'electronics/Mouse.jpg',
  'Power bank': 'electronics/Power_Bank.jpg',
  'Projector': 'electronics/Projector.jpg',
  'Router': 'electronics/Router.jpg',
  'Smart TV': 'electronics/Smart_TV.jpg',
  'Smartphone': 'electronics/Smartphone.jpg',
  'Smartwatch': 'electronics/Smartwatch.jpg',
  'Tablet': 'electronics/Tablet.jpg',
  'USB flash drive': 'electronics/USB_Flash_Drive.jpg',
  'VR headset': 'electronics/VR_Headset.jpg',
  'Wireless earbuds': 'electronics/Wireless_Earbuds.jpg',
  
  // Fashion
  'Belt': 'fashion/Belt.jpg',
  'Blazer': 'fashion/Blazer.jpg',
  'Boots': 'fashion/Boots.jpg',
  'Dress': 'fashion/Dress.jpg',
  'Gloves': 'fashion/Gloves.jpg',
  'Hoodie': 'fashion/Hoodie.jpg',
  'Jacket': 'fashion/Jacket.jpg',
  'Leggings': 'fashion/Leggings.jpg',
  "Men's T-shirt": 'fashion/Men_s_T_shirt.jpg',
  'Raincoat': 'fashion/Raincoat.jpg',
  'Sandals': 'fashion/Sandals.jpg',
  'Shoes': 'fashion/Shoes.jpg',
  'Shorts': 'fashion/Shorts.jpg',
  'Skirt': 'fashion/Skirt.jpg',
  'Suit': 'fashion/Suit.jpg'
};

// Function to update product files with image paths
async function updateProductFiles() {
  const productFiles = [
    { 
      path: path.join(__dirname, '../src/data/beautyProducts.ts'),
      varName: 'beautyProducts'
    },
    { 
      path: path.join(__dirname, '../src/data/products.ts'), // Electronics
      varName: 'electronicsProducts'
    },
    { 
      path: path.join(__dirname, '../src/data/fashionProducts.ts'),
      varName: 'fashionProducts'
    },
    { 
      path: path.join(__dirname, '../src/data/groceryProducts.ts'),
      varName: 'groceryProducts'
    },
    { 
      path: path.join(__dirname, '../src/data/homeProducts.ts'),
      varName: 'homeProducts'
    }
  ];

  for (const file of productFiles) {
    try {
      // Read the file
      let content = await fs.promises.readFile(file.path, 'utf-8');
      
      // Extract the products array
      const match = content.match(new RegExp(`export const ${file.varName} = (\[.*?\]);`, 's'));
      if (!match) {
        console.log(`Could not find ${file.varName} in ${file.path}`);
        continue;
      }
      
      // Parse the products array
      let products;
      try {
        // Clean up the array string to make it valid JSON
        const arrayStr = match[1]
          .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
          .replace(/\/\/.*?\n/g, '') // Remove line comments
          .replace(/\n/g, '') // Remove newlines
          .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
          .replace(/'/g, '"') // Replace single quotes with double quotes
          .replace(/([\w\d]+):/g, '"$1":'); // Add quotes around property names
          
        products = JSON.parse(arrayStr);
      } catch (parseError) {
        console.error(`Error parsing products from ${file.path}:`, parseError);
        continue;
      }
      
      // Update products with image paths
      let updatedCount = 0;
      const updatedProducts = products.map(product => {
        const cleanName = product.name.replace(/\([^)]*\)/g, '').trim();
        const imagePath = productImageMap[product.name] || productImageMap[cleanName];
        
        if (imagePath && !product.image) {
          updatedCount++;
          console.log(`Mapped: ${product.name} -> ${imagePath}`);
          return { ...product, image: `/images/products/${imagePath}` };
        }
        return product;
      });
      
      // Generate new file content
      const newContent = content.replace(
        match[0],
        `export const ${file.varName} = ${JSON.stringify(updatedProducts, null, 2)};`
      );
      
      // Write the updated content back to the file
      await fs.promises.writeFile(file.path, newContent, 'utf-8');
      console.log(`Updated ${file.path} with ${updatedCount} new image mappings`);
      
    } catch (error) {
      console.error(`Error processing ${file.path}:`, error);
    }
  }
}

// Run the update
updateProductFiles().catch(console.error);
