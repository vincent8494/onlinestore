import os
from pathlib import Path
from typing import Dict, List, Set

# Configuration
BASE_DIR = Path(__file__).parent.parent
IMAGES_DIR = BASE_DIR / 'public' / 'images' / 'products'

# Expected categories and their subdirectories
EXPECTED_CATEGORIES = {
    'Electronics': 'electronics',
    'Fashion': 'fashion',
    'Beauty & Personal Care': 'beauty_&_personal_care',
    'Groceries': 'groceries',
    'Home & Kitchen': 'home_&_kitchen'
}

def get_downloaded_images() -> Dict[str, Set[str]]:
    """Get a dictionary of downloaded images by category"""
    downloaded = {}
    
    for category, dir_name in EXPECTED_CATEGORIES.items():
        category_dir = IMAGES_DIR / dir_name
        if not category_dir.exists():
            print(f"⚠️ Directory not found: {category_dir}")
            downloaded[category] = set()
            continue
            
        # Get all JPG files in the directory
        image_files = [f.stem for f in category_dir.glob('*.jpg')]
        downloaded[category] = set(image_files)
    
    return downloaded

def get_expected_product_names() -> Dict[str, Set[str]]:
    """Get a dictionary of expected product names by category"""
    # This is based on the products we tried to download
    return {
        'Electronics': {
            'Smartphone', 'Laptop', 'Bluetooth_Speaker', 'Smartwatch', 'Tablet',
            'Wireless_Earbuds', 'Digital_Camera', 'Gaming_Console', 'Desktop_Computer',
            'Monitor', 'Router', 'Hard_Drive', 'Power_Bank', 'USB_Flash_Drive',
            'VR_Headset', 'Smart_TV', 'Graphics_Card', 'Keyboard', 'Mouse', 'Projector'
        },
        'Fashion': {
            'Men_s_T_shirt', 'Women_s_Jeans', 'Jacket', 'Dress', 'Sweater',
            'Hoodie', 'Shorts', 'Skirt', 'Blazer', 'Shoes', 'Boots', 'Sandals',
            'Suit', 'Tie', 'Belt', 'Gloves', 'Raincoat', 'Swimsuit', 'Leggings'
        },
        'Beauty & Personal Care': {
            'Lipstick', 'Shampoo', 'Moisturizer', 'Face_Wash', 'Conditioner',
            'Hair_Dryer', 'Nail_Polish', 'Sunscreen', 'Foundation', 'Mascara',
            'Makeup_Remover', 'Body_Lotion', 'Deodorant', 'Toothbrush', 'Face_Mask'
        },
        'Groceries': {
            'Rice', 'Wheat_Flour', 'Sugar', 'Salt', 'Milk', 'Butter',
            'Cheese', 'Eggs', 'Bread', 'Cooking_Oil', 'Chicken', 'Beef',
            'Fish', 'Tomatoes', 'Onions', 'Potatoes', 'Carrots', 'Apples'
        },
        'Home & Kitchen': {
            'Microwave', 'Dish_Rack', 'Cookware_Set', 'Blender', 'Toaster',
            'Refrigerator', 'Coffee_Maker', 'Electric_Kettle', 'Rice_Cooker',
            'Chopping_Board', 'Cutlery_Set', 'Dinner_Set', 'Frying_Pan',
            'Pressure_Cooker', 'Air_Fryer', 'Food_Processor', 'Vacuum_Cleaner'
        }
    }

def main():
    print("🔍 Verifying downloaded product images...\n")
    
    # Get downloaded images and expected product names
    downloaded = get_downloaded_images()
    expected = get_expected_product_names()
    
    # Compare and report
    total_missing = 0
    
    print("="*80)
    print("MISSING IMAGES REPORT")
    print("="*80)

    
    for category in EXPECTED_CATEGORIES.keys():
        downloaded_set = downloaded.get(category, set())
        expected_set = expected.get(category, set())
        
        missing = expected_set - downloaded_set
        total_missing += len(missing)
        
        if missing:
            print(f"\n{category.upper()} - {len(missing)} missing")
            print("-" * 60)
            for product in sorted(missing):
                print(f"  - {product.replace('_', ' ').title()}")
    
    print("\n" + "="*80)
    print(f"TOTAL MISSING IMAGES: {total_missing}")
    print("="*80)
    
    if total_missing == 0:
        print("\n✅ All expected product images have been downloaded!")
    else:
        print("\n❌ Some product images are missing. See the report above.")

if __name__ == "__main__":
    main()
