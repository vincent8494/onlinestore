import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HeroSlide {
  eyebrow: string;
  title: string;
  /** Painted gold, rendered on its own line */
  highlight: string;
  body: string;
  cta: string;
  to: string;
  /** Tailwind background classes — the colour field behind (or instead of) the photo */
  surface: string;
  /** Optional photograph */
  image?: string;
  /** object-position for the photo, so the subject survives the crop */
  focal?: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  /** Auto-advance interval in ms. Pass 0 to disable. */
  interval?: number;
}

/**
 * Full-width rotating hero banner.
 *
 * Auto-advance pauses on hover and on keyboard focus, and is skipped entirely
 * for users who prefer reduced motion — an unstoppable carousel is a common
 * accessibility failure.
 */
const HeroCarousel = ({ slides, interval = 6000 }: HeroCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  const count = slides.length;
  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    if (!interval || paused || count <= 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    timer.current = window.setTimeout(() => go(index + 1), interval);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [index, interval, paused, count, go]);

  if (count === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative h-[26rem] md:h-[32rem]">
        {slides.map((slide, i) => (
          <div
            key={slide.title + i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
            className={cn(
              'absolute inset-0 transition-opacity duration-700',
              slide.surface,
              i === index ? 'opacity-100' : 'pointer-events-none opacity-0'
            )}
          >
            {slide.image && (
              <>
                <img
                  src={slide.image}
                  alt=""
                  /* The first slide is above the fold — let it load eagerly */
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: slide.focal ?? 'center' }}
                />
                {/* Left-weighted scrim: opaque behind the copy column, clearing
                    to almost nothing on the right so the subject stays visible.
                    Written as an inline style rather than an arbitrary Tailwind
                    value — the commas and slashes in hsl(var(--x)/a) do not
                    survive Tailwind's class parser. */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, hsl(var(--ink)) 0%, hsl(var(--ink) / 0.9) 30%, hsl(var(--ink) / 0.4) 62%, hsl(var(--ink) / 0.08) 100%)',
                  }}
                />
              </>
            )}

            {/* Dot texture */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />

            <div className="container relative mx-auto flex h-full items-center px-4">
              <div className="max-w-2xl text-white">
                <span className="mb-5 inline-block border-l-4 border-gold bg-black/20 py-1 pl-3 pr-4 text-xs font-bold uppercase tracking-[0.2em] text-gold backdrop-blur-sm">
                  {slide.eyebrow}
                </span>
                <h2 className="mb-4 text-4xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-6xl">
                  {slide.title}
                  <span className="mt-1 block text-gold">{slide.highlight}</span>
                </h2>
                <p className="mb-8 max-w-lg text-base text-white/75 md:text-lg">{slide.body}</p>
                <Link
                  to={slide.to}
                  tabIndex={i === index ? 0 : -1}
                  className="inline-flex items-center gap-2 bg-gold px-8 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-all hover:-translate-y-0.5 hover:bg-gold-deep hover:shadow-glow-gold"
                >
                  {slide.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {count > 1 && (
          <>
            {/* Arrows */}
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(index - 1)}
              className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-gold hover:text-ink"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(index + 1)}
              className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-gold hover:text-ink"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.title + i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => go(i)}
                  className={cn(
                    'h-1.5 transition-all duration-300',
                    i === index ? 'w-10 bg-gold' : 'w-4 bg-white/40 hover:bg-white/70'
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroCarousel;
