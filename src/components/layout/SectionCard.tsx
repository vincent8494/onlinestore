import React from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { HUE_STYLES, type Hue } from '@/lib/theme';

interface SectionCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  hue?: Hue;
  children: React.ReactNode;
  /** Removes the default padding when the body needs to bleed to the edges */
  bare?: boolean;
  className?: string;
  bodyClassName?: string;
  style?: React.CSSProperties;
}

/**
 * Panel with a saturated gradient header. The workhorse container for the
 * form-and-content pages (settings, seller tools, policies).
 */
const SectionCard = ({
  title,
  description,
  icon: Icon,
  hue = 'violet',
  children,
  bare = false,
  className,
  bodyClassName,
  style,
}: SectionCardProps) => {
  const s = HUE_STYLES[hue];

  return (
    <div className={cn('card-pop animate-fade-up overflow-hidden', className)} style={style}>
      <div className={cn('flex items-center gap-3 p-5 text-white', s.gradient)}>
        {Icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-lg font-bold">{title}</h2>
          {description && <p className="text-sm text-white/80">{description}</p>}
        </div>
      </div>
      <div className={cn(!bare && 'p-6', bodyClassName)}>{children}</div>
    </div>
  );
};

export default SectionCard;
