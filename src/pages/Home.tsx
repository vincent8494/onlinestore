import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Sparkles,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Camera,
  Gamepad2,
  Shirt,
  Home as HomeIcon,
  TrendingUp,
  Shield,
  Truck,
  CreditCard,
  Store,
  Flame,
  Zap,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroCarousel, { type HeroSlide } from '@/components/home/HeroCarousel';
import CategoryTile from '@/components/home/CategoryTile';
import BrandWall from '@/components/home/BrandWall';
import ProductCard, { type ProductCardData } from '@/components/product/ProductCard';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { HUE_STYLES, type Hue } from '@/lib/theme';
import { CATEGORIES } from '@/lib/categories';
import { useCategoryCounts } from '@/hooks/useCategoryCounts';

const HERO_SLIDES: HeroSlide[] = [
  {
    eyebrow: 'Over 180,000 products',
    title: 'Buy & sell with',
    highlight: 'Confidence',
    body: 'Join thousands of buyers and sellers on VMK Store. Discover great products, or start your own business today.',
    cta: 'Start shopping',
    to: '/products',
    surface: 'bg-brand-wash-animated',
    image: '/images/hero/marketplace.jpg',
    // Laptop sits centre-right; bias the crop so it survives beside the copy
    focal: '65% center',
  },
  {
    eyebrow: 'Weekly deals',
    title: 'Up to 70% off',
    highlight: 'This week',
    body: 'Fresh markdowns across electronics, fashion and home. New offers land every Friday.',
    cta: 'Shop deals',
    to: '/deals',
    surface: 'bg-gradient-to-br from-ink via-[hsl(354_60%_22%)] to-ink',
    image: '/images/hero/deals.jpg',
    // Lit podium and cart are on the right, leaving the left dark for the copy
    focal: '70% center',
  },
  {
    eyebrow: 'For sellers',
    title: 'Open your store',
    highlight: 'No listing fees',
    body: 'Reach thousands of buyers from day one. You only pay a success fee when an item sells.',
    cta: 'Start selling',
    to: '/register',
    surface: 'bg-gradient-to-br from-ink via-[hsl(220_20%_22%)] to-ink',
    image: '/images/hero/open-store.jpg',
    focal: '68% center',
  },
];

/** Categories come from the shared canonical list so the homepage, the
 *  Categories page and the mega-menu can never disagree with the database. */

const FEATURES: { title: string; body: string; icon: typeof Shield; hue: Hue }[] = [
  { title: 'Secure Payments', body: 'Your transactions are protected end to end', icon: Shield, hue: 'blue' },
  { title: 'Fast Shipping', body: 'Quick delivery, tracked worldwide', icon: Truck, hue: 'teal' },
  { title: 'Best Prices', body: 'Competitive marketplace rates, always', icon: TrendingUp, hue: 'amber' },
  { title: 'Easy Returns', body: 'Hassle-free returns within 30 days', icon: CreditCard, hue: 'pink' },
];

const STATS: { value: string; label: string; hue: Hue }[] = [
  { value: '50K+', label: 'Happy buyers', hue: 'blue' },
  { value: '12K+', label: 'Active sellers', hue: 'violet' },
  { value: '180K+', label: 'Products listed', hue: 'pink' },
  { value: '4.8★', label: 'Average rating', hue: 'amber' },
];

/** Scrolling ticker strip under the hero. The threshold must match the one
 *  Cart and Checkout charge against. */
const TICKER = [
  'Free shipping over $100',
  'New drops every Friday',
  '30-day returns',
  'Verified sellers only',
  'Secure checkout',
  '24/7 support',
];

/** Shape of a joined product row as returned by the featured-products query. */
interface FeaturedRow {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  stock_quantity: number;
  average_rating: number | null;
  review_count: number | null;
  categories: { name: string } | null;
  product_images: { image_url: string; is_primary: boolean }[] | null;
}

