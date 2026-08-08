
import React from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import PageHero from '@/components/layout/PageHero';
import { Button } from '@/components/ui/button';
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingCart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import { styleAt } from '@/lib/theme';

/** Free-shipping threshold. Must match the one Checkout charges against. */
const FREE_SHIPPING_AT = 100;

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md animate-fade-up py-16 text-center">
          <div className="relative mx-auto mb-6 h-24 w-24">
            <div className="absolute inset-0 rounded-full bg-brand-gradient opacity-30 blur-2xl animate-pulse-glow" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-gradient text-ink shadow-lift">
              <ShoppingCart className="h-12 w-12" />
            </div>
          </div>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight">
            Your cart is{' '}
            <span className="text-gold-ink">empty</span>
          </h1>
          <p className="mb-8 text-muted-foreground">Add some products to get started</p>
          <Button variant="gradient" size="lg" asChild>
            <Link to="/products">
              <ShoppingBag className="h-5 w-5" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_AT - totalPrice);
  const shippingProgress = Math.min(100, (totalPrice / FREE_SHIPPING_AT) * 100);

  return (
    <PageShell>
      <div className="mb-6 flex items-center gap-3 animate-fade-up">
        <Button variant="soft" size="icon" asChild>
          <Link to="/products" aria-label="Back to products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <PageHero
        eyebrow={`${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'}`}
        title="Shopping"
        highlight="Cart"
        icon={ShoppingCart}
        hue="blue"
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {cartItems.map((item, i) => {
            const style = styleAt(i);
            return (
              <div
                key={item.id}
                className={cn('card-pop ring-gradient group animate-fade-up p-4', style.glow)}
                style={{ animationDelay: `${Math.min(i, 11) * 50}ms` }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link
                    to={`/products/${item.id}`}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-muted"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <h3 className={cn('font-bold transition-colors', style.groupHoverText)}>
                      <Link to={`/products/${item.id}`}>{item.name}</Link>
                    </h3>
                    <p className={cn('text-xl font-extrabold', style.text)}>${item.price}</p>
                    <p className="text-xs text-muted-foreground">
                      Line total:{' '}
                      <span className="font-bold text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Quantity stepper */}
                    <div className="flex items-center gap-1 rounded-full bg-muted p-1">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-background"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-full text-white transition-transform hover:scale-110',
                          style.bg
                        )}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      aria-label={`Remove ${item.name} from cart`}
                      onClick={() => removeFromCart(item.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-brand-rose/10 hover:text-brand-rose"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div>
          <div className="sticky top-32 animate-fade-up space-y-4">
            <div className="card-pop overflow-hidden">
              <div className="bg-brand-gradient p-5 text-ink">
                <h2 className="text-lg font-bold">Order Summary</h2>
              </div>

              <div className="space-y-4 p-5">
                {/* Free shipping progress */}
                <div className="rounded-2xl bg-brand-teal/10 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-teal">
                    <Truck className="h-4 w-4" />
                    {remainingForFreeShipping > 0 ? (
                      <span>
                        ${remainingForFreeShipping.toFixed(2)} away from free shipping
                      </span>
                    ) : (
                      <span>You've unlocked free shipping! 🎉</span>
                    )}
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-brand-teal/20">
                    <div
                      className="h-full rounded-full bg-mint transition-all duration-500"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold text-brand-teal">
                    {remainingForFreeShipping > 0 ? 'Calculated at checkout' : 'Free'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between border-t pt-4">
                  <span className="font-bold">Total</span>
                  <span className="bg-brand-gradient bg-clip-text text-3xl font-extrabold text-transparent">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <Button variant="gradient" size="lg" className="w-full" asChild>
                  <Link to="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="soft" className="w-full" onClick={clearCart}>
                  <Trash2 className="h-4 w-4" />
                  Clear Cart
                </Button>

                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-teal" />
                  Secure checkout, protected payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Cart;
