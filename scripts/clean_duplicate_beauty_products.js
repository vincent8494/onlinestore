import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Products to remove (duplicates with inconsistent image paths)
const DUPLICATE_PRODUCTS = [
  'Lipstick',
  'Mascara',
  'Deodorant',
  'Nail Polish',
  'Nail polish' // Handle case sensitivity
];

async function cleanBeautyProducts() {
  try {
    const filePath = path.join(__dirname, '../src/data/beautyProducts.ts');
    let content = await fs.readFile(filePath, 'utf-8');
    
    // Extract the beauty products array
    const productsArrayMatch = content.match(/export const beautyProducts: BeautyProduct\[\] = \[([\s\S]*?)\];/);
    if (!productsArrayMatch) {
      console.error('Could not find beauty products array in the file');
      return;
    }
    
    const productsArrayText = productsArrayMatch[1];
    
    // Parse the products array
    let products = [];
    try {
      // Create a valid JSON array string by wrapping with brackets
      const jsonString = `[${productsArrayText}]`;
      // Use eval to parse the array (be careful with this in production)
      products = (0, eval)(`(${jsonString})`);
    } catch (error) {
      console.error('Error parsing products array:', error);
      return;
    }
    
    // Filter out duplicates, keeping only the first occurrence of each product name
    const seenProducts = new Set();
    const uniqueProducts = products.filter(product => {
      const lowerName = product.name.toLowerCase();
      // Skip if this is a duplicate product we want to remove
      if (DUPLICATE_PRODUCTS.some(name => name.toLowerCase() === lowerName)) {
        // Only keep the first occurrence (with the correct image path)
        if (seenProducts.has(lowerName)) {
          console.log(`Removing duplicate: ${product.name}`);
          return false;
        }
      }
      seenProducts.add(lowerName);
      return true;
    });
    
    // Convert products back to string format
    const productsString = uniqueProducts.map(product => {
      const entries = [
        `id: '${product.id}'`,
        `name: '${product.name.replace(/'/g, "\\'")}'`,
        `price: ${product.price}`,
        `category: '${product.category}'`,
        `subcategory: '${product.subcategory.replace(/'/g, "\\'")}'`
      ];
      
      if (product.size) entries.push(`size: '${product.size}'`);
      if (product.image) entries.push(`image: "${product.image}"`);
      if (product.description) entries.push(`description: '${product.description.replace(/'/g, "\\'")}'`);
      
      return `  { ${entries.join(', ')} }`;
    }).join(',\n');
    
    // Rebuild the file content
    const newContent = content.replace(
      /export const beautyProducts: BeautyProduct\[\] = \[[\s\S]*?\];/,
      `export const beautyProducts: BeautyProduct[] = [
${productsString}
];`
    );
    
    // Write the cleaned content back to the file
    await fs.writeFile(filePath, newContent, 'utf-8');
    console.log('✅ Successfully removed duplicate beauty products');
    
  } catch (error) {
    console.error('Error cleaning beauty products:', error);
  }
}

// Run the cleanup
cleanBeautyProducts().catch(console.error);
