export interface GroceryProduct {
  id: string;
  name: string;
  price: number;
  category: 'Groceries';
  subcategory: 'Staples' | 'Dairy & Eggs' | 'Meat & Seafood' | 'Produce' | 'Beverages' | 'Snacks' | 'Baking' | 'Canned Goods' | 'Condiments' | 'Household' | 'Bakery';
  size?: string;
  unit?: string;
  image?: string;
  description?: string;
}

export const groceryProducts: GroceryProduct[] = [
  // Staples
  { 
    id: 'g-001', 
    name: 'Rice', 
    price: 6, 
    category: 'Groceries', 
    subcategory: 'Staples', 
    size: '5kg',
    image: "/images/products/groceries/Rice.jpg"
  },
  { 
    id: 'g-002', 
    name: 'Wheat Flour', 
    price: 3, 
    category: 'Groceries', 
    subcategory: 'Staples', 
    size: '2kg',
    image: "/images/products/groceries/Wheat_Flour.jpg"
  },
  { 
    id: 'g-003', 
    name: 'Sugar', 
    price: 3, 
    category: 'Groceries', 
    subcategory: 'Staples', 
    size: '2kg',
    image: "/images/products/groceries/Sugar.jpg"
  },
  { 
    id: 'g-004', 
    name: 'Salt', 
    price: 1, 
    category: 'Groceries', 
    subcategory: 'Staples', 
    size: '1kg',
    image: "/images/products/groceries/Salt.jpg"
  },
  { 
    id: 'g-005', 
    name: 'Cooking Oil', 
    price: 2.5, 
    category: 'Groceries', 
    subcategory: 'Staples', 
    size: '1L',
    image: "/images/products/groceries/Cooking_Oil.jpg"
  },
  
  // Dairy & Eggs
  { 
    id: 'g-011', 
    name: 'Milk', 
    price: 1.2, 
    category: 'Groceries', 
    subcategory: 'Dairy & Eggs', 
    size: '1L',
    image: "/images/products/groceries/Milk.jpg"
  },
  { 
    id: 'g-013', 
    name: 'Eggs', 
    price: 2.5, 
    category: 'Groceries', 
    subcategory: 'Dairy & Eggs', 
    size: 'tray of 12',
    image: "/images/products/groceries/Eggs.jpg"
  },
  { 
    id: 'g-014', 
    name: 'Butter', 
    price: 2, 
    category: 'Groceries', 
    subcategory: 'Dairy & Eggs', 
    size: '250g',
    image: "/images/products/groceries/Butter.jpg"
  },
  { 
    id: 'g-016', 
    name: 'Cheese', 
    price: 3.5, 
    category: 'Groceries', 
    subcategory: 'Dairy & Eggs', 
    size: '200g',
    image: "/images/products/groceries/Cheese.jpg"
  },
  
  // Meat & Seafood
  { 
    id: 'g-018', 
    name: 'Chicken', 
    price: 5, 
    category: 'Groceries', 
    subcategory: 'Meat & Seafood', 
    size: '1kg',
    image: "/images/products/groceries/Chicken.jpg"
  },
  { 
    id: 'g-019', 
    name: 'Beef', 
    price: 6, 
    category: 'Groceries', 
    subcategory: 'Meat & Seafood', 
    size: '1kg',
    image: "/images/products/groceries/Beef.jpg"
  },
  { 
    id: 'g-020', 
    name: 'Fish', 
    price: 7, 
    category: 'Groceries', 
    subcategory: 'Meat & Seafood', 
    size: '1kg',
    image: "/images/products/groceries/Fish.jpg"
  },
  
  // Produce
  { 
    id: 'g-021', 
    name: 'Apples', 
    price: 2, 
    category: 'Groceries', 
    subcategory: 'Produce', 
    size: '1kg',
    image: "/images/products/groceries/Apples.jpg"
  },
  { 
    id: 'g-022', 
    name: 'Bread', 
    price: 1.5, 
    category: 'Groceries', 
    subcategory: 'Bakery', 
    size: 'Loaf',
    image: "/images/products/groceries/Bread.jpg"
  },
  { 
    id: 'g-023', 
    name: 'Carrots', 
    price: 1, 
    category: 'Groceries', 
    subcategory: 'Produce', 
    size: '1kg',
    image: "/images/products/groceries/Carrots.jpg"
  },
  { 
    id: 'g-024', 
    name: 'Onions', 
    price: 1.2, 
    category: 'Groceries', 
    subcategory: 'Produce', 
    size: '1kg',
    image: "/images/products/groceries/Onions.jpg"
  },
  { 
    id: 'g-025', 
    name: 'Potatoes', 
    price: 1.5, 
    category: 'Groceries', 
    subcategory: 'Produce', 
    size: '1kg',
    image: "/images/products/groceries/Potatoes.jpg"
  },
  { 
    id: 'g-026', 
    name: 'Tomatoes', 
    price: 1.8, 
    category: 'Groceries', 
    subcategory: 'Produce', 
    size: '1kg',
    image: "/images/products/groceries/Tomatoes.jpg"
  },
  
  
  
  // Beverages
  
  
  
  
  
  // Snacks
  
  
  
  
  
  
  
  // Baking
  
  
  // Canned Goods
  
  
  
  // Condiments
  
  
  
  
  
  
  
  
  
  // Household
  
  
  
];
