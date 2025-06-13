import os
import sys
import requests
import time
from pathlib import Path
from typing import Dict, List, Any, Optional
from urllib.parse import quote
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Add the project root to the Python path
sys.path.append(str(Path(__file__).parent.parent))

# Configuration
PEXELS_API_KEY = os.getenv('PEXELS_API_KEY')
if not PEXELS_API_KEY:
    raise ValueError("PEXELS_API_KEY not found in environment variables")

BASE_DIR = Path(__file__).parent.parent
PRODUCTS_DIR = BASE_DIR / 'public' / 'images' / 'products'

# Import product data
import sys
import os

# Add the src directory to the Python path
src_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src'))
sys.path.append(src_dir)

# Import products from the data directory
from data.products import electronicsProducts
from data.fashionProducts import fashionProducts
from data.beautyProducts import beautyProducts
from data.groceryProducts import groceryProducts
from data.homeProducts import homeProducts

# Create directories if they don't exist
PRODUCTS_DIR.mkdir(parents=True, exist_ok=True)

def search_pexels_image(query: str, category: str, per_page: int = 1, page: int = 1) -> Optional[Dict[str, Any]]:
    """Search for an image on Pexels based on the query and category"""
    try:
        headers = {
            'Authorization': PEXELS_API_KEY
        }
        
        # Add category to query for better results
        search_query = f"{query} {category} product"
        encoded_query = quote(search_query)
        
        # Search for photos
        url = f"https://api.pexels.com/v1/search?query={encoded_query}&per_page={per_page}&page={page}"
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
            return search_pexels_image(query, category, per_page, page)
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
        p = product if isinstance(product, dict) else vars(product)
        p['_source'] = 'electronics'
        categories['electronics'].append(p)
    
    for product in fashionProducts:
        p = product if isinstance(product, dict) else vars(product)
        p['_source'] = 'fashion'
        categories['fashion'].append(p)
    
    for product in beautyProducts:
        p = product if isinstance(product, dict) else vars(product)
        p['_source'] = 'beauty'
        categories['beauty'].append(p)
    
    for product in groceryProducts:
        p = product if isinstance(product, dict) else vars(product)
        p['_source'] = 'groceries'
        categories['groceries'].append(p)
    
    for product in homeProducts:
        p = product if isinstance(product, dict) else vars(product)
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
        
        # Create category directory
        category_dir = PRODUCTS_DIR / category_name
        category_dir.mkdir(exist_ok=True)
        
        # Process each product
        for i, product in enumerate(products, 1):
            # Get the display name for the product
            display_name = product.get('name', '')
            
            # Get the product ID, using a fallback if needed
            product_id = str(product.get('id', f"{category_name[0]}-{i}"))
            
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
            else:
                print(f"  ✗ No suitable image found for {display_name}")
            
            # Be nice to the API - add a small delay between requests
            time.sleep(1)
    
    print("\nImage download process completed!")

if __name__ == "__main__":
    main()
