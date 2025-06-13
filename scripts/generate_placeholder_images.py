import os
import random
import hashlib
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Configuration
BASE_DIR = Path(__file__).parent.parent
PRODUCTS_DIR = BASE_DIR / 'public' / 'images' / 'products'
FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"  # Common font path on Linux

# Create directories if they don't exist
PRODUCTS_DIR.mkdir(parents=True, exist_ok=True)

def get_random_color():
    """Generate a pastel color"""
    r = random.randint(100, 200)
    g = random.randint(100, 200)
    b = random.randint(100, 200)
    return (r, g, b)

def generate_placeholder_image(product_name: str, product_id: str, category: str, width: int = 400, height: int = 400) -> str:
    """Generate a placeholder image with the product name and ID"""
    # Create a new image with a random pastel background
    bg_color = get_random_color()
    image = Image.new('RGB', (width, height), color=bg_color)
    draw = ImageDraw.Draw(image)
    
    # Try to load a font, fall back to default if not found
    try:
        font_size = 20
        font = ImageFont.truetype(FONT_PATH, font_size)
    except IOError:
        font = ImageFont.load_default()
    
    # Add text to the image
    text = f"{product_name}\n({product_id})"
    
    # Calculate text size and position
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    # Calculate position to center the text
    x = (width - text_width) / 2
    y = (height - text_height) / 2
    
    # Draw text with a contrasting color
    text_color = (255 - bg_color[0], 255 - bg_color[1], 255 - bg_color[2])
    draw.text((x, y), text, fill=text_color, font=font)
    
    # Create category directory if it doesn't exist
    category_dir = PRODUCTS_DIR / category.lower().replace(' ', '_')
    category_dir.mkdir(exist_ok=True)
    
    # Save the image
    image_path = category_dir / f"{product_id}.jpg"
    image.save(image_path, "JPEG")
    
    return str(image_path.relative_to(BASE_DIR))

def main():
    # Sample product data (you would replace this with your actual data)
    sample_products = [
        {"id": "e-001", "name": "Smartphone (basic)", "category": "Electronics"},
        {"id": "f-001", "name": "Men's T-Shirt", "category": "Fashion"},
        {"id": "b-001", "name": "Shampoo", "category": "Beauty"},
        {"id": "g-001", "name": "Rice (1kg)", "category": "Groceries"},
        {"id": "h-001", "name": "Kitchen Knife Set", "category": "Home & Kitchen"},
    ]
    
    print("Generating placeholder images...")
    
    for product in sample_products:
        try:
            image_path = generate_placeholder_image(
                product["name"], 
                product["id"], 
                product["category"]
            )
            print(f"Generated: {image_path}")
        except Exception as e:
            print(f"Error generating image for {product['id']}: {e}")
    
    print("\nPlaceholder image generation completed!")

if __name__ == "__main__":
    # Install required package if not already installed
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        print("Installing required package: Pillow")
        import subprocess
        import sys
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
        from PIL import Image, ImageDraw, ImageFont
    
    main()
