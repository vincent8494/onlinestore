import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ELECTRONICS_IMAGES_PATH = path.join(__dirname, '../public/images/products/electronics');
const MISSING_IMAGES = [
  'Gaming_Controller.jpg',
  'Curved_Monitor.jpg',
  'SSD.jpg',
  'Graphics_Card.jpg',
  'Motherboard.jpg',
  'Processor.jpg',
  'RAM.jpg',
  'Laptop_Charger.jpg',
  'Screen_Protector.jpg',
  'Phone_Case.jpg',
  'Smart_Doorbell.jpg',
  'Fitness_Tracker.jpg',
  'Alarm_Clock.jpg',
  'Laptop_Stand.jpg',
  'Desktop_PC.jpg',
  'Wireless_Headphones.jpg',
  'Ethernet_Cable.jpg',
  'USB_Hub.jpg',
  'Car_Phone_Mount.jpg',
  'Laptop_Backpack.jpg',
  'Phone_Gimbal.jpg',
  'Ebook_Reader.jpg'
];

async function verifyMissingImages() {
  try {
    console.log('Verifying missing electronics images...\n');
    
    // Get list of all current files in the electronics directory
    const existingFiles = await fs.readdir(ELECTRONICS_IMAGES_PATH);
    
    // Check each missing image
    let foundCount = 0;
    const stillMissing = [];
    
    console.log('Status of previously missing images:');
    console.log('-----------------------------------');
    
    for (const image of MISSING_IMAGES) {
      if (existingFiles.includes(image)) {
        console.log(`✅ Found: ${image}`);
        foundCount++;
      } else {
        console.log(`❌ Still missing: ${image}`);
        stillMissing.push(image);
      }
    }
    
    // Print summary
    console.log('\nVerification Summary:');
    console.log('---------------------');
    console.log(`Total checked: ${MISSING_IMAGES.length}`);
    console.log(`✅ Found: ${foundCount}`);
    console.log(`❌ Still missing: ${stillMissing.length}`);
    
    if (stillMissing.length > 0) {
      console.log('\nStill missing images:');
      console.log('---------------------');
      stillMissing.forEach(img => console.log(`- ${img}`));
    }
    
  } catch (error) {
    console.error('Error verifying images:', error);
  }
}

// Run the verification
verifyMissingImages().catch(console.error);
