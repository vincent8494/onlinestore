import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthShell from '@/components/layout/AuthShell';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, Eye, EyeOff, User, Phone, ShoppingBag, Store, UserPlus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: 'buyer' as 'buyer' | 'seller',
    agreeTerms: false,
    agreeMarketing: false
  });
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.agreeTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the Terms of Service",
        variant: "destructive",
      });
      return;
    }

    console.log('Registration attempt:', formData);
    
    const result = await register(formData);
    if (result === 'confirm') {
      // Account exists but is not usable until the email is confirmed, so send
      // them to sign-in rather than a homepage that still shows them logged out.
      navigate('/login');
    } else if (result) {
      navigate('/');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSocialRegister = (provider: string) => {
    toast({
      title: "Social Registration",
      description: `${provider} registration will be implemented soon.`,
    });
  };

  const labelClass = 'text-xs font-bold uppercase tracking-wider text-muted-foreground';
  const inputClass = 'h-12 rounded-xl border-2 pl-11';

  /** Account-type picker: two big colour-coded cards instead of radio dots. */
  const ACCOUNT_TYPES = [
    {
      value: 'buyer' as const,
      label: 'Buy products',
      body: 'Shop from verified sellers',
      icon: ShoppingBag,
      active: 'border-brand-blue bg-brand-blue/10 shadow-glow-blue',
      chip: 'bg-brand-blue',
      text: 'text-brand-blue',
    },
    {
      value: 'seller' as const,
      label: 'Sell products',
      body: 'List items and reach buyers',
      icon: Store,
      active: 'border-brand-pink bg-brand-pink/10 shadow-glow-pink',
      chip: 'bg-brand-pink',
      text: 'text-brand-pink',
    },
  ];

  return (
    <AuthShell
      title="Create"
      highlight="Account"
      subtitle="Join our marketplace and start buying or selling today"
      footer={
        <p className="text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-gold-ink hover:underline">
            Sign in here
          </Link>
        </p>
      }
    >
      <div className="card-pop p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Account Type */}
          <div className="space-y-2">
            <Label className={labelClass}>I want to</Label>
            <div className="grid grid-cols-2 gap-3">
              {ACCOUNT_TYPES.map(t => {
                const selected = formData.accountType === t.value;
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    type="button"
                    disabled={loading}
                    aria-pressed={selected}
                    onClick={() => setFormData(prev => ({ ...prev, accountType: t.value }))}
                    className={cn(
                      'relative rounded-2xl border-2 p-4 text-left transition-all duration-200',
                      selected
                        ? t.active
                        : 'border-border hover:-translate-y-0.5 hover:border-muted-foreground/30'
                    )}
                  >
                    {selected && (
                      <span
                        className={cn(
                          'absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full text-white',
                          t.chip
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    <Icon className={cn('mb-2 h-6 w-6', selected ? t.text : 'text-muted-foreground')} />
                    <div className="text-sm font-bold">{t.label}</div>
                    <div className="text-xs text-muted-foreground">{t.body}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName" className={labelClass}>First Name</Label>
              <div className="group relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-violet" />
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className={labelClass}>Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="h-12 rounded-xl border-2"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className={labelClass}>Email Address</Label>
            <div className="group relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-violet" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className={inputClass}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className={labelClass}>Phone Number</Label>
            <div className="group relative">
              <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-violet" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                className={inputClass}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className={labelClass}>Password</Label>
            <div className="group relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-violet" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                className={cn(inputClass, 'pr-11')}
                required
                disabled={loading}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-brand-violet"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className={labelClass}>Confirm Password</Label>
            <div className="group relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-violet" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={cn(inputClass, 'pr-11')}
                required
                disabled={loading}
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-brand-violet"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Terms and Marketing */}
          <div className="space-y-3 rounded-2xl bg-muted/50 p-4">
            <div className="flex items-start gap-2.5">
              <Checkbox
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, agreeTerms: checked as boolean }))
                }
                required
                disabled={loading}
                className="mt-0.5"
              />
              <Label htmlFor="agreeTerms" className="text-sm font-normal leading-snug">
                I agree to the{' '}
                <Link to="/terms" className="font-semibold text-gold-ink hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-semibold text-gold-ink hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            <div className="flex items-start gap-2.5">
              <Checkbox
                id="agreeMarketing"
                name="agreeMarketing"
                checked={formData.agreeMarketing}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, agreeMarketing: checked as boolean }))
                }
                disabled={loading}
                className="mt-0.5"
              />
              <Label htmlFor="agreeMarketing" className="text-sm font-normal leading-snug">
                I'd like to receive promotional emails and updates
              </Label>
            </div>
          </div>

          <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
            <UserPlus className="h-5 w-5" />
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full hover:border-brand-rose hover:text-brand-rose"
              disabled={loading}
              onClick={() => handleSocialRegister('Google')}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full hover:border-brand-blue hover:text-brand-blue"
              disabled={loading}
              onClick={() => handleSocialRegister('Facebook')}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div>
        </div>
      </div>
    </AuthShell>
  );
};

export default Register;
