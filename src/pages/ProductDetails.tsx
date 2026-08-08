
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Check,
  Shield,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { cn } from '@/lib/utils';
import { categoryStyle } from '@/lib/theme';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  // Mock product data - in real app, this would come from API
  const product = {
    id: id || 'e-038',
    name: 'Wireless Headphones',
    price: 299.99,
    originalPrice: 399.99,
    description: 'Experience crystal-clear audio with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and premium comfort padding.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    rating: 4.5,
    reviews: 128,
    inStock: true,
    features: [
      'Active Noise Cancellation',
      '30-hour battery life',
      'Quick charge: 5 min = 3 hours',
      'Premium comfort padding',
      'Wireless connectivity'
    ]
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  const handleAddToWishlist = () => {
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  const style = categoryStyle(product.category);
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
  const wishlisted = isInWishlist(product.id);

  const TRUST = [
    { icon: Shield, label: 'Secure payment', hue: 'text-brand-blue', bg: 'bg-brand-blue/10' },
    { icon: Truck, label: 'Free shipping', hue: 'text-brand-teal', bg: 'bg-brand-teal/10' },
    { icon: RotateCcw, label: '30-day returns', hue: 'text-brand-violet', bg: 'bg-brand-violet/10' },
  ];

  return (
    <PageShell>
      {/* Breadcrumb / back */}
      <div className="mb-6 flex items-center gap-3 animate-fade-up">
        <Button variant="soft" size="icon" asChild>
          <Link to="/products" aria-label="Back to products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <nav className="text-sm text-muted-foreground">
          <Link to="/products" className="transition-colors hover:text-brand-violet">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className={cn('font-semibold', style.text)}>{product.category}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="animate-fade-up">
          <div className={cn('card-pop ring-gradient group overflow-hidden', style.glow)}>
            <div className="relative aspect-square overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {discount > 0 && (
                <Badge variant="hot" className="absolute left-4 top-4 text-sm">
                  -{discount}%
                </Badge>
              )}
              <div
                className={cn(
                  'pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-30',
                  style.gradient
                )}
              />
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {TRUST.map(({ icon: Icon, label, hue, bg }) => (
              <div
                key={label}
                className={cn('rounded-2xl p-3 text-center', bg)}
              >
                <Icon className={cn('mx-auto mb-1.5 h-5 w-5', hue)} />
                <div className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buy box */}
        <div className="animate-fade-up space-y-6" style={{ animationDelay: '80ms' }}>
          <div>
            <span
              className={cn(
                'mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider',
                style.tint,
                style.text
              )}
            >
              {product.category}
            </span>
            <h1 className="mb-3 text-4xl font-extrabold tracking-tight">{product.name}</h1>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < Math.floor(product.rating)
                        ? 'fill-brand-amber text-brand-amber'
                        : 'text-muted-foreground/30'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-bold">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews} reviews)
              </span>
            </div>
          </div>

          {/* Price block */}
          <div className={cn('rounded-2xl border p-5', style.tint, style.border)}>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className={cn('text-4xl font-extrabold', style.text)}>
                ${product.price}
              </span>
              <span className="text-lg text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
              {discount > 0 && <Badge variant="hot">Save {discount}%</Badge>}
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-brand-teal">
              <Check className="h-4 w-4" />
              {product.inStock ? 'In stock — ships today' : 'Currently unavailable'}
            </p>
          </div>

          <p className="leading-relaxed text-muted-foreground">{product.description}</p>

          {/* Features */}
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Features
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {product.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 rounded-xl bg-muted/60 px-3 py-2 text-sm"
                >
                  <Check className={cn('mt-0.5 h-4 w-4 shrink-0', style.text)} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="gradient"
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-5 w-5" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button
              variant={wishlisted ? 'default' : 'outline'}
              size="lg"
              aria-label={wishlisted ? 'In wishlist' : 'Add to wishlist'}
              className={cn(wishlisted && 'bg-brand-pink text-white hover:bg-brand-pink/90')}
              onClick={handleAddToWishlist}
              disabled={wishlisted}
            >
              <Heart className={cn('h-5 w-5', wishlisted && 'fill-current')} />
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default ProductDetails;
