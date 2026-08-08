
import React from 'react';
import PageShell from '@/components/layout/PageShell';
import SectionCard from '@/components/layout/SectionCard';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Scale,
  Gavel,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { HUE_STYLES, type Hue } from '@/lib/theme';

const SellerPolicies = () => {
  const policyCategories: {
    icon: typeof Shield;
    title: string;
    description: string;
    badge: string;
    badgeVariant: 'hot' | 'blue' | 'teal' | 'amber';
    hue: Hue;
  }[] = [
    {
      icon: Shield,
      title: 'Account Policies',
      description: 'Guidelines for maintaining your seller account',
      badge: 'Required',
      badgeVariant: 'hot',
      hue: 'rose',
    },
    {
      icon: FileText,
      title: 'Product Policies',
      description: 'Rules for listing and selling products',
      badge: 'Important',
      badgeVariant: 'blue',
      hue: 'blue',
    },
    {
      icon: Users,
      title: 'Customer Service',
      description: 'Standards for customer interactions',
      badge: 'Best Practice',
      badgeVariant: 'teal',
      hue: 'teal',
    },
    {
      icon: AlertTriangle,
      title: 'Prohibited Items',
      description: 'Items that cannot be sold on our platform',
      badge: 'Restricted',
      badgeVariant: 'amber',
      hue: 'amber',
    }
  ];

  const prohibitedItems = [
    'Illegal or regulated items',
    'Counterfeit or replica products',
    'Hazardous materials',
    'Adult content',
    'Weapons and firearms',
    'Stolen goods',
    'Prescription medications',
    'Live animals'
  ];

  const accountRequirements = [
    'Valid government-issued ID',
    'Verified email address and phone number',
    'Accurate business information',
    'Tax identification number (if applicable)',
    'Bank account for payments',
    'Compliance with local laws'
  ];

  const listingGuidelines = [
    {
      title: 'Product Information',
      body: 'All product listings must include accurate titles, descriptions, and images. Misleading information is strictly prohibited and may result in account suspension.',
    },
    {
      title: 'Pricing and Inventory',
      body: 'Prices must be clearly stated and include all applicable fees. Inventory levels should be kept current to avoid overselling.',
    },
    {
      title: 'Images and Media',
      body: 'Product images must be clear, accurate, and owned by you or used with permission. Stock photos should represent the actual product being sold.',
    },
  ];

  const serviceStandards = [
    {
      title: 'Response Times',
      body: 'Respond to customer inquiries within 24 hours. Faster response times improve your seller rating and customer satisfaction.',
    },
    {
      title: 'Order Fulfillment',
      body: 'Ship orders within your stated handling time. Provide tracking information when available and communicate any delays promptly.',
    },
    {
      title: 'Returns and Refunds',
      body: 'Honor your stated return policy and process refunds according to our platform guidelines. Clear return policies help build customer trust.',
    },
  ];

  const consequences: {
    label: string;
    body: string;
    tint: string;
    text: string;
  }[] = [
    {
      label: 'Warning',
      body: 'First-time minor violations result in a warning and guidance.',
      tint: 'bg-brand-amber/10 border-brand-amber/30',
      text: 'text-brand-amber',
    },
    {
      label: 'Suspension',
      body: 'Repeated or serious violations may lead to temporary suspension.',
      tint: 'bg-brand-orange/10 border-brand-orange/30',
      text: 'text-brand-orange',
    },
    {
      label: 'Termination',
      body: 'Severe violations or repeated offenses result in account termination.',
      tint: 'bg-brand-rose/10 border-brand-rose/30',
      text: 'text-brand-rose',
    },
  ];

  return (
    <PageShell>
      {/* Hero */}
      <section className="mb-16 text-center animate-fade-up">
        <span className="eyebrow mb-5 bg-brand-indigo/10 text-brand-indigo">
          <Scale className="h-3.5 w-3.5" />
          The rules
        </span>
        <h1 className="mb-5 text-5xl font-extrabold tracking-tight md:text-6xl">
          Seller{' '}
          <span className="text-gold-ink">Policies</span>
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
          Understanding our policies helps you build a successful business while
          maintaining a safe and trusted marketplace for everyone.
        </p>
      </section>

      {/* Policy Categories */}
      <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {policyCategories.map((category, index) => {
          const s = HUE_STYLES[category.hue];
          const Icon = category.icon;
          return (
            <div
              key={category.title}
              className={cn(
                'card-pop ring-gradient group animate-fade-up p-6 text-center',
                s.tint,
                s.border,
                s.glow
              )}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div
                className={cn(
                  'mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lift-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6',
                  s.gradient
                )}
              >
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mb-1.5 font-bold">{category.title}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{category.description}</p>
              <Badge variant={category.badgeVariant}>{category.badge}</Badge>
            </div>
          );
        })}
      </div>

      {/* Requirements vs prohibited */}
      <div className="mb-16 grid gap-6 md:grid-cols-2">
        <SectionCard title="Account Requirements" description="What you need to sell here" icon={CheckCircle} hue="teal">
          <ul className="space-y-2.5">
            {accountRequirements.map((requirement) => (
              <li
                key={requirement}
                className="flex items-center gap-3 rounded-xl bg-brand-teal/10 px-4 py-2.5 text-sm"
              >
                <CheckCircle className="h-4 w-4 flex-shrink-0 text-brand-teal" />
                {requirement}
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Prohibited Items"
          description="These cannot be listed on VMK Store"
          icon={XCircle}
          hue="rose"
          style={{ animationDelay: '80ms' }}
        >
          <ul className="space-y-2.5">
            {prohibitedItems.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-xl bg-brand-rose/10 px-4 py-2.5 text-sm"
              >
                <XCircle className="h-4 w-4 flex-shrink-0 text-brand-rose" />
                {item}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Detailed Policies */}
      <div className="space-y-6">
        <SectionCard title="Product Listing Guidelines" icon={FileText} hue="blue">
          <div className="space-y-4">
            {listingGuidelines.map(({ title, body }) => (
              <div key={title} className="rounded-2xl bg-muted/60 p-5">
                <h3 className="mb-1.5 font-bold">{title}</h3>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Customer Service Standards" icon={Users} hue="violet">
          <div className="space-y-4">
            {serviceStandards.map(({ title, body }) => (
              <div key={title} className="rounded-2xl bg-muted/60 p-5">
                <h3 className="mb-1.5 font-bold">{title}</h3>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Violation Consequences" icon={Gavel} hue="orange">
          <div className="grid gap-4 md:grid-cols-3">
            {consequences.map(({ label, body, tint, text }) => (
              <div key={label} className={cn('rounded-2xl border-2 p-5 text-center', tint)}>
                <div className={cn('mb-2 text-lg font-extrabold', text)}>{label}</div>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
};

export default SellerPolicies;
