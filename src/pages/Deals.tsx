
import React, { useState, useEffect } from 'react';
import PageShell from '@/components/layout/PageShell';
import PageHero from '@/components/layout/PageHero';
import ProductCard from '@/components/product/ProductCard';
import { Flame, TicketPercent } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { supabase } from '@/lib/supabase';

interface DealProduct {
  id: string;
  name: string;
  price: number;
  original_price: number;
  average_rating: number;
  review_count: number;
  image: string;
  category: string;
}

const Deals = () => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [deals, setDeals] = useState<DealProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      const { data } = await supabase
        .from('products')
        .select(`
          id, name, price, original_price, average_rating, review_count,
          categories(name),
          product_images(image_url, is_primary)
        `)
        .eq('status', 'active')
        .not('original_price', 'is', null)
        .order('original_price', { ascending: false })
        .limit(6);

      if (data) {
        setDeals(
          (data as any[])
            .filter(p => p.original_price > p.price)
            .map(p => ({
              id: p.id,
              name: p.name,
              price: p.price,
              original_price: p.original_price,
              average_rating: p.average_rating ?? 0,
              review_count: p.review_count ?? 0,
              category: p.categories?.name ?? 'Uncategorized',
              image:
                (p.product_images as { image_url: string; is_primary: boolean }[])
                  ?.sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
                  ?.[0]?.image_url ?? '/placeholder.svg',
            }))
        );
      }
      setLoading(false);
    };
    fetchDeals();
  }, []);

  const handleAddToCart = (deal: DealProduct) => {
    addToCart({ id: deal.id, name: deal.name, price: deal.price, image: deal.image });
  };

  const handleWishlistToggle = (deal: DealProduct) => {
    if (isInWishlist(deal.id)) {
      removeFromWishlist(deal.id);
    } else {
      addToWishlist({ id: deal.id, name: deal.name, price: deal.price, image: deal.image });
    }
  };

  const biggestSaving = deals.reduce(
    (max, d) => Math.max(max, d.original_price - d.price),
    0
  );

  return (
    <PageShell>
      <PageHero
        eyebrow="Limited time"
        title="Best"
        highlight="Deals"
        subtitle="Limited time offers you don't want to miss"
        icon={Flame}
        hue="pink"
      >
        {deals.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-brand-pink/30 bg-brand-pink/10 px-5 py-3">
              <div className="text-2xl font-extrabold text-brand-pink">{deals.length}</div>
              <div className="text-xs font-medium text-muted-foreground">Live deals</div>
            </div>
            <div className="rounded-2xl border border-brand-amber/30 bg-brand-amber/10 px-5 py-3">
              <div className="text-2xl font-extrabold text-brand-amber">
                ${biggestSaving.toFixed(0)}
              </div>
              <div className="text-xs font-medium text-muted-foreground">Biggest saving</div>
            </div>
          </div>
        )}
      </PageHero>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : deals.length === 0 ? (
        <div className="card-pop mx-auto max-w-md p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-candy text-white">
            <TicketPercent className="h-8 w-8" />
          </div>
          <p className="mb-2 text-lg font-bold">No deals right now</p>
          <p className="text-muted-foreground">Check back soon — new offers drop every week.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal, i) => (
            <ProductCard
              key={deal.id}
              product={deal}
              index={i}
              wishlisted={isInWishlist(deal.id)}
              onToggleWishlist={() => handleWishlistToggle(deal)}
              onAddToCart={() => handleAddToCart(deal)}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
};

export default Deals;
