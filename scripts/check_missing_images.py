import os
import json
import re
from pathlib import Path
from typing import Dict, List, Set, Tuple

# Configuration
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / 'src' / 'data'
IMAGES_DIR = BASE_DIR / 'public' / 'images' / 'products'

# Dictionary to store missing images by category
missing_images: Dict[str, List[Dict]] = {}

def extract_products_from_ts(file_path: Path) -> List[Dict]:
    """Extract products from a TypeScript file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the array of products
    match = re.search(r'export\s+const\s+\w+\s*=\s*\[(.*?)\];', content, re.DOTALL)
    if not match:
        return []
    
    # Extract the array content
    array_content = match.group(1).strip()
    
    # Simple parser for the TypeScript array
    products = []
    current_obj = {}
    buffer = ""
    in_object = False
    in_string = False
    escape = False
    
    i = 0
    while i < len(array_content):
        char = array_content[i]
        
        if char == '{' and not in_string:
            current_obj = {}
            in_object = True
            buffer = ""
        elif char == '}' and not in_string and in_object:
            # Process the buffer as key-value pairs
            pairs = [p.strip() for p in buffer.split(',') if p.strip()]
            for pair in pairs:
                if ':' in pair:
                    key, value = pair.split(':', 1)
                    key = key.strip().strip('"\'')
                    value = value.strip()
                    
                    # Remove trailing comma if present
                    if value.endswith(','):
                        value = value[:-1].strip()
                    
                    # Handle string values
                    if (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
                        value = value[1:-1]
                    # Handle numbers
                    elif value.replace('.', '').isdigit():
                        if '.' in value:
                            value = float(value)
                        else:
                            value = int(value)
                    # Handle boolean
                    elif value.lower() == 'true':
                        value = True
                    elif value.lower() == 'false':
                        value = False
                    # Handle null/undefined
                    elif value.lower() in ('null', 'undefined'):
                        value = None
                    
                    current_obj[key] = value
            
            products.append(current_obj)
            in_object = False
            buffer = ""
        elif in_object:
            buffer += char
        
        i += 1
    
    return products

def get_expected_image_path(product: Dict) -> Path:
    """Generate the expected image path for a product"""
    category_dir = product['category'].replace(' ', '_').lower()
    product_name = product['name'].split('(')[0].strip()  # Remove anything in parentheses
    safe_name = "".join(c if c.isalnum() else "_" for c in product_name)
    return IMAGES_DIR / category_dir / f"{safe_name}.jpg"

def check_missing_images():
    """Check which products are missing images"""
    # Get all product files
    product_files = list(DATA_DIR.glob('*Products.ts'))
    
    if not product_files:
        print("No product files found!")
        return
    
    # Process each product file
    for product_file in product_files:
        category = product_file.stem.replace('Products', '').replace('_', ' ').title()
        if category == 'Grocery':
            category = 'Groceries'
        elif category == 'Home':
            category = 'Home & Kitchen'
        
        print(f"\nChecking {category} products...")
        
        # Extract products from TypeScript file
        products = extract_products_from_ts(product_file)
        
        if not products:
            print(f"  No products found in {product_file.name}")
            continue
        
        missing = []
        
        # Check each product
        for product in products:
            if 'name' not in product or 'category' not in product:
                continue
                
            # Get expected image path
            image_path = get_expected_image_path(product)
            
            # Check if image exists
            if not image_path.exists():
                missing.append({
                    'id': product.get('id', 'N/A'),
                    'name': product['name'],
                    'expected_path': str(image_path.relative_to(BASE_DIR))
                })
        
        # Store missing images for this category
        if missing:
            missing_images[category] = missing
            print(f"  ❌ {len(missing)}/{len(products)} products missing images")
        else:
            print(f"  ✅ All {len(products)} products have images")
    
    # Generate report
    generate_report()

def generate_report():
    """Generate a report of missing images"""
    if not missing_images:
        print("\n✅ All products have images!")
        return
    
    print("\n" + "="*80)
    print("MISSING IMAGES REPORT")
    print("="*80)
    
    total_missing = 0
    
    for category, products in missing_images.items():
        print(f"\n{category.upper()} ({len(products)} missing)")
        print("-" * 60)
        
        for product in products:
            print(f"ID: {product['id']}")
            print(f"Name: {product['name']}")
            print(f"Expected: {product['expected_path']}")
            print()
        
        total_missing += len(products)
    
    print("="*80)
    print(f"TOTAL MISSING IMAGES: {total_missing}")
    print("="*80)

if __name__ == "__main__":
    print("🔍 Checking for missing product images...")
    check_missing_images()
