import type { Hue } from '@/lib/theme';

export interface MegaColumn {
  heading: string;
  links: { label: string; to: string }[];
}

export interface NavItem {
  label: string;
  to: string;
  hue: Hue;
  /** Present when this nav item opens a mega-menu panel */
  columns?: MegaColumn[];
  /** Promo tile shown on the right of the panel */
  promo?: { title: string; body: string; cta: string; to: string };
}

const cat = (name: string) => `/products?category=${encodeURIComponent(name)}`;

/**
 * Navigation model for the header. Kept out of the component so the desktop
 * mega-menu and the mobile accordion render from one source.
 */
export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Categories',
    to: '/categories',
    hue: 'blue',
    columns: [
      {
        heading: 'Tech',
        links: [
          { label: 'Electronics', to: cat('Electronics') },
          { label: 'Computers', to: cat('Computers') },
          { label: 'Audio', to: cat('Audio') },
          { label: 'Cameras', to: cat('Cameras') },
        ],
      },
      {
        heading: 'Lifestyle',
        links: [
          { label: 'Fashion', to: cat('Fashion') },
          { label: 'Watches', to: cat('Watches') },
          { label: 'Beauty & Personal Care', to: cat('Beauty & Personal Care') },
          { label: 'Sports & Outdoors', to: cat('Sports & Outdoors') },
        ],
      },
      {
        heading: 'Home',
        links: [
          { label: 'Home & Kitchen', to: cat('Home & Kitchen') },
          { label: 'Home & Garden', to: cat('Home & Garden') },
          { label: 'Groceries', to: cat('Groceries') },
          { label: 'Automotive', to: cat('Automotive') },
        ],
      },
    ],
    promo: {
      title: 'Shop all categories',
      body: 'Browse every department in one place.',
      cta: 'View all',
      to: '/categories',
    },
  },
  {
    label: 'Best Deals',
    to: '/deals',
    hue: 'rose',
    columns: [
      {
        heading: 'By discount',
        links: [
          { label: 'Under $25', to: '/deals' },
          { label: '50% off and over', to: '/deals' },
          { label: 'Clearance', to: '/deals' },
        ],
      },
      {
        heading: 'Popular',
        links: [
          { label: 'Deals in Electronics', to: cat('Electronics') },
          { label: 'Deals in Fashion', to: cat('Fashion') },
          { label: 'Deals in Home', to: cat('Home & Kitchen') },
        ],
      },
    ],
    promo: {
      title: 'Weekly deals',
      body: 'New offers land every Friday.',
      cta: 'Shop deals',
      to: '/deals',
    },
  },
  { label: 'New Arrivals', to: '/new-arrivals', hue: 'amber' },
  { label: 'Top Sellers', to: '/sellers', hue: 'teal' },
  {
    label: 'Sell',
    to: '/seller-guide',
    hue: 'violet',
    columns: [
      {
        heading: 'Get started',
        links: [
          { label: 'Seller Guide', to: '/seller-guide' },
          { label: 'Start Selling', to: '/sell' },
          { label: 'Fees & Pricing', to: '/fees' },
        ],
      },
      {
        heading: 'Support',
        links: [
          { label: 'Seller Support', to: '/seller-support' },
          { label: 'Seller Policies', to: '/seller-policies' },
        ],
      },
    ],
    promo: {
      title: 'Sell on VMK Store',
      body: 'No listing fees — only success fees on sales.',
      cta: 'Open a store',
      to: '/register',
    },
  },
];
