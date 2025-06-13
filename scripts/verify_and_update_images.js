import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_IMAGES_PATH = path.join(__dirname, '../public/images/products');
const PRODUCTS_FILES = [
  { path: path.join(__dirname, '../src/data/products.ts'), type: 'electronics' },
  { path: path.join(__dirname, '../src/data/homeProducts.ts'), type: 'home' }
];

async function verifyAndUpdateImages() {
  try {
    // Get list of all image files in each category
    const categories = ['electronics', 'home', 'fashion', 'groceries', 'beauty'];
    const imageFiles = {};
    
    for (const category of categories) {
      try {
        const categoryPath = path.join(BASE_IMAGES_PATH, category);
        const files = await fs.readdir(categoryPath);
        imageFiles[category] = files;
        console.log(`Found ${files.length} images in ${category} category`);
      } catch (err) {
        console.warn(`Could not read ${category} directory:`, err.message);
        imageFiles[category] = [];
      }
    }

    // Process each products file
    for (const { path: filePath, type } of PRODUCTS_FILES) {
      try {
        console.log(`\nProcessing ${type} products in ${filePath}`);
        let content = await fs.readFile(filePath, 'utf-8');
        
        // Find all product objects with image properties
        const productRegex = /({[^}]*name: ['"]([^'"]+)['"][^}]*image: ['"]([^'"]+)['"][^}]*})/g;
        let match;
        let updates = 0;
        let missingImages = [];
        
        while ((match = productRegex.exec(content)) !== null) {
          const [fullMatch, productBlock, productName, imagePath] = match;
          const imageName = path.basename(imagePath);
          const category = imagePath.includes('/electronics/') ? 'electronics' : 
                          imagePath.includes('/home/') ? 'home' :
                          imagePath.includes('/fashion/') ? 'fashion' :
                          imagePath.includes('/groceries/') ? 'groceries' :
                          imagePath.includes('/beauty/') ? 'beauty' : null;
          
          if (!category) {
            console.warn(`  Could not determine category for: ${imagePath}`);
            continue;
          }
          
          // Check if image exists
          const imageExists = imageFiles[category]?.includes(imageName);
          
          if (!imageExists) {
            missingImages.push({ name: productName, expectedImage: imagePath });
            console.warn(`  Missing image: ${imageName} for product: ${productName}`);
          }
        }
        
        console.log(`\nFound ${missingImages.length} products with missing images in ${filePath}`);
        if (missingImages.length > 0) {
          console.log('Products with missing images:');
          missingImages.forEach(item => {
            console.log(`  - ${item.name}: ${item.expectedImage}`);
          });
        }
        
      } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
      }
    }
    
    console.log('\nImage verification complete!');
    
  } catch (error) {
    console.error('Error in verifyAndUpdateImages:', error);
  }
}

// Run the verification
verifyAndUpdateImages().catch(console.error);
