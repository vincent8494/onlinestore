
import React from 'react';
import PageShell from '@/components/layout/PageShell';
import SectionCard from '@/components/layout/SectionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Book,
  Users,
  LifeBuoy,
  Send,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { HUE_STYLES, type Hue } from '@/lib/theme';

const SellerSupport = () => {
  const supportOptions: {
    icon: typeof MessageCircle;
    title: string;
    description: string;
    availability: string;
    action: string;
    hue: Hue;
  }[] = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: '24/7',
      action: 'Start Chat',
      hue: 'blue',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with a support specialist',
      availability: 'Mon-Fri 9AM-6PM',
      action: 'Call Now',
      hue: 'violet',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message about your issue',
      availability: 'Response within 24 hours',
      action: 'Send Email',
      hue: 'pink',
    }
  ];

  const resources: {
    icon: typeof Book;
    title: string;
    description: string;
    hue: Hue;
  }[] = [
    {
      icon: Book,
      title: 'Knowledge Base',
      description: 'Browse our comprehensive help articles',
      hue: 'teal',
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Connect with other sellers and share experiences',
      hue: 'amber',
    },
    {
      icon: Clock,
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides to master the platform',
      hue: 'cyan',
    }
  ];

  const inputClass = 'h-12 rounded-xl border-2';

  return (
    <PageShell>
      {/* Hero */}
      <section className="mb-16 text-center animate-fade-up">
        <span className="eyebrow mb-5 bg-brand-cyan/10 text-brand-cyan">
          <LifeBuoy className="h-3.5 w-3.5" />
          We're here to help
        </span>
        <h1 className="mb-5 text-5xl font-extrabold tracking-tight md:text-6xl">
          Seller{' '}
          <span className="text-gold-ink">Support</span>
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
          We're here to help you succeed. Get the support you need, when you need it,
          from our dedicated team of experts.
        </p>
      </section>

      {/* Support Options */}
      <div className="mb-16 grid gap-6 md:grid-cols-3">
        {supportOptions.map((option, index) => {
          const s = HUE_STYLES[option.hue];
          const Icon = option.icon;
          return (
            <div
              key={option.title}
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
              <h3 className="mb-1.5 font-bold">{option.title}</h3>
              <p className="mb-3 text-sm text-muted-foreground">{option.description}</p>
              <span
                className={cn(
                  'mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold',
                  s.bg,
                  'text-white'
                )}
              >
                {option.availability}
              </span>
              <Button className={cn('w-full text-white', s.bg)}>{option.action}</Button>
            </div>
          );
        })}
      </div>

      {/* Contact + hours */}
      <div className="mb-16 grid gap-6 md:grid-cols-2">
        <SectionCard
          title="Send Us a Message"
          description="We'll get back to you within 24 hours"
          icon={Send}
          hue="violet"
        >
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="First Name" className={inputClass} />
              <Input placeholder="Last Name" className={inputClass} />
            </div>
            <Input placeholder="Email Address" type="email" className={inputClass} />
            <Input placeholder="Subject" className={inputClass} />
            <Textarea
              placeholder="Describe your issue or question..."
              rows={6}
              className="rounded-xl border-2"
            />
            <Button variant="gradient" size="lg" className="w-full">
              <Send className="h-4 w-4" />
              Send Message
            </Button>
          </form>
        </SectionCard>

        <SectionCard
          title="Support Hours"
          description="When you can reach each channel"
          icon={Clock}
          hue="teal"
          style={{ animationDelay: '80ms' }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-brand-teal/10 px-4 py-3">
              <span className="font-bold">Live Chat</span>
              <Badge variant="success">24/7</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3">
              <span className="font-bold">Phone Support</span>
              <span className="text-sm text-muted-foreground">Mon-Fri 9AM-6PM EST</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3">
              <span className="font-bold">Email Support</span>
              <span className="text-sm text-muted-foreground">24 hour response</span>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border-2 border-brand-rose/30 bg-brand-rose/10 p-5">
            <h3 className="mb-1.5 flex items-center gap-2 font-bold text-brand-rose">
              <Zap className="h-4 w-4" />
              Emergency Support
            </h3>
            <p className="text-sm text-muted-foreground">
              For urgent issues affecting your sales, we provide priority support
              to get you back up and running quickly.
            </p>
          </div>
        </SectionCard>
      </div>

      {/* Self-Help Resources */}
      <section>
        <h2 className="mb-10 text-center text-4xl font-extrabold tracking-tight">
          Self-Help{' '}
          <span className="text-gold-ink">Resources</span>
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {resources.map((resource, index) => {
            const s = HUE_STYLES[resource.hue];
            const Icon = resource.icon;
            return (
              <div
                key={resource.title}
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
                <h3 className="mb-1.5 font-bold">{resource.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{resource.description}</p>
                <Button variant="outline" className="w-full">
                  Browse Now
                </Button>
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
};

export default SellerSupport;
