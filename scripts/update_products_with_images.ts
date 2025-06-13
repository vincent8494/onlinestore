import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Product data with image paths
const productsWithImages = {
  "Electronics": [
    { id: 'e-001', name: 'Smartphone (basic)', price: 120, category: 'Electronics', image: '/images/products/electronics/Smartphone.jpg' },
    { id: 'e-002', name: 'Laptop (basic)', price: 400, category: 'Electronics', image: '/images/products/electronics/Laptop.jpg' },
    { id: 'e-003', name: 'Bluetooth speaker', price: 50, category: 'Electronics', image: '/images/products/electronics/Bluetooth_Speaker.jpg' },
    // Add more electronics products...
  ],
  "Fashion": [
    { id: 'f-001', name: "Men's T-shirt", price: 25, category: 'Fashion', image: '/images/products/fashion/Men_s_T_shirt.jpg' },
    { id: 'f-002', name: 'Jeans', price: 45, category: 'Fashion', image: '/images/products/fashion/Jeans.jpg' },
    // Add more fashion products...
  ],
  "Beauty & Personal Care": [
    { id: 'b-001', name: 'Shampoo', price: 8, category: 'Beauty & Personal Care', image: '/images/products/beauty_&_personal_care/Shampoo.jpg' },
    { id: 'b-002', name: 'Moisturizer', price: 15, category: 'Beauty & Personal Care', image: '/images/products/beauty_&_personal_care/Moisturizer.jpg' },
    // Add more beauty products...
  ],
  "Groceries": [
    { id: 'g-001', name: 'Rice', price: 5, category: 'Groceries', image: '/images/products/groceries/Rice.jpg' },
    { id: 'g-002', name: 'Pasta', price: 3, category: 'Groceries', image: '/images/products/groceries/Pasta.jpg' },
    // Add more grocery products...
  ],
  "Home & Kitchen": [
    { id: 'h-001', name: 'Cookware Set', price: 150, category: 'Home & Kitchen', image: '/images/products/home_&_kitchen/Cookware_Set.jpg' },
    { id: 'h-002', name: 'Blender', price: 50, category: 'Home & Kitchen', image: '/images/products/home_&_kitchen/Blender.jpg' },
    // Add more home & kitchen products...
  ]
};

// Generate TypeScript content
const generateTypeScriptContent = () => {
  let content = '// Auto-generated file - Do not edit manually\n\n';
  
  // Add interface
  content += 'export interface Product {\n';
  content += '  id: string;\n';
  content += '  name: string;\n';
  content += '  price: number;\n';
  content += '  category: string;\n';
  content += '  image: string;\n';
  content += '  description?: string;\n';
  content += '  [key: string]: any;\n';
  content += '}\n\n';

  // Add products by category
  for (const [category, products] of Object.entries(productsWithImages)) {
    const varName = `${category.toLowerCase().replace(/[^a-z]/g, '')}Products`;
    
    content += `// ${category} Products\n`;
    content += `export const ${varName}: Product[] = ${JSON.stringify(products, null, 2)};\n\n`;
  }

  // Add all products array
  const allProducts = Object.values(productsWithImages).flat();
  content += '// All Products\n';
  content += `export const allProducts: Product[] = ${JSON.stringify(allProducts, null, 2)};\n`;

  return content;
};

// Write to file
const outputPath = join(process.cwd(), 'src', 'data', 'productsWithImages.ts');
const content = generateTypeScriptContent();

writeFileSync(outputPath, content, 'utf-8');
console.log(`✅ Generated ${outputPath}`);
