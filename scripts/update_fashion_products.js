import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FASHION_PRODUCTS_PATH = path.join(__dirname, '../src/data/fashionProducts.ts');

// Mapping of fashion product names to their image files
const FASHION_IMAGE_MAP = {
  "Men's t-shirt": "Men_s_T_Shirt.jpg",
  "Women's t-shirt": "Women_s_T_Shirt.jpg",
  "Men's jeans": "Men_s_Jeans.jpg",
  "Women's jeans": "Women_s_Jeans.jpg",
  "Hoodie (unisex)": "Hoodie.jpg",
  "Sweatpants": "Sweatpants.jpg",
  "Sneakers": "Sneakers.jpg",
  "Dress shoes": "Dress_Shoes.jpg",
  "Women's dress": "Dress.jpg",
  "Men's blazer": "Blazer.jpg",
  "Women's blazer": "Blazer.jpg",
  "Leather jacket": "Leather_Jacket.jpg",
  "Denim jacket": "Denim_Jacket.jpg",
  "Shorts": "Shorts.jpg",
  "Skirt": "Skirt.jpg",
  "Socks (5 pairs)": "Socks.jpg",
  "Undergarments (3 pack)": "Underwear.jpg",
  "Sunglasses": "Sunglasses.jpg",
  "Watch (casual)": "Watch.jpg",
  "Belt (leather)": "Belt.jpg",
  "Hat (baseball cap)": "Baseball_Cap.jpg",
  "Scarf": "Scarf.jpg",
  "Gloves": "Gloves.jpg",
  "Beanie": "Beanie.jpg",
  "Winter coat": "Winter_Coat.jpg",
  "Sportswear set": "Sportswear_Set.jpg",
  "Gym leggings": "Leggings.jpg",
  "Sports bra": "Sports_Bra.jpg",
  "Swimwear (men)": "Men_s_Swimwear.jpg",
  "Swimwear (women)": "Women_s_Swimwear.jpg",
  "Handbag": "Handbag.jpg",
  "Backpack (fashion)": "Backpack.jpg",
  "Earrings (fashion)": "Earrings.jpg",
  "Necklace (fashion)": "Necklace.jpg"
};

async function updateFashionProducts() {
  try {
    // Read the fashion products file
    let content = await fs.readFile(FASHION_PRODUCTS_PATH, 'utf-8');
    
    // Update each product with its corresponding image
    for (const [productName, imageFile] of Object.entries(FASHION_IMAGE_MAP)) {
      const imagePath = `/images/products/fashion/${imageFile}`;
      
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
    await fs.writeFile(FASHION_PRODUCTS_PATH, content, 'utf-8');
    console.log('Successfully updated fashion products with images');
    
  } catch (error) {
    console.error('Error updating fashion products:', error);
  }
}

// Run the update
updateFashionProducts().catch(console.error);