const Home = () => {
  const [featured, setFeatured] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const { label: categoryLabel } = useCategoryCounts();

  // The Featured grid was previously hard-coded to an empty array, so the
  // section always rendered blank. Pull the real top-rated products instead.
  useEffect(() => {
    let cancelled = false;

    const fetchFeatured = async () => {
      const { data } = await supabase
        .from('products')
        .select(`
          id, name, price, original_price, stock_quantity, average_rating, review_count,
          categories(name),
          product_images(image_url, is_primary, display_order)
        `)
        .eq('status', 'active')
        .order('average_rating', { ascending: false })
        .limit(8);

      if (cancelled) return;

      if (data) {
        setFeatured(
          (data as unknown as FeaturedRow[]).map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            original_price: p.original_price ?? null,
            stock_quantity: p.stock_quantity,
            average_rating: p.average_rating ?? 0,
            review_count: p.review_count ?? 0,
            category: p.categories?.name ?? 'Uncategorized',
            image:
              [...(p.product_images ?? [])].sort(
                (a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)
              )[0]?.image_url ?? '/placeholder.svg',
          }))
        );
      }
      setLoading(false);
    };

    fetchFeatured().catch(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* ---------- Hero carousel ---------- */}
        <HeroCarousel slides={HERO_SLIDES} />

        {/* ---------- Ticker ---------- */}
        <section className="overflow-hidden border-y border-border bg-brand-gradient py-3">
          <div className="flex w-max animate-marquee gap-8">
            {/* Duplicated so the -50% translate loops seamlessly */}
            {[...TICKER, ...TICKER].map((item, i) => (
              <span
                key={i}
                className="flex shrink-0 items-center gap-2 text-sm font-bold uppercase tracking-widest text-white"
              >
                <Zap className="h-4 w-4 fill-current" />
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* ---------- Stats ---------- */}
        <section className="container mx-auto px-4 py-14">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
            {STATS.map(({ value, label, hue }, i) => {
              const style = HUE_STYLES[hue];
              return (
                <div
                  key={label}
                  className="group animate-fade-up bg-background p-6 text-center transition-colors hover:bg-muted"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className={cn('text-4xl font-extrabold md:text-5xl', style.text)}>
                    {value}
                  </div>
                  <div className="mt-1 text-2xs font-bold uppercase tracking-widest text-muted-foreground">
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------- Features ---------- */}
        <section className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ title, body, icon: Icon, hue }, i) => {
              const style = HUE_STYLES[hue];
              return (
                <div
                  key={title}
                  className="group flex animate-fade-up items-start gap-4 rounded-lg border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-lift-sm"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div
                    className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-white transition-transform duration-300 group-hover:scale-110',
                      style.gradient
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="mb-1 text-sm font-bold uppercase tracking-wide">{title}</h3>
                    <p className="text-sm text-muted-foreground">{body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------- Categories ---------- */}
        <section className="container mx-auto px-4 py-16">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="mb-3 inline-block border-l-4 border-gold pl-3 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Browse
              </span>
              <h2 className="text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
                Shop by <span className="text-gold-ink">category</span>
              </h2>
            </div>
            <Link
              to="/categories"
              className="group flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors hover:text-gold-ink"
            >
              All categories
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mosaic: the lead tile spans two rows, so exactly 7 tiles fill the
              4-column block without leaving an orphan on a third row. */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {CATEGORIES.slice(0, 7).map(({ name, icon, image }, i) => (
              <CategoryTile
                key={name}
                name={name}
                icon={icon}
                count={categoryLabel(name)}
                image={image}
                index={i}
                size={i === 0 ? 'tall' : 'default'}
                className={i === 0 ? 'lg:row-span-2' : undefined}
              />
            ))}
          </div>
        </section>

        {/* ---------- Store wall ---------- */}
        <BrandWall />

        {/* ---------- Featured Products ---------- */}
        <section className="relative py-16">
          <div className="absolute inset-0 bg-muted/40" />
          <div className="container relative mx-auto px-4">
            <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <span className="mb-3 inline-flex items-center gap-1.5 border-l-4 border-sale pl-3 text-xs font-bold uppercase tracking-[0.2em] text-sale">
                  <Flame className="h-3.5 w-3.5" />
                  Trending now
                </span>
                <h2 className="text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
                  Featured <span className="text-gold-ink">products</span>
                </h2>
                <p className="mt-1 text-muted-foreground">
                  Hand-picked items from our best sellers
                </p>
              </div>
              <Button variant="outline-gradient" asChild>
                <Link to="/products">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />
                ))}
              </div>
            ) : featured.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featured.slice(0, 8).map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="card-pop p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-ink">
                  <Store className="h-8 w-8" />
                </div>
                <p className="mb-2 text-lg font-bold">No featured products yet</p>
                <p className="mb-6 text-muted-foreground">
                  Be the first to list something on the marketplace.
                </p>
                <Button variant="gradient" asChild>
                  <Link to="/sell">
                    <Sparkles className="h-4 w-4" />
                    Start Selling
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="container mx-auto px-4 py-20">
          {/* Split panel rather than a full-bleed background: the artwork is a
              pale pastel, so laying white type over it would need a wash heavy
              enough to hide the image entirely. */}
          <div className="relative grid overflow-hidden rounded-lg bg-brand-wash-animated text-white shadow-lift md:grid-cols-2">
            {/* Artwork */}
            <div className="relative order-first min-h-[14rem] md:order-last md:min-h-[24rem]">
              <img
                src="/images/cta/sell-with-us.jpg"
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Feathers the artwork into the dark panel — downward on mobile
                  where the panel stacks, leftward once it sits side by side. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-b from-transparent via-ink/40 to-ink md:bg-gradient-to-l md:from-transparent md:via-ink/15 md:to-ink"
              />
            </div>

            {/* Copy */}
            <div className="relative p-10 text-center md:p-14 md:text-left lg:p-16">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              <div className="relative">
              <span className="mb-5 inline-flex items-center gap-1.5 border-l-4 border-gold bg-black/20 py-1 pl-3 pr-4 text-xs font-bold uppercase tracking-[0.2em] text-gold">
                <Store className="h-3.5 w-3.5" />
                For sellers
              </span>
              <h2 className="mb-4 text-3xl font-extrabold uppercase tracking-tight md:text-5xl">
                Ready to start <span className="text-gold">selling?</span>
              </h2>
              <p className="mb-8 text-lg text-white/75">
                Join our community of successful sellers and reach thousands of potential
                customers. No listing fees — just success fees on sales.
              </p>
              <Button size="xl" asChild>
                <Link to="/register">
                  Create Seller Account
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
