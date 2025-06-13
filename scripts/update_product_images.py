import os
import json
from pathlib import Path
from typing import Dict, List, Any
import re

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
    'Beauty': 'beauty_&_personal_care',  # Alias for Beauty & Personal Care
    'Home': 'home_&_kitchen'  # Alias for Home & Kitchen
}

def get_downloaded_images() -> Dict[str, Dict[str, str]]:
    """Get a mapping of product names to their image paths"""
    images = {}
    
    for category, dir_name in CATEGORY_TO_DIR.items():
        category_dir = IMAGES_DIR / dir_name
        if not category_dir.exists():
            continue
            
        # Get all JPG files in the directory
        for img_path in category_dir.glob('*.jpg'):
            # Remove the file extension and replace underscores with spaces
            product_name = img_path.stem.replace('_', ' ').lower()
            # Store the relative path from public directory
            rel_path = str(Path('images/products') / dir_name / img_path.name)
            images[(category.lower(), product_name)] = rel_path
    
    return images

def extract_products_from_ts(file_path: Path) -> List[Dict[str, Any]]:
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
    
    i = 0
    while i < len(array_content):
        char = array_content[i]
        
        if char == '{' and not in_object:
            current_obj = {}
            in_object = True
            buffer = ""
        elif char == '}' and in_object:
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

def update_products_with_images():
    """Update product data files with image paths"""
    # Get all product files
    product_files = list(DATA_DIR.glob('*Products.ts'))
    if not product_files:
        print("No product files found!")
        return
    
    # Get mapping of product names to image paths
    image_map = get_downloaded_images()
    
    for product_file in product_files:
        print(f"\nProcessing {product_file.name}...")
        
        # Extract products from TypeScript file
        products = extract_products_from_ts(product_file)
        if not products:
            print(f"  No products found in {product_file.name}")
            continue
        
        updated_products = []
        updated_count = 0
        
        for product in products:
            if 'name' not in product or 'category' not in product:
                updated_products.append(product)
                continue
            
            # Create a key for the image map
            category = product['category']
            product_name = product['name'].split('(')[0].strip().lower()  # Remove anything in parentheses
            
            # Look up the image path
            image_path = image_map.get((category.lower(), product_name))
            
            # If not found, try with base category (e.g., 'Beauty' instead of 'Beauty & Personal Care')
            if not image_path and '&' in category:
                base_category = category.split('&')[0].strip()
                image_path = image_map.get((base_category.lower(), product_name))
            
            # Update the product with the image path if found
            if image_path and ('image' not in product or not product['image']):
                product['image'] = f"/{image_path}"  # Add leading slash for absolute path
                updated_count += 1
            
            updated_products.append(product)
        
        # Read the original file content
        with open(product_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Update the products in the file
        for product in updated_products:
            # Find the product in the original content and update its image property
            # This is a simple approach - for a more robust solution, consider using a proper TypeScript parser
            product_id = product.get('id', '')
            if not product_id:
                continue
                
            # Create a pattern to find the product by ID
            pattern = rf"id\s*[:=]\s*['"]{re.escape(product_id)}['"]([^}]*?)(?=,?\s*[}\]])?"
            
            # If the product has an image, add or update the image property
            if 'image' in product and product['image']:
                replacement = f"id: '{product_id}', image: '{product['image']}'"
                content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        
        # Write the updated content back to the file
        with open(product_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"  Updated {updated_count} products with image paths in {product_file.name}")

if __name__ == "__main__":
    print("🔄 Updating product data with image paths...")
    update_products_with_images()
    print("\n✅ Update complete!")
