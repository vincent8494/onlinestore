
import React from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import PageHero from '@/components/layout/PageHero';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Eye, CheckCircle2, Truck, Clock, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const OrderHistory = () => {
  // Mock orders data
  const orders = [
    {
      id: '12345',
      date: '2024-06-10',
      status: 'delivered',
      total: 299.99,
      items: [
        { name: 'Wireless Headphones', quantity: 1, price: 299.99 }
      ]
    },
    {
      id: '12346',
      date: '2024-06-08',
      status: 'shipped',
      total: 149.99,
      items: [
        { name: 'Bluetooth Speaker', quantity: 1, price: 149.99 }
      ]
    },
    {
      id: '12347',
      date: '2024-06-05',
      status: 'processing',
      total: 89.99,
      items: [
        { name: 'Wireless Mouse', quantity: 1, price: 89.99 }
      ]
    }
  ];

  /** Status → colour + icon, so orders scan by colour at a glance. */
  const STATUS = {
    delivered: {
      label: 'Delivered',
      icon: CheckCircle2,
      badge: 'success' as const,
      text: 'text-brand-teal',
      tint: 'bg-brand-teal/10',
      bar: 'bg-mint',
      glow: 'hover:shadow-glow-teal',
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
    processing: {
      label: 'Processing',
      icon: Clock,
      badge: 'amber' as const,
      text: 'text-brand-amber',
      tint: 'bg-brand-amber/10',
      bar: 'bg-sunrise',
      glow: 'hover:shadow-glow-amber',
    },
  };

  const statusOf = (status: string) =>
    STATUS[status as keyof typeof STATUS] ?? STATUS.processing;

  return (
    <PageShell>
      <div className="mb-6 flex items-center gap-3 animate-fade-up">
        <Button variant="soft" size="icon" asChild>
          <Link to="/profile" aria-label="Back to profile">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <PageHero
        eyebrow={`${orders.length} orders`}
        title="Order"
        highlight="History"
        subtitle="Track everything you've bought on VMK Store"
        icon={Package}
        hue="indigo"
      />

      {orders.length === 0 ? (
        <div className="card-pop mx-auto max-w-md p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-ink">
            <Package className="h-8 w-8" />
          </div>
          <h2 className="mb-2 text-xl font-bold">No orders yet</h2>
          <p className="mb-8 text-muted-foreground">
            Start shopping to see your order history here
          </p>
          <Button variant="gradient" asChild>
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
                {/* Status colour bar */}
                <div className={cn('h-1.5 w-full', s.bar)} />

                <div className="p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl', s.tint)}>
                        <StatusIcon className={cn('h-5 w-5', s.text)} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Order #{order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={s.badge}>{s.label}</Badge>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold">${item.price}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3.5 w-3.5" />
                        View Details
                      </Button>
                      {order.status === 'delivered' && (
                        <Button variant="soft" size="sm">
                          <RotateCcw className="h-3.5 w-3.5" />
                          Reorder
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total:{' '}
                      <span className={cn('text-xl font-extrabold', s.text)}>
                        ${order.total}
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
