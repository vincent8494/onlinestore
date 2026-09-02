import { useSyncExternalStore } from 'react';
import { getConsent, subscribe } from '@/lib/cookieConsent';

/**
 * The visitor's current choice about non-essential storage, kept in step
 * across every component that shows it — the banner and the cookie policy
 * page can be on screen at the same time.
 */
export function useConsent() {
  return useSyncExternalStore(
    subscribe,
    getConsent,
    // Server/prerender snapshot: no storage there, so nobody has chosen yet,
    // which is the same answer the client gives on a first visit.
    () => null
  );
}
