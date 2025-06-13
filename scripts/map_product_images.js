import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directory for product images
const baseImageDir = path.join(__dirname, '../public/images/products');

// Product categories and their corresponding subdirectories and file names
const categories = {
  'beauty': {
    dir: 'beauty_&_personal_care',
    file: 'beautyProducts.ts'
  },
  'electronics': {
    dir: 'electronics',
    file: 'products.ts'
  },
  'fashion': {
    dir: 'fashion',
    file: 'fashionProducts.ts'
  },
  'grocery': {
    dir: 'grocery',
    file: 'groceryProducts.ts'
  },
  'home': {
    dir: 'home_&_kitchen',
    file: 'homeProducts.ts'
  }
};

// Function to normalize product names for matching
function normalizeName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')  // Remove anything in parentheses
    .replace(/[^a-z0-9\s]/g, '')  // Remove special characters
    .replace(/\b(and|with|for|the|a|an|in|on|at|to|from|of)\b/g, '') // Remove common words
    .trim()
    .replace(/\s+/g, ' ');  // Replace multiple spaces with single space
}

// Function to calculate similarity between two strings (0-1)
function stringSimilarity(s1, s2) {
  if (!s1 || !s2) return 0;
  
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  
  // Exact match
  if (s1 === s2) return 1;
  
  // Check if one string contains the other
  if (s1.includes(s2) || s2.includes(s1)) return 0.9;
  
  // Split into words and check word matches
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  
  // Count matching words
  const matches = words1.filter(word1 => 
    word1.length > 2 && words2.some(word2 => 
      word2.length > 2 && 
      (word1.includes(word2) || word2.includes(word1))
    )
  ).length;
  
  // Calculate similarity score
  return matches / Math.max(words1.length, words2.length);
}

// Function to find the best matching image for a product
function findMatchingImage(productName, imageFiles, debug = false) {
  if (!productName || !imageFiles?.length) {
    debug && console.log(`No product name or image files provided`);
    return null;
  }
  
  const normalizedProduct = normalizeName(productName);
  let bestMatch = { score: 0, file: null, name: '' };
  
  debug && console.log(`\nMatching product: "${productName}" (${normalizedProduct})`);
  
  for (const imgFile of imageFiles) {
    const imgName = path.basename(imgFile, path.extname(imgFile));
    const normalizedImg = normalizeName(imgName);
    
    // Calculate similarity score
    const score = stringSimilarity(normalizedProduct, normalizedImg);
    
    // Update best match if current score is higher
    if (score > bestMatch.score) {
      bestMatch = { score, file: imgFile, name: imgName };
      debug && console.log(`  New best match: "${imgName}" (${normalizedImg}) - Score: ${score.toFixed(2)}`);
      
      // Perfect match found, return immediately
      if (score >= 0.9) break;
    }
  }
  
  debug && console.log(`  Best match for "${productName}": "${bestMatch.name}" (Score: ${bestMatch.score.toFixed(2)})`);
  
  // Only return if we have a good enough match
  return bestMatch.score > 0.3 ? bestMatch.file : null;
}

