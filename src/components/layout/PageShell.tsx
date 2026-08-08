import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

/**
 * Ambient colour blobs that sit behind every page. They're the main reason the
 * whole site reads as "colourful" even on text-heavy pages like the policies.
 */
export const AmbientBlobs = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    {/* Kept faint: the brand now carries its weight through gold and charcoal,
        so these only warm the page rather than colour it. */}
    <div className="absolute -top-40 -left-32 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-3xl animate-blob" />
    <div
      className="absolute top-1/3 -right-40 h-[34rem] w-[34rem] rounded-full bg-brand-blue/[0.07] blur-3xl animate-blob"
      style={{ animationDelay: '-6s' }}
    />
    <div
      className="absolute -bottom-48 left-1/4 h-[30rem] w-[30rem] rounded-full bg-gold/[0.08] blur-3xl animate-blob"
      style={{ animationDelay: '-12s' }}
    />
  </div>
);

interface PageShellProps {
  children: React.ReactNode;
  /** Drop the container/padding when a page wants full-bleed sections (e.g. Home) */
  bare?: boolean;
  className?: string;
}

/** Header + ambient colour + Footer. The frame for every page on the site. */
const PageShell = ({ children, bare = false, className }: PageShellProps) => (
  <div className="relative flex min-h-screen flex-col bg-background">
    <AmbientBlobs />
    <Header />
    <main className={cn('flex-1', !bare && 'container mx-auto px-4 py-10', className)}>
      {children}
    </main>
    <Footer />
  </div>
);

export default PageShell;
