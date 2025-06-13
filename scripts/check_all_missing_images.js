import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_IMAGES_PATH = path.join(__dirname, '../public/images/products');
const CATEGORIES = ['electronics', 'home', 'fashion', 'groceries', 'beauty'];

async function checkMissingImages() {
  try {
    console.log('Scanning for missing product images...\n');
    
    // Get all product files
    const productsFiles = [
      { path: path.join(__dirname, '../src/data/products.ts'), categories: ['electronics'] },
      { path: path.join(__dirname, '../src/data/homeProducts.ts'), categories: ['home'] },
      { path: path.join(__dirname, '../src/data/fashionProducts.ts'), categories: ['fashion'] },
      { path: path.join(__dirname, '../src/data/groceryProducts.ts'), categories: ['groceries'] },
      { path: path.join(__dirname, '../src/data/beautyProducts.ts'), categories: ['beauty'] }
    ];
    
    // Check each product file
    for (const { path: filePath, categories } of productsFiles) {
      try {
        console.log(`\n🔍 Checking: ${path.basename(filePath)}`);
        console.log('----------------------------------------');
        
        const content = await fs.readFile(filePath, 'utf-8');
        const productRegex = /{.*?name:\s*['"]([^'"]+)['"].*?image:\s*['"]([^'"]+)['"].*?}/gs;
        
        let match;
        const missingImagesMap = new Map();
        
        // Initialize missing images map for each category
        for (const category of categories) {
          missingImagesMap.set(category, []);
        }
        
        // Find all product images
        while ((match = productRegex.exec(content)) !== null) {
          const [_, productName, imagePath] = match;
          const imageName = path.basename(imagePath);
          
          // Determine the category from the image path
          let category = null;
          for (const cat of categories) {
            if (imagePath.includes(cat)) {
              category = cat;
              break;
            }
          }
          
          if (!category) {
            console.warn(`  ⚠️  Could not determine category for: ${productName} (${imagePath})`);
            continue;
          }
          
          // Check if image exists
          const imageExists = await fileExists(path.join(BASE_IMAGES_PATH, category, imageName));
          
          if (!imageExists) {
            missingImagesMap.get(category).push({
              product: productName,
              image: imageName,
              path: imagePath
            });
          }
        }
        
        // Print results for this file
        let hasMissing = false;
        for (const [category, missing] of missingImagesMap.entries()) {
          if (missing.length > 0) {
            hasMissing = true;
            console.log(`\n❌ Missing ${missing.length} images in ${category} category:`);
            missing.forEach(({ product, image, path }) => {
              console.log(`  - ${product}: ${image} (${path})`);
            });
          }
        }
        
        if (!hasMissing) {
          console.log('✅ No missing images found in this file');
        }
        
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`ℹ️  File not found: ${filePath}`);
        } else {
          console.error(`Error processing ${filePath}:`, error.message);
        }
      }
    }
    
    console.log('\n✅ Scan complete!');
    
  } catch (error) {
    console.error('Error in checkMissingImages:', error);
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Run the check
checkMissingImages().catch(console.error);
