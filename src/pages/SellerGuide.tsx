
import React from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import { Button } from '@/components/ui/button';
import { CheckCircle, DollarSign, Package, Users, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HUE_STYLES, type Hue } from '@/lib/theme';

const SellerGuide = () => {
  const steps: {
    step: number;
    title: string;
    description: string;
    icon: typeof Users;
    hue: Hue;
  }[] = [
    {
      step: 1,
      title: 'Create Your Seller Account',
      description: 'Sign up and complete your seller profile with business information.',
      icon: Users,
      hue: 'blue',
    },
    {
      step: 2,
      title: 'List Your Products',
      description: 'Add detailed product descriptions, high-quality photos, and competitive pricing.',
      icon: Package,
      hue: 'violet',
    },
    {
      step: 3,
      title: 'Start Selling',
      description: 'Once approved, your products go live and customers can start purchasing.',
      icon: DollarSign,
      hue: 'pink',
    }
  ];

  const benefits = [
    'Reach thousands of potential customers',
    'Low seller fees - only 5% commission',
    'Built-in payment processing',
    'Marketing and promotional tools',
    'Analytics and sales insights',
    'Customer support assistance'
  ];

  return (
    <PageShell>
      {/* Hero */}
      <section className="mb-16 text-center animate-fade-up">
        <span className="eyebrow mb-5 bg-brand-violet/10 text-brand-violet">
          <BookOpen className="h-3.5 w-3.5" />
          Seller resources
        </span>
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight md:text-6xl">
          Seller's{' '}
          <span className="text-gold-ink">Guide</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
          Everything you need to know to start selling successfully on VMK Store
        </p>
        <Button variant="gradient" size="xl" asChild>
          <Link to="/sell">
            Start Selling Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </section>

      {/* Steps */}
      <section className="mb-16">
        <h2 className="mb-10 text-center text-4xl font-extrabold tracking-tight">
          How It{' '}
          <span className="text-gold-ink">Works</span>
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, i) => {
            const s = HUE_STYLES[step.hue];
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className={cn(
                  'card-pop ring-gradient group relative animate-fade-up p-6 text-center',
                  s.tint,
                  s.border,
                  s.glow
                )}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Big ghost step number */}
                <span
                  className={cn(
                    'pointer-events-none absolute right-4 top-2 text-6xl font-extrabold opacity-10',
                    s.text
                  )}
                >
                  {step.step}
                </span>

                <div
                  className={cn(
                    'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lift-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6',
                    s.gradient
                  )}
                >
                  <Icon className="h-8 w-8" />
                </div>
                <div className={cn('mb-1 text-xs font-bold uppercase tracking-widest', s.text)}>
                  Step {step.step}
                </div>
                <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="animate-fade-up">
            <h2 className="mb-6 text-4xl font-extrabold tracking-tight">
              Why Sell on{' '}
              <span className="text-gold-ink">VMK Store?</span>
            </h2>
            <div className="space-y-2.5">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl bg-muted/60 px-4 py-3 transition-colors hover:bg-brand-teal/10"
                >
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-brand-teal" />
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
            </div>
            <Button variant="gradient" size="lg" className="mt-6" asChild>
              <Link to="/register">
                Get Started Today
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="relative animate-fade-up overflow-hidden rounded-[2rem] bg-brand-wash-animated p-10 text-center text-white shadow-lift">
            <div
              aria-hidden
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
            <div className="relative">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-md">
                <TrendingUp className="h-10 w-10" />
              </div>
              <h3 className="mb-2 text-3xl font-extrabold">Growing Marketplace</h3>
              <p className="mb-8 text-white/80">
                Join thousands of successful sellers who trust VMK Store
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-md">
                  <div className="text-3xl font-extrabold">50K+</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-white/70">
                    Active Buyers
                  </div>
                </div>
                <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-md">
                  <div className="text-3xl font-extrabold">1M+</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-white/70">
                    Monthly Views
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default SellerGuide;
