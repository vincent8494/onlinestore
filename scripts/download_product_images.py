import os
import sys
import requests
import json
from pathlib import Path
from urllib.parse import quote
from typing import List, Dict, Any, Optional

# Add the project root to the Python path
sys.path.append(str(Path(__file__).parent.parent))

# Configuration
UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'  # Replace with your Unsplash Access Key
BASE_DIR = Path(__file__).parent.parent
PRODUCTS_DIR = BASE_DIR / 'public' / 'images' / 'products'

# Import product data
from src.data.products import electronicsProducts
from src.data.fashionProducts import fashionProducts
from src.data.beautyProducts import beautyProducts
from src.data.groceryProducts import groceryProducts
from src.data.homeProducts import homeProducts

# Create directories if they don't exist
PRODUCTS_DIR.mkdir(parents=True, exist_ok=True)

def download_image(url, filepath):
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

def search_unsplash_image(query, category):
    """Search for an image on Unsplash based on the query and category"""
    try:
        headers = {
            'Authorization': f'Client-ID {UNSPLASH_ACCESS_KEY}',
            'Accept-Version': 'v1'
        }
        
        # Add category to query for better results
        search_query = f"{query} {category}"
        encoded_query = quote(search_query)
        
        # Search for photos
        url = f"https://api.unsplash.com/search/photos?query={encoded_query}&per_page=1"
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        if data['results']:
            return data['results'][0]['urls']['regular']
        return None
    except Exception as e:
        print(f"Error searching Unsplash: {e}")
        return None

def process_products(products, category):
    """Process a list of products and download their images"""
    category_dir = PRODUCTS_DIR / category.replace(' ', '_').lower()
    category_dir.mkdir(exist_ok=True)
    
    for product in products:
        # Skip if image already exists
        image_path = category_dir / f"{product['id']}.jpg"
        if image_path.exists():
            print(f"Image for {product['name']} already exists. Skipping...")
            continue
        
        # Search for image on Unsplash
        query = f"{product['name']} product"
        image_url = search_unsplash_image(query, category)
        
        if image_url:
            print(f"Downloading image for {product['name']}...")
            download_image(image_url, image_path)
        else:
            print(f"No image found for {product['name']}")

def convert_product_to_dict(product: Any) -> Dict[str, Any]:
    """Convert product object to dictionary with consistent keys"""
    if hasattr(product, '_asdict'):  # For namedtuples
        return product._asdict()
    elif hasattr(product, 'dict'):  # For Pydantic models
        return product.dict()
    elif isinstance(product, dict):
        return product
    else:
        return vars(product)  # For regular objects

def get_products_by_category() -> Dict[str, List[Dict[str, Any]]]:
    """Organize products by category"""
    categories = {
        'electronics': [],
        'fashion': [],
        'beauty': [],
        'groceries': [],
        'home_kitchen': []
    }
    
    # Convert all products to dictionaries and categorize them
    for product in electronicsProducts:
        p = convert_product_to_dict(product)
        p['_source'] = 'electronics'
        categories['electronics'].append(p)
    
    for product in fashionProducts:
        p = convert_product_to_dict(product)
        p['_source'] = 'fashion'
        categories['fashion'].append(p)
    
    for product in beautyProducts:
        p = convert_product_to_dict(product)
        p['_source'] = 'beauty'
        categories['beauty'].append(p)
    
    for product in groceryProducts:
        p = convert_product_to_dict(product)
        p['_source'] = 'groceries'
        categories['groceries'].append(p)
    
    for product in homeProducts:
        p = convert_product_to_dict(product)
        p['_source'] = 'home_kitchen'
        categories['home_kitchen'].append(p)
    
    return categories

def main():
    # Get all products organized by category
    categories = get_products_by_category()
    
    print("Starting image download process...")
    
    for category_name, products in categories.items():
        if not products:
            print(f"No products found for category: {category_name}")
            continue
            
        print(f"\nProcessing category: {category_name}")
        print(f"Found {len(products)} products")
        
        # Process each product
        for product in products:
            # Get the display name for the product
            display_name = product.get('name', '')
            
            # Get the product ID, using a fallback if needed
            product_id = str(product.get('id', hash(display_name)))
            
            # Update the product with the ID if it was missing
            if 'id' not in product:
                product['id'] = product_id
            
            # Skip if image already exists
            image_path = PRODUCTS_DIR / category_name / f"{product_id}.jpg"
            if image_path.exists():
                print(f"Image for {display_name} already exists. Skipping...")
                continue
            
            # Create the directory if it doesn't exist
            image_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Search for image on Unsplash
            query = f"{display_name} product"
            image_url = search_unsplash_image(query, category_name)
            
            if image_url:
                print(f"Downloading image for {display_name}...")
                if download_image(image_url, image_path):
                    # Update the product's image path in the data
                    relative_path = f"/images/products/{category_name}/{product_id}.jpg"
                    print(f"Saved image to {relative_path}")
                    
                    # Here you would typically update your database or data files
                    # with the new image path. For now, we'll just print it.
                    print(f"Update image path for {product_id} to: {relative_path}")
            else:
                print(f"No image found for {display_name}")
    
    print("\nImage download process completed!")

if __name__ == "__main__":
    if UNSPLASH_ACCESS_KEY == 'YOUR_UNSPLASH_ACCESS_KEY':
        print("ERROR: Please set your Unsplash Access Key in the script.")
        print("Get one at https://unsplash.com/developers")
    else:
        main()
