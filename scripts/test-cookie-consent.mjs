/**
 * Checks the consent module that gates non-essential browser storage.
 *
 *   node scripts/test-cookie-consent.mjs
 *
 * Worth testing despite its size: every branch here decides whether tracking
 * is allowed to run, and the failure mode is silent — a bug that makes
 * `hasConsent()` return true by accident tracks people who never agreed. The
 * cases below all assert the safe direction: anything unclear reads as "no".
 */
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = await mkdtemp(join(tmpdir(), 'consent-'));
const outfile = join(dir, 'consent.mjs');
await build({
  entryPoints: ['src/lib/cookieConsent.ts'],
  bundle: true, format: 'esm', outfile, logLevel: 'warning',
});

let store = {};
globalThis.window = {
  localStorage: {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; },
  },
};
const m = await import(outfile);
let pass = 0, fail = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  ok ? pass++ : fail++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${name}${ok ? '' : `  got ${JSON.stringify(got)} want ${JSON.stringify(want)}`}`);
};

check('undecided by default',            m.getConsent(), null);
check('undecided is NOT consent',        m.hasConsent(), false);

m.setConsent('granted');
check('granted is recorded',             m.getConsent(), 'granted');
check('granted means consent',           m.hasConsent(), true);
check('timestamp stored',                typeof m.getConsentDate(), 'string');

m.setConsent('denied');
check('denied overrides granted',        m.getConsent(), 'denied');
check('denied is not consent',           m.hasConsent(), false);

m.resetConsent();
check('reset clears the record',         m.getConsent(), null);
check('reset means no consent',          m.hasConsent(), false);

// A stored choice from an older category set must not be honoured silently.
store['vmk-cookie-consent'] = JSON.stringify({ version: 0, choice: 'granted', at: 'x' });
check('stale version ignored',           m.getConsent(), null);
check('stale version is not consent',    m.hasConsent(), false);

store['vmk-cookie-consent'] = 'not json';
check('corrupt value ignored',           m.getConsent(), null);

store['vmk-cookie-consent'] = JSON.stringify({ version: 1, choice: 'maybe', at: 'x' });
check('unknown choice ignored',          m.getConsent(), null);

// Storage that throws on every access (private modes do this).
globalThis.window = { localStorage: { getItem() { throw new Error('blocked'); },
  setItem() { throw new Error('blocked'); }, removeItem() { throw new Error('blocked'); } } };
check('throwing storage reads as undecided', m.getConsent(), null);
check('throwing storage is not consent',     m.hasConsent(), false);
let threw = false;
try { m.setConsent('granted'); } catch { threw = true; }
check('setConsent survives throwing storage', threw, false);

// Subscribers are told when the choice changes.
globalThis.window = { localStorage: { getItem: k => store[k] ?? null,
  setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } } };
let calls = 0;
const off = m.subscribe(() => { calls++; });
m.setConsent('granted'); m.resetConsent();
check('subscribers notified twice', calls, 2);
off();
m.setConsent('denied');
check('unsubscribe stops notifications', calls, 2);

console.log(`\n${pass} passed, ${fail} failed`);
await rm(dir, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
