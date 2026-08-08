
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import PageHero from '@/components/layout/PageHero';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Grid, List, PackageSearch, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { categoryStyle } from '@/lib/theme';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  stock_quantity: number;
  average_rating: number;
  review_count: number;
  category: string;
  image: string;
}

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  // Seeded from the URL so category links from the homepage tiles, the
  // Categories page and the header mega-menu actually arrive filtered.
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Keep local filter state in step with back/forward navigation and with
  // links followed while already on this page.
  useEffect(() => {
    setSearchTerm(searchParams.get('search') ?? '');
    setCategoryFilter(searchParams.get('category') ?? 'all');
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select(`
          id, name, price, original_price, stock_quantity, average_rating, review_count,
          categories(name),
          product_images(image_url, is_primary, display_order)
        `)
        .eq('status', 'active');

      if (data) {
        setProducts(
          (data as any[]).map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            original_price: p.original_price ?? null,
            stock_quantity: p.stock_quantity,
            average_rating: p.average_rating ?? 0,
            review_count: p.review_count ?? 0,
            category: p.categories?.name ?? 'Uncategorized',
            image:
              (p.product_images as { image_url: string; is_primary: boolean; display_order: number }[])
                ?.sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
                ?.[0]?.image_url ?? '/placeholder.svg',
          }))
        );
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Include the active filter even when no loaded product carries it, so a
  // category link from elsewhere on the site still shows a labelled control
  // rather than an empty select.
  const categories = [
    'all',
    ...Array.from(
      new Set([
        ...products.map(p => p.category),
        ...(categoryFilter !== 'all' ? [categoryFilter] : []),
      ])
    ).sort(),
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.average_rating - a.average_rating;
      default: return 0;
    }
  });

  const handleAddToCart = (product: Product) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
  };

  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image });
    }
  };

  /** Writes a filter change back to the URL; the effect above mirrors it into
   *  state. Keeps the view shareable and the Back button meaningful. */
  const updateParams = (next: { search?: string; category?: string }) => {
    const params: Record<string, string> = {};
    const search = next.search ?? searchTerm;
    const category = next.category ?? categoryFilter;
    if (search) params.search = search;
    if (category && category !== 'all') params.category = category;
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchTerm });
  };

  const handleCategoryChange = (cat: string) => updateParams({ category: cat });

  return (
    <PageShell>
      <PageHero
        eyebrow="Marketplace"
        title="All"
        highlight="Products"
        subtitle="Discover amazing products from trusted sellers"
        icon={ShoppingBag}
        hue="blue"
      />

      {/* Search + filters */}
      <div className="mb-6 flex flex-col gap-3 lg:flex-row">
        <form onSubmit={handleSearch} className="group relative flex-1">
          <div className="absolute -inset-0.5 rounded-full bg-brand-gradient opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-50" />
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-violet" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 rounded-full border-2 border-transparent bg-muted pl-11 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </form>

        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={handleCategoryChange}>
            <SelectTrigger className="h-11 w-44 rounded-full border-2">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-11 w-44 rounded-full border-2">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-full bg-muted p-1">
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full transition-all',
                viewMode === 'grid'
                  ? 'bg-brand-gradient text-ink shadow-lift-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
              onClick={() => setViewMode('list')}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full transition-all',
                viewMode === 'list'
                  ? 'bg-brand-gradient text-ink shadow-lift-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category quick-filter chips — the rainbow row */}
      {categories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map(cat => {
            const style = categoryStyle(cat);
            const active = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5',
                  active
                    ? cat === 'all'
                      ? 'bg-brand-gradient text-ink shadow-lift-sm'
                      : cn(style.bg, 'text-white shadow-lift-sm')
                    : cat === 'all'
                      ? 'bg-muted text-muted-foreground hover:text-foreground'
                      : cn(style.tint, style.text)
                )}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            );
          })}
        </div>
      )}

      {!loading && (
        <p className="mb-6 text-sm text-muted-foreground">
          Showing <span className="font-bold text-foreground">{sortedProducts.length}</span> of{' '}
          <span className="font-bold text-foreground">{products.length}</span> products
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : sortedProducts.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'space-y-4'
          }
        >
          {sortedProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              view={viewMode}
              index={i}
              wishlisted={isInWishlist(product.id)}
              onToggleWishlist={() => handleWishlistToggle(product)}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
      ) : (
        <div className="card-pop mx-auto max-w-md p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-ink">
            <PackageSearch className="h-8 w-8" />
          </div>
          <p className="mb-2 text-lg font-bold">No products found</p>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </PageShell>
  );
};

export default Products;
