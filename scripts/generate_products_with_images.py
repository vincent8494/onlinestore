import os
import json
from pathlib import Path
from typing import Dict, List, Any, Optional

# Configuration
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / 'src' / 'data'
IMAGES_DIR = BASE_DIR / 'public' / 'images' / 'products'

# Map category names to their directory names
CATEGORY_TO_DIR = {
    'Electronics': 'electronics',
    'Fashion': 'fashion',
    'Beauty & Personal Care': 'beauty_&_personal_care',
    'Groceries': 'groceries',
    'Home & Kitchen': 'home_&_kitchen',
    'Beauty': 'beauty_&_personal_care',  # Alias
    'Home': 'home_&_kitchen'  # Alias
}

def get_product_image_path(product_name: str, category: str) -> Optional[str]:
    """Get the image path for a product if it exists"""
    # Try the exact category first
    dir_name = CATEGORY_TO_DIR.get(category)
    if not dir_name:
        return None
    
    # Create a safe filename by replacing spaces with underscores and removing special chars
    safe_name = "".join(c if c.isalnum() else "_" for c in product_name.split('(')[0].strip())
    
    # Check if the image exists
    image_path = IMAGES_DIR / dir_name / f"{safe_name}.jpg"
    if image_path.exists():
        return f"/images/products/{dir_name}/{safe_name}.jpg"
    
    return None

def update_products_file(file_path: Path, products: List[Dict[str, Any]]) -> bool:
    """Update the products file with image paths"""
    updated = False
    
    for product in products:
        if 'name' not in product or 'category' not in product:
            continue
            
        # Skip if already has an image
        if 'image' in product and product['image']:
            continue
            
        # Get the image path
        image_path = get_product_image_path(product['name'], product['category'])
        if image_path:
            product['image'] = image_path
            updated = True
    
    if not updated:
        return False
    
    # Generate the TypeScript content
    lines = []
    lines.append("export interface Product {")
    lines.append("  id: string;")
    lines.append("  name: string;")
    lines.append("  price: number;")
    lines.append("  category: string;")
    lines.append("  image?: string;")
    lines.append("  description?: string;")
    lines.append("  [key: string]: any;")
    lines.append("}")
    lines.append("")
    
    # Add the products array
    lines.append(f"export const {file_path.stem}: Product[] = [")
    
    for i, product in enumerate(products):
        lines.append("  {")
        for key, value in product.items():
            if isinstance(value, str):
                # Escape single quotes in strings
                value = value.replace("'", "\\'")
                lines.append(f"    {key}: '{value}',")
            elif isinstance(value, bool):
                lines.append(f"    {key}: {'true' if value else 'false'},")
            elif value is None:
                lines.append(f"    {key}: null,")
            else:
                lines.append(f"    {key}: {value},")
        
        # Add a comma unless it's the last item
        if i < len(products) - 1:
            lines.append("  },")
        else:
            lines.append("  }")
    
    lines.append("];")
    
    # Write the updated content back to the file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(lines))
    
    return True

def main():
    print("🔄 Updating product data with image paths...")
    
    # Get all product files
    product_files = list(DATA_DIR.glob('*Products.ts'))
    if not product_files:
        print("❌ No product files found!")
        return
    
    updated_count = 0
    
    for product_file in product_files:
        print(f"\nProcessing {product_file.name}...")
        
        # Read the file content
        with open(product_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract the products array
        products_match = re.search(r'export\s+const\s+\w+\s*=\s*\[(.*?)\];', content, re.DOTALL)
        if not products_match:
            print(f"  ❌ Could not find products array in {product_file.name}")
            continue
        
        # Extract the interface
        interface_match = re.search(r'export\s+interface\s+\w+\s*\{([^}]*)\}', content, re.DOTALL)
        
        # Parse the products as JSON (with some preprocessing)
        products_str = products_match.group(1).strip()
        # Replace single quotes with double quotes for JSON parsing
        products_str = products_str.replace("'", '"')
        # Fix trailing commas
        products_str = re.sub(r',\s*}', '}', products_str)
        products_str = re.sub(r',\s*]', ']', products_str)
        
        try:
            # Wrap in square brackets to make it a valid JSON array
            products = json.loads(f'[{products_str}]')
            
            # Update the products with image paths
            if update_products_file(product_file, products):
                print(f"  ✅ Updated {len([p for p in products if 'image' in p])} products with image paths")
                updated_count += 1
            else:
                print("  ℹ️ No updates needed")
                
        except json.JSONDecodeError as e:
            print(f"  ❌ Error parsing products in {product_file.name}: {e}")
    
    print(f"\n✅ Updated {updated_count} product files")

if __name__ == "__main__":
    import re
    main()
