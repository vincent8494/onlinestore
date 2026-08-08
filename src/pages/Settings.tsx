
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import PageHero from '@/components/layout/PageHero';
import SectionCard from '@/components/layout/SectionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Bell, Lock, User, Palette, Sun, Moon, Monitor, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Settings = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: true
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved!",
      description: "Your settings have been updated successfully.",
    });
  };

  const labelClass = 'text-xs font-bold uppercase tracking-wider text-muted-foreground';
  const inputClass = 'h-12 rounded-xl border-2';

  /** Notification rows, each with its own hue. */
  const NOTIFICATION_ROWS = [
    {
      key: 'email' as const,
      label: 'Email Notifications',
      body: 'Receive notifications via email',
      tint: 'bg-brand-blue/10',
      text: 'text-brand-blue',
    },
    {
      key: 'push' as const,
      label: 'Push Notifications',
      body: 'Receive push notifications in your browser',
      tint: 'bg-brand-violet/10',
      text: 'text-brand-violet',
    },
    {
      key: 'sms' as const,
      label: 'SMS Notifications',
      body: 'Receive notifications via SMS',
      tint: 'bg-brand-teal/10',
      text: 'text-brand-teal',
    },
    {
      key: 'marketing' as const,
      label: 'Marketing Communications',
      body: 'Receive promotional emails and offers',
      tint: 'bg-brand-pink/10',
      text: 'text-brand-pink',
    },
  ];

  const THEMES = [
    { label: 'Light', icon: Sun, swatch: 'bg-white border-2', text: 'hover:text-brand-amber hover:border-brand-amber' },
    { label: 'Dark', icon: Moon, swatch: 'bg-[hsl(236_44%_10%)]', text: 'hover:text-brand-violet hover:border-brand-violet' },
    { label: 'Auto', icon: Monitor, swatch: 'bg-brand-gradient', text: 'hover:text-brand-cyan hover:border-brand-cyan' },
  ];

  const TABS = [
    { value: 'account', label: 'Account' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'privacy', label: 'Privacy' },
    { value: 'appearance', label: 'Appearance' },
  ];

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
        eyebrow="Preferences"
        title="Your"
        highlight="Settings"
        subtitle="Control your account, alerts, privacy and look"
        icon={Palette}
        hue="violet"
      />

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl bg-muted p-1.5 sm:grid-cols-4">
          {TABS.map(t => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="rounded-xl py-2 text-sm font-bold data-[state=active]:bg-brand-gradient data-[state=active]:text-ink data-[state=active]:shadow-lift-sm"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Account */}
        <TabsContent value="account">
          <SectionCard
            title="Account Settings"
            description="Manage your account information"
            icon={User}
            hue="blue"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className={labelClass}>First Name</Label>
                  <Input id="firstName" defaultValue="John" className={inputClass} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className={labelClass}>Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" className={inputClass} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className={labelClass}>Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className={labelClass}>Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className={inputClass} />
              </div>
              <Button variant="gradient" onClick={handleSaveSettings}>Save Changes</Button>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <SectionCard
            title="Notification Preferences"
            description="Choose how you want to receive notifications"
            icon={Bell}
            hue="amber"
          >
            <div className="space-y-3">
              {NOTIFICATION_ROWS.map(row => (
                <div
                  key={row.key}
                  className={cn(
                    'flex items-center justify-between gap-4 rounded-2xl p-4 transition-colors',
                    row.tint
                  )}
                >
                  <div className="min-w-0">
                    <Label className={cn('font-bold', row.text)}>{row.label}</Label>
                    <p className="text-sm text-muted-foreground">{row.body}</p>
                  </div>
                  <Switch
                    checked={notifications[row.key]}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, [row.key]: checked })
                    }
                  />
                </div>
              ))}

              <Button variant="gradient" onClick={handleSaveSettings}>Save Preferences</Button>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy">
          <SectionCard
            title="Privacy & Security"
            description="Manage your privacy and security settings"
            icon={Lock}
            hue="teal"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className={labelClass}>Current Password</Label>
                  <Input id="currentPassword" type="password" className={inputClass} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className={labelClass}>New Password</Label>
                  <Input id="newPassword" type="password" className={inputClass} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className={labelClass}>Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" className={inputClass} />
                </div>
                <Button variant="gradient" onClick={handleSaveSettings}>Update Password</Button>
              </div>

              <div className="rounded-2xl border-2 border-brand-teal/30 bg-brand-teal/10 p-5">
                <h4 className="mb-1 font-bold text-brand-teal">Two-Factor Authentication</h4>
                <p className="mb-4 text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline" className="hover:border-brand-teal hover:text-brand-teal">
                  Enable Two-Factor Authentication
                </Button>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <SectionCard
            title="Appearance"
            description="Customize how the app looks and feels"
            icon={Palette}
            hue="pink"
          >
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-bold">Theme</h4>
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {THEMES.map(({ label, icon: Icon, swatch, text }) => (
                    <button
                      key={label}
                      type="button"
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-2xl border-2 border-border p-4 font-bold transition-all duration-200 hover:-translate-y-0.5',
                        text
                      )}
                    >
                      <div className={cn('h-9 w-9 rounded-xl', swatch)} />
                      <span className="flex items-center gap-1.5 text-sm">
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="flex items-center gap-2 font-bold">
                  <Globe className="h-4 w-4 text-brand-cyan" />
                  Language
                </h4>
                <select className="h-12 w-full rounded-xl border-2 border-border bg-background px-4 font-medium">
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              <Button variant="gradient" onClick={handleSaveSettings}>
                Save Appearance Settings
              </Button>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
};

export default Settings;
