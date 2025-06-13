import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_TO_REMOVE = [
  'Premium Wireless Headphones',
  'Smart Fitness Watch',
  'Professional Camera Lens',
  'Gaming Mechanical Keyboard',
  'Designer Sunglasses',
  'Organic Coffee Beans'
];

async function removeProducts() {
  try {
    const filePath = path.join(__dirname, '../src/pages/Products.tsx');
    let content = await fs.readFile(filePath, 'utf-8');
    
    // Create a pattern to match the products array
    const productsArrayPattern = /(const\s+products\s*=\s*\[)([\s\S]*?)(\];)/;
    const match = content.match(productsArrayPattern);
    
    if (!match) {
      console.log('Could not find products array in Products.tsx');
      return;
    }
    
    const [fullMatch, prefix, productsText, suffix] = match;
    
    // Split the products text into individual product objects
    const productObjects = productsText
      .split(/\{\s*\n/)
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('//'))
      .map(s => `{\n${s}`.trim())
      .filter(s => s.length > 2); // Filter out any remaining non-product strings
    
    // Filter out products that should be removed
    const filteredProducts = productObjects.filter(product => {
      const productNameMatch = product.match(/name\s*:\s*['"]([^'"]+)['"]/);
      if (!productNameMatch) return true;
      const productName = productNameMatch[1];
      return !PRODUCTS_TO_REMOVE.includes(productName);
    });
    
    // Rebuild the products array
    const newProductsText = `
${filteredProducts.join(',\n\n')}\n    `;
    
    const newContent = content.replace(
      productsArrayPattern, 
      `$1${newProductsText}$3`
    );
    
    // Clean up any double commas or trailing commas
    const cleanedContent = newContent
      .replace(/,\s*,/g, ',')
      .replace(/,\s*\]/g, ']');
    
    if (cleanedContent !== content) {
      await fs.writeFile(filePath, cleanedContent, 'utf-8');
      console.log(`✅ Removed ${productObjects.length - filteredProducts.length} products from Products.tsx`);
      console.log(`✅ Kept ${filteredProducts.length} products`);
    } else {
      console.log('ℹ️ No changes made to Products.tsx');
    }
    
  } catch (error) {
    console.error('Error processing file:', error);
  }
}

// Run the removal
removeProducts().catch(console.error);
