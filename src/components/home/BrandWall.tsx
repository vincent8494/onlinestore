import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { styleFor } from '@/lib/theme';
import { supabase } from '@/lib/supabase';

interface StoreRow {
  store_name: string;
}

/**
 * Logo-wall of seller storefronts. Each tile derives its colour from the store
 * name, so the wall keeps the multi-colour signature inside the gold/charcoal frame.
 *
 * The names come from seller_profiles. This used to render a hardcoded list of
 * invented shop names, which presented storefronts that do not exist as though
 * they were trading here. With nothing to show the section renders nothing at
 * all rather than filling itself in.
 */
const BrandWall = () => {
  const [stores, setStores] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from('seller_profiles')
      .select('store_name')
      .order('total_sales', { ascending: false })
      .limit(12)
      .then(({ data }) => {
        if (cancelled || !data) return;
        setStores((data as StoreRow[]).map((s) => s.store_name).filter(Boolean));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (stores.length === 0) return null;

  // With only a handful of sellers a fixed six-column grid leaves a lone tile
  // stranded in a mostly empty row, so the wall narrows to fit what is there.
  // Written out in full because Tailwind cannot see interpolated class names.
  const columns =
    ['', 'sm:grid-cols-1 lg:grid-cols-1', 'sm:grid-cols-2 lg:grid-cols-2',
     'sm:grid-cols-3 lg:grid-cols-3', 'sm:grid-cols-2 lg:grid-cols-4',
     'sm:grid-cols-3 lg:grid-cols-5'][stores.length] ?? 'sm:grid-cols-3 lg:grid-cols-6';

  return (
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

        <div
          className={cn(
            'grid gap-px overflow-hidden rounded-lg border border-border bg-border',
            stores.length === 1 ? 'grid-cols-1' : 'grid-cols-2',
            columns
          )}
        >
          {stores.map((store, i) => {
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
};

export default BrandWall;
