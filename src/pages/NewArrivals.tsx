
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Eye } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

const NewArrivals = () => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const products = [
    {
      id: 1,
      title: 'Premium Bluetooth Speaker',
      price: 149,
      rating: 4.7,
      reviews: 23,
      isNew: true,
      category: 'Electronics',
      image: '/images/products/new-arrivals/premium-bluetooth-speaker.jpg'
    },
    {
      id: 2,
      title: 'Classic Wristwatch',
      price: 89,
      rating: 4.5,
      reviews: 12,
      isNew: true,
      category: 'Fashion',
      image: '/images/products/new-arrivals/classic-wristwatch.jpg'
    },
    {
      id: 3,
      title: 'Gourmet Coffee',
      price: 24,
      rating: 4.9,
      reviews: 45,
      isNew: true,
      category: 'Food & Drinks',
      image: '/images/products/new-arrivals/gourmet-coffee.jpg'
    },
    {
      id: 4,
      title: 'Fitness Tracker Band',
      price: 79,
      rating: 4.4,
      reviews: 18,
      isNew: true,
      category: 'Sports',
      image: '/images/products/new-arrivals/fitness-tracker-band.jpg'
    }
  ];

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image
    });
  };

  const handleWishlistToggle = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.image
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">New Arrivals</h1>
          <p className="text-muted-foreground">Fresh products just added to our marketplace</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
                {product.isNew && (
                  <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                    NEW
                  </Badge>
                )}
                <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant={isInWishlist(product.id) ? "default" : "ghost"}
                    size="icon" 
                    className="bg-background/80 hover:bg-background"
                    onClick={() => handleWishlistToggle(product)}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon" className="bg-background/80 hover:bg-background">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs ml-1">{product.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-sm line-clamp-2">{product.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-primary">${product.price}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
                </div>
                <Button className="w-full" size="sm" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewArrivals;
