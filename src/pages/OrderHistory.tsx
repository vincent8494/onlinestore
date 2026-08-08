
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import PageHero from '@/components/layout/PageHero';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  Truck,
  Clock,
  RotateCcw,
  XCircle,
  LogIn,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface OrderItem {
  id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  created_at: string;
  items: OrderItem[];
}

/** Status → colour, icon and copy. Covers every value of order_status_enum. */
const STATUS = {
  processing: {
    label: 'Processing',
    icon: Clock,
    badge: 'amber' as const,
    text: 'text-brand-amber',
    tint: 'bg-brand-amber/10',
    bar: 'bg-sunrise',
    glow: 'hover:shadow-glow-amber',
  },
  shipped: {
    label: 'Shipped',
    icon: Truck,
    badge: 'blue' as const,
    text: 'text-brand-blue',
    tint: 'bg-brand-blue/10',
    bar: 'bg-ocean',
    glow: 'hover:shadow-glow-blue',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle2,
    badge: 'success' as const,
    text: 'text-brand-teal',
    tint: 'bg-brand-teal/10',
    bar: 'bg-mint',
    glow: 'hover:shadow-glow-teal',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    badge: 'destructive' as const,
    text: 'text-sale',
    tint: 'bg-sale/10',
    bar: 'bg-sale',
    glow: 'hover:shadow-glow-sale',
  },
  refunded: {
    label: 'Refunded',
    icon: RotateCcw,
    badge: 'violet' as const,
    text: 'text-brand-violet',
    tint: 'bg-brand-violet/10',
    bar: 'bg-candy',
    glow: 'hover:shadow-glow-violet',
  },
};

const statusOf = (status: string) =>
  STATUS[status as keyof typeof STATUS] ?? STATUS.processing;

const OrderHistory = () => {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // Wait for auth to settle before deciding there is nothing to show.
      if (authLoading) return;
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, status, total, created_at,
          order_items(id, product_id, product_name, unit_price, quantity)
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (cancelled) return;

      if (error || !data) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setOrders(
        (data as unknown as (Omit<Order, 'items'> & { order_items: OrderItem[] | null })[]).map(
          o => ({
            id: o.id,
            status: o.status,
            total: o.total,
            created_at: o.created_at,
            items: o.order_items ?? [],
          })
        )
      );
      setLoading(false);
    };

    load().catch(() => {
      if (!cancelled) {
        setOrders([]);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  /** Puts every line of a past order back into the cart. */
  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      for (let n = 0; n < item.quantity; n++) {
        addToCart({
          id: item.product_id ?? item.id,
          name: item.product_name,
          price: item.unit_price,
          image: '/placeholder.svg',
        });
      }
    });
  };

  const backLink = (
    <div className="mb-6 flex items-center gap-3 animate-fade-up">
      <Button variant="soft" size="icon" asChild>
        <Link to="/profile" aria-label="Back to profile">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );

  // Signed out — orders are per-account, so ask for sign-in rather than
  // showing an empty list that looks like lost history.
  if (!authLoading && !isLoggedIn) {
    return (
      <PageShell>
        {backLink}
        <div className="card-pop mx-auto max-w-md p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-brand-gradient text-ink">
            <LogIn className="h-8 w-8" />
          </div>
          <h1 className="mb-2 text-2xl font-extrabold">Sign in to view orders</h1>
          <p className="mb-8 text-muted-foreground">
            Your order history is tied to your account.
          </p>
          <Button asChild>
            <Link to="/login?redirect=/orders">Sign In</Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {backLink}

      <PageHero
        eyebrow={loading ? 'Loading' : `${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`}
        title="Order"
        highlight="History"
        subtitle="Track everything you've bought on VMK Store"
        icon={Package}
        hue="indigo"
      />

      {loading || authLoading ? (
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="card-pop mx-auto max-w-md p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-brand-gradient text-ink">
            <Package className="h-8 w-8" />
          </div>
          <h2 className="mb-2 text-xl font-bold">No orders yet</h2>
          <p className="mb-8 text-muted-foreground">
            Start shopping to see your order history here
          </p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order, i) => {
            const s = statusOf(order.status);
            const StatusIcon = s.icon;
            return (
              <div
                key={order.id}
                className={cn('card-pop animate-fade-up overflow-hidden', s.glow)}
                style={{ animationDelay: `${Math.min(i, 11) * 70}ms` }}
              >
                <div className={cn('h-1.5 w-full', s.bar)} />

                <div className="p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-11 w-11 items-center justify-center rounded-lg', s.tint)}>
                        <StatusIcon className={cn('h-5 w-5', s.text)} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={s.badge}>{s.label}</Badge>
                  </div>

                  <div className="space-y-2">
                    {order.items.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-md bg-muted/50 px-4 py-3"
                      >
                        <div className="min-w-0">
                          {item.product_id ? (
                            <Link
                              to={`/products/${item.product_id}`}
                              className="font-semibold transition-colors hover:text-gold-ink"
                            >
                              {item.product_name}
                            </Link>
                          ) : (
                            <p className="font-semibold">{item.product_name}</p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold">
                          ${(item.unit_price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                    <Button
                      variant="soft"
                      size="sm"
                      onClick={() => handleReorder(order)}
                      disabled={order.items.length === 0}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reorder
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Total:{' '}
                      <span className={cn('text-xl font-extrabold', s.text)}>
                        ${Number(order.total).toFixed(2)}
                      </span>
                    </p>
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

export default OrderHistory;
