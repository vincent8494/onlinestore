import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  Heart,
  Bell,
  Store,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isLoggedIn, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">VMK Store</h1>
              <p className="text-xs text-muted-foreground">Buy & Sell Marketplace</p>
            </div>
          </Link>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted/50 border-0 focus:bg-background"
              />
            </form>
          </div>

          {/* Navigation icons */}
          <div className="flex items-center space-x-2">
            {isLoggedIn && (
              <>
                <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
                  <Link to="/wishlist">
                    <Heart className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="relative" asChild>
                  <Link to="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {totalItems}
                      </Badge>
                    )}
                  </Link>
                </Button>
              </>
            )}
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/profile">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="hidden md:flex">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/login">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation menu */}
        <nav className="hidden md:flex items-center justify-between py-2 border-t border-border">
          <div className="flex items-center space-x-6">
            <Link 
              to="/categories" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Categories
            </Link>
            <Link 
              to="/deals" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Best Deals
            </Link>
            <Link 
              to="/new-arrivals" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              New Arrivals
            </Link>
            <Link 
              to="/sellers" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Top Sellers
            </Link>
            <Link 
              to="/seller-guide" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Seller Guide
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.firstName}!
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

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-muted/50 border-0"
                />
              </form>
              <Link to="/categories" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>Categories</Link>
              <Link to="/deals" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>Best Deals</Link>
              <Link to="/new-arrivals" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>New Arrivals</Link>
              <Link to="/sellers" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>Top Sellers</Link>
              <Link to="/seller-guide" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>Seller Guide</Link>
              <div className="flex flex-col space-y-2 pt-2 border-t border-border">
                {isLoggedIn ? (
                  <>
                    <span className="text-sm text-muted-foreground">Welcome, {user?.firstName}!</span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      Logout
                    </Button>
                    <Button size="sm" asChild>
                      <Link to="/sell" onClick={() => setIsMenuOpen(false)}>Start Selling</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link to="/login?redirect=/sell" onClick={() => setIsMenuOpen(false)}>Start Selling</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
