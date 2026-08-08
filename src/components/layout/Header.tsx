import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Heart,
  Bell,
  Store,
  LogOut,
  X,
  ChevronDown,
  Truck,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import { HUE_STYLES } from '@/lib/theme';
import { NAV_ITEMS } from '@/components/layout/megaMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isLoggedIn, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Utility strip — gold on charcoal */}
      <div className="bg-gold text-ink">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-1.5 text-2xs font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" />
            Free shipping over $100
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <ShieldCheck className="h-3.5 w-3.5" />
            Buyer protection on every order
          </span>
          <Link to="/deals" className="flex items-center gap-1.5 hover:underline">
            <Tag className="h-3.5 w-3.5" />
            Weekly deals
          </Link>
        </div>
      </div>

      {/* Main bar — charcoal */}
      <div className="bg-ink text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4 py-3">
            {/* Logo */}
            <Link to="/" className="group flex shrink-0 items-center gap-3">
              <div className="rounded-md bg-gold p-2.5 text-ink transition-transform group-hover:scale-105">
                <Store className="h-6 w-6" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-extrabold uppercase tracking-wide">
                  <span className="text-gold">VMK</span> Store
                </h1>
                <p className="text-2xs font-medium uppercase tracking-[0.2em] text-white/50">
                  Buy &amp; Sell Marketplace
                </p>
              </div>
            </Link>

            {/* Search */}
            <div className="mx-4 hidden max-w-xl flex-1 md:flex">
              <form onSubmit={handleSearch} className="relative w-full">
                <Input
                  placeholder="Search products, brands and more..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 rounded-md border-0 bg-white pr-24 text-ink placeholder:text-ink/40 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-0"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-0 top-0 flex h-11 items-center gap-1.5 rounded-r-md bg-gold px-5 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-gold-deep"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1">
              {isLoggedIn && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden text-white hover:bg-white/10 hover:text-gold md:flex"
                    asChild
                  >
                    <Link to="/wishlist" aria-label="Wishlist">
                      <Heart className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Notifications"
                    className="hidden text-white hover:bg-white/10 hover:text-gold md:flex"
                  >
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-white hover:bg-white/10 hover:text-gold"
                    asChild
                  >
                    <Link to="/cart" aria-label={`Cart, ${totalItems} items`}>
                      <ShoppingCart className="h-5 w-5" />
                      {totalItems > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-sale text-2xs font-bold text-white">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  </Button>
                </>
              )}

              {isLoggedIn ? (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 hover:text-gold"
                    asChild
                  >
                    <Link to="/profile" aria-label="Profile">
                      <User className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    aria-label="Log out"
                    className="hidden text-white hover:bg-white/10 hover:text-gold md:flex"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 hover:text-gold"
                  asChild
                >
                  <Link to="/login" aria-label="Sign in">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 md:hidden"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Nav row + mega menu.
          onMouseLeave on the wrapper (not the trigger) keeps the panel open
          while the pointer travels from the label down into it. */}
      <div
        className="relative hidden border-b border-border bg-background md:block"
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between">
            <ul className="flex items-center">
              {NAV_ITEMS.map((item) => {
                const style = HUE_STYLES[item.hue];
                const isActive = location.pathname === item.to;
                const isOpen = openMenu === item.label;
                return (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      onMouseEnter={() => setOpenMenu(item.columns ? item.label : null)}
                      onFocus={() => setOpenMenu(item.columns ? item.label : null)}
                      aria-expanded={item.columns ? isOpen : undefined}
                      className={cn(
                        'flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors',
                        isActive || isOpen
                          ? 'border-gold text-foreground'
                          : 'border-transparent text-muted-foreground hover:border-gold/40 hover:text-foreground'
                      )}
                    >
                      <span className={cn('h-2 w-2 rounded-full', style.bg)} />
                      {item.label}
                      {item.columns && (
                        <ChevronDown
                          className={cn(
                            'h-3.5 w-3.5 transition-transform',
                            isOpen && 'rotate-180'
                          )}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Hey, <span className="font-bold text-foreground">{user?.firstName}</span>
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/sell">Start Selling</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/login?redirect=/sell">Start Selling</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>

        {/* Mega-menu panel */}
        {NAV_ITEMS.filter((i) => i.columns).map((item) =>
          openMenu === item.label ? (
            <div
              key={item.label}
              className="absolute inset-x-0 top-full z-50 border-b-2 border-gold bg-background shadow-lift animate-fade-in"
            >
              <div className="container mx-auto grid gap-8 px-4 py-8 lg:grid-cols-4">
                {item.columns!.map((col) => (
                  <div key={col.heading}>
                    <h3 className="mb-3 border-b border-border pb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {col.heading}
                    </h3>
                    <ul className="space-y-1.5">
                      {col.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            to={link.to}
                            onClick={() => setOpenMenu(null)}
                            className="group flex items-center gap-2 py-1 text-sm font-medium transition-colors hover:text-gold-ink"
                          >
                            <span className="h-1 w-0 bg-gold transition-all duration-200 group-hover:w-3" />
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {item.promo && (
                  <Link
                    to={item.promo.to}
                    onClick={() => setOpenMenu(null)}
                    className="group flex flex-col justify-between rounded-lg bg-brand-wash p-6 text-white transition-transform hover:-translate-y-0.5"
                  >
                    <div>
                      <h3 className="mb-1 text-lg font-extrabold">{item.promo.title}</h3>
                      <p className="text-sm text-white/70">{item.promo.body}</p>
                    </div>
                    <span className="mt-4 inline-flex w-fit items-center gap-1.5 bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink">
                      {item.promo.cta}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-b border-border bg-background py-4 md:hidden animate-fade-up">
          <div className="container mx-auto flex flex-col gap-3 px-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 rounded-md border-2 pl-10"
              />
            </form>

            <ul className="divide-y divide-border border-y border-border">
              {NAV_ITEMS.map((item) => {
                const style = HUE_STYLES[item.hue];
                const expanded = mobileSection === item.label;
                return (
                  <li key={item.label}>
                    <div className="flex items-center justify-between">
                      <Link
                        to={item.to}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex flex-1 items-center gap-2 py-3 text-sm font-bold uppercase tracking-wide"
                      >
                        <span className={cn('h-2 w-2 rounded-full', style.bg)} />
                        {item.label}
                      </Link>
                      {item.columns && (
                        <button
                          type="button"
                          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${item.label}`}
                          aria-expanded={expanded}
                          onClick={() => setMobileSection(expanded ? null : item.label)}
                          className="p-3"
                        >
                          <ChevronDown
                            className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
                          />
                        </button>
                      )}
                    </div>

                    {item.columns && expanded && (
                      <div className="pb-3 pl-4">
                        {item.columns.map((col) => (
                          <div key={col.heading} className="mb-3">
                            <h4 className="mb-1 text-2xs font-bold uppercase tracking-widest text-muted-foreground">
                              {col.heading}
                            </h4>
                            <ul className="space-y-1">
                              {col.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    to={link.to}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block py-1 text-sm text-muted-foreground"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Hey, <span className="font-bold text-foreground">{user?.firstName}</span>
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/sell" onClick={() => setIsMenuOpen(false)}>
                      Start Selling
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/login?redirect=/sell" onClick={() => setIsMenuOpen(false)}>
                      Start Selling
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
