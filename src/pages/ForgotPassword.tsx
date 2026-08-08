import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthShell from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSending(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });
    setSending(false);

    if (error) {
      toast({
        title: 'Could not send reset link',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    // Shown regardless of whether the address exists, so this form cannot be
    // used to discover which emails have accounts.
    setSent(true);
  };

  return (
    <AuthShell
      title="Reset your"
      highlight="Password"
      subtitle="We'll email you a link to choose a new one"
      footer={
        <p className="text-muted-foreground">
          Remembered it?{' '}
          <Link to="/login" className="font-bold text-gold-ink hover:underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      <div className="card-pop p-6">
        {sent ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-brand-teal/15">
              <CheckCircle2 className="h-7 w-7 text-brand-teal" />
            </div>
            <h2 className="mb-2 text-lg font-bold">Check your inbox</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              If an account exists for <span className="font-semibold">{email}</span>, a reset
              link is on its way. It expires after a short while.
            </p>
            <Button variant="outline" onClick={() => setSent(false)}>
              Use a different email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Email Address
              </Label>
              <div className="group relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-gold-ink" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-12 rounded-md border-2 pl-11"
                  required
                  disabled={sending}
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={sending}>
              {sending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send reset link
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </AuthShell>
  );
};

export default ForgotPassword;
