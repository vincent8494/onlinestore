import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import PageHero from '@/components/layout/PageHero';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Package, Users, BadgeCheck, Trophy, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { styleAt } from '@/lib/theme';

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
    <PageShell>
      <PageHero
        eyebrow="Community"
        title="Top"
        highlight="Sellers"
        subtitle="Discover our most trusted and popular sellers"
        icon={Trophy}
        hue="teal"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {topSellers.map((seller, i) => {
          const isFollowing = followedSellers.includes(seller.id);
          const style = styleAt(i);
          return (
            <div
              key={seller.id}
              className={cn('card-pop ring-gradient group animate-fade-up overflow-hidden', style.glow)}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              {/* Colour banner */}
              <div className={cn('h-20', style.gradient)} />

              <div className="px-6 pb-6">
                <div className="-mt-10 mb-4 flex items-start gap-4">
                  <Avatar className="h-20 w-20 shrink-0 ring-4 ring-background">
                    <AvatarImage src={seller.avatar} alt={seller.name} />
                    <AvatarFallback className={cn(style.bg, 'text-2xl font-extrabold text-white')}>
                      {seller.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 pt-11">
                    <div className="mb-1 flex items-center gap-1.5">
                      <h3 className={cn('truncate text-lg font-bold transition-colors', style.groupHoverText)}>
                        {seller.name}
                      </h3>
                      {seller.verified && (
                        <BadgeCheck className={cn('h-5 w-5 shrink-0', style.text)} />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-brand-amber text-brand-amber" />
                        {seller.rating} ({seller.reviews})
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {seller.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specialty chips */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {seller.specialties.map(sp => (
                    <span
                      key={sp}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-bold',
                        style.tint,
                        style.text
                      )}
                    >
                      {sp}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                  {[
                    { icon: Package, value: seller.products, label: 'Products' },
                    { icon: Users, value: seller.followers.toLocaleString(), label: 'Followers' },
                    { icon: Star, value: seller.rating, label: 'Rating' },
                  ].map(({ icon: Icon, value, label }) => (
                    <div key={label} className={cn('rounded-2xl p-3 transition-colors', style.tint)}>
                      <Icon className={cn('mx-auto mb-1 h-4 w-4', style.text)} />
                      <div className="text-lg font-extrabold">{value}</div>
                      <div className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button className={cn('flex-1 text-white', style.bg)} asChild>
                    <Link to={`/products?seller=${encodeURIComponent(seller.name)}`}>
                      View Store
                    </Link>
                  </Button>
                  <Button
                    variant={isFollowing ? 'default' : 'outline'}
                    className={cn(
                      'flex-1',
                      isFollowing
                        ? 'bg-brand-pink text-white hover:bg-brand-pink/90'
                        : 'hover:border-brand-pink hover:text-brand-pink'
                    )}
                    onClick={() => handleFollowToggle(seller.id, seller.name)}
                  >
                    <Heart className={cn('h-4 w-4', isFollowing && 'fill-current')} />
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
};

export default Sellers;
