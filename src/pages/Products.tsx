
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Star, Heart, ShoppingCart, Grid, List } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { electronicsProducts } from '@/data/products';
import { fashionProducts } from '@/data/fashionProducts';
import { beautyProducts } from '@/data/beautyProducts';
import { groceryProducts } from '@/data/groceryProducts';
import { homeProducts } from '@/data/homeProducts';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlistItems } = useWishlist();

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);

  // Helper function to generate a random rating between 3.5 and 5
  const getRandomRating = () => Number((Math.random() * 1.5 + 3.5).toFixed(1));
  
  // Helper function to generate a random number of reviews
  const getRandomReviews = () => Math.floor(Math.random() * 500) + 1;

  // Existing products
  const existingProducts = [

    ];

  // Helper function to generate unique IDs
  const generateUniqueId = (() => {
    let idCounter = 0;
    return (prefix = '') => `${prefix}${++idCounter}`;
  })();

  // Format electronics products to match the existing product structure
  const formattedElectronics = electronicsProducts.map((product) => ({
    ...product,
    id: generateUniqueId('e-'),
    originalPrice: Math.random() > 0.3 ? Math.round(product.price * (1 + Math.random() * 0.5)) : null,
    rating: getRandomRating(),
    reviews: getRandomReviews(),
    seller: 'TechStore Pro',
    badge: Math.random() > 0.7 ? 'New' : Math.random() > 0.5 ? 'Hot Deal' : null,
    inStock: Math.random() > 0.1, // 90% chance of being in stock
    image: product.image || '/placeholder.svg'}));

  // Format fashion products to match the existing product structure
  const formattedFashion = fashionProducts.map((product) => ({
    ...product,
    id: generateUniqueId('f-'),
    originalPrice: Math.random() > 0.2 ? Math.round(product.price * (1 + Math.random() * 0.4)) : null,
    rating: getRandomRating(),
    reviews: getRandomReviews(),
    seller: 'FashionHub',
    badge: Math.random() > 0.8 ? 'New' : Math.random() > 0.6 ? 'Sale' : null,
    inStock: Math.random() > 0.05, // 95% chance of being in stock
    image: product.image || '/placeholder.svg'}));

  // Format beauty products to match the existing product structure
  const formattedBeauty = beautyProducts.map((product) => ({
    ...product,
    id: generateUniqueId('b-'),
    originalPrice: Math.random() > 0.25 ? Math.round(product.price * (1 + Math.random() * 0.3)) : null,
    rating: getRandomRating(),
    reviews: getRandomReviews(),
    seller: 'BeautyEssentials',
    badge: Math.random() > 0.85 ? 'Bestseller' : Math.random() > 0.7 ? 'Limited Time' : null,
    inStock: Math.random() > 0.03, // 97% chance of being in stock
    image: product.image || '/placeholder.svg'}));

  // Format grocery products to match the existing product structure
  const formattedGrocery = groceryProducts.map((product) => ({
    ...product,
    id: generateUniqueId('g-'),
    name: product.name + (product.size ? ` (${product.size})` : ''),
    originalPrice: Math.random() > 0.3 ? Math.round(product.price * (1 + Math.random() * 0.2) * 10) / 10 : null,
    rating: getRandomRating(),
    reviews: getRandomReviews(),
    seller: 'FreshMart',
    badge: Math.random() > 0.9 ? 'Popular' : Math.random() > 0.8 ? 'On Sale' : null,
    inStock: Math.random() > 0.02, // 98% chance of being in stock
    image: product.image || '/placeholder.svg'}));

  // Format home & kitchen products to match the existing product structure
  const formattedHome = homeProducts.map((product) => ({
    ...product,
    id: generateUniqueId('h-'),
    name: product.name + (product.size ? ` (${product.size})` : ''),
    originalPrice: Math.random() > 0.35 ? Math.round(product.price * (1 + Math.random() * 0.25) * 10) / 10 : null,
    rating: getRandomRating(),
    reviews: getRandomReviews(),
    seller: 'HomeEssentials',
    badge: Math.random() > 0.9 ? 'Bestseller' : Math.random() > 0.8 ? 'New Arrival' : null,
    inStock: Math.random() > 0.01, // 99% chance of being in stock
    image: product.image || '/placeholder.svg'}));

  // Combine all products
  const products = [
    ...existingProducts, 
    ...formattedElectronics, 
    ...formattedFashion, 
    ...formattedBeauty, 
    ...formattedGrocery,
    ...formattedHome
  ];

  const categories = ['all', 'Electronics', 'Fashion', 'Beauty & Personal Care', 'Groceries', 'Home & Kitchen', 'Food', 'Home & Garden', 'Sports'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return Number(a.price) - Number(b.price);
      case 'price-high':
        return Number(b.price) - Number(a.price);
      case 'rating':
        return Number(b.rating) - Number(a.rating);
      case 'newest':
        // Convert string IDs to numbers for comparison, fallback to 0 if conversion fails
        const idA = typeof a.id === 'string' ? parseInt(a.id.replace(/[^0-9]/g, '') || '0', 10) : Number(a.id);
        const idB = typeof b.id === 'string' ? parseInt(b.id.replace(/[^0-9]/g, '') || '0', 10) : Number(b.id);
        return idB - idA;
      default:
        return 0;
    }
  });

  // Helper function to convert product ID to number
  const toNumberId = (id: string | number): number => {
    return typeof id === 'string' 
      ? parseInt(id.replace(/[^0-9]/g, '') || '0', 10)
      : Number(id);
  };

  const handleAddToCart = (product: {
    id: string | number;
    name: string;
    price: number;
    image?: string;
  }) => {
    addToCart({
      id: toNumberId(product.id),
      name: product.name,
      price: product.price,
      image: product.image || '/placeholder.svg'
    });
  };

  const handleWishlistToggle = (product: {
    id: string | number;
    name: string;
    price: number;
    image?: string;
  }) => {
    const productId = toNumberId(product.id);

    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image || '/placeholder.svg'
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchTerm ? { search: searchTerm } : {});
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">All Products</h1>
          <p className="text-muted-foreground">Discover amazing products from trusted sellers</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <form onSubmit={handleSearch}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </form>
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'} 
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {sortedProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
        }>
          {sortedProducts.map((product) => (
            <Card key={product.id} className={`group hover:shadow-xl transition-all duration-300 ${
              viewMode === 'list' ? 'flex flex-row' : ''
            } ${!product.inStock ? 'opacity-60' : ''}`}>
              <div className={`relative overflow-hidden ${
                viewMode === 'list' ? 'w-48 h-32' : 'w-full h-48'
              }`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className={`absolute top-3 left-3 ${
                  product.badge === 'Best Seller' ? 'bg-orange-500' :
                  product.badge === 'New' ? 'bg-green-500' :
                  product.badge === 'Premium' ? 'bg-purple-500' :
                  product.badge === 'Hot Deal' ? 'bg-red-500' :
                  product.badge === 'Sale' ? 'bg-blue-500' :
                  'bg-emerald-500'
                }`}>
                  {product.badge}
                </Badge>
                {!product.inStock && (
                  <Badge className="absolute top-3 right-3 bg-gray-500">
                    Out of Stock
                  </Badge>
                )}
                <Button
                  size="icon"
                  variant={isInWishlist(toNumberId(product.id)) ? "default" : "secondary"}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleWishlistToggle(product)}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist(toNumberId(product.id)) ? 'fill-current' : ''}`} />
                </Button>
              </div>
              
              <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                <div>
                  <h3 className={`font-semibold mb-2 line-clamp-2 ${
                    viewMode === 'list' ? 'text-lg' : 'text-sm'
                  }`}>
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">by {product.seller}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-primary">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  size="sm"
                  disabled={!product.inStock}
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No products found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Products;
