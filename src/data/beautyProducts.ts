export interface BeautyProduct {
  id: string;
  name: string;
  price: number;
  category: 'Beauty & Personal Care';
  subcategory: 'Hair Care' | 'Skin Care' | 'Oral Care' | 'Fragrance' | 'Makeup' | 'Tools & Accessories' | 'Men\'s Grooming' | 'Bath & Body';
  size?: string;
  image?: string;
  description?: string;
}

export const beautyProducts: BeautyProduct[] = [
  { id: 'b-001', name: 'Shampoo', price: 8, category: 'Beauty & Personal Care', subcategory: 'Hair Care', image: "/images/products/beauty/Shampoo.jpg" },
  { id: 'b-002', name: 'Conditioner', price: 8, category: 'Beauty & Personal Care', subcategory: 'Hair Care', image: "/images/products/beauty/Conditioner.jpg" },
  { id: 'b-008', name: 'Face wash', price: 7, category: 'Beauty & Personal Care', subcategory: 'Skin Care', image: "/images/products/beauty/Face_Wash.jpg" },
  { id: 'b-009', name: 'Facial mask', price: 2, category: 'Beauty & Personal Care', subcategory: 'Skin Care', image: "/images/products/beauty/Face_Mask.jpg" },
  { id: 'b-010', name: 'Sunscreen (SPF 30+)', price: 10, category: 'Beauty & Personal Care', subcategory: 'Skin Care', image: "/images/products/beauty/Sunscreen.jpg" },
  { id: 'b-019', name: 'Toothbrush', price: 4, category: 'Beauty & Personal Care', subcategory: 'Oral Care', image: "/images/products/beauty/Toothbrush.jpg" },
  { id: 'b-023', name: 'Makeup remover', price: 6, category: 'Beauty & Personal Care', subcategory: 'Makeup', image: "/images/products/beauty/Makeup_Remover.jpg" },
  { id: 'b-024', name: 'Mascara', price: 8, category: 'Beauty & Personal Care', subcategory: 'Makeup', image: "/images/products/beauty/Mascara.jpg" },
  { id: 'b-025', name: 'Foundation', price: 12, category: 'Beauty & Personal Care', subcategory: 'Makeup', image: "/images/products/beauty/Foundation.jpg" },
  { id: 'b-026', name: 'Lipstick', price: 10, category: 'Beauty & Personal Care', subcategory: 'Makeup', image: "/images/products/beauty/Lipstick.jpg" },
  { id: 'b-027', name: 'Moisturizer', price: 15, category: 'Beauty & Personal Care', subcategory: 'Skin Care', image: "/images/products/beauty/Moisturizer.jpg" },
  { id: 'b-028', name: 'Nail Polish', price: 5, category: 'Beauty & Personal Care', subcategory: 'Makeup', image: "/images/products/beauty/Nail_Polish.jpg" },
  { id: 'b-029', name: 'Deodorant', price: 4, category: 'Beauty & Personal Care', subcategory: 'Bath & Body', image: "/images/products/beauty/Deodorant.jpg" },
  { id: 'b-030', name: 'Hair Dryer', price: 35, category: 'Beauty & Personal Care', subcategory: 'Tools & Accessories', image: "/images/products/beauty/Hair_Dryer.jpg" },
  { id: 'b-031', name: 'Body Lotion', price: 7, category: 'Beauty & Personal Care', subcategory: 'Bath & Body', image: "/images/products/beauty/Body_Lotion.jpg" }
];
