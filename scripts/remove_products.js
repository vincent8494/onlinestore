import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Products to remove with their exact names as they appear in the files
const PRODUCTS_TO_REMOVE = [
  'Premium Wireless Headphones',
  'Smart Fitness Watch',
  'Professional Camera Lens',
  'Gaming Mechanical Keyboard',
  'Designer Sunglasses',
  'Organic Coffee Beans'
];

// Files to process with their specific patterns
const FILES_TO_PROCESS = [
  {
    path: 'src/pages/Products.tsx',
    pattern: /{\s*[^}]*name\s*:\s*['"]([^'"]+)['"][^}]*},?/g,
    isArray: true
  },
  {
    path: 'src/pages/Home.tsx',
    pattern: /{\s*[^}]*name\s*:\s*['"]([^'"]+)['"][^}]*},?/g,
    isArray: true
  },
  {
    path: 'src/pages/OrderHistory.tsx',
    pattern: /name\s*:\s*['"]([^'"]+)['"]/g,
    isArray: false
  },
  {
    path: 'src/pages/SellDashboard.tsx',
    pattern: /name\s*:\s*['"]([^'"]+)['"]/g,
    isArray: false
  },
  {
    path: 'src/pages/NewArrivals.tsx',
    pattern: /title\s*:\s*['"]([^'"]+)['"]/g,
    isArray: false
  },
  {
    path: 'src/pages/ProductDetails.tsx',
    pattern: /name\s*:\s*['"]([^'"]+)['"]/g,
    isArray: false
  },
  {
    path: 'src/pages/EditProduct.tsx',
    pattern: /name\s*:\s*['"]([^'"]+)['"]/g,
    isArray: false
  }
];

async function removeProducts() {
  try {
    for (const file of FILES_TO_PROCESS) {
      const fullPath = path.join(process.cwd(), file.path);
      
      try {
        // Read the file content
        let content = await fs.readFile(fullPath, 'utf-8');
        let originalContent = content;
        let removedCount = 0;

        // Process each product to remove
        for (const product of PRODUCTS_TO_REMOVE) {
          const escapedProduct = product.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          
          if (file.isArray) {
            // For array items (like in Products.tsx, Home.tsx)
            const arrayItemPattern = new RegExp(
              `{\s*[^}]*name\s*:\s*['"]${escapedProduct}['"][^}]*},?\s*`,
              'g'
            );
            
            content = content.replace(arrayItemPattern, (match) => {
              removedCount++;
              return '';
            });
          } else {
            // For other files with different patterns
            const pattern = new RegExp(`['"]${escapedProduct}['"]`, 'g');
            content = content.replace(pattern, (match) => {
              removedCount++;
              return '';
            });
          }
        }

        // Clean up any trailing commas before closing brackets/braces
        content = content.replace(/,\s*([}\]])/g, '$1');
        
        // Clean up any double commas
        content = content.replace(/,\s*,/g, ',');
        
        // Clean up any trailing commas at the end of arrays/objects
        content = content.replace(/,\s*([}\]])/g, '$1');
        
        // Clean up empty lines
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        if (content !== originalContent) {
          await fs.writeFile(fullPath, content, 'utf-8');
          console.log(`✅ Removed ${removedCount} occurrences from ${file.path}`);
        } else {
          console.log(`ℹ️  No changes made to ${file.path}`);
        }
        
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`ℹ️  File not found: ${file.path}`);
        } else {
          console.error(`Error processing ${file.path}:`, error.message);
        }
      }
    }
    
    console.log('\n✅ Product removal complete!');
    
  } catch (error) {
    console.error('Error in removeProducts:', error);
  }
}

// Run the removal
removeProducts().catch(console.error);
