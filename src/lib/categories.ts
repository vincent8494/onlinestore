import {
  Smartphone,
  Shirt,
  Home,
  ShoppingBasket,
  Sparkles,
  Dumbbell,
  BookOpen,
  Car,
  type LucideIcon,
} from 'lucide-react';
import type { Hue } from '@/lib/theme';

/**
 * The canonical category list.
 *
 * `name` must match `public.categories.name` in the database exactly — product
 * rows are filtered by that string, so a mismatch silently yields zero results.
 * The homepage tiles, the Categories page and the header mega-menu all read
 * from here so the three can never drift apart again.
 *
 * Icons mirror the `icon` column seeded alongside each row.
 */
export interface CategoryDef {
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  hue: Hue;
  /** Only a few have photography; the rest fall back to their hue field. */
  image?: string;
}

export const CATEGORIES: CategoryDef[] = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Phones, laptops, audio and gadgets',
    icon: Smartphone,
    hue: 'blue',
    image: '/images/categories/electronics.jpg',
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, shoes and accessories',
    icon: Shirt,
    hue: 'rose',
    image: '/images/categories/fashion.jpg',
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Furniture, decor and garden supplies',
    icon: Home,
    hue: 'orange',
  },
  {
    name: 'Grocery',
    slug: 'grocery',
    description: 'Fresh food, pantry staples and essentials',
    icon: ShoppingBasket,
    hue: 'lime',
  },
  {
    name: 'Beauty & Personal Care',
    slug: 'beauty-personal-care',
    description: 'Skincare, haircare and grooming',
    icon: Sparkles,
    hue: 'pink',
  },
  {
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Equipment, gear and outdoor activities',
    icon: Dumbbell,
    hue: 'cyan',
  },
  {
    name: 'Books & Media',
    slug: 'books-media',
    description: 'Books, movies, music and games',
    icon: BookOpen,
    hue: 'indigo',
  },
  {
    name: 'Automotive',
    slug: 'automotive',
    description: 'Car parts, tools and accessories',
    icon: Car,
    hue: 'violet',
  },
];

/** Link target for a category. Matches what the Products page parses. */
export const categoryHref = (name: string) =>
  `/products?category=${encodeURIComponent(name)}`;

export const findCategory = (name: string) =>
  CATEGORIES.find(c => c.name.toLowerCase() === name.toLowerCase());
