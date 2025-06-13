export interface HomeProduct {
  id: string;
  name: string;
  price: number;
  category: 'Home & Kitchen';
  subcategory: 'Cleaning' | 'Storage' | 'Bedding' | 'Bath' | 'Kitchen' | 'Furniture' | 'Lighting' | 'Laundry' | 'Organization' | 'Dining' | 'Decor' | 'Outdoor';
  size?: string;
  material?: string;
  color?: string;
  image?: string;
  description?: string;
  type?: string;
  length?: string;
}

export const homeProducts: HomeProduct[] = [
  // Kitchen
  { 
    id: 'h-001', 
    name: 'Chopping Board',
    price: 15, 
    category: 'Home & Kitchen', 
    subcategory: 'Kitchen',
    material: 'Wood',
    image: "/images/products/home/Chopping_Board.jpg"
  },
  { 
    id: 'h-002', 
    name: 'Cookware Set',
    price: 120, 
    category: 'Home & Kitchen', 
    subcategory: 'Kitchen',
    material: 'Stainless Steel',
    image: "/images/products/home/Cookware_Set.jpg"
  },
  { 
    id: 'h-003', 
    name: 'Cutlery Set',
    price: 45, 
    category: 'Home & Kitchen', 
    subcategory: 'Dining',
    material: 'Stainless Steel',
    image: "/images/products/home/Cutlery_Set.jpg"
  },
  { 
    id: 'h-004', 
    name: 'Dinner Set',
    price: 65, 
    category: 'Home & Kitchen', 
    subcategory: 'Dining',
    material: 'Porcelain',
    image: "/images/products/home/Dinner_Set.jpg"
  },
  { 
    id: 'h-005', 
    name: 'Dish Rack',
    price: 22, 
    category: 'Home & Kitchen', 
    subcategory: 'Kitchen',
    material: 'Stainless Steel',
    image: "/images/products/home/Dish_Rack.jpg"
  },
  { 
    id: 'h-006', 
    name: 'Electric Kettle',
    price: 35, 
    category: 'Home & Kitchen', 
    subcategory: 'Kitchen',
    material: 'Stainless Steel',
    image: "/images/products/home/Electric_Kettle.jpg"
  },
  { 
    id: 'h-007', 
    name: 'Food Processor',
    price: 85, 
    category: 'Home & Kitchen', 
    subcategory: 'Kitchen',
    material: 'Plastic & Metal',
    image: "/images/products/home/Food_Processor.jpg"
  },
  { 
    id: 'h-008', 
    name: 'Frying Pan',
    price: 28, 
    category: 'Home & Kitchen', 
    subcategory: 'Kitchen',
    material: 'Non-stick',
    image: "/images/products/home/Frying_Pan.jpg"
  },
  { 
    id: 'h-009', 
    name: 'Microwave',
    price: 110, 
    category: 'Home & Kitchen', 
    subcategory: 'Kitchen',
    material: 'Metal',
    image: "/images/products/home/Microwave.jpg"
  },
  { 
    id: 'h-010', 
    name: 'Pressure Cooker',
    price: 55, 
    category: 'Home & Kitchen', 
    subcategory: 'Kitchen',
    material: 'Stainless Steel',
    image: "/images/products/home/Pressure_Cooker.jpg"
  },
  { 
    id: 'h-011', 
    name: 'Refrigerator',
    price: 600, 
    category: 'Home & Kitchen', 
    subcategory: 'Kitchen',
    material: 'Metal',
    image: "/images/products/home/Refrigerator.jpg"
  },
  { 
    id: 'h-012', 
    name: 'Rice Cooker',
    price: 45, 
    category: 'Home & Kitchen', 
    subcategory: 'Kitchen',
    material: 'Non-stick',
    image: "/images/products/home/Rice_Cooker.jpg"
  },
  { 
    id: 'h-013', 
    name: 'Toaster',
    price: 32, 
    category: 'Home & Kitchen', 
    subcategory: 'Kitchen',
    material: 'Metal & Plastic',
    image: "/images/products/home/Toaster.jpg"
  },
  { 
    id: 'h-014', 
    name: 'Vacuum Cleaner',
    price: 120, 
    category: 'Home & Kitchen', 
    subcategory: 'Cleaning',
    material: 'Plastic & Metal',
    image: "/images/products/home/Vacuum_Cleaner.jpg"
  },
  { 
    id: 'h-015', 
    name: 'Air Fryer',
    price: 95, 
    category: 'Home & Kitchen', 
    subcategory: 'Kitchen',
    material: 'Plastic & Metal',
    image: "/images/products/home/Air_Fryer.jpg"
  },
  { 
    id: 'h-016', 
    name: 'Blender',
    price: 45, 
    category: 'Home & Kitchen', 
    subcategory: 'Kitchen',
    material: 'Plastic & Metal',
    image: "/images/products/home/Blender.jpg"
  },
  { 
    id: 'h-017', 
    name: 'Coffee Maker',
    price: 75, 
    category: 'Home & Kitchen', 
    subcategory: 'Kitchen',
    material: 'Plastic & Metal',
    image: "/images/products/home/Coffee_Maker.jpg"
  },
  
  
  
  
  
  // Bath
  
  
  
  // Laundry
  
  
  
  
  
  
  
  // Organization
  
  
  
  
  
  
  
  // Decor
  
  
  
  // Sofa cover entry already exists above
  
  // Outdoor
  
  
  
  
  
  // Electrical
  
  
  
  // Protection
  
  
  // Water
  
  
  // Ironing
  
  
  // Window
  
];
