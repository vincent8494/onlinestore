import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Sparkles, ArrowLeft } from 'lucide-react';
import Logo from '@/components/brand/Logo';

interface AuthShellProps {
  title: string;
  highlight: string;
  subtitle: string;
  children: React.ReactNode;
  /** Rendered under the card (e.g. "Don't have an account?") */
  footer?: React.ReactNode;
}

const PERKS = [
  { icon: ShieldCheck, label: 'Buyer protection on every order' },
  { icon: Truck, label: 'Free shipping over $100' },
  { icon: Sparkles, label: 'New drops every Friday' },
];

/**
 * Split-screen auth layout: a saturated brand panel on the left, the form on
 * the right. The panel collapses on mobile so the form stays the focus.
 */
const AuthShell = ({ title, highlight, subtitle, children, footer }: AuthShellProps) => (
  <div className="flex min-h-screen">
    {/* Brand panel */}
    <div className="relative hidden w-1/2 overflow-hidden bg-brand-wash-animated lg:flex lg:flex-col lg:justify-between">
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 top-24 h-64 w-64 rounded-full bg-white/10 animate-blob" />
        <div
          className="absolute -left-10 bottom-32 h-72 w-72 rounded-full bg-white/10 animate-blob"
          style={{ animationDelay: '-8s' }}
        />
      </div>

      <div className="relative p-12">
        <Logo size="xl" />
      </div>

      <div className="relative p-12">
        <h2 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white">
          The marketplace built for
          <span className="block bg-gradient-to-r from-white via-[hsl(var(--hue-amber))] to-white bg-clip-text text-transparent">
            buyers and sellers
          </span>
        </h2>
        <ul className="space-y-3">
          {PERKS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 text-white/85">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium">{label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative p-12 pt-0">
        <div className="flex items-center gap-6 text-white/70">
          <div>
            <div className="text-2xl font-extrabold text-white">50K+</div>
            <div className="text-xs uppercase tracking-widest">Buyers</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">12K+</div>
            <div className="text-xs uppercase tracking-widest">Sellers</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">4.8★</div>
            <div className="text-xs uppercase tracking-widest">Rating</div>
          </div>
        </div>
      </div>
    </div>

    {/* Form side */}
    <div className="relative flex w-full items-center justify-center overflow-hidden p-4 lg:w-1/2">
      {/* Ambient colour, visible mainly on mobile where the panel is hidden */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-brand-violet/20 blur-3xl animate-blob" />
        <div
          className="absolute -bottom-32 left-0 h-80 w-80 rounded-full bg-brand-pink/20 blur-3xl animate-blob"
          style={{ animationDelay: '-9s' }}
        />
      </div>

      <div className="w-full max-w-md animate-fade-up py-8">
        {/* Mobile logo */}
        <div className="mb-8 flex justify-center lg:hidden">
          <Logo size="lg" />
        </div>

        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight">
            {title}{' '}
            <span className="text-gold-ink">{highlight}</span>
          </h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        {children}

        {footer && <div className="mt-6 text-center text-sm">{footer}</div>}

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand-violet"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to VMK Store
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default AuthShell;
