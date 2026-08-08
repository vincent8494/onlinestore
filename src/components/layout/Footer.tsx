
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Clock,
  Send,
  Check,
  CreditCard,
  Smartphone,
  Wallet,
  Landmark,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { HUE_STYLES, type Hue } from '@/lib/theme';
import Logo from '@/components/brand/Logo';

/** Link columns, each with its own hue for the heading and hover states. */
const COLUMNS: { title: string; hue: Hue; links: { to: string; label: string }[] }[] = [
  {
    title: 'Quick Links',
    hue: 'cyan',
    links: [
      { to: '/about', label: 'About Us' },
      { to: '/products', label: 'All Products' },
      { to: '/categories', label: 'Categories' },
      { to: '/deals', label: 'Best Deals' },
      { to: '/sellers', label: 'Top Sellers' },
    ],
  },
  {
    title: 'For Sellers',
    hue: 'amber',
    links: [
      { to: '/sell', label: 'Start Selling' },
      { to: '/seller-guide', label: 'Seller Guide' },
      { to: '/fees', label: 'Fees & Pricing' },
      { to: '/seller-support', label: 'Seller Support' },
      { to: '/seller-policies', label: 'Seller Policies' },
    ],
  },
];

const SOCIALS: { icon: typeof Facebook; label: string; hue: Hue }[] = [
  { icon: Facebook, label: 'Facebook', hue: 'blue' },
  { icon: Twitter, label: 'Twitter', hue: 'cyan' },
  { icon: Instagram, label: 'Instagram', hue: 'pink' },
  { icon: Youtube, label: 'YouTube', hue: 'rose' },
];

const PAYMENTS = [
  { icon: CreditCard, label: 'Card' },
  { icon: Smartphone, label: 'Mobile money' },
  { icon: Wallet, label: 'Wallet' },
  { icon: Landmark, label: 'Bank transfer' },
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // No mailing-list backend yet — acknowledge locally so the control isn't dead.
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="relative mt-16 overflow-hidden bg-ink text-white">
      {/* Gold hairline mirrors the header stripe */}
      <div className="h-1 w-full bg-gold" />

      {/* Newsletter band */}
      <div className="border-b border-white/10 bg-ink-soft">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 py-8 lg:flex-row">
          <div className="text-center lg:text-left">
            <h3 className="text-xl font-extrabold uppercase tracking-wide">
              Get <span className="text-gold">10% off</span> your first order
            </h3>
            <p className="text-sm text-white/60">
              Join the list for weekly deals and new arrivals.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-0">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-12 w-full rounded-l-md border-0 bg-white px-4 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button
              type="submit"
              className="flex h-12 shrink-0 items-center gap-2 rounded-r-md bg-gold px-6 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-gold-deep"
            >
              {subscribed ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              {subscribed ? 'Joined' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      <div className="container relative mx-auto px-4 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Logo size="xl" />
            </div>
            <p className="mb-5 text-sm leading-relaxed text-white/60">
              Your trusted marketplace for buying and selling quality products.
              Connect with sellers worldwide and discover amazing deals.
            </p>
            <div className="flex gap-2">
              {SOCIALS.map(({ icon: Icon, label, hue }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/60 transition-all duration-200 hover:-translate-y-0.5 hover:text-white',
                    HUE_STYLES[hue].glow
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map(({ title, hue, links }) => (
            <div key={title}>
              <h4 className={cn('mb-4 text-sm font-bold uppercase tracking-widest', HUE_STYLES[hue].text)}>
                {title}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="inline-block text-white/60 transition-all duration-200 hover:translate-x-1 hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold">
              Contact Us
            </h4>
            <a
              href="mailto:support@vmkstore.com"
              className="mb-5 flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gold/15">
                <Mail className="h-4 w-4 text-gold" />
              </span>
              support@vmkstore.com
            </a>

            <div className="rounded-md border border-white/10 bg-white/5 p-4">
              <h5 className="mb-2 flex items-center gap-1.5 text-2xs font-bold uppercase tracking-widest text-white/70">
                <Clock className="h-3 w-3 text-gold" />
                Customer Support
              </h5>
              <p className="text-xs text-white/50">Monday – Friday: 9AM – 6PM</p>
              <p className="text-xs text-white/50">Saturday – Sunday: 10AM – 4PM</p>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <span className="text-2xs font-bold uppercase tracking-widest text-white/40">
            We accept
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PAYMENTS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                title={label}
                className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-2xs font-bold uppercase tracking-wide text-white/60"
              >
                <Icon className="h-4 w-4 text-gold" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} VMK Store. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-white/40 transition-colors hover:text-gold">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white/40 transition-colors hover:text-gold">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-white/40 transition-colors hover:text-gold">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
