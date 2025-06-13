
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Heart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

const Deals = () => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const deals = [
    {
      id: 1,
      title: 'Gaming Laptop Pro',
      originalPrice: 1299,
      salePrice: 899,
      discount: 31,
      rating: 4.8,
      reviews: 156,
      timeLeft: '2 days',
      image: '/images/products/deals/gaming-laptop-pro.jpg'
    },
    {
      id: 2,
      title: 'Wireless Headphones',
      originalPrice: 199,
      salePrice: 129,
      discount: 35,
      rating: 4.6,
      reviews: 89,
      timeLeft: '5 hours',
      image: '/images/products/deals/wireless-headphones.jpg'
    },
    {
      id: 3,
      title: 'Smart Watch Series 5',
      originalPrice: 399,
      salePrice: 279,
      discount: 30,
      rating: 4.9,
      reviews: 203,
      timeLeft: '1 day',
      image: '/images/products/deals/smart-watch-series-5.jpg'
    }
  ];

  const handleAddToCart = (deal: any) => {
    addToCart({
      id: deal.id,
      name: deal.title,
      price: deal.salePrice,
      image: deal.image
    });
  };

  const handleWishlistToggle = (deal: any) => {
    if (isInWishlist(deal.id)) {
      removeFromWishlist(deal.id);
    } else {
      addToWishlist({
        id: deal.id,
        name: deal.title,
        price: deal.salePrice,
        image: deal.image
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Best Deals</h1>
          <p className="text-muted-foreground">Limited time offers you don't want to miss</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <Card key={deal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={deal.image} alt={deal.title} className="w-full h-48 object-cover" />
                <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                  -{deal.discount}%
                </Badge>
                <Button 
                  variant={isInWishlist(deal.id) ? "default" : "ghost"} 
                  size="icon" 
                  className="absolute top-3 right-3 bg-background/80 hover:bg-background"
                  onClick={() => handleWishlistToggle(deal)}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist(deal.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{deal.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm ml-1">{deal.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({deal.reviews} reviews)</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-primary">${deal.salePrice}</span>
                    <span className="text-sm text-muted-foreground line-through ml-2">${deal.originalPrice}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {deal.timeLeft} left
                  </div>
                </div>
                <Button className="w-full" onClick={() => handleAddToCart(deal)}>
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

export default Deals;
