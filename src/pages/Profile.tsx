
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import PageShell from '@/components/layout/PageShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Settings, ShoppingBag, Heart, Star, Users, Loader2, BadgeCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { styleAt } from '@/lib/theme';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: ''
  });

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update your profile.',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }

    setIsLoading(true);

    try {
      // The signed-in user is derived from the Supabase session's user_metadata,
      // so updating that is what actually persists a profile change — and it
      // fires onAuthStateChange, which refreshes the context for us.
      const emailChanged = formData.email !== user.email;

      const { error } = await supabase.auth.updateUser({
        ...(emailChanged ? { email: formData.email } : {}),
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
        },
      });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: emailChanged
          ? 'Profile updated. Check your inbox to confirm the new email address.'
          : 'Your profile has been updated.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update profile. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [followedSellers, setFollowedSellers] = useState([
    {
      id: '1',
      name: 'TechWorld Store',
      avatar: '/placeholder.svg',
      rating: 4.9,
      followers: 12500,
      verified: true,
      storeSlug: 'techworld-store'
    },
    {
      id: '2',
      name: 'Fashion Hub',
      avatar: '/placeholder.svg',
      rating: 4.8,
      followers: 8900,
      verified: true,
      storeSlug: 'fashion-hub'
    }
  ]);

  const handleViewStore = (storeName: string) => {
    // There is no /store/:slug route; the marketplace surfaces a seller's
    // listings through the products page, same as every other seller link.
    navigate(`/products?seller=${encodeURIComponent(storeName)}`);
  };

  const handleUnfollowSeller = (sellerId: string) => {
    setFollowedSellers(prevSellers => 
      prevSellers.filter(seller => seller.id !== sellerId)
    );
    
    // In a real app, you would also update this in your database/backend
    toast({
      title: 'Success',
      description: 'You have unfollowed this seller.',
    });
  };

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || 'VM';

  /** Empty-state block shared by the Orders / Wishlist / Settings tabs. */
  const EmptyTab = ({
    icon: Icon,
    title,
    body,
    gradient,
  }: {
    icon: typeof ShoppingBag;
    title: string;
    body: string;
    gradient: string;
  }) => (
    <div className="py-10 text-center">
      <div
        className={cn(
          'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lift-sm',
          gradient
        )}
      >
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="mb-1 text-lg font-bold">{title}</h3>
      <p className="text-muted-foreground">{body}</p>
    </div>
  );

  const TABS = [
    { value: 'profile', label: 'Profile' },
    { value: 'orders', label: 'Orders' },
    { value: 'wishlist', label: 'Wishlist' },
    { value: 'following', label: 'Following' },
    { value: 'settings', label: 'Settings' },
  ];

  return (
    <PageShell>
      {/* Profile banner */}
      <div className="card-pop mb-8 animate-fade-up overflow-hidden">
        <div className="relative h-32 bg-brand-wash-animated">
          <div
            aria-hidden
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>
        <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end">
          <div className="-mt-12 shrink-0">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-gradient text-3xl font-extrabold text-ink shadow-lift ring-4 ring-background">
              {initials}
            </div>
          </div>
          <div className="flex-1 sm:pb-1">
            <h1 className="text-3xl font-extrabold tracking-tight">
              {user?.firstName || 'My'}{' '}
              <span className="text-gold-ink">
                {user?.lastName || 'Profile'}
              </span>
            </h1>
            <p className="text-muted-foreground">
              {user?.email || 'Manage your account settings and preferences'}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl bg-muted p-1.5 sm:grid-cols-5">
          {TABS.map(t => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="rounded-xl py-2 text-sm font-bold data-[state=active]:bg-brand-gradient data-[state=active]:text-ink data-[state=active]:shadow-lift-sm"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile">
          <div className="card-pop overflow-hidden">
            <div className="flex items-center gap-3 bg-ocean p-5 text-white">
              <User className="h-5 w-5" />
              <div>
                <h2 className="text-lg font-bold">Personal Information</h2>
                <p className="text-sm text-white/80">Update your personal details</p>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="h-12 rounded-xl border-2"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="h-12 rounded-xl border-2"
                      required
                    />
                  </div>
                </div>
                <div className="mb-6 space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-12 rounded-xl border-2"
                    required
                  />
                </div>
                <Button type="submit" variant="gradient" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="card-pop p-6">
            <EmptyTab
              icon={ShoppingBag}
              title="No orders yet"
              body="Start shopping to see your order history here."
              gradient="bg-ocean"
            />
          </div>
        </TabsContent>

        <TabsContent value="wishlist">
          <div className="card-pop p-6">
            <EmptyTab
              icon={Heart}
              title="No saved items yet"
              body="Browse products and add them to your wishlist."
              gradient="bg-candy"
            />
          </div>
        </TabsContent>

        <TabsContent value="following">
          <div className="card-pop overflow-hidden">
            <div className="flex items-center gap-3 bg-mint p-5 text-white">
              <Users className="h-5 w-5" />
              <div>
                <h2 className="text-lg font-bold">Followed Sellers</h2>
                <p className="text-sm text-white/80">Sellers you're currently following</p>
              </div>
            </div>
            <div className="p-6">
              {followedSellers.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {followedSellers.map((seller, i) => {
                    const style = styleAt(i);
                    return (
                      <div
                        key={seller.id}
                        className={cn('card-pop group p-4', style.tint, style.border, style.glow)}
                      >
                        <div className="mb-3 flex items-center gap-3">
                          <Avatar className={cn('h-12 w-12 ring-2', style.border)}>
                            <AvatarImage src={seller.avatar} alt={seller.name} />
                            <AvatarFallback className={cn(style.bg, 'font-bold text-white')}>
                              {seller.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h3 className="truncate text-sm font-bold">{seller.name}</h3>
                              {seller.verified && (
                                <BadgeCheck className={cn('h-4 w-4 shrink-0', style.text)} />
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-brand-amber text-brand-amber" />
                                {seller.rating}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {seller.followers.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className={cn('flex-1 text-white', style.bg)}
                            onClick={() => handleViewStore(seller.name)}
                          >
                            View Store
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 hover:border-brand-rose hover:text-brand-rose"
                            onClick={() => handleUnfollowSeller(seller.id)}
                          >
                            Unfollow
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyTab
                  icon={Users}
                  title="Not following anyone yet"
                  body="Browse sellers and start following them."
                  gradient="bg-mint"
                />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="card-pop p-6">
            <EmptyTab
              icon={Settings}
              title="Account settings"
              body="Account settings will be available here."
              gradient="bg-sunrise"
            />
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
};

export default Profile;
