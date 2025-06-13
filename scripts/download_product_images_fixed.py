import os
import sys
import json
import re
import time
from pathlib import Path
from typing import Dict, List, Any, Optional
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configuration
PEXELS_API_KEY = os.getenv('PEXELS_API_KEY')
if not PEXELS_API_KEY:
    raise ValueError("PEXELS_API_KEY not found in environment variables")

BASE_DIR = Path(__file__).parent.parent
PRODUCTS_DIR = BASE_DIR / 'public' / 'images' / 'products'
DATA_DIR = BASE_DIR / 'src' / 'data'

# Create directories if they don't exist
PRODUCTS_DIR.mkdir(parents=True, exist_ok=True)

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
    current_key = None
    in_string = False
    in_object = False
    buffer = ""
    
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

def search_pexels_image(query: str, category: str) -> Optional[Dict[str, str]]:
    """Search for an image on Pexels"""
    try:
        headers = {
            'Authorization': PEXELS_API_KEY
        }
        
        # Add category to query for better results
        search_query = f"{query} {category} product"
        
        # Search for photos
        url = f"https://api.pexels.com/v1/search?query={search_query}&per_page=1"
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        if data.get('photos') and len(data['photos']) > 0:
            photo = data['photos'][0]
            return {
                'url': photo['src']['large'],
                'photographer': photo['photographer'],
                'photographer_url': photo['photographer_url']
            }
        return None
    except Exception as e:
        print(f"Error searching Pexels: {e}")
        if response.status_code == 429:  # Rate limit exceeded
            retry_after = int(response.headers.get('Retry-After', 30))
            print(f"Rate limit reached. Waiting for {retry_after} seconds...")
            time.sleep(retry_after)
            return search_pexels_image(query, category)
        return None

def download_image(url: str, filepath: Path) -> bool:
    """Download an image from a URL and save it to the specified filepath"""
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

def main():
    # Define product categories and their corresponding files
    categories = {
        'electronics': 'products.ts',
        'fashion': 'fashionProducts.ts',
        'beauty': 'beautyProducts.ts',
        'groceries': 'groceryProducts.ts',
        'home_kitchen': 'homeProducts.ts'
    }
    
    print("Starting image download process...")
    
    for category_name, filename in categories.items():
        ts_file = DATA_DIR / filename
        if not ts_file.exists():
            print(f"File not found: {ts_file}")
            continue
        
        print(f"\nProcessing category: {category_name} from {filename}")
        
        # Extract products from TypeScript file
        products = extract_products_from_ts(ts_file)
        
        if not products:
            print(f"No products found in {filename}")
            continue
            
        print(f"Found {len(products)} products")
        
        # Create category directory
        category_dir = PRODUCTS_DIR / category_name
        category_dir.mkdir(exist_ok=True)
        
        # Process each product
        for i, product in enumerate(products, 1):
            # Get the display name and ID
            display_name = product.get('name', '').strip()
            product_id = str(product.get('id', f"{category_name[0]}-{i}"))
            
            if not display_name:
                print(f"Skipping product {i}: No name")
                continue
            
            # Skip if image already exists
            image_path = category_dir / f"{product_id}.jpg"
            if image_path.exists():
                print(f"{i}/{len(products)}: Image for {display_name} already exists. Skipping...")
                continue
            
            # Search for image on Pexels
            query = display_name.split('(')[0].strip()  # Remove anything in parentheses
            print(f"{i}/{len(products)}: Searching for {query}...")
            
            image_data = search_pexels_image(query, category_name)
            
            if image_data and download_image(image_data['url'], image_path):
                print(f"  ✓ Downloaded image for {display_name}")
                print(f"  ✓ Photo by {image_data['photographer']} ({image_data['photographer_url']})")
                
                # Update the product's image path
                relative_path = f"/images/products/{category_name}/{product_id}.jpg"
                print(f"  ✓ Image saved to {relative_path}")
            else:
                print(f"  ✗ No suitable image found for {display_name}")
            
            # Be nice to the API - add a small delay between requests
            time.sleep(1)
    
    print("\nImage download process completed!")

if __name__ == "__main__":
    main()
