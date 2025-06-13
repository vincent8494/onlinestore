import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping of product names to their image paths
const imageMappings = {
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

async function updateProductFile(filePath, productKey) {
  try {
    // Read the file
    let content = await fs.readFile(filePath, 'utf-8');
    
    // Find the products array (handle both with and without TypeScript type annotations)
    const productArrayRegex = new RegExp(`export const ${productKey}(?::\s*\w+\s*\[\s*\w+\s*\])?\s*=\s*\[([\s\S]*?)\];`, 'm');
    const match = content.match(productArrayRegex);
    
    if (!match) {
      console.log(`Could not find ${productKey} in ${filePath}`);
      return;
    }
    
    // Extract the products array content
    let productsContent = match[1];
    let updatedCount = 0;
    
    // Update each product's image path
    for (const [productName, imagePath] of Object.entries(imageMappings)) {
      // Create a regex to find the product by name
      const productRegex = new RegExp(`({[^}]*name: ['"]${productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"][^}]*})`, 'g');
      
      // Check if product exists and doesn't already have an image
      if (productsContent.includes(`name: '${productName}'`) || 
          productsContent.includes(`name: "${productName}"`)) {
        
        // Only update if the product doesn't already have an image
        const escapedName = productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const hasImage1 = new RegExp(`name: ['"]${escapedName}['"][^}]*image:`, 's').test(productsContent);
        const hasImage2 = new RegExp(`name: ["']${escapedName}["'][^}]*image:`, 's').test(productsContent);
        
        if (!hasImage1 && !hasImage2) {
          
          // Add the image property
          productsContent = productsContent.replace(
            new RegExp(`({[^}]*name: ['"]${productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"][^}]*})`),
            `$1\n    image: "/images/products/${imagePath}",`
          );
          updatedCount++;
          console.log(`Updated: ${productName} -> ${imagePath}`);
        }
      }
    }
    
    // Update the content with modified products
    const updatedContent = content.replace(
      productArrayRegex,
      (match, p1) => `export const ${productKey} = [${productsContent}];`
    );
    
    // Write the updated content back to the file
    await fs.writeFile(filePath, updatedContent, 'utf-8');
    console.log(`Updated ${filePath} with ${updatedCount} image mappings`);
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

async function main() {
  const filesToUpdate = [
    { path: path.join(__dirname, '../src/data/beautyProducts.ts'), key: 'beautyProducts' },
    { path: path.join(__dirname, '../src/data/products.ts'), key: 'electronicsProducts' },
    { path: path.join(__dirname, '../src/data/fashionProducts.ts'), key: 'fashionProducts' },
    { path: path.join(__dirname, '../src/data/groceryProducts.ts'), key: 'groceryProducts' },
    { path: path.join(__dirname, '../src/data/homeProducts.ts'), key: 'homeProducts' }
  ];

  for (const file of filesToUpdate) {
    await updateProductFile(file.path, file.key);
  }
}

main().catch(console.error);
