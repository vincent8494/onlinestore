
import React from 'react';
import PageShell from '@/components/layout/PageShell';
import SectionCard from '@/components/layout/SectionCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, CreditCard, Truck, Shield, Tag, HelpCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { HUE_STYLES, type Hue } from '@/lib/theme';

const Fees = () => {
  const pricingPlans: {
    name: string;
    price: string;
    description: string;
    features: string[];
    popular: boolean;
    hue: Hue;
  }[] = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for getting started',
      features: [
        'Up to 10 product listings',
        '2.9% transaction fee',
        'Basic seller tools',
        'Email support',
        'Standard listing visibility'
      ],
      popular: false,
      hue: 'teal',
    },
    {
      name: 'Professional',
      price: '$29/month',
      description: 'For growing businesses',
      features: [
        'Up to 100 product listings',
        '2.4% transaction fee',
        'Advanced analytics',
        'Priority support',
        'Enhanced listing visibility',
        'Bulk upload tools',
        'Custom store branding'
      ],
      popular: true,
      hue: 'violet',
    },
    {
      name: 'Enterprise',
      price: '$99/month',
      description: 'For large-scale operations',
      features: [
        'Unlimited product listings',
        '1.9% transaction fee',
        'Advanced seller tools',
        'Dedicated account manager',
        'Premium listing placement',
        'API access',
        'Custom integrations',
        'White-label options'
      ],
      popular: false,
      hue: 'amber',
    }
  ];

  const additionalFees: {
    icon: typeof CreditCard;
    title: string;
    description: string;
    fee: string;
    hue: Hue;
  }[] = [
    {
      icon: CreditCard,
      title: 'Payment Processing',
      description: 'Standard payment processing fees apply',
      fee: '2.9% + $0.30 per transaction',
      hue: 'blue',
    },
    {
      icon: Truck,
      title: 'Shipping Labels',
      description: 'Discounted shipping rates available',
      fee: 'Up to 20% off retail rates',
      hue: 'pink',
    },
    {
      icon: Shield,
      title: 'Seller Protection',
      description: 'Optional seller protection coverage',
      fee: '0.5% of transaction value',
      hue: 'teal',
    }
  ];

  const FAQ = [
    {
      q: 'When are fees charged?',
      a: 'Fees are automatically deducted when a sale is completed and payment is processed.',
    },
    {
      q: 'Can I change my plan anytime?',
      a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
    },
    {
      q: 'Are there any setup fees?',
      a: 'No, there are no setup fees or monthly minimums. You only pay for what you sell.',
    },
  ];

  return (
    <PageShell>
      {/* Hero */}
      <section className="mb-16 text-center animate-fade-up">
        <span className="eyebrow mb-5 bg-brand-amber/10 text-brand-amber">
          <Tag className="h-3.5 w-3.5" />
          Pricing
        </span>
        <h1 className="mb-5 text-5xl font-extrabold tracking-tight md:text-6xl">
          Transparent{' '}
          <span className="text-gold-ink">Pricing</span>
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
          Choose the plan that fits your business. No hidden fees, no surprises.
          Start free and upgrade as you grow.
        </p>
      </section>

      {/* Pricing Plans */}
      <div className="mb-20 grid gap-6 md:grid-cols-3">
        {pricingPlans.map((plan, index) => {
          const s = HUE_STYLES[plan.hue];
          return (
            <div
              key={plan.name}
              className={cn(
                'card-pop ring-gradient group relative animate-fade-up p-6',
                s.tint,
                s.border,
                s.glow,
                // Lift the popular plan out of the row
                plan.popular && 'md:-translate-y-4 md:scale-[1.03]'
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {plan.popular && (
                <Badge
                  variant="gradient"
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1"
                >
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </Badge>
              )}

              <div className="mb-6 text-center">
                <h3 className="text-2xl font-extrabold">{plan.name}</h3>
                <div className={cn('my-2 text-4xl font-extrabold', s.text)}>{plan.price}</div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="mb-6 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className={cn('mt-0.5 h-4 w-4 flex-shrink-0', s.text)} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn('w-full', plan.popular ? '' : cn(s.bg, 'text-white'))}
                variant={plan.popular ? 'gradient' : 'default'}
                size="lg"
                asChild
              >
                <Link to="/sell">Get Started</Link>
              </Button>
            </div>
          );
        })}
      </div>

      {/* Additional Services */}
      <section className="mb-16">
        <h2 className="mb-10 text-center text-4xl font-extrabold tracking-tight">
          Additional{' '}
          <span className="text-gold-ink">Services</span>
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {additionalFees.map((service, index) => {
            const s = HUE_STYLES[service.hue];
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className={cn(
                  'card-pop ring-gradient group animate-fade-up p-6 text-center',
                  s.tint,
                  s.border,
                  s.glow
                )}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div
                  className={cn(
                    'mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lift-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6',
                    s.gradient
                  )}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-1.5 font-bold">{service.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{service.description}</p>
                <span
                  className={cn(
                    'inline-block rounded-full px-3 py-1 text-xs font-bold',
                    s.bg,
                    'text-white'
                  )}
                >
                  {service.fee}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <SectionCard
        title="Frequently Asked Questions"
        description="The short answers to what sellers ask most"
        icon={HelpCircle}
        hue="indigo"
      >
        <div className="space-y-4">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="rounded-2xl bg-muted/60 p-5">
              <h3 className="mb-1.5 font-bold">{q}</h3>
              <p className="text-sm text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </PageShell>
  );
};

export default Fees;
