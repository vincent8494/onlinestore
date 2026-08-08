import React from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import PageHero from '@/components/layout/PageHero';
import SectionCard from '@/components/layout/SectionCard';
import { Button } from '@/components/ui/button';
import { FileText, Mail, ShieldCheck, Cookie, Scale } from 'lucide-react';
import type { Hue } from '@/lib/theme';

interface LegalPageProps {
  title: string;
  highlight: string;
  eyebrow: string;
  icon: typeof FileText;
  hue: Hue;
  /** Plain, factual notes about what this document will cover. */
  points: { heading: string; body: string }[];
}

/**
 * Shared shell for the policy pages.
 *
 * These deliberately do NOT contain policy text. Publishing invented legal
 * wording would be worse than publishing none — it reads as a binding
 * commitment the operator never agreed to. The pages exist so the footer links
 * resolve, and they say plainly that the document is still being prepared.
 */
const LegalPage = ({ title, highlight, eyebrow, icon, hue, points }: LegalPageProps) => (
  <PageShell>
    <PageHero
      eyebrow={eyebrow}
      title={title}
      highlight={highlight}
      subtitle="This document is being prepared."
      icon={icon}
      hue={hue}
    />

    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-lg border-2 border-gold/40 bg-gold/10 p-5">
        <p className="font-bold">Not yet published</p>
        <p className="mt-1 text-sm text-muted-foreground">
          VMK Store has not published this policy yet. Nothing on this page is a legal
          agreement. If you need this information before it is available, contact us and
          we will answer directly.
        </p>
      </div>

      <SectionCard title="What this will cover" icon={icon} hue={hue}>
        <div className="space-y-4">
          {points.map(({ heading, body }) => (
            <div key={heading} className="rounded-md bg-muted/60 p-5">
              <h2 className="mb-1.5 font-bold">{heading}</h2>
              <p className="text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="card-pop p-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-brand-gradient text-ink">
          <Mail className="h-7 w-7" />
        </div>
        <h2 className="mb-1 text-lg font-bold">Questions in the meantime?</h2>
        <p className="mb-5 text-muted-foreground">
          Email us and a person will get back to you.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <a href="mailto:support@vmkstore.com">support@vmkstore.com</a>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/seller-support">Support centre</Link>
          </Button>
        </div>
      </div>
    </div>
  </PageShell>
);

export const Privacy = () => (
  <LegalPage
    eyebrow="Legal"
    title="Privacy"
    highlight="Policy"
    icon={ShieldCheck}
    hue="teal"
    points={[
      {
        heading: 'Account information',
        body: 'The name and email address you provide when registering, held so you can sign in and so orders can be attributed to you.',
      },
      {
        heading: 'Orders and addresses',
        body: 'Shipping details you enter at checkout, retained against the order so it can be fulfilled and reviewed later.',
      },
      {
        heading: 'Processors',
        body: 'Accounts and application data are stored with Supabase. The site is served through Vercel.',
      },
      {
        heading: 'Your choices',
        body: 'How to request a copy of your data, correct it, or have your account deleted.',
      },
    ]}
  />
);

export const Terms = () => (
  <LegalPage
    eyebrow="Legal"
    title="Terms of"
    highlight="Service"
    icon={Scale}
    hue="indigo"
    points={[
      {
        heading: 'Using the marketplace',
        body: 'What buyers and sellers each agree to when they open an account and transact.',
      },
      {
        heading: 'Listings and prohibited items',
        body: 'Rules for what may be listed. The current working rules are set out on the Seller Policies page.',
      },
      {
        heading: 'Fees',
        body: 'Commission and plan pricing. Current published rates are on the Fees page.',
      },
      {
        heading: 'Disputes and liability',
        body: 'How disputes between buyers and sellers are handled, and the limits of the marketplace’s responsibility.',
      },
    ]}
  />
);

export const Cookies = () => (
  <LegalPage
    eyebrow="Legal"
    title="Cookie"
    highlight="Policy"
    icon={Cookie}
    hue="amber"
    points={[
      {
        heading: 'Essential storage',
        body: 'The site keeps a sign-in session in your browser. Without it you would be signed out on every page load.',
      },
      {
        heading: 'Preferences',
        body: 'Settings such as theme and language are saved to your account when you are signed in.',
      },
      {
        heading: 'Analytics and advertising',
        body: 'VMK Store does not currently run third-party analytics or advertising trackers. This page will be updated before any are introduced.',
      },
    ]}
  />
);

export default LegalPage;
