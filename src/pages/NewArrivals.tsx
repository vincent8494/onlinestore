
import React, { useState, useEffect } from 'react';
import PageShell from '@/components/layout/PageShell';
import PageHero from '@/components/layout/PageHero';
import ProductCard from '@/components/product/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Sparkles, PackagePlus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { supabase } from '@/lib/supabase';

interface NewProduct {
  id: string;
  name: string;
  price: number;
  average_rating: number;
  review_count: number;
  category: string;
  image: string;
}

const NewArrivals = () => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState<NewProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      const { data } = await supabase
        .from('products')
        .select(`
          id, name, price, average_rating, review_count,
          categories(name),
          product_images(image_url, is_primary)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(8);

      if (data) {
        setProducts(
          (data as any[]).map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
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
    fetchNewArrivals();
  }, []);

  const handleAddToCart = (product: NewProduct) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
  };

  const handleWishlistToggle = (product: NewProduct) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image });
    }
  };

  return (
    <PageShell>
      <PageHero
        eyebrow="Just landed"
        title="New"
        highlight="Arrivals"
        subtitle="Fresh products just added to our marketplace"
        icon={Sparkles}
        hue="amber"
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="card-pop mx-auto max-w-md p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sunrise text-white">
            <PackagePlus className="h-8 w-8" />
          </div>
          <p className="mb-2 text-lg font-bold">Nothing new yet</p>
          <p className="text-muted-foreground">New products land here as sellers list them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <div key={product.id} className="relative">
              {/* NEW flag sits above the card's own badge stack */}
              <Badge variant="fresh" className="absolute -left-1 -top-1 z-10 shadow-lift-sm">
                NEW
              </Badge>
              <ProductCard
                product={product}
                index={i}
                wishlisted={isInWishlist(product.id)}
                onToggleWishlist={() => handleWishlistToggle(product)}
                onAddToCart={() => handleAddToCart(product)}
              />
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
};

export default NewArrivals;
