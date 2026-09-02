
import React from 'react';
import PageShell from '@/components/layout/PageShell';
import SectionCard from '@/components/layout/SectionCard';
import { Heart, Sparkles, ShieldCheck, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HUE_STYLES, type Hue } from '@/lib/theme';

const About = () => {
  const values: { title: string; body: string; icon: typeof ShieldCheck; hue: Hue }[] = [
    {
      title: 'Trust & Safety',
      body: 'We prioritize the security and trust of our community through verified sellers and secure transactions.',
      icon: ShieldCheck,
      hue: 'teal',
    },
    {
      title: 'Innovation',
      body: 'We continuously improve our platform with cutting-edge technology and user-focused features.',
      icon: Lightbulb,
      hue: 'amber',
    },
    {
      title: 'Community',
      body: 'We foster a supportive community where everyone can learn, grow, and succeed together.',
      icon: Heart,
      hue: 'pink',
    },
  ];

  return (
    <PageShell>
      {/* Hero */}
      <section className="mb-16 text-center animate-fade-up">
        <span className="eyebrow mb-5 bg-brand-violet/10 text-brand-violet">
          <Sparkles className="h-3.5 w-3.5" />
          A marketplace for buyers and sellers
        </span>
        <h1 className="mb-5 text-5xl font-extrabold tracking-tight md:text-6xl">
          About{' '}
          <span className="text-gold-ink">VMK Store</span>
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
          We're building the world's most trusted marketplace where buyers and sellers
          can connect, trade, and grow their businesses with confidence.
        </p>
      </section>

      {/* Mission */}
      <section className="mb-16 grid items-center gap-8 md:grid-cols-2">
        <div className="animate-fade-up">
          <h2 className="mb-5 text-4xl font-extrabold tracking-tight">
            Our{' '}
            <span className="text-gold-ink">Mission</span>
          </h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            At VMK Store, we believe that everyone should have the opportunity to build
            and grow their business online. Our platform provides the tools, support,
            and community needed to succeed in the digital marketplace.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            We're committed to creating a safe, transparent, and efficient trading
            environment that benefits both buyers and sellers.
          </p>
        </div>

        <div className="relative animate-fade-up overflow-hidden rounded-[2rem] bg-brand-wash-animated p-1 shadow-lift">
          <div className="overflow-hidden rounded-[1.75rem] bg-card">
            <img
              src="/placeholder.svg"
              alt="Our Mission"
              className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <SectionCard title="Our Values" description="What we hold ourselves to" icon={Heart} hue="violet">
        <div className="grid gap-5 md:grid-cols-3">
          {values.map(({ title, body, icon: Icon, hue }) => {
            const s = HUE_STYLES[hue];
            return (
              <div
                key={title}
                className={cn('group rounded-2xl p-5 text-center transition-colors', s.tint)}
              >
                <div
                  className={cn(
                    'mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lift-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6',
                    s.gradient
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className={cn('mb-2 font-bold', s.text)}>{title}</h3>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </PageShell>
  );
};

export default About;
