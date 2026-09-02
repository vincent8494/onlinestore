/**
 * Consent for non-essential browser storage.
 *
 * VMK Store currently sets no cookies and runs no analytics or advertising
 * trackers, so nothing on the site depends on this choice today. It exists so
 * that consent is recorded BEFORE any such tool is added, rather than being
 * retrofitted afterwards — at which point the honest options are to ask
 * everyone again or to start tracking people who never agreed.
 *
 * Anything non-essential added later must call `hasConsent()` and do nothing
 * unless it returns true. Default is denial: an undecided visitor is treated
 * exactly like one who said no.
 */

const KEY = 'vmk-cookie-consent';

/** Bump when the categories change; a stored choice for an older version is
 *  treated as undecided so the visitor is asked about the new ones. */
const VERSION = 1;

export type ConsentChoice = 'granted' | 'denied';

interface StoredConsent {
  version: number;
  choice: ConsentChoice;
  /** ISO timestamp, so a record of when consent was given can be produced. */
  at: string;
}

/** Reading storage throws outright in some privacy modes, so every access is
 *  guarded and a failure is treated as "no choice recorded". */
function read(): StoredConsent | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed?.version !== VERSION) return null;
    if (parsed.choice !== 'granted' && parsed.choice !== 'denied') return null;
    return parsed;
  } catch {
    return null;
  }
}

/** The recorded choice, or null if the visitor has not been asked yet. */
export function getConsent(): ConsentChoice | null {
  return read()?.choice ?? null;
}

/** When the choice was made, for answering "prove I agreed" requests. */
export function getConsentDate(): string | null {
  return read()?.at ?? null;
}

/** The only question a tracking script should ask. Undecided means no. */
export function hasConsent(): boolean {
  return getConsent() === 'granted';
}

export function setConsent(choice: ConsentChoice): void {
  try {
    const record: StoredConsent = { version: VERSION, choice, at: new Date().toISOString() };
    window.localStorage.setItem(KEY, JSON.stringify(record));
  } catch {
    // Storage unavailable. The banner stays dismissed for this page view only,
    // and the visitor is asked again next time — which is the safe direction.
  }
  notify();
}

/** Clears the record so the banner returns. Used by "change your choice". */
export function resetConsent(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
  notify();
}

/* --- change notification -------------------------------------------------
 * The banner and the cookie policy page both render the current choice, and
 * they can be on screen together. A tiny subscription keeps them in step
 * without reaching for a context provider.
 * ------------------------------------------------------------------------ */

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
