import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Package, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Sellers = () => {
  const { toast } = useToast();
  const [followedSellers, setFollowedSellers] = useState<number[]>([]);

  const topSellers = [
    {
      id: 1,
      name: 'TechWorld Store',
      avatar: '/placeholder.svg',
      rating: 4.9,
      reviews: 2341,
      products: 156,
      followers: 12500,
      location: 'New York, USA',
      verified: true,
      specialties: ['Electronics', 'Gadgets']
    },
    {
      id: 2,
      name: 'Fashion Hub',
      avatar: '/placeholder.svg',
      rating: 4.8,
      reviews: 1876,
      products: 203,
      followers: 8900,
      location: 'Los Angeles, USA',
      verified: true,
      specialties: ['Fashion', 'Accessories']
    }
  ];

  const handleFollowToggle = (sellerId: number, sellerName: string) => {
    const isFollowing = followedSellers.includes(sellerId);
    
    if (isFollowing) {
      setFollowedSellers(prev => prev.filter(id => id !== sellerId));
      toast({
        title: "Unfollowed!",
        description: `You are no longer following ${sellerName}`,
      });
    } else {
      setFollowedSellers(prev => [...prev, sellerId]);
      toast({
        title: "Followed!",
        description: `You are now following ${sellerName}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Top Sellers</h1>
          <p className="text-muted-foreground">Discover our most trusted and popular sellers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topSellers.map((seller) => {
            const isFollowing = followedSellers.includes(seller.id);
            return (
              <Card key={seller.id} className="hover:shadow-lg hover:scale-105 transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={seller.avatar} alt={seller.name} />
                      <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{seller.name}</CardTitle>
                        {seller.verified && (
                          <Badge className="bg-blue-500 text-white text-xs hover:bg-blue-600 transition-colors">Verified</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {seller.rating} ({seller.reviews})
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {seller.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div className="hover:bg-accent/50 rounded-lg p-2 transition-colors">
                      <div className="flex items-center justify-center mb-1">
                        <Package className="h-4 w-4 text-muted-foreground mr-1" />
                      </div>
                      <div className="text-lg font-semibold">{seller.products}</div>
                      <div className="text-xs text-muted-foreground">Products</div>
                    </div>
                    <div className="hover:bg-accent/50 rounded-lg p-2 transition-colors">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-4 w-4 text-muted-foreground mr-1" />
                      </div>
                      <div className="text-lg font-semibold">{seller.followers.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </div>
                    <div className="hover:bg-accent/50 rounded-lg p-2 transition-colors">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="h-4 w-4 text-muted-foreground mr-1" />
                      </div>
                      <div className="text-lg font-semibold">{seller.rating}</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 hover:bg-primary/90 transition-colors" asChild>
                      <Link to={`/products?seller=${encodeURIComponent(seller.name)}`}>
                        View Store
                      </Link>
                    </Button>
                    <Button 
                      variant={isFollowing ? "default" : "outline"}
                      className={`flex-1 transition-colors ${isFollowing ? 'hover:bg-primary/90' : 'hover:bg-accent hover:text-accent-foreground'}`}
                      onClick={() => handleFollowToggle(seller.id, seller.name)}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Sellers;
