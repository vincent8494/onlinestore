import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import SectionCard from '@/components/layout/SectionCard';
import { cn } from '@/lib/utils';
import { HUE_STYLES, type Hue } from '@/lib/theme';

const SellDashboard = () => {
  const navigate = useNavigate();

  const stats: {
    title: string;
    value: string;
    icon: typeof Package;
    change: string;
    hue: Hue;
  }[] = [
    { title: 'Total Products', value: '24', icon: Package, change: '+2 this week', hue: 'blue' },
    { title: 'Total Sales', value: '$3,247', icon: DollarSign, change: '+15.3% from last month', hue: 'teal' },
    { title: 'Pending Reviews', value: '8', icon: Clock, change: '3 new today', hue: 'amber' },
    { title: 'Store Views', value: '1,432', icon: Users, change: '+8.2% this week', hue: 'pink' },
  ];

  const handleAddProduct = () => {
    navigate('/sell/new-product');
  };

  const TABS = [
    { value: 'products', label: 'My Products' },
    { value: 'orders', label: 'Orders' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'settings', label: 'Settings' },
  ];

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 animate-fade-up md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-ink shadow-lift">
            <LayoutDashboard className="h-7 w-7" />
          </span>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Seller{' '}
              <span className="text-gold-ink">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">Manage your products and track your sales</p>
          </div>
        </div>
        <Button variant="gradient" size="lg" asChild>
          <Link to="/sell/new-product">
            <Plus className="h-5 w-5" />
            Add New Product
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
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
                    'flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lift-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6',
                    s.gradient
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <div className={cn('text-3xl font-extrabold', s.text)}>{stat.value}</div>
              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl bg-muted p-1.5 sm:grid-cols-4">
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

        <TabsContent value="products">
          <div className="card-pop p-12 text-center">
            <div className="relative mx-auto mb-5 h-20 w-20">
              <div className="absolute inset-0 rounded-3xl bg-brand-gradient opacity-30 blur-2xl animate-pulse-glow" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-gradient text-ink shadow-lift">
                <PackagePlus className="h-10 w-10" />
              </div>
            </div>
            <h3 className="mb-2 text-2xl font-extrabold">No products yet</h3>
            <p className="mb-6 text-muted-foreground">
              You haven't added any products to your store yet.
            </p>
            <Button variant="gradient" size="lg" onClick={handleAddProduct}>
              <Plus className="h-5 w-5" />
              Add Your First Product
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <SectionCard
            title="Recent Orders"
            description="Manage your customer orders and shipping"
            icon={Package}
            hue="blue"
          >
            <div className="py-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ocean text-white shadow-lift-sm">
                <Package className="h-8 w-8" />
              </div>
              <p className="text-muted-foreground">
                No orders yet. Your orders will appear here once customers start purchasing.
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-mint text-white shadow-lift-sm">
                <BarChart3 className="h-8 w-8" />
              </div>
              <p className="text-muted-foreground">
                Analytics dashboard coming soon. Get detailed insights about your sales performance.
              </p>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="settings">
          <SectionCard
            title="Store Settings"
            description="Configure your store preferences and policies"
            icon={SettingsIcon}
            hue="amber"
          >
            <div className="py-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sunrise text-white shadow-lift-sm">
                <SettingsIcon className="h-8 w-8" />
              </div>
              <p className="text-muted-foreground">
                Store settings and configuration options will be available here.
              </p>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
};

export default SellDashboard;
