import type { Hue } from '@/lib/theme';
import { CATEGORIES, categoryHref } from '@/lib/categories';

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

/**
 * Navigation model for the header. Kept out of the component so the desktop
 * mega-menu and the mobile accordion render from one source.
 */
export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Categories',
    to: '/categories',
    hue: 'blue',
    // Derived from the canonical list and split into three balanced columns,
    // so the menu always matches the categories that actually exist.
    columns: [0, 1, 2].map(col => ({
      heading: col === 0 ? 'Shop' : '\u00A0',
      links: CATEGORIES.filter((_, i) => i % 3 === col).map(c => ({
        label: c.name,
        to: categoryHref(c.name),
      })),
    })),
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
          { label: 'Deals in Electronics', to: categoryHref('Electronics') },
          { label: 'Deals in Fashion', to: categoryHref('Fashion') },
          { label: 'Deals in Home', to: categoryHref('Home & Garden') },
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
