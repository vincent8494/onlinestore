import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { categoryStyle } from '@/lib/theme';

export interface ProductCardData {
  id: string;
  name: string;
  price: number;
  original_price?: number | null;
  stock_quantity?: number;
  average_rating?: number;
  review_count?: number;
  category?: string;
  image?: string;
}

interface ProductCardProps {
  product: ProductCardData;
  view?: 'grid' | 'list';
  wishlisted?: boolean;
  onToggleWishlist?: (product: ProductCardData) => void;
  onAddToCart?: (product: ProductCardData) => void;
  /** Staggers the entrance animation across a grid */
  index?: number;
  className?: string;
}

/**
 * The product tile used across Products, Deals, New Arrivals, Wishlist and Home.
 * Its accent colour is derived from the product's category, so a grid of mixed
 * categories renders as a rainbow.
 */
const ProductCard = ({
  product,
  view = 'grid',
  wishlisted = false,
  onToggleWishlist,
  onAddToCart,
  index = 0,
  className,
}: ProductCardProps) => {
  const style = categoryStyle(product.category ?? '');
  const outOfStock = product.stock_quantity === 0;
  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null;
  const isList = view === 'list';

  return (
    <div
      className={cn(
        'card-pop ring-gradient group overflow-hidden animate-fade-up',
        style.glow,
        isList && 'flex flex-row',
        outOfStock && 'opacity-60',
        className
      )}
      // Cap the stagger so long grids don't leave later cards blank for seconds
      style={{ animationDelay: `${Math.min(index, 11) * 50}ms` }}
    >
      {/* Image */}
      <div
        className={cn(
          'relative shrink-0 overflow-hidden bg-muted',
          isList ? 'w-40 sm:w-56' : 'aspect-[4/3] w-full'
        )}
      >
        <Link to={`/products/${product.id}`} className="block h-full w-full">
          <img
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Colour wash that blooms on hover */}
          <div
            className={cn(
              'pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-40',
              style.gradient
            )}
          />
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {discount !== null && <Badge variant="hot">-{discount}%</Badge>}
          {outOfStock && <Badge variant="secondary">Sold out</Badge>}
        </div>

        {/* Wishlist */}
        {onToggleWishlist && (
          <button
            type="button"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={wishlisted}
            onClick={() => onToggleWishlist(product)}
            className={cn(
              'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110',
              wishlisted
                ? 'bg-brand-pink text-white shadow-glow-pink'
                : 'bg-background/80 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-brand-pink'
            )}
          >
            <Heart className={cn('h-4 w-4', wishlisted && 'fill-current')} />
          </button>
        )}
      </div>

      {/* Body */}
      <div className={cn('flex flex-col p-4', isList && 'flex-1 justify-between')}>
        <div>
          {product.category && (
            <span
              className={cn(
                'mb-2 inline-block rounded-full px-2.5 py-0.5 text-2xs font-bold uppercase tracking-wider',
                style.tint,
                style.text
              )}
            >
              {product.category}
            </span>
          )}

          <h3
            className={cn(
              'mb-2 line-clamp-2 font-bold leading-snug transition-colors',
              style.groupHoverText,
              isList ? 'text-lg' : 'text-sm'
            )}
          >
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </h3>

          {(product.average_rating !== undefined || product.review_count !== undefined) && (
            <div className="mb-3 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-brand-amber text-brand-amber" />
              <span className="text-xs font-bold">
                {(product.average_rating ?? 0).toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({product.review_count ?? 0})
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="mb-3 flex items-baseline gap-2">
            <span className={cn('text-xl font-extrabold', style.text)}>
              ${product.price}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.original_price}
              </span>
            )}
          </div>

          {onAddToCart && (
            <Button
              variant="gradient"
              size="sm"
              className="w-full"
              disabled={outOfStock}
              onClick={() => onAddToCart(product)}
            >
              <ShoppingCart className="h-4 w-4" />
              {outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
