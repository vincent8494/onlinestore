export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
}

export const electronicsProducts: Product[] = [
  { 
    id: 'e-001', 
    name: 'Smartphone',
    price: 800, 
    category: 'Electronics',
    image: "/images/products/electronics/Smartphone.jpg"
  },
  { 
    id: 'e-003', 
    name: 'Laptop',
    price: 400, 
    category: 'Electronics',
    image: "/images/products/electronics/Laptop.jpg"
  },
  { 
    id: 'e-005', 
    name: 'Smartwatch',
    price: 150, 
    category: 'Electronics',
    image: "/images/products/electronics/Smartwatch.jpg"
  },
  { 
    id: 'e-006', 
    name: 'Wireless earbuds',
    price: 60, 
    category: 'Electronics',
    image: "/images/products/electronics/Wireless_Earbuds.jpg"
  },
  { 
    id: 'e-007', 
    name: 'Bluetooth speaker', 
    price: 50, 
    category: 'Electronics',
    image: "/images/products/electronics/Bluetooth_Speaker.jpg"
  },
  { 
    id: 'e-008', 
    name: 'Smart TV', 
    price: 500, 
    category: 'Electronics',
    image: "/images/products/electronics/Smart_TV.jpg"
  },
  { 
    id: 'e-012', 
    name: 'Power bank (10,000mAh)',
    price: 25, 
    category: 'Electronics',
    image: "/images/products/electronics/Power_Bank.jpg"
  },
  { 
    id: 'e-013', 
    name: 'USB flash drive (32GB)',
    price: 10, 
    category: 'Electronics',
    image: "/images/products/electronics/USB_Flash_Drive.jpg"
  },
  { 
    id: 'e-014', 
    name: 'Hard drive',
    price: 60, 
    category: 'Electronics',
    image: "/images/products/electronics/Hard_Drive.jpg"
  },
  { 
    id: 'e-017', 
    name: 'Wireless keyboard',
    price: 30, 
    category: 'Electronics',
    image: "/images/products/electronics/Keyboard.jpg"
  },
  { 
    id: 'e-018', 
    name: 'Wireless mouse',
    price: 20, 
    category: 'Electronics',
    image: "/images/products/electronics/Mouse.jpg"
  },
  { 
    id: 'e-020', 
    name: 'Router (WiFi)',
    price: 50, 
    category: 'Electronics',
    image: "/images/products/electronics/Router.jpg"
  },
  { 
    id: 'e-023', 
    name: 'VR headset',
    price: 200, 
    category: 'Electronics',
    image: "/images/products/electronics/VR_Headset.jpg"
  },
  { 
    id: 'e-026', 
    name: 'Tablet',
    price: 150, 
    category: 'Electronics',
    image: "/images/products/electronics/Tablet.jpg"
  },
  { 
    id: 'e-027', 
    name: 'Gaming console',
    price: 400, 
    category: 'Electronics',
    image: "/images/products/electronics/Gaming_Console.jpg"
  },
  { 
    id: 'e-028', 
    name: 'Game controller', 
    price: 50, 
    category: 'Electronics',
    image: "/images/products/electronics/Gaming_Controller.jpg"
  },
  { 
    id: 'e-029', 
    name: 'Monitor (24")',
    price: 120, 
    category: 'Electronics',
    image: "/images/products/electronics/Monitor.jpg"
  },
  { 
    id: 'e-030', 
    name: 'Monitor (curved, 27")', 
    price: 250, 
    category: 'Electronics',
    image: "/images/products/electronics/Curved_Monitor.jpg"
  },
  { 
    id: 'e-031', 
    name: 'SSD (500GB)', 
    price: 80, 
    category: 'Electronics',
    image: "/images/products/electronics/SSD.jpg"
  },
  { 
    id: 'e-032', 
    name: 'Graphics card (mid-range)',
    price: 300, 
    category: 'Electronics',
    image: "/images/products/electronics/Graphics_Card.jpg"
  },
  { 
    id: 'e-033', 
    name: 'Motherboard (ATX)', 
    price: 120, 
    category: 'Electronics',
    image: "/images/products/electronics/Motherboard.jpg"
  },
  { 
    id: 'e-034', 
    name: 'Processor (i5 equivalent)', 
    price: 180, 
    category: 'Electronics',
    image: "/images/products/electronics/Processor.jpg"
  },
  { 
    id: 'e-035', 
    name: 'RAM (8GB)', 
    price: 40, 
    category: 'Electronics',
    image: "/images/products/electronics/RAM.jpg"
  },
  { 
    id: 'e-036', 
    name: 'Laptop charger',
    price: 35, 
    category: 'Electronics',
    image: "/images/products/electronics/Laptop_Charger.jpg"
  },
  { 
    id: 'e-037', 
    name: 'Screen protector', 
    price: 5, 
    category: 'Electronics',
    image: "/images/products/electronics/Screen_Protector.jpg"
  },
  { 
    id: 'e-038', 
    name: 'Phone case', 
    price: 10, 
    category: 'Electronics',
    image: "/images/products/electronics/Phone_Case.jpg"
  },
  { 
    id: 'e-039', 
    name: 'Smart doorbell',
    price: 90, 
    category: 'Electronics',
    image: "/images/products/electronics/Smart_Doorbell.jpg"
  },
  { 
    id: 'e-040', 
    name: 'Fitness tracker', 
    price: 70, 
    category: 'Electronics',
    image: "/images/products/electronics/Fitness_Tracker.jpg"
  },
  { 
    id: 'e-041', 
    name: 'Alarm clock (digital)',
    price: 20, 
    category: 'Electronics',
    image: "/images/products/electronics/Alarm_Clock.jpg"
  },
  { 
    id: 'e-042', 
    name: 'Laptop stand',
    price: 25, 
    category: 'Electronics',
    image: "/images/products/electronics/Laptop_Stand.jpg"
  },
  { 
    id: 'e-043', 
    name: 'Desktop PC (entry level)',
    price: 350, 
    category: 'Electronics',
    image: "/images/products/electronics/Desktop_PC.jpg"
  },
  { 
    id: 'e-044', 
    name: 'Wireless headphones',
    price: 80, 
    category: 'Electronics',
    image: "/images/products/electronics/Wireless_Headphones.jpg"
  },
  { 
    id: 'e-045', 
    name: 'Projector (portable)',
    price: 200, 
    category: 'Electronics',
    image: "/images/products/electronics/Projector.jpg"
  },
  { 
    id: 'e-046', 
    name: 'Ethernet cable (10m)', 
    price: 12, 
    category: 'Electronics',
    image: "/images/products/electronics/Ethernet_Cable.jpg"
  },
  { 
    id: 'e-047', 
    name: 'USB hub', 
    price: 15, 
    category: 'Electronics',
    image: "/images/products/electronics/USB_Hub.jpg"
  },
  { 
    id: 'e-048', 
    name: 'Car phone mount', 
    price: 8, 
    category: 'Electronics',
    image: "/images/products/electronics/Car_Phone_Mount.jpg"
  },
  { 
    id: 'e-049', 
    name: 'Laptop backpack', 
    price: 40, 
    category: 'Electronics',
    image: "/images/products/electronics/Laptop_Backpack.jpg"
  },
  { 
    id: 'e-050', 
    name: 'Phone gimbal', 
    price: 90, 
    category: 'Electronics',
    image: "/images/products/electronics/Phone_Gimbal.jpg"
  },
  { 
    id: 'e-051', 
    name: 'E-book reader', 
    price: 130, 
    category: 'Electronics',
    image: "/images/products/electronics/Ebook_Reader.jpg"
  }
];
