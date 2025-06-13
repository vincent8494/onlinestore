import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_TO_REMOVE = [
  'Premium Wireless Headphones',
  'Smart Fitness Watch',
  'Professional Camera Lens',
  'Gaming Mechanical Keyboard'
];

async function removeProductsFromHome() {
  try {
    const filePath = path.join(__dirname, '../src/pages/Home.tsx');
    let content = await fs.readFile(filePath, 'utf-8');
    let originalContent = content;
    let removedCount = 0;

    // Process each product to remove
    for (const product of PRODUCTS_TO_REMOVE) {
      const escapedProduct = product.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Pattern to match the entire product object in the featuredProducts array
      const productPattern = new RegExp(
        `\{\s*[^}]*name\s*:\s*['"]${escapedProduct}['"][^}]*\},?\s*`,
        'g'
      );
      
      content = content.replace(productPattern, (match) => {
        removedCount++;
        return '';
      });
    }

    // Clean up any trailing commas before closing brackets/braces
    content = content.replace(/,\s*([}\]])/g, '$1');
    
    // Clean up any double commas
    content = content.replace(/,\s*,/g, ',');
    
    // Clean up empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    if (content !== originalContent) {
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`✅ Removed ${removedCount} products from Home.tsx`);
    } else {
      console.log('ℹ️  No changes made to Home.tsx');
    }
    
  } catch (error) {
    console.error('Error removing products from Home.tsx:', error);
  }
}

// Run the removal
removeProductsFromHome().catch(console.error);
