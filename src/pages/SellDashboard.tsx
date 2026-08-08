import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Package,
  Clock,
  DollarSign,
  Users,
  PackagePlus,
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Settings as SettingsIcon,
  Pencil,
  LogIn,
} from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import SectionCard from '@/components/layout/SectionCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { HUE_STYLES, type Hue } from '@/lib/theme';

interface SellerProduct {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  status: string;
  image: string;
}

interface Stats {
  products: number;
  sales: number;
  pending: number;
  views: number;
}

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'destructive' | 'indigo' | 'outline'> = {
  active: 'success',
  pending: 'warning',
  out_of_stock: 'destructive',
  draft: 'indigo',
  archived: 'outline',
};

const SellDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, loading: authLoading } = useAuth();

  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [stats, setStats] = useState<Stats>({ products: 0, sales: 0, pending: 0, views: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (authLoading) return;
      if (!user) {
        setLoading(false);
        return;
      }

      const [{ data: prodRows }, { data: profile }, { data: soldRows }] = await Promise.all([
        supabase
          .from('products')
          .select('id, name, price, stock_quantity, status, product_images(image_url, is_primary)')
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('seller_profiles')
          .select('store_views, total_sales')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase.from('order_items').select('line_total').eq('seller_id', user.id),
      ]);

      if (cancelled) return;

      const rows = (prodRows ?? []) as unknown as (SellerProduct & {
        product_images: { image_url: string; is_primary: boolean }[] | null;
      })[];

      const list: SellerProduct[] = rows.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        stock_quantity: p.stock_quantity,
        status: p.status,
        image:
          [...(p.product_images ?? [])].sort(
            (a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)
          )[0]?.image_url ?? '/placeholder.svg',
      }));

      // Prefer the summed order lines; fall back to the profile total.
      const summed = ((soldRows ?? []) as { line_total: number }[]).reduce(
        (acc, r) => acc + Number(r.line_total ?? 0),
        0
      );
      const prof = profile as { store_views: number; total_sales: number } | null;

      setProducts(list);
      setStats({
        products: list.length,
        sales: summed || Number(prof?.total_sales ?? 0),
        pending: list.filter(p => p.status === 'pending').length,
        views: Number(prof?.store_views ?? 0),
      });
      setLoading(false);
    };

    load().catch(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const statCards: { title: string; value: string; icon: typeof Package; hue: Hue }[] = [
    { title: 'Total Products', value: stats.products.toLocaleString(), icon: Package, hue: 'blue' },
    {
      title: 'Total Sales',
      value: `$${stats.sales.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      hue: 'teal',
    },
    { title: 'Pending Review', value: stats.pending.toLocaleString(), icon: Clock, hue: 'amber' },
    { title: 'Store Views', value: stats.views.toLocaleString(), icon: Users, hue: 'pink' },
  ];

  const TABS = [
    { value: 'products', label: 'My Products' },
    { value: 'orders', label: 'Orders' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'settings', label: 'Settings' },
  ];

  if (!authLoading && !isLoggedIn) {
    return (
      <PageShell>
        <div className="card-pop mx-auto max-w-md p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-brand-gradient text-ink">
            <LogIn className="h-8 w-8" />
          </div>
          <h1 className="mb-2 text-2xl font-extrabold">Sign in to sell</h1>
          <p className="mb-8 text-muted-foreground">
            Your dashboard, listings and sales live with your account.
          </p>
          <Button asChild>
            <Link to="/login?redirect=/sell">Sign In</Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 animate-fade-up md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-ink shadow-lift">
            <LayoutDashboard className="h-7 w-7" />
          </span>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Seller <span className="text-gold-ink">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">Manage your products and track your sales</p>
          </div>
        </div>
        <Button size="lg" asChild>
          <Link to="/sell/new-product">
            <Plus className="h-5 w-5" />
            Add New Product
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const s = HUE_STYLES[stat.hue];
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={cn(
                'card-pop ring-gradient group animate-fade-up p-5',
                s.tint,
                s.border,
                s.glow
              )}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">{stat.title}</span>
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-md text-white shadow-lift-sm transition-transform duration-300 group-hover:scale-110',
                    s.gradient
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <div className={cn('text-3xl font-extrabold', s.text)}>
                {loading ? <span className="inline-block h-8 w-20 animate-pulse rounded bg-muted" /> : stat.value}
              </div>
              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                From your storefront
              </p>
            </div>
          );
        })}
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-lg bg-muted p-1.5 sm:grid-cols-4">
          {TABS.map(t => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="rounded-md py-2 text-sm font-bold data-[state=active]:bg-brand-gradient data-[state=active]:text-ink data-[state=active]:shadow-lift-sm"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="products">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="card-pop p-12 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-lg bg-brand-gradient text-ink shadow-lift">
                <PackagePlus className="h-10 w-10" />
              </div>
              <h2 className="mb-2 text-2xl font-extrabold">No products yet</h2>
              <p className="mb-6 text-muted-foreground">
                You haven't added any products to your store yet.
              </p>
              <Button size="lg" onClick={() => navigate('/sell/new-product')}>
                <Plus className="h-5 w-5" />
                Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((p, i) => (
                <div
                  key={p.id}
                  className="card-pop flex animate-fade-up items-center gap-4 p-4"
                  style={{ animationDelay: `${Math.min(i, 11) * 50}ms` }}
                >
                  <img
                    src={p.image}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/products/${p.id}`}
                      className="font-bold transition-colors hover:text-gold-ink"
                    >
                      {p.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      ${p.price} · {p.stock_quantity} in stock
                    </p>
                  </div>
                  <Badge variant={STATUS_VARIANT[p.status] ?? 'outline'}>
                    {p.status.replace(/_/g, ' ')}
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/sell/edit-product/${p.id}`}>
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders">
          <SectionCard
            title="Recent Orders"
            description="Manage your customer orders and shipping"
            icon={Package}
            hue="blue"
          >
            <div className="py-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-ocean text-white shadow-lift-sm">
                <Package className="h-8 w-8" />
              </div>
              <p className="text-muted-foreground">
                Order management for sellers is not built yet. Buyer-side orders are
                recorded and visible under your account's order history.
              </p>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="analytics">
          <SectionCard
            title="Sales Analytics"
            description="Track your performance and growth"
            icon={BarChart3}
            hue="teal"
          >
            <div className="py-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-mint text-white shadow-lift-sm">
                <BarChart3 className="h-8 w-8" />
              </div>
              <p className="text-muted-foreground">
                Detailed analytics are not built yet. The headline figures above are live.
              </p>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="settings">
          <SectionCard
            title="Store Settings"
            description="Configure your store preferences"
            icon={SettingsIcon}
            hue="amber"
          >
            <div className="py-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-sunrise text-white shadow-lift-sm">
                <SettingsIcon className="h-8 w-8" />
              </div>
              <p className="mb-6 text-muted-foreground">
                Store-level settings are not built yet. Account settings are available now.
              </p>
              <Button variant="outline" asChild>
                <Link to="/settings">Go to account settings</Link>
              </Button>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
};

export default SellDashboard;
