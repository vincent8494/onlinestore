
import React from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import PageHero from '@/components/layout/PageHero';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, X, Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import { styleAt } from '@/lib/theme';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    });
  };

  if (wishlistItems.length === 0) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md animate-fade-up py-16 text-center">
          <div className="relative mx-auto mb-6 h-24 w-24">
            <div className="absolute inset-0 rounded-full bg-candy opacity-30 blur-2xl animate-pulse-glow" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-candy text-white shadow-lift">
              <Heart className="h-12 w-12" />
            </div>
          </div>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight">
            Your wishlist is{' '}
            <span className="text-gold-ink">empty</span>
          </h1>
          <p className="mb-8 text-muted-foreground">Save items you love for later</p>
          <Button variant="gradient" size="lg" asChild>
            <Link to="/products">
              <ShoppingBag className="h-5 w-5" />
              Browse Products
            </Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mb-6 flex items-center gap-3 animate-fade-up">
        <Button variant="soft" size="icon" asChild>
          <Link to="/products" aria-label="Back to products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <PageHero
        eyebrow={`${wishlistItems.length} saved`}
        title="My"
        highlight="Wishlist"
        subtitle="Everything you've saved for later"
        icon={Heart}
        hue="pink"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlistItems.map((item, i) => {
          const style = styleAt(i);
          return (
            <div
              key={item.id}
              className={cn('card-pop ring-gradient group animate-fade-up overflow-hidden', style.glow)}
              style={{ animationDelay: `${Math.min(i, 11) * 50}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Link to={`/products/${item.id}`} className="block h-full w-full">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className={cn(
                      'pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-40',
                      style.gradient
                    )}
                  />
                </Link>
                <button
                  type="button"
                  aria-label={`Remove ${item.name} from wishlist`}
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-md transition-all hover:scale-110 hover:bg-brand-rose hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4">
                <h3 className={cn('mb-2 line-clamp-2 font-bold transition-colors', style.groupHoverText)}>
                  <Link to={`/products/${item.id}`}>{item.name}</Link>
                </h3>
                <div className={cn('mb-3 text-2xl font-extrabold', style.text)}>
                  ${item.price}
                </div>
                <Button
                  variant="gradient"
                  size="sm"
                  className="w-full"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
};

export default Wishlist;
