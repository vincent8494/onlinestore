import React from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { HUE_STYLES, type Hue } from '@/lib/theme';

interface PageHeroProps {
  title: string;
  /** Trailing words of the title, painted with the hue gradient */
  highlight?: string;
  subtitle?: string;
  icon?: LucideIcon;
  /** Small uppercase label above the title */
  eyebrow?: string;
  /** Drives the icon chip, eyebrow and title gradient */
  hue?: Hue;
  children?: React.ReactNode;
  className?: string;
}

/** Gradient page header used at the top of every inner page. */
const PageHero = ({
  title,
  highlight,
  subtitle,
  icon: Icon,
  eyebrow,
  hue = 'violet',
  children,
  className,
}: PageHeroProps) => {
  const style = HUE_STYLES[hue];

  return (
    <section className={cn('relative mb-10 animate-fade-up', className)}>
      <div className="flex flex-col gap-5">
        {(eyebrow || Icon) && (
          <div className="flex items-center gap-3">
            {Icon && (
              <span
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lift-sm',
                  style.gradient
                )}
              >
                <Icon className="h-6 w-6" />
              </span>
            )}
            {eyebrow && (
              <span className={cn('eyebrow', style.tint, style.text)}>{eyebrow}</span>
            )}
          </div>
        )}

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            {title}
            {highlight && (
              <>
                {' '}
                <span className="text-gold-ink">
                  {highlight}
                </span>
              </>
            )}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {children}
      </div>
    </section>
  );
};

export default PageHero;
