import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categoryStyle } from '@/lib/theme';

interface CategoryTileProps {
  name: string;
  count: string;
  icon: LucideIcon;
  /** Optional photograph; falls back to the category's colour field */
  image?: string;
  /** Taller tile for a featured slot in the grid */
  size?: 'default' | 'tall';
  index?: number;
  className?: string;
}

/**
 * Image-led category tile with the item count overlaid.
 * Where no photograph exists it falls back to the category's own hue, which is
 * what keeps the grid reading as a colour spectrum.
 */
const CategoryTile = ({
  name,
  count,
  icon: Icon,
  image,
  size = 'default',
  index = 0,
  className,
}: CategoryTileProps) => {
  const style = categoryStyle(name);

  return (
    <Link
      to={`/products?category=${encodeURIComponent(name)}`}
      className={cn(
        'group relative block overflow-hidden rounded-lg animate-fade-up',
        size === 'tall' ? 'h-[26rem]' : 'h-52',
        className
      )}
      style={{ animationDelay: `${Math.min(index, 11) * 60}ms` }}
    >
      {/* Photo when we have one, otherwise the category's colour field */}
      <div className={cn('absolute inset-0', !image && style.gradient)}>
        {image && (
          <img
            src={image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}
      </div>

      {/* Legibility scrim — text sits on this, never on the raw image.
          Photos need a deeper, taller scrim than the flat colour fields do. */}
      <div
        className={cn(
          'absolute inset-0',
          image
            ? 'bg-gradient-to-t from-ink via-ink/55 to-ink/10'
            : 'bg-gradient-to-t from-ink/85 via-ink/25 to-transparent'
        )}
      />

      {/* A hint of the category hue keeps the grid reading as a spectrum.
          Kept low and cleared on hover: any stronger and it misrepresents the
          product colours in the photograph. */}
      {image && (
        <div
          className={cn(
            'absolute inset-0 opacity-[0.14] mix-blend-color transition-opacity duration-300 group-hover:opacity-0',
            style.gradient
          )}
        />
      )}

      {/* Gold hairline on hover */}
      <div className="absolute inset-0 border-2 border-transparent transition-colors duration-300 group-hover:border-gold" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
        <div className="min-w-0">
          <Icon className="mb-2 h-6 w-6 text-gold" />
          <h3 className="truncate text-lg font-extrabold uppercase tracking-wide text-white">
            {name}
          </h3>
          <p className="text-xs font-bold uppercase tracking-widest text-white/60">{count}</p>
        </div>
        <span className="shrink-0 bg-gold px-3 py-1.5 text-2xs font-bold uppercase tracking-wide text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Shop
        </span>
      </div>
    </Link>
  );
};

export default CategoryTile;