// Function to read and parse a TypeScript file to extract the products array
async function readProductsFile(filePath) {
  try {
    let content = await fs.promises.readFile(filePath, 'utf8');
    
    // Remove TypeScript type annotations
    content = content
      // Remove type annotations after properties
      .replace(/\s*:\s*[\w\s\[\]{}|'"`]+(?=,|\n|\r|\s*[\r\n]\s*[}\]])/g, '')
      // Remove interface/type definitions
      .replace(/(interface|type|export\s+interface|export\s+type)\s+\w+\s*[\s\S]*?\n\s*\}/g, '')
      // Remove single-line type assertions
      .replace(/\s*as\s+[\w\s\[\]{}|'"`]+/g, '');
    
    // Find the products array
    const arrayMatch = content.match(/export\s+const\s+\w+\s*=\s*(\[[\s\S]*?\]);/);
    if (!arrayMatch) {
      console.log(`No products array found in ${filePath}`);
      return [];
    }
    
    let arrayContent = arrayMatch[1];
    
    // Transform to valid JSON
    arrayContent = arrayContent
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '')
      // Handle single quotes
      .replace(/'/g, '"')
      // Handle unquoted keys
      .replace(/([\w\d_]+):/g, '"$1":')
      // Handle trailing commas
      .replace(/,\s*([}\]])/g, '$1')
      // Handle line breaks in strings
      .replace(/\\n/g, '\\n')
      // Handle escaped quotes
      .replace(/\\"/g, '\\"');
    
    // Parse the array
    const products = JSON.parse(arrayContent);
    console.log(`Found ${products.length} products in ${path.basename(filePath)}`);
    return Array.isArray(products) ? products : [];
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    if (error instanceof SyntaxError) {
      console.error('Parsing error at position', error.pos);
    }
    return [];
  }
}

// Function to update product with image paths
async function updateProductImages() {
  // Read and parse each product file
  const productFiles = Object.entries(categories).reduce((acc, [category, data]) => {
    acc[category] = path.join(__dirname, `../src/data/${data.file}`);
    return acc;
  }, {});

  // Read all product files
  const [
    beautyProducts,
    electronicsProducts,
    fashionProducts,
    groceryProducts,
    homeProducts
  ] = await Promise.all([
    readProductsFile(productFiles['beauty']),
    readProductsFile(productFiles['electronics']),
    readProductsFile(productFiles['fashion']),
    readProductsFile(productFiles['grocery']),
    readProductsFile(productFiles['home'])
  ]);

  // Map of categories to their product arrays
  const productMap = {
    beauty: beautyProducts,
    electronics: electronicsProducts,
    fashion: fashionProducts,
    grocery: groceryProducts,
    home: homeProducts
  };
  
  // Process each category
  for (const [category, { dir: subdir }] of Object.entries(categories)) {
    const imageDir = path.join(baseImageDir, subdir);
    
    try {
      const files = fs.readdirSync(imageDir);
      const imageFiles = files.filter(file => 
        ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
      );
      
      console.log(`\nProcessing ${category} (${imageFiles.length} images)`);
      
      if (imageFiles.length === 0) {
        console.log(`No images found for ${category}`);
        continue;
      }
      
      // Update products with matching images
      const products = productMap[category];
      let updatedCount = 0;
      
      console.log(`\nFound ${products.length} products in ${category} category`);
      console.log(`Sample product names:`, products.slice(0, 3).map(p => p.name));
      console.log(`Sample image files:`, imageFiles.slice(0, 3));
      
      // Process first few products with debug info
      for (let i = 0; i < Math.min(5, products.length); i++) {
        const product = products[i];
        console.log(`\n[${i}] Processing: ${product.name}`);
        const matchingImage = findMatchingImage(product.name, imageFiles, true);
        if (matchingImage) {
          console.log(`✅ Match found: ${matchingImage}`);
          product.image = `/images/products/${subdir}/${matchingImage}`;
          updatedCount++;
        } else {
          console.log(`❌ No good match found`);
        }
      }
      
      // Process remaining products silently
      for (let i = 5; i < products.length; i++) {
        const product = products[i];
        const matchingImage = findMatchingImage(product.name, imageFiles);
        if (matchingImage) {
          product.image = `/images/products/${subdir}/${matchingImage}`;
          updatedCount++;
        }
      }
      
      // Write updated products back to file
      const filePath = productFiles[category];
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Find the products array in the file and replace it with updated products
      const updatedContent = fileContent.replace(
        /(const\s+\w+\s*=\s*\[\s*)([\s\S]*?)(\s*\];)/,
        (_, prefix, content, suffix) => {
          // Format products with proper indentation
          const formattedProducts = products.map(p => 
            `  ${JSON.stringify(p, null, 2).replace(/\n/g, '\n  ')}`
          ).join(',\n');
          return `${prefix}${formattedProducts}\n${suffix}`;
        }
      );
      
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Updated ${filePath} with ${updatedCount} products having images`);
      
    } catch (error) {
      console.error(`Error processing ${category}:`, error.message);
    }
  }
}

// Run the update
updateProductImages().catch(console.error);
