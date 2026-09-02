import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { setConsent } from '@/lib/cookieConsent';
import { useConsent } from '@/hooks/useConsent';

/**
 * Consent banner for non-essential browser storage.
 *
 * The wording says plainly that nothing non-essential is in use yet, because
 * it isn't. A banner that implies tracking which does not exist is its own
 * kind of false statement, and it teaches people to dismiss these without
 * reading — which is the opposite of what consent is for.
 *
 * Both buttons carry equal visual weight. Making "reject" quieter than
 * "accept" is the standard dark pattern regulators single out.
 */
const CookieConsent = () => {
  const choice = useConsent();
  const [mounted, setMounted] = useState(false);

  // Wait a tick before showing, so the banner animates in rather than
  // appearing in the first painted frame over content still settling.
  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 600);
    return () => window.clearTimeout(t);
  }, []);

  if (choice !== null || !mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-0 bottom-0 z-50 animate-fade-up border-t-2 border-gold bg-ink text-white shadow-lift"
    >
      <div className="container mx-auto flex flex-col gap-5 px-4 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold/15 sm:flex">
            <Cookie className="h-5 w-5 text-gold" />
          </span>
          <div className="min-w-0">
            <h2 id="cookie-consent-title" className="mb-1 text-sm font-bold uppercase tracking-wide">
              Your choice about storage
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-white/70">
              VMK Store sets no cookies and runs no analytics or advertising trackers. The
              only thing kept in your browser is the sign-in session, which the site cannot
              work without. We are asking now so that your answer is already on record if we
              ever add anything optional.{' '}
              <Link to="/cookies" className="font-semibold text-gold underline underline-offset-2">
                Read the cookie policy
              </Link>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-3">
          {/* Equal weight, deliberately. */}
          <Button
            variant="outline"
            className="flex-1 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white lg:flex-none"
            onClick={() => setConsent('denied')}
          >
            Essential only
          </Button>
          <Button className="flex-1 lg:flex-none" onClick={() => setConsent('granted')}>
            Allow optional
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
