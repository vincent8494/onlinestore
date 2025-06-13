import os
import requests
import time

# Pexels API Configuration
PEXELS_API_KEY = "jQFUaHUJBkEMp6kUkGgnggfSPhNkHAmktzPylSfyYSP5arhJouVMjbI1"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRODUCT_IMAGES_DIR = os.path.join(BASE_DIR, 'public', 'images', 'products')

# Product categories and their items
PRODUCTS_BY_CATEGORY = {
    "Electronics": [
        "Smartphone", "Laptop", "Bluetooth Speaker", "Smartwatch", "Tablet",
        "Wireless Earbuds", "Digital Camera", "Gaming Console", "Desktop Computer",
        "Monitor", "Router", "Hard Drive", "Power Bank", "USB Flash Drive",
        "VR Headset", "Smart TV", "Graphics Card", "Keyboard", "Mouse", "Projector"
    ],
    "Fashion": [
        "Men's T-shirt", "Women's Jeans", "Jacket", "Dress", "Sweater",
        "Hoodie", "Shorts", "Skirt", "Blazer", "Shoes", "Boots", "Sandals",
        "Suit", "Tie", "Belt", "Gloves", "Raincoat", "Swimsuit", "Leggings"
    ],
    "Beauty & Personal Care": [
        "Lipstick", "Shampoo", "Moisturizer", "Face Wash", "Conditioner",
        "Hair Dryer", "Nail Polish", "Sunscreen", "Foundation", "Mascara",
        "Makeup Remover", "Body Lotion", "Deodorant", "Toothbrush", "Face Mask"
    ],
    "Groceries": [
        "Rice", "Wheat Flour", "Sugar", "Salt", "Milk", "Butter",
        "Cheese", "Eggs", "Bread", "Cooking Oil", "Chicken", "Beef",
        "Fish", "Tomatoes", "Onions", "Potatoes", "Carrots", "Apples"
    ],
    "Home & Kitchen": [
        "Microwave", "Dish Rack", "Cookware Set", "Blender", "Toaster",
        "Refrigerator", "Coffee Maker", "Electric Kettle", "Rice Cooker",
        "Chopping Board", "Cutlery Set", "Dinner Set", "Frying Pan",
        "Pressure Cooker", "Air Fryer", "Food Processor", "Vacuum Cleaner"
    ]
}

def setup_directories():
    """Create necessary directories for product images"""
    os.makedirs(PRODUCT_IMAGES_DIR, exist_ok=True)
    for category in PRODUCTS_BY_CATEGORY.keys():
        category_dir = os.path.join(PRODUCT_IMAGES_DIR, category.replace(' ', '_').lower())
        os.makedirs(category_dir, exist_ok=True)

def download_image(product_name, category):
    """Download a single product image from Pexels"""
    headers = {
        "Authorization": PEXELS_API_KEY
    }
    params = {
        "query": f"{product_name} product",
        "per_page": 1,
        "orientation": "square"
    }
    
    try:
        # Search for the image
        search_url = "https://api.pexels.com/v1/search"
        response = requests.get(search_url, headers=headers, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("photos") and len(data["photos"]) > 0:
                # Get the first photo
                photo = data["photos"][0]
                image_url = photo["src"]["large"]
                
                # Download the image
                image_response = requests.get(image_url, stream=True, timeout=10)
                if image_response.status_code == 200:
                    # Save the image
                    safe_name = "".join(c if c.isalnum() else "_" for c in product_name)
                    category_dir = os.path.join(PRODUCT_IMAGES_DIR, category.replace(' ', '_').lower())
                    file_path = os.path.join(category_dir, f"{safe_name}.jpg")
                    
                    with open(file_path, 'wb') as f:
                        for chunk in image_response.iter_content(1024):
                            f.write(chunk)
                    
                    print(f"✅ Downloaded: {category}/{safe_name}.jpg")
                    return True
                else:
                    print(f"⚠️ Failed to download image for: {product_name}")
            else:
                print(f"⚠️ No image found for: {product_name}")
        else:
            print(f"❌ API error for {product_name}: {response.status_code}")
            
        return False
        
    except Exception as e:
        print(f"❌ Error processing {product_name}: {str(e)}")
        return False

def main():
    print("🚀 Starting product image downloader...")
    print(f"📁 Saving images to: {PRODUCT_IMAGES_DIR}")
    
    # Setup directories
    setup_directories()
    
    total_downloaded = 0
    
    # Process each category and product
    for category, products in PRODUCTS_BY_CATEGORY.items():
        print(f"\n📦 Category: {category}")
        print("-" * 40)
        
        for product in products:
            if download_image(product, category):
                total_downloaded += 1
            
            # Be nice to the API - add a small delay between requests
            time.sleep(1)
    
    print("\n" + "=" * 50)
    print(f"🎉 Download complete! Downloaded {total_downloaded} images.")
    print(f"📁 Images saved in: {PRODUCT_IMAGES_DIR}")
    print("=" * 50)

if __name__ == "__main__":
    main()
