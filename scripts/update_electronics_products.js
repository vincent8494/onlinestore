import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ELECTRONICS_PRODUCTS_PATH = path.join(__dirname, '../src/data/products.ts');

// Mapping of electronics product names to their image files
const ELECTRONICS_IMAGE_MAP = {
  'Smartphone (basic)': 'Smartphone.jpg',
  'Smartphone (flagship)': 'Smartphone.jpg',
  'Laptop (basic)': 'Laptop.jpg',
  'Laptop (gaming)': 'Gaming_Laptop.jpg',
  'Smartwatch': 'Smartwatch.jpg',
  'Wireless earbuds': 'Wireless_Earbuds.jpg',
  'Bluetooth speaker': 'Bluetooth_Speaker.jpg',
  'Flat-screen TV (32")': 'Smart_TV.jpg',
  'Smart TV (50")': 'Smart_TV.jpg',
  'HDMI cable': 'HDMI_Cable.jpg',
  'Phone charger': 'Phone_Charger.jpg',
  'Power bank (10,000mAh)': 'Power_Bank.jpg',
  'USB flash drive (32GB)': 'USB_Flash_Drive.jpg',
  'External hard drive (1TB)': 'External_Hard_Drive.jpg',
  'Printer (inkjet)': 'Inkjet_Printer.jpg',
  'Printer (laser)': 'Laser_Printer.jpg',
  'Wireless keyboard': 'Keyboard.jpg',
  'Wireless mouse': 'Mouse.jpg',
  'Webcam (HD)': 'Webcam.jpg',
  'Router (WiFi)': 'Router.jpg',
  'Smart bulb': 'Smart_Bulb.jpg',
  'Home security camera': 'Security_Camera.jpg',
  'VR headset (basic)': 'VR_Headset.jpg',
  'Drone (camera)': 'Drone.jpg',
  'Action camera (GoPro style)': 'Action_Camera.jpg',
  'Tablet (basic)': 'Tablet.jpg',
  'Gaming console': 'Gaming_Console.jpg',
  'Game controller': 'Game_Controller.jpg',
  'Monitor (24")': 'Monitor.jpg',
  'Monitor (curved, 27")': 'Curved_Monitor.jpg',
  'SSD (500GB)': 'SSD.jpg',
  'Graphics card (mid-range)': 'Graphics_Card.jpg',
  'Motherboard (ATX)': 'Motherboard.jpg',
  'Processor (i5 equivalent)': 'Processor.jpg',
  'RAM (8GB)': 'RAM.jpg',
  'Laptop charger': 'Laptop_Charger.jpg',
  'Screen protector': 'Screen_Protector.jpg',
  'Phone case': 'Phone_Case.jpg',
  'Smart doorbell': 'Smart_Doorbell.jpg',
  'Fitness tracker': 'Fitness_Tracker.jpg',
  'Alarm clock (digital)': 'Alarm_Clock.jpg'
};

async function updateElectronicsProducts() {
  try {
    // Read the electronics products file
    let content = await fs.readFile(ELECTRONICS_PRODUCTS_PATH, 'utf-8');
    
    // Update each product with its corresponding image
    for (const [productName, imageFile] of Object.entries(ELECTRONICS_IMAGE_MAP)) {
      const imagePath = `/images/products/electronics/${imageFile}`;
      
      // Create a regex to find the product by name
      const escapedName = productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const productRegex = new RegExp(`({[^}]*name: ['"]${escapedName}['"][^}]*})`);
      
      // Check if product exists and doesn't already have an image
      if (content.includes(`name: '${productName}'`) || content.includes(`name: "${productName}"`)) {
        const hasImage = new RegExp(`name: ['"]${escapedName}['"][^}]*image:`, 's').test(content);
        
        if (!hasImage) {
          // Add the image property
          content = content.replace(
            productRegex,
            `$1\n  image: "${imagePath}",`
          );
          console.log(`Updated: ${productName} -> ${imagePath}`);
        }
      }
    }
    
    // Write the updated content back to the file
    await fs.writeFile(ELECTRONICS_PRODUCTS_PATH, content, 'utf-8');
    console.log('Successfully updated electronics products with images');
    
  } catch (error) {
    console.error('Error updating electronics products:', error);
  }
}

// Run the update
updateElectronicsProducts().catch(console.error);
