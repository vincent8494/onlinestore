import os
import re
from pathlib import Path
from typing import Dict, List, Tuple, Optional

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
    'Home & Kitchen': 'home_&_kitchen'
}

def get_image_path(product_name: str, category: str) -> Optional[str]:
    """Get the image path for a product if it exists"""
    # Get the directory for this category
    dir_name = CATEGORY_TO_DIR.get(category)
    if not dir_name:
        return None
    
    # Create a safe filename by removing special characters and replacing spaces with underscores
    safe_name = re.sub(r'[^\w\s]', '', product_name.split('(')[0].strip())
    safe_name = '_'.join(safe_name.split())
    
    # Check if the image exists
    image_path = IMAGES_DIR / dir_name / f"{safe_name}.jpg"
    if image_path.exists():
        return f"/images/products/{dir_name}/{safe_name}.jpg"
    
    return None

def update_product_file(file_path: Path):
    """Update a single product file with image paths"""
    print(f"\nProcessing {file_path.name}...")
    
    # Read the file content
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all products in the file
    product_matches = list(re.finditer(r'\{\s*([^}]*)\s*\}', content))
    updated_count = 0
    
    for match in reversed(product_matches):  # Process in reverse to avoid offset issues
        product_block = match.group(0)
        
        # Extract product properties
        props = {}
        for prop_match in re.finditer(r'(\w+)\s*[:=]\s*([^,}\n]+)', product_block):
            key = prop_match.group(1).strip()
            value = prop_match.group(2).strip()
            
            # Clean up the value
            if value.startswith(("'", '"')) and value.endswith(("'", '"')):
                value = value[1:-1]  # Remove quotes
            
            props[key] = value
        
        # Skip if required fields are missing
        if 'name' not in props or 'category' not in props:
            continue
        
        # Get the image path
        image_path = get_image_path(props['name'], props['category'])
        if not image_path:
            continue
        
        # Check if the product already has an image
        if 'image' in props and props['image']:
            continue  # Skip if already has an image
        
        # Add the image property
        new_product_block = product_block.rstrip('}')
        if not new_product_block.endswith('{') and not new_product_block.endswith(','):
            new_product_block += ','
        new_product_block += f'\n  image: "{image_path}",\n}}'
        
        # Update the content
        content = content[:match.start()] + new_product_block + content[match.end():]
        updated_count += 1
    
    if updated_count > 0:
        # Write the updated content back to the file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✅ Updated {updated_count} products with image paths")
    else:
        print("  ℹ️ No updates needed")

def main():
    print("🔄 Updating product files with image paths...")
    
    # Get all product files
    product_files = list(DATA_DIR.glob('*Products.ts'))
    if not product_files:
        print("❌ No product files found!")
        return
    
    # Process each product file
    for product_file in product_files:
        update_product_file(product_file)
    
    print("\n✅ Update complete!")

if __name__ == "__main__":
    main()
