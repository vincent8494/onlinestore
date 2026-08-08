import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { styleFor } from '@/lib/theme';

/**
 * Storefronts selling on VMK Store. These are the marketplace's own seller
 * names — swap for real seller data once the sellers table is wired up.
 */
const STORES = [
  'TechWorld',
  'Fashion Hub',
  'Urban Cart',
  'Nova Living',
  'PeakGear',
  'Bright Basket',
  'Atlas Audio',
  'Kori Home',
  'Vantage Watch',
  'Studio Nine',
  'GreenLeaf',
  'Metro Supply',
];

/**
 * Logo-wall of seller storefronts. Each tile derives its colour from the store
 * name, so the wall keeps the multi-colour signature inside the gold/charcoal frame.
 */
const BrandWall = () => (
  <section className="border-y border-border bg-muted/40 py-16">
    <div className="container mx-auto px-4">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="mb-3 inline-block border-l-4 border-gold pl-3 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Our stores
          </span>
          <h2 className="text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
            Shop by <span className="text-gold-ink">store</span>
          </h2>
        </div>
        <Link
          to="/sellers"
          className="group flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors hover:text-gold-ink"
        >
          All sellers
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
        {STORES.map((store, i) => {
          const style = styleFor(store);
          return (
            <Link
              key={store}
              to={`/products?seller=${encodeURIComponent(store)}`}
              className="group flex h-24 items-center justify-center bg-background transition-colors hover:bg-muted"
              style={{ animationDelay: `${Math.min(i, 11) * 40}ms` }}
            >
              <span
                className={cn(
                  'text-center text-sm font-extrabold uppercase tracking-wider text-muted-foreground transition-colors',
                  style.groupHoverText
                )}
              >
                {store}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

export default BrandWall;
