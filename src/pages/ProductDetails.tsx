
import React, { useEffect, useState } from 'react';
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
  PackageSearch,
  Store,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { categoryStyle } from '@/lib/theme';

interface ProductDetail {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  category: string;
  rating: number;
  reviews: number;
  stock: number;
  images: string[];
  features: string[];
  sellerId: string | null;
  sellerName: string | null;
}

/** Row shape returned by the product-detail query. */
interface ProductRow {
  id: string;
  seller_id: string | null;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  stock_quantity: number;
  average_rating: number | null;
  review_count: number | null;
  categories: { name: string } | null;
  product_images: { image_url: string; is_primary: boolean; display_order: number }[] | null;
  product_features: { feature: string; display_order: number }[] | null;
}

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);

      const { data, error } = await supabase
        .from('products')
        .select(`
          id, seller_id, name, description, price, original_price, stock_quantity,
          average_rating, review_count,
          categories(name),
          product_images(image_url, is_primary, display_order),
          product_features(feature, display_order)
        `)
        .eq('id', id)
        .maybeSingle();

      if (cancelled) return;

      if (error || !data) {
        setProduct(null);
        setLoading(false);
        return;
      }

      const row = data as unknown as ProductRow;

      const images = [...(row.product_images ?? [])]
        .sort(
          (a, b) =>
            (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) ||
            a.display_order - b.display_order
        )
        .map(i => i.image_url);

      const features = [...(row.product_features ?? [])]
        .sort((a, b) => a.display_order - b.display_order)
        .map(f => f.feature);

      // The seller's store name lives on seller_profiles, which has no direct
      // foreign key from products (products.seller_id -> users.id), so it is
      // fetched separately rather than embedded.
      let sellerName: string | null = null;
      if (row.seller_id) {
        const { data: profile } = await supabase
          .from('seller_profiles')
          .select('store_name')
          .eq('user_id', row.seller_id)
          .maybeSingle();
        sellerName = (profile as { store_name: string } | null)?.store_name ?? null;
      }

      if (cancelled) return;

      setProduct({
        id: row.id,
        name: row.name,
        description: row.description ?? '',
        price: row.price,
        originalPrice: row.original_price,
        category: row.categories?.name ?? 'Uncategorized',
        rating: row.average_rating ?? 0,
        reviews: row.review_count ?? 0,
        stock: row.stock_quantity,
        images: images.length ? images : ['/placeholder.svg'],
        features,
        sellerId: row.seller_id,
        sellerName,
      });
      setActiveImage(0);
      setLoading(false);
    };

    load().catch(() => {
      if (!cancelled) {
        setProduct(null);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <PageShell>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-lg bg-muted" />
          <div className="space-y-4">
            <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            <div className="h-12 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-24 w-full animate-pulse rounded bg-muted" />
            <div className="h-12 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </PageShell>
    );
  }

  if (!product) {
    return (
      <PageShell>
        <div className="card-pop mx-auto max-w-md p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-brand-gradient text-ink">
            <PackageSearch className="h-8 w-8" />
          </div>
          <h1 className="mb-2 text-2xl font-extrabold">Product not found</h1>
          <p className="mb-8 text-muted-foreground">
            This listing may have been removed or is no longer available.
          </p>
          <Button asChild>
            <Link to="/products">Browse all products</Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  const style = categoryStyle(product.category);
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
  const inStock = product.stock > 0;
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () =>
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });

  const handleAddToWishlist = () =>
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });

  const TRUST = [
    { icon: Shield, label: 'Secure payment', hue: 'text-brand-blue', bg: 'bg-brand-blue/10' },
    { icon: Truck, label: 'Free over $100', hue: 'text-brand-teal', bg: 'bg-brand-teal/10' },
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
          <Link to="/products" className="transition-colors hover:text-gold-ink">
            Products
          </Link>
          <span className="mx-2">/</span>
          <Link
            to={`/products?category=${encodeURIComponent(product.category)}`}
            className={cn('font-semibold', style.text)}
          >
            {product.category}
          </Link>
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="animate-fade-up">
          <div className={cn('card-pop ring-gradient group overflow-hidden', style.glow)}>
            <div className="relative aspect-square overflow-hidden bg-muted">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {discount > 0 && (
                <Badge variant="hot" className="absolute left-4 top-4 text-sm">
                  -{discount}%
                </Badge>
              )}
              {!inStock && (
                <Badge variant="secondary" className="absolute right-4 top-4">
                  Sold out
                </Badge>
              )}
            </div>
          </div>

          {/* Thumbnails — only when there is more than one image */}
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {product.images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  aria-label={`View image ${i + 1} of ${product.images.length}`}
                  aria-current={i === activeImage}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-colors',
                    i === activeImage ? 'border-gold' : 'border-transparent hover:border-border'
                  )}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust strip */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {TRUST.map(({ icon: Icon, label, hue, bg }) => (
              <div key={label} className={cn('rounded-lg p-3 text-center', bg)}>
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

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
                <span className="text-sm font-bold">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews} {product.reviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              {product.sellerName && (
                <Link
                  to={`/products?seller=${encodeURIComponent(product.sellerName)}`}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-gold-ink"
                >
                  <Store className="h-3.5 w-3.5" />
                  Sold by <span className="font-bold text-foreground">{product.sellerName}</span>
                </Link>
              )}
            </div>
          </div>

          {/* Price block */}
          <div className={cn('rounded-lg border p-5', style.tint, style.border)}>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className={cn('text-4xl font-extrabold', style.text)}>${product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
              {discount > 0 && <Badge variant="hot">Save {discount}%</Badge>}
            </div>
            <p
              className={cn(
                'mt-2 flex items-center gap-1.5 text-sm font-semibold',
                inStock ? 'text-brand-teal' : 'text-sale'
              )}
            >
              <Check className="h-4 w-4" />
              {inStock
                ? product.stock <= 5
                  ? `Only ${product.stock} left in stock`
                  : 'In stock — ships today'
                : 'Currently unavailable'}
            </p>
          </div>

          {product.description && (
            <p className="leading-relaxed text-muted-foreground">{product.description}</p>
          )}

          {/* Features */}
          {product.features.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Features
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {product.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 rounded-md bg-muted/60 px-3 py-2 text-sm"
                  >
                    <Check className={cn('mt-0.5 h-4 w-4 shrink-0', style.text)} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              <ShoppingCart className="h-5 w-5" />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button
              variant={wishlisted ? 'default' : 'outline'}
              size="lg"
              aria-label={wishlisted ? 'In wishlist' : 'Add to wishlist'}
              className={cn(wishlisted && 'bg-sale text-white hover:bg-sale/90')}
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
