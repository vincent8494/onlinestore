import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const IMAGES_BASE_DIR = path.join(__dirname, '../public/images/products');
const PRODUCTS_DIR = path.join(__dirname, '../src/data');
const PRODUCT_FILES = {
  beauty: 'beautyProducts.ts',
  electronics: 'products.ts',
  fashion: 'fashionProducts.ts',
  grocery: 'groceryProducts.ts',
  home: 'homeProducts.ts'
};

// Helper function to normalize strings for comparison
function normalizeString(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ') // Replace non-alphanumeric with space
    .replace(/\s+/g, ' ')      // Collapse multiple spaces
    .trim();
}

// Helper function to find the best matching image for a product
function findBestImageMatch(productName, imageFiles) {
  const normalizedProduct = normalizeString(productName);
  let bestMatch = { score: 0, file: null };

  for (const file of imageFiles) {
    const fileName = path.basename(file, path.extname(file));
    const normalizedFile = normalizeString(fileName);
    
    // Simple scoring: count matching words
    const productWords = new Set(normalizedProduct.split(' ').filter(w => w.length > 2));
    const fileWords = new Set(normalizedFile.split(' ').filter(w => w.length > 2));
    
    let score = 0;
    for (const word of productWords) {
      if (fileWords.has(word)) {
        score += 1;
      }
    }
    
    // Normalize score
    score = score / Math.max(productWords.size, fileWords.size);
    
    if (score > bestMatch.score) {
      bestMatch = { score, file };
    }
    
    // Early exit for perfect match
    if (score >= 0.9) break;
  }
  
  return bestMatch.score > 0.3 ? bestMatch.file : null;
}

// Function to update product images in a file
async function updateProductImages(category) {
  try {
    const imageDir = path.join(IMAGES_BASE_DIR, category);
    const productFile = path.join(PRODUCTS_DIR, PRODUCT_FILES[category]);
    
    // Read product file
    let content = await fs.readFile(productFile, 'utf8');
    
    // Skip if no content
    if (!content) {
      console.log(`No content in ${productFile}`);
      return 0;
    }
    
    // Get list of image files
    let imageFiles;
    try {
      imageFiles = (await fs.readdir(imageDir))
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
    } catch (err) {
      console.log(`No images found for ${category}: ${err.message}`);
      return 0;
    }
    
    if (imageFiles.length === 0) {
      console.log(`No images found in ${imageDir}`);
      return 0;
    }
    
    // Find and update product images
    const productRegex = /(\{\s*id:\s*['"]([^'"]+)['"][^}]*?name:\s*['"]([^'"]+)['"][^}]*?)(image:\s*['"]([^'"]*)['"])?/g;
    let updatedCount = 0;
    
    const updatedContent = content.replace(productRegex, (match, prefix, id, name, _, existingImage) => {
      // Skip if image already exists
      if (existingImage) {
        console.log(`Keeping existing image for ${name}: ${existingImage}`);
        return match;
      }
      
      // Find best matching image
      const bestImage = findBestImageMatch(name, imageFiles);
      if (bestImage) {
        const imagePath = `/images/products/${category}/${bestImage}`;
        console.log(`Matched ${name} -> ${bestImage}`);
        updatedCount++;
        return `${prefix}image: '${imagePath}',`;
      }
      
      return match;
    });
    
    // Write updated content back to file
    if (updatedCount > 0) {
      await fs.writeFile(productFile, updatedContent, 'utf8');
      console.log(`Updated ${updatedCount} products in ${path.basename(productFile)}`);
    } else {
      console.log(`No updates needed for ${path.basename(productFile)}`);
    }
    
    return updatedCount;
    
  } catch (error) {
    console.error(`Error updating ${category}:`, error.message);
    return 0;
  }
}

// Main function
async function main() {
  console.log('Starting product image update...');
  
  let totalUpdated = 0;
  
  // Process each category
  for (const [category] of Object.entries(PRODUCT_FILES)) {
    console.log(`\nProcessing ${category}...`);
    const updated = await updateProductImages(category);
    totalUpdated += updated;
  }
  
  console.log(`\nDone! Updated ${totalUpdated} products in total.`);
}

// Run the script
main().catch(console.error);
