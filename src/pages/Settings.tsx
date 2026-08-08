
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import PageHero from '@/components/layout/PageHero';
import SectionCard from '@/components/layout/SectionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Bell, Lock, User, Palette, Sun, Moon, Monitor, Globe, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

type ThemeChoice = 'light' | 'dark' | 'auto';

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: true
  });
  const [theme, setTheme] = useState<ThemeChoice>('auto');
  const [language, setLanguage] = useState('en');
  const [account, setAccount] = useState({ firstName: '', lastName: '', email: '', phone: '' });

  // Seed the account fields from the signed-in user rather than showing
  // someone else's placeholder details.
  useEffect(() => {
    if (!user) return;
    setAccount(a => ({
      ...a,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
    }));
  }, [user]);

  // Load persisted preferences.
  useEffect(() => {
    let cancelled = false;
    if (!user) return;

    supabase
      .from('user_settings')
      .select('email_notifications, push_notifications, sms_notifications, marketing_emails, theme, language')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return;
        const row = data as {
          email_notifications: boolean;
          push_notifications: boolean;
          sms_notifications: boolean;
          marketing_emails: boolean;
          theme: ThemeChoice;
          language: string;
        };
        setNotifications({
          email: row.email_notifications,
          push: row.push_notifications,
          sms: row.sms_notifications,
          marketing: row.marketing_emails,
        });
        setTheme(row.theme ?? 'auto');
        setLanguage(row.language ?? 'en');
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleSaveSettings = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Log in to save your settings.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    // user_id is unique on user_settings, so upsert keyed on it both inserts
    // the first time and updates thereafter.
    const { error } = await supabase.from('user_settings').upsert(
      {
        user_id: user.id,
        email_notifications: notifications.email,
        push_notifications: notifications.push,
        sms_notifications: notifications.sms,
        marketing_emails: notifications.marketing,
        theme,
        language,
      },
      { onConflict: 'user_id' }
    );
    setSaving(false);

    if (error) {
      toast({
        title: 'Could not save settings',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Settings saved!',
      description: 'Your settings have been updated successfully.',
    });
  };

  /** Account details live on the auth user, not user_settings. */
  const handleSaveAccount = async () => {
    if (!user) {
      toast({ title: 'Sign in required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const emailChanged = account.email !== user.email;
    const { error } = await supabase.auth.updateUser({
      ...(emailChanged ? { email: account.email } : {}),
      data: {
        first_name: account.firstName,
        last_name: account.lastName,
        phone: account.phone,
      },
    });
    setSaving(false);

    if (error) {
      toast({ title: 'Could not save account', description: error.message, variant: 'destructive' });
      return;
    }
    toast({
      title: 'Account updated',
      description: emailChanged
        ? 'Check your inbox to confirm the new email address.'
        : 'Your account details have been saved.',
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

  const THEMES: { label: string; value: ThemeChoice; icon: typeof Sun; swatch: string; text: string }[] = [
    { label: 'Light', value: 'light', icon: Sun, swatch: 'bg-white border-2', text: 'hover:text-gold-ink hover:border-gold' },
    { label: 'Dark', value: 'dark', icon: Moon, swatch: 'bg-ink', text: 'hover:text-gold-ink hover:border-gold' },
    { label: 'Auto', value: 'auto', icon: Monitor, swatch: 'bg-brand-gradient', text: 'hover:text-gold-ink hover:border-gold' },
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
                  <Input id="firstName" value={account.firstName} onChange={e => setAccount(a => ({ ...a, firstName: e.target.value }))} className={inputClass} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className={labelClass}>Last Name</Label>
                  <Input id="lastName" value={account.lastName} onChange={e => setAccount(a => ({ ...a, lastName: e.target.value }))} className={inputClass} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className={labelClass}>Email</Label>
                <Input id="email" type="email" value={account.email} onChange={e => setAccount(a => ({ ...a, email: e.target.value }))} className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className={labelClass}>Phone Number</Label>
                <Input id="phone" type="tel" value={account.phone} onChange={e => setAccount(a => ({ ...a, phone: e.target.value }))} className={inputClass} />
              </div>
              <Button onClick={handleSaveAccount} disabled={saving}>{saving ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : "Save Changes"}</Button>
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

              <Button onClick={handleSaveSettings} disabled={saving}>{saving ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : "Save Preferences"}</Button>
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
                  {THEMES.map(({ label, value, icon: Icon, swatch, text }) => (
                    <button
                      key={label}
                      type="button"
                      aria-pressed={theme === value}
                      onClick={() => setTheme(value)}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-lg border-2 p-4 font-bold transition-all duration-200 hover:-translate-y-0.5',
                        theme === value ? 'border-gold' : 'border-border',
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
                <select
                  aria-label="Language"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="h-12 w-full rounded-lg border-2 border-border bg-background px-4 font-medium"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
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
