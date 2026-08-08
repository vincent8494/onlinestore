
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  ShoppingBag,
  Building2,
  Truck,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

type PaymentMethod = 'card' | 'paypal' | 'google_pay' | 'apple_pay' | 'bank_transfer';

interface ShippingForm {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CardForm {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: React.ReactNode; comingSoon: boolean }[] = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    icon: <CreditCard className="h-5 w-5" />,
    comingSoon: false,
  },
  {
    id: 'paypal',
    label: 'PayPal',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.26-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.477z" />
      </svg>
    ),
    comingSoon: true,
  },
  {
    id: 'google_pay',
    label: 'Google Pay',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
    comingSoon: true,
  },
  {
    id: 'apple_pay',
    label: 'Apple Pay',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    comingSoon: true,
  },
  {
    id: 'bank_transfer',
    label: 'Bank Transfer',
    icon: <Building2 className="h-5 w-5" />,
    comingSoon: true,
  },
];

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('card');
  const [submitting, setSubmitting] = useState(false);

  const [shipping, setShipping] = useState<ShippingForm>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [card, setCard] = useState<CardForm>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });

  const shippingCost = totalPrice >= 100 ? 0 : 4.99;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + shippingCost + tax;

  const formatCard = (value: string) =>
    value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Login required', description: 'Please log in to place an order.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          status: 'processing',
          subtotal: totalPrice,
          shipping_cost: shippingCost,
          tax: parseFloat(tax.toFixed(2)),
          total: parseFloat(orderTotal.toFixed(2)),
          shipping_email: shipping.email,
          shipping_first_name: shipping.firstName,
          shipping_last_name: shipping.lastName,
          shipping_address: shipping.address,
          shipping_city: shipping.city,
          shipping_postal_code: shipping.postalCode,
          shipping_country: shipping.country,
        })
        .select('id')
        .single();

      if (orderError || !order) throw orderError ?? new Error('Failed to create order');

      // 2. Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // 3. Create payment record (pending — gateway coming soon)
      const cardLastFour =
        selectedPayment === 'card' && card.cardNumber
          ? card.cardNumber.replace(/\s/g, '').slice(-4)
          : null;

      const { error: paymentError } = await supabase.from('payments').insert({
        order_id: order.id,
        amount: parseFloat(orderTotal.toFixed(2)),
        status: 'pending',
        payment_method: selectedPayment === 'bank_transfer' ? 'card' : selectedPayment,
        card_last_four: cardLastFour,
      });
      if (paymentError) throw paymentError;

      // 4. Clear cart and redirect
      await clearCart();

      toast({
        title: 'Order placed!',
        description: `Order #${order.id.slice(0, 8).toUpperCase()} saved. Payment gateway integration coming soon — your order is confirmed pending payment.`,
      });
      navigate('/orders');
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Something went wrong', description: err?.message ?? 'Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md animate-fade-up py-16 text-center">
          <div className="relative mx-auto mb-6 h-24 w-24">
            <div className="absolute inset-0 rounded-full bg-brand-gradient opacity-30 blur-2xl animate-pulse-glow" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-gradient text-ink shadow-lift">
              <ShoppingBag className="h-12 w-12" />
            </div>
          </div>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight">
            Your cart is{' '}
            <span className="text-gold-ink">empty</span>
          </h1>
          <p className="mb-8 text-muted-foreground">
            Add some products to proceed with checkout
          </p>
          <Button variant="gradient" size="lg" asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mb-6 flex items-center gap-3 animate-fade-up">
        <Button variant="soft" size="icon" asChild>
          <Link to="/cart" aria-label="Back to cart">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="text-gold-ink">Checkout</span>
          </h1>
        </div>
      </div>

      {/* Step rail */}
      <div className="mb-8 flex items-center gap-2 text-sm font-semibold animate-fade-up">
        <span className="flex items-center gap-1.5 rounded-full bg-brand-teal/10 px-3 py-1 text-brand-teal">
          <Check className="h-3.5 w-3.5" /> Cart
        </span>
        <span className="h-px flex-1 bg-border" />
        <span className="rounded-full bg-brand-gradient px-3 py-1 text-ink shadow-lift-sm">
          Details &amp; Payment
        </span>
        <span className="h-px flex-1 bg-border" />
        <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">Confirmation</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left: Shipping + Payment */}
          <div className="space-y-6 lg:col-span-2">

            {/* Shipping */}
            <div className="card-pop animate-fade-up overflow-hidden">
              <div className="flex items-center gap-3 bg-ocean p-5 text-white">
                <Truck className="h-5 w-5" />
                <h2 className="text-lg font-bold">Shipping Information</h2>
              </div>
              <div className="space-y-4 p-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={shipping.email}
                      onChange={e => setShipping({ ...shipping, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={shipping.firstName}
                        onChange={e => setShipping({ ...shipping, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={shipping.lastName}
                        onChange={e => setShipping({ ...shipping, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Street address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main St, Apt 4B"
                      value={shipping.address}
                      onChange={e => setShipping({ ...shipping, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2 col-span-1">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="Lagos"
                        value={shipping.city}
                        onChange={e => setShipping({ ...shipping, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal code</Label>
                      <Input
                        id="postalCode"
                        placeholder="100001"
                        value={shipping.postalCode}
                        onChange={e => setShipping({ ...shipping, postalCode: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="Nigeria"
                        value={shipping.country}
                        onChange={e => setShipping({ ...shipping, country: e.target.value })}
                        required
                      />
                    </div>
                  </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="card-pop animate-fade-up overflow-hidden" style={{ animationDelay: '80ms' }}>
              <div className="flex items-center gap-3 bg-candy p-5 text-white">
                <CreditCard className="h-5 w-5" />
                <h2 className="text-lg font-bold">Payment Method</h2>
              </div>
              <div className="space-y-3 p-6">
                  {PAYMENT_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => !opt.comingSoon && setSelectedPayment(opt.id)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3.5 transition-all duration-200',
                        selectedPayment === opt.id && !opt.comingSoon
                          ? 'border-brand-violet bg-brand-violet/10 shadow-glow-violet'
                          : opt.comingSoon
                            ? 'cursor-not-allowed border-transparent bg-muted/50 opacity-60'
                            : 'border-border hover:-translate-y-0.5 hover:border-brand-violet/50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
                            selectedPayment === opt.id && !opt.comingSoon
                              ? 'bg-brand-violet text-white'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {opt.icon}
                        </div>
                        <span className="text-sm font-bold">{opt.label}</span>
                      </div>
                      {opt.comingSoon ? (
                        <Badge variant="amber">Coming Soon</Badge>
                      ) : selectedPayment === opt.id ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-violet">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/40" />
                      )}
                    </button>
                  ))}

                  {/* Card fields — shown only when card is selected */}
                  {selectedPayment === 'card' && (
                    <div className="mt-4 space-y-4 pt-4 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="nameOnCard">Name on card</Label>
                        <Input
                          id="nameOnCard"
                          placeholder="John Doe"
                          value={card.nameOnCard}
                          onChange={e => setCard({ ...card, nameOnCard: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={card.cardNumber}
                          onChange={e => setCard({ ...card, cardNumber: formatCard(e.target.value) })}
                          maxLength={19}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={card.expiryDate}
                            onChange={e => setCard({ ...card, expiryDate: formatExpiry(e.target.value) })}
                            maxLength={5}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={card.cvv}
                            onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>
                      <p className="rounded-2xl border border-brand-amber/30 bg-brand-amber/10 p-3 text-xs text-muted-foreground">
                        ⚠️ Payment gateway integration coming soon. Your order details will be saved and you will be contacted to complete payment.
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Right: Order summary */}
          <div>
            <div className="card-pop sticky top-32 animate-fade-up overflow-hidden" style={{ animationDelay: '160ms' }}>
              <div className="bg-brand-gradient p-5 text-ink">
                <h2 className="text-lg font-bold">Order Summary</h2>
                <p className="text-sm text-white/80">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>

              <div className="space-y-4 p-5">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 flex-shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="flex-shrink-0 text-sm font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">
                      {shippingCost === 0 ? (
                        <span className="text-brand-teal">Free</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-baseline justify-between">
                  <span className="font-bold">Total</span>
                  <span className="bg-brand-gradient bg-clip-text text-3xl font-extrabold text-transparent">
                    ${orderTotal.toFixed(2)}
                  </span>
                </div>

                {shippingCost > 0 && (
                  <p className="rounded-xl bg-brand-teal/10 p-2.5 text-center text-xs font-semibold text-brand-teal">
                    Add ${(100 - totalPrice).toFixed(2)} more for free shipping
                  </p>
                )}

                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Placing Order…
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Place Order — ${orderTotal.toFixed(2)}
                    </>
                  )}
                </Button>

                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-teal" />
                  By placing your order you agree to our Terms of Service
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </PageShell>
  );
};

export default Checkout;
