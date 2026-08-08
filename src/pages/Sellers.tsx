import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import PageHero from '@/components/layout/PageHero';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Package, Users, BadgeCheck, Trophy, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { styleAt } from '@/lib/theme';

interface Seller {
  userId: string;
  storeName: string;
  location: string | null;
  avatarUrl: string | null;
  verified: boolean;
  bio: string | null;
  products: number;
  followers: number;
  /** Mean of this seller's product ratings; null when they have none rated. */
  rating: number | null;
}

const Sellers = () => {
  const { toast } = useToast();
  const { user, isLoggedIn } = useAuth();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data: profiles, error } = await supabase
        .from('seller_profiles')
        .select('user_id, store_name, location, avatar_url, is_verified, bio')
        .order('total_sales', { ascending: false })
        .limit(24);

      if (cancelled) return;
      if (error || !profiles) {
        setSellers([]);
        setLoading(false);
        return;
      }

      const rows = profiles as {
        user_id: string;
        store_name: string;
        location: string | null;
        avatar_url: string | null;
        is_verified: boolean;
        bio: string | null;
      }[];
      const ids = rows.map(r => r.user_id);

      // Product counts and ratings, tallied client-side: PostgREST has no
      // plain GROUP BY, and this keeps it to a single extra round trip.
      const productStats: Record<string, { count: number; ratingSum: number; rated: number }> = {};
      if (ids.length) {
        const { data: prods } = await supabase
          .from('products')
          .select('seller_id, average_rating')
          .eq('status', 'active')
          .in('seller_id', ids);

        for (const p of (prods ?? []) as { seller_id: string; average_rating: number | null }[]) {
          const stat = (productStats[p.seller_id] ??= { count: 0, ratingSum: 0, rated: 0 });
          stat.count += 1;
          if (p.average_rating && p.average_rating > 0) {
            stat.ratingSum += p.average_rating;
            stat.rated += 1;
          }
        }
      }

      // Follower counts
      const followerCounts: Record<string, number> = {};
      if (ids.length) {
        const { data: follows } = await supabase
          .from('seller_follows')
          .select('seller_id')
          .in('seller_id', ids);
        for (const f of (follows ?? []) as { seller_id: string }[]) {
          followerCounts[f.seller_id] = (followerCounts[f.seller_id] ?? 0) + 1;
        }
      }

      if (cancelled) return;

      setSellers(
        rows.map(r => {
          const stat = productStats[r.user_id];
          return {
            userId: r.user_id,
            storeName: r.store_name,
            location: r.location,
            avatarUrl: r.avatar_url,
            verified: r.is_verified,
            bio: r.bio,
            products: stat?.count ?? 0,
            followers: followerCounts[r.user_id] ?? 0,
            rating: stat && stat.rated > 0 ? stat.ratingSum / stat.rated : null,
          };
        })
      );
      setLoading(false);
    };

    load().catch(() => {
      if (!cancelled) {
        setSellers([]);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Which of these the signed-in user already follows
  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setFollowed(new Set());
      return;
    }

    supabase
      .from('seller_follows')
      .select('seller_id')
      .eq('follower_id', user.id)
      .then(({ data }) => {
        if (cancelled || !data) return;
        setFollowed(new Set((data as { seller_id: string }[]).map(f => f.seller_id)));
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleFollowToggle = async (seller: Seller) => {
    if (!isLoggedIn || !user) {
      toast({
        title: 'Sign in required',
        description: 'Log in to follow sellers.',
        variant: 'destructive',
      });
      return;
    }

    const isFollowing = followed.has(seller.userId);

    // Optimistic — reverted below if the write fails.
    setFollowed(prev => {
      const next = new Set(prev);
      if (isFollowing) next.delete(seller.userId);
      else next.add(seller.userId);
      return next;
    });
    setSellers(prev =>
      prev.map(s =>
        s.userId === seller.userId
          ? { ...s, followers: s.followers + (isFollowing ? -1 : 1) }
          : s
      )
    );

    const { error } = isFollowing
      ? await supabase
          .from('seller_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('seller_id', seller.userId)
      : await supabase
          .from('seller_follows')
          .insert({ follower_id: user.id, seller_id: seller.userId });

    if (error) {
      setFollowed(prev => {
        const next = new Set(prev);
        if (isFollowing) next.add(seller.userId);
        else next.delete(seller.userId);
        return next;
      });
      setSellers(prev =>
        prev.map(s =>
          s.userId === seller.userId
            ? { ...s, followers: s.followers + (isFollowing ? 1 : -1) }
            : s
        )
      );
      toast({
        title: 'Something went wrong',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: isFollowing ? 'Unfollowed' : 'Followed!',
      description: isFollowing
        ? `You are no longer following ${seller.storeName}`
        : `You are now following ${seller.storeName}`,
    });
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

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : sellers.length === 0 ? (
        <div className="card-pop mx-auto max-w-md p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-brand-gradient text-ink">
            <Trophy className="h-8 w-8" />
          </div>
          <h2 className="mb-2 text-xl font-bold">No sellers yet</h2>
          <p className="mb-8 text-muted-foreground">
            Storefronts will appear here as sellers join the marketplace.
          </p>
          <Button asChild>
            <Link to="/register">Become a seller</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {sellers.map((seller, i) => {
            const isFollowing = followed.has(seller.userId);
            const style = styleAt(i);
            return (
              <div
                key={seller.userId}
                className={cn('card-pop ring-gradient group animate-fade-up overflow-hidden', style.glow)}
                style={{ animationDelay: `${Math.min(i, 11) * 70}ms` }}
              >
                <div className={cn('h-20', style.gradient)} />

                <div className="px-6 pb-6">
                  <div className="-mt-10 mb-4 flex items-start gap-4">
                    <Avatar className="h-20 w-20 shrink-0 ring-4 ring-background">
                      <AvatarImage src={seller.avatarUrl ?? undefined} alt={seller.storeName} />
                      <AvatarFallback className={cn(style.bg, 'text-2xl font-extrabold text-white')}>
                        {seller.storeName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 pt-11">
                      <div className="mb-1 flex items-center gap-1.5">
                        <h2 className={cn('truncate text-lg font-bold transition-colors', style.groupHoverText)}>
                          {seller.storeName}
                        </h2>
                        {seller.verified && (
                          <BadgeCheck className={cn('h-5 w-5 shrink-0', style.text)} />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        {seller.rating !== null && (
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-brand-amber text-brand-amber" />
                            {seller.rating.toFixed(1)}
                          </span>
                        )}
                        {seller.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {seller.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {seller.bio && (
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{seller.bio}</p>
                  )}

                  <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                    {[
                      { icon: Package, value: seller.products.toLocaleString(), label: 'Products' },
                      { icon: Users, value: seller.followers.toLocaleString(), label: 'Followers' },
                      {
                        icon: Star,
                        value: seller.rating !== null ? seller.rating.toFixed(1) : '—',
                        label: 'Rating',
                      },
                    ].map(({ icon: Icon, value, label }) => (
                      <div key={label} className={cn('rounded-lg p-3 transition-colors', style.tint)}>
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
                      <Link to={`/products?seller=${encodeURIComponent(seller.storeName)}`}>
                        View Store
                      </Link>
                    </Button>
                    <Button
                      variant={isFollowing ? 'default' : 'outline'}
                      className={cn(
                        'flex-1',
                        isFollowing && 'bg-sale text-white hover:bg-sale/90'
                      )}
                      onClick={() => handleFollowToggle(seller)}
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
      )}
    </PageShell>
  );
};

export default Sellers;
