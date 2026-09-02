import React from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import PageHero from '@/components/layout/PageHero';
import { Button } from '@/components/ui/button';
import { FileText, Mail, ShieldCheck, Cookie, Scale, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HUE_STYLES, type Hue } from '@/lib/theme';
import { useConsent } from '@/hooks/useConsent';
import { resetConsent, getConsentDate } from '@/lib/cookieConsent';

/* ---------------------------------------------------------------------------
 * These are real published policies, not placeholders.
 *
 * Two rules were followed throughout, and anyone editing them should keep to
 * both. First, every factual claim matches what the code actually does — the
 * data listed in the privacy policy is the data the schema stores, the cookie
 * policy says the site sets no cookies because it sets none, and where a
 * feature does not exist yet (payment processing) the document says so rather
 * than describing it in advance. A policy that overstates is worse than none,
 * because it is a promise nobody is keeping.
 *
 * Second, they are jurisdiction-neutral: they grant the rights that are common
 * to modern data protection law without claiming to be issued under a
 * particular statute. The governing-law clause is left as a marked placeholder
 * for a lawyer to complete once the operating entity is settled.
 * ------------------------------------------------------------------------- */

/** Reviewed and published on this date. Update when the text changes. */
const UPDATED = '2 September 2026';

const CONTACT = 'support@vmkstore.com';

/* --- small typographic helpers -------------------------------------------- */

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-4 text-[0.9375rem] leading-7 text-muted-foreground last:mb-0">{children}</p>
);

const UL = ({ children }: { children: React.ReactNode }) => (
  <ul className="mb-4 space-y-2 last:mb-0">{children}</ul>
);

const LI = ({ children }: { children: React.ReactNode }) => (
  <li className="flex gap-3 text-[0.9375rem] leading-7 text-muted-foreground">
    <span aria-hidden className="mt-[0.6875rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
    <span className="min-w-0">{children}</span>
  </li>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-2 mt-6 text-sm font-bold uppercase tracking-wide first:mt-0">{children}</h3>
);

/** A gap a lawyer must fill before this clause means anything. */
const Placeholder = ({ children }: { children: React.ReactNode }) => (
  <mark className="rounded bg-sale/15 px-1.5 py-0.5 font-bold uppercase tracking-wide text-sale">
    {children}
  </mark>
);

/** Definition table used for the storage inventory. */
const DataTable = ({ rows }: { rows: [string, string, string][] }) => (
  <div className="mb-4 overflow-x-auto rounded-lg border border-border">
    <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
      <thead>
        <tr className="bg-muted/60">
          <th className="px-4 py-3 font-bold">Name</th>
          <th className="px-4 py-3 font-bold">Purpose</th>
          <th className="px-4 py-3 font-bold">Kept for</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([name, purpose, kept]) => (
          <tr key={name} className="border-t border-border align-top">
            <td className="px-4 py-3 font-mono text-xs">{name}</td>
            <td className="px-4 py-3 text-muted-foreground">{purpose}</td>
            <td className="px-4 py-3 text-muted-foreground">{kept}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* --- document shell ------------------------------------------------------- */

interface Section {
  id: string;
  heading: string;
  body: React.ReactNode;
}

interface LegalDocumentProps {
  eyebrow: string;
  title: string;
  highlight: string;
  icon: typeof FileText;
  hue: Hue;
  sections: Section[];
}

const LegalDocument = ({
  eyebrow,
  title,
  highlight,
  icon: Icon,
  hue,
  sections,
}: LegalDocumentProps) => {
  const style = HUE_STYLES[hue];

  return (
    <PageShell>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        highlight={highlight}
        subtitle={`Last updated ${UPDATED}`}
        icon={Icon}
        hue={hue}
      />

      <div className="mx-auto max-w-3xl">
        {/* Section ids are kept so a clause can be linked to directly,
            e.g. /privacy#rights. */}
        <div className="space-y-10">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="mb-3 flex items-baseline gap-3 text-xl font-extrabold tracking-tight">
                <span className={cn('font-mono text-sm', style.text)}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {s.heading}
              </h2>
              <div>{s.body}</div>
            </section>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 card-pop p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-brand-gradient text-ink">
            <Mail className="h-7 w-7" />
          </div>
          <h2 className="mb-1 text-lg font-bold">Questions about this document?</h2>
          <p className="mb-5 text-muted-foreground">
            Email us and a person will get back to you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/seller-support">Support centre</Link>
            </Button>
          </div>
        </div>

        {/* Cross-links */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link to="/privacy" className="underline-offset-4 hover:text-gold-ink hover:underline">
            Privacy Policy
          </Link>
          <Link to="/terms" className="underline-offset-4 hover:text-gold-ink hover:underline">
            Terms of Service
          </Link>
          <Link to="/cookies" className="underline-offset-4 hover:text-gold-ink hover:underline">
            Cookie Policy
          </Link>
          <Link
            to="/seller-policies"
            className="underline-offset-4 hover:text-gold-ink hover:underline"
          >
            Seller Policies
          </Link>
        </div>
      </div>
    </PageShell>
  );
};

/* ==========================================================================
 * Privacy Policy
 * ======================================================================== */

export const Privacy = () => (
  <LegalDocument
    eyebrow="Legal"
    title="Privacy"
    highlight="Policy"
    icon={ShieldCheck}
    hue="teal"
    sections={[
      {
        id: 'scope',
        heading: 'Who this applies to',
        body: (
          <>
            <P>
              This policy explains how VMK Store (&ldquo;we&rdquo;, &ldquo;us&rdquo;) handles
              personal information when you use the VMK Store marketplace, whether you browse
              without an account, buy as a registered customer, or sell.
            </P>
            <P>
              It covers the website and the services reached through it. It does not cover
              anything a seller does with your information outside the platform, or sites we
              link to. Sellers are independent businesses and are responsible for their own
              handling of customer data.
            </P>
          </>
        ),
      },
      {
        id: 'what-we-collect',
        heading: 'What we collect',
        body: (
          <>
            <H3>Information you give us</H3>
            <UL>
              <LI>
                <strong>Account:</strong> first and last name, email address, password (stored
                only as a cryptographic hash, never in readable form), and optionally a phone
                number and profile picture. You also tell us whether the account is for buying
                or selling.
              </LI>
              <LI>
                <strong>Seller profile, if you sell:</strong> store name, store address on the
                site, and optionally a description, location and store picture.
              </LI>
              <LI>
                <strong>Delivery details:</strong> recipient name, street address, city, postal
                code and country, plus the email address an order is confirmed to. Saved
                addresses are kept on your account so you need not retype them.
              </LI>
              <LI>
                <strong>Things you post:</strong> product listings, product reviews and star
                ratings. Reviews are public and are shown next to your name.
              </LI>
              <LI>
                <strong>Preferences:</strong> notification settings, display theme and language,
                and whether you agreed to marketing email.
              </LI>
              <LI>
                <strong>Messages:</strong> anything you send us by email or through a support
                form.
              </LI>
            </UL>

            <H3>Information created as you use the site</H3>
            <UL>
              <LI>
                <strong>Orders:</strong> what you ordered, from which seller, the price, and the
                status of the order.
              </LI>
              <LI>
                <strong>Basket and wishlist:</strong> items you have saved but not yet bought.
              </LI>
              <LI>
                <strong>Sellers you follow.</strong>
              </LI>
              <LI>
                <strong>Technical records:</strong> our hosting and database providers keep
                standard server logs, which include IP addresses, timestamps and the pages
                requested. These are generated by the infrastructure rather than collected by
                us, and are used for security and fault diagnosis.
              </LI>
            </UL>

            <H3>Payment information</H3>
            <P>
              <strong>
                VMK Store does not currently process payments and holds no card numbers, bank
                details or payment credentials of any kind.
              </strong>{' '}
              When a payment provider is introduced, card data will be handled by that provider
              directly and this policy will be updated to name them before the feature goes
              live.
            </P>

            <H3>What we do not collect</H3>
            <P>
              We do not ask for and do not want special-category information — health, race,
              religion, political opinions, biometrics or similar. Please do not put such
              details into reviews, listings or support messages.
            </P>
          </>
        ),
      },
      {
        id: 'why',
        heading: 'Why we use it, and on what basis',
        body: (
          <>
            <P>
              We only use personal information where we have a proper reason. In practice that
              is one of the following.
            </P>
            <UL>
              <LI>
                <strong>To provide what you asked for.</strong> Creating your account, showing
                your basket, placing an order, passing delivery details to the seller who has to
                ship it, and handling returns. Without this we cannot run the service.
              </LI>
              <LI>
                <strong>Because you agreed.</strong> Marketing email, and any optional storage
                covered by the{' '}
                <Link to="/cookies" className="font-semibold text-gold-ink underline underline-offset-2">
                  cookie policy
                </Link>
                . You can withdraw agreement at any time, and withdrawing does not affect
                anything done beforehand.
              </LI>
              <LI>
                <strong>To run the business responsibly.</strong> Keeping the site secure,
                preventing fraud and abuse, diagnosing faults, and understanding which parts of
                the marketplace are used. We weigh this against your interests and use the least
                information that will do.
              </LI>
              <LI>
                <strong>Because the law requires it.</strong> Keeping transaction records, and
                responding to lawful requests from authorities.
              </LI>
            </UL>
            <P>
              We do not make decisions about you by automated means that produce legal or
              similarly significant effects.
            </P>
          </>
        ),
      },
      {
        id: 'sharing',
        heading: 'Who we share it with',
        body: (
          <>
            <P>
              <strong>We do not sell personal information, and we never have.</strong> We share
              it only in the situations below.
            </P>

            <H3>Sellers</H3>
            <P>
              When you place an order, the seller receives what they need to fulfil it: the
              recipient&rsquo;s name, delivery address, contact email and the items ordered. They
              do not receive your password, your browsing history or your orders from other
              sellers. Sellers may only use these details to complete your order.
            </P>

            <H3>Service providers</H3>
            <P>
              We use two providers to run the site. They process data on our instructions and
              may not use it for their own purposes.
            </P>
            <UL>
              <LI>
                <strong>Supabase</strong> — hosts the database and the authentication system.
                Effectively all account and order data lives here.
              </LI>
              <LI>
                <strong>Vercel</strong> — serves the website and its images, and keeps
                short-lived request logs.
              </LI>
            </UL>
            <P>
              If we add another provider that handles personal information, this list will be
              updated.
            </P>

            <H3>Other situations</H3>
            <UL>
              <LI>Where the law, a court or a regulator requires disclosure.</LI>
              <LI>
                To investigate fraud, abuse or a breach of the{' '}
                <Link to="/terms" className="font-semibold text-gold-ink underline underline-offset-2">
                  terms of service
                </Link>
                , or to protect someone&rsquo;s safety.
              </LI>
              <LI>
                If the business is sold or reorganised, in which case the buyer is bound by this
                policy until they publish their own and tell you about it.
              </LI>
            </UL>
          </>
        ),
      },
      {
        id: 'public',
        heading: 'What other people can see',
        body: (
          <>
            <P>Some information is public by design. Before you post, note that:</P>
            <UL>
              <LI>
                Product reviews and ratings are visible to anyone, shown with your name and the
                date.
              </LI>
              <LI>
                If you sell, your store name, description, location and store picture are public,
                along with your listings.
              </LI>
            </UL>
            <P>
              Your email address, phone number, delivery addresses and order history are never
              published.
            </P>
          </>
        ),
      },
      {
        id: 'retention',
        heading: 'How long we keep it',
        body: (
          <>
            <UL>
              <LI>
                <strong>Account information:</strong> while your account is open, and for a short
                period afterwards so an accidental deletion can be reversed.
              </LI>
              <LI>
                <strong>Orders and transaction records:</strong> for as long as accounting and tax
                rules require, which is typically several years, even if you close your account.
                These are kept in the narrowest form that satisfies the obligation.
              </LI>
              <LI>
                <strong>Reviews:</strong> until you delete them or your account is closed.
              </LI>
              <LI>
                <strong>Basket and wishlist:</strong> until you remove the items or close your
                account.
              </LI>
              <LI>
                <strong>Support messages:</strong> long enough to resolve the issue and handle any
                follow-up.
              </LI>
            </UL>
          </>
        ),
      },
      {
        id: 'rights',
        heading: 'Your rights',
        body: (
          <>
            <P>Whatever country you are in, we will honour the following requests.</P>
            <UL>
              <LI>
                <strong>Get a copy</strong> of the personal information we hold about you, in a
                portable format.
              </LI>
              <LI>
                <strong>Correct it</strong> if it is wrong. Most account details can be edited
                directly from your profile.
              </LI>
              <LI>
                <strong>Delete your account</strong> and the personal information attached to it,
                except records we are legally required to retain.
              </LI>
              <LI>
                <strong>Object to or restrict</strong> a particular use, including profiling for
                marketing.
              </LI>
              <LI>
                <strong>Withdraw consent</strong> you previously gave, such as for marketing
                email or optional storage.
              </LI>
              <LI>
                <strong>Complain</strong> to the data protection authority where you live. We
                would rather you came to us first, but you do not have to.
              </LI>
            </UL>
            <P>
              Email <a className="font-semibold text-gold-ink underline underline-offset-2" href={`mailto:${CONTACT}`}>{CONTACT}</a>{' '}
              and we will respond within 30 days. There is no charge. We may need to confirm who
              you are before acting, so that someone else cannot obtain your data by asking.
            </P>
          </>
        ),
      },
      {
        id: 'security',
        heading: 'How we protect it',
        body: (
          <>
            <UL>
              <LI>Traffic between your browser and the site is encrypted in transit.</LI>
              <LI>
                Passwords are stored only as cryptographic hashes. Nobody at VMK Store can read
                your password.
              </LI>
              <LI>
                The database enforces row-level access rules, so one account cannot read
                another&rsquo;s orders, addresses or basket even if a bug in the site tried to
                request them.
              </LI>
              <LI>
                We hold no payment credentials, which removes the most valuable target
                altogether.
              </LI>
            </UL>
            <P>
              No system is perfectly secure. If a breach affects your personal information we
              will tell you and the relevant authority promptly, describing what happened, what
              it means for you and what we are doing about it.
            </P>
          </>
        ),
      },
      {
        id: 'children',
        heading: 'Children',
        body: (
          <P>
            The marketplace is not intended for children, and you must be old enough to enter a
            contract in your country to hold an account. We do not knowingly collect information
            from children. If you believe a child has given us personal information, contact us
            and we will delete it.
          </P>
        ),
      },
      {
        id: 'transfers',
        heading: 'Where your information is held',
        body: (
          <P>
            Our providers operate internationally, so your information may be stored or processed
            in a country other than your own, including one whose data protection laws differ
            from those where you live. Where that happens we rely on the safeguards those
            providers offer, such as standard contractual protections, and we require them to
            keep your data confidential and use it only on our instructions.
          </P>
        ),
      },
      {
        id: 'changes',
        heading: 'Changes to this policy',
        body: (
          <P>
            We update this policy when the way we handle information changes — for example when
            payment processing is introduced. The date at the top always reflects the current
            version. If a change materially affects your rights we will give notice on the site
            or by email before it takes effect, rather than changing it quietly.
          </P>
        ),
      },
      {
        id: 'contact',
        heading: 'Contacting us',
        body: (
          <P>
            Write to{' '}
            <a className="font-semibold text-gold-ink underline underline-offset-2" href={`mailto:${CONTACT}`}>
              {CONTACT}
            </a>{' '}
            with any question about this policy, to exercise any of the rights above, or to
            report a concern.
          </P>
        ),
      },
    ]}
  />
);

/* ==========================================================================
 * Terms of Service
 * ======================================================================== */

export const Terms = () => (
  <LegalDocument
    eyebrow="Legal"
    title="Terms of"
    highlight="Service"
    icon={Scale}
    hue="indigo"
    sections={[
      {
        id: 'agreement',
        heading: 'These terms',
        body: (
          <>
            <P>
              These terms are an agreement between you and VMK Store. They apply whenever you
              use the marketplace — browsing, buying, or selling. By creating an account or
              placing an order you accept them. If you do not accept them, please do not use the
              site.
            </P>
            <P>
              Additional rules apply to sellers and are set out in the{' '}
              <Link to="/seller-policies" className="font-semibold text-gold-ink underline underline-offset-2">
                seller policies
              </Link>{' '}
              and the{' '}
              <Link to="/fees" className="font-semibold text-gold-ink underline underline-offset-2">
                fees page
              </Link>
              . Those form part of this agreement. Where they conflict with this document, this
              document governs.
            </P>
          </>
        ),
      },
      {
        id: 'accounts',
        heading: 'Your account',
        body: (
          <>
            <UL>
              <LI>
                You must be old enough to enter a binding contract where you live, and must not
                be barred from using the service under any applicable law.
              </LI>
              <LI>
                Give accurate registration details and keep them current. Accounts opened with
                false information may be closed.
              </LI>
              <LI>
                Keep your password to yourself. You are responsible for what happens under your
                account. Tell us promptly at{' '}
                <a className="font-semibold text-gold-ink underline underline-offset-2" href={`mailto:${CONTACT}`}>
                  {CONTACT}
                </a>{' '}
                if you think someone else has access.
              </LI>
              <LI>One person or business, one account, unless we agree otherwise in writing.</LI>
            </UL>
          </>
        ),
      },
      {
        id: 'our-role',
        heading: 'What VMK Store is, and is not',
        body: (
          <>
            <P>
              <strong>
                VMK Store is a venue. We are not the seller of the items listed here.
              </strong>{' '}
              Listings are created by independent sellers, and when you buy something the
              contract of sale is between you and that seller. We are not a party to it.
            </P>
            <P>
              This means the seller — not VMK Store — is responsible for the accuracy of the
              listing, for the item&rsquo;s quality and legality, for packing and dispatching
              it, and for meeting any obligation the law places on a seller, including consumer
              rights that cannot be signed away.
            </P>
            <P>
              We review listings and act on reports, but we do not inspect items before they are
              listed and cannot guarantee that every listing is accurate.
            </P>
          </>
        ),
      },
      {
        id: 'buying',
        heading: 'Buying',
        body: (
          <>
            <UL>
              <LI>
                Placing an order is an offer to buy. The contract forms when the seller accepts
                it, which is normally when the order is confirmed or dispatched.
              </LI>
              <LI>
                Prices and availability can change until an order is accepted. If an item is
                listed at an obviously wrong price through a genuine error, the seller may
                cancel and refund rather than fulfil it.
              </LI>
              <LI>
                Delivery times shown are the seller&rsquo;s estimates, not guarantees, and
                exclude delays outside their control.
              </LI>
              <LI>
                Any right to cancel or return, and any warranty, comes from the seller and from
                the consumer law that applies to you. Nothing here reduces rights you have by
                law.
              </LI>
              <LI>
                If something goes wrong, raise it with the seller first. If that does not
                resolve it, contact us.
              </LI>
            </UL>
            <P>
              <strong>Payments.</strong> Online payment is not yet available on VMK Store.
              Until it is, payment arrangements are made between you and the seller directly,
              and we are not involved in them. When we introduce a payment service these terms
              will be updated to cover it.
            </P>
          </>
        ),
      },
      {
        id: 'selling',
        heading: 'Selling',
        body: (
          <>
            <P>If you list items, you agree that:</P>
            <UL>
              <LI>
                Your listings are accurate and not misleading — the description, condition,
                price and photographs must match what you will actually send.
              </LI>
              <LI>
                You have the right to sell the item, and selling it does not infringe anyone
                else&rsquo;s trade mark, copyright or other rights.
              </LI>
              <LI>
                You will not list prohibited items. The categories are set out in the{' '}
                <Link to="/seller-policies" className="font-semibold text-gold-ink underline underline-offset-2">
                  seller policies
                </Link>
                .
              </LI>
              <LI>
                You keep stock levels current, dispatch within the time you advertise, and deal
                with your customers fairly and promptly.
              </LI>
              <LI>
                You use buyer information only to fulfil the order, and you comply with the data
                protection law that applies to you.
              </LI>
              <LI>
                You are responsible for your own taxes, licences and any registration your
                business needs.
              </LI>
              <LI>
                Fees are charged as published on the{' '}
                <Link to="/fees" className="font-semibold text-gold-ink underline underline-offset-2">
                  fees page
                </Link>
                . We will give reasonable notice before fees change.
              </LI>
            </UL>
          </>
        ),
      },
      {
        id: 'content',
        heading: 'Content you post',
        body: (
          <>
            <P>
              You keep ownership of everything you post — listings, photographs, reviews. By
              posting it you give us permission to host, display and distribute it for the
              purpose of operating and promoting the marketplace. That permission ends when you
              remove the content, except where we must keep a copy for legal reasons or where it
              has already been shared with someone else on the site.
            </P>
            <P>Content must not:</P>
            <UL>
              <LI>be unlawful, hateful, harassing, deceptive or obscene;</LI>
              <LI>infringe anyone&rsquo;s intellectual property or privacy;</LI>
              <LI>contain malware or attempt to interfere with the site;</LI>
              <LI>be a fake review, or a review posted in exchange for payment or incentive.</LI>
            </UL>
            <P>
              Reviews should reflect a genuine experience. We may remove content that breaks
              these rules, and we may remove listings that appear fraudulent.
            </P>
          </>
        ),
      },
      {
        id: 'conduct',
        heading: 'Things you must not do',
        body: (
          <UL>
            <LI>Use the site for anything unlawful, or to defraud anyone.</LI>
            <LI>
              Interfere with the site&rsquo;s operation, probe its security, or try to reach
              accounts or data that are not yours.
            </LI>
            <LI>
              Scrape or harvest the site at scale, or use bots to place orders or post content.
            </LI>
            <LI>
              Impersonate someone else, or misrepresent your connection to a person or business.
            </LI>
            <LI>
              Take transactions off the platform to avoid fees, or use buyer contact details for
              unsolicited marketing.
            </LI>
            <LI>Manipulate ratings, reviews or search placement.</LI>
          </UL>
        ),
      },
      {
        id: 'ip',
        heading: 'Our intellectual property',
        body: (
          <P>
            The VMK Store name, logo, site design, text and software are ours or our
            licensors&rsquo;. You may use the site for its intended purpose, but you may not
            copy, adapt or redistribute it, or use our branding, without written permission.
            Product photographs and descriptions belong to the sellers who posted them.
          </P>
        ),
      },
      {
        id: 'suspension',
        heading: 'Suspension and closure',
        body: (
          <>
            <P>
              You can close your account at any time from your profile, or by emailing us.
              Closing it does not cancel orders already placed or fees already owed.
            </P>
            <P>
              We may suspend or close an account, remove listings, or withdraw access if we
              reasonably believe these terms have been broken, if the account is being used
              fraudulently or unlawfully, or if required by law. Except where the breach is
              serious or we are legally prevented, we will tell you why and give you a chance to
              respond.
            </P>
          </>
        ),
      },
      {
        id: 'disclaimers',
        heading: 'What we do not promise',
        body: (
          <>
            <P>
              We work to keep the marketplace running well, but we provide it as it is. We do not
              promise that it will be uninterrupted or error-free, that listings are accurate, or
              that a seller will perform. Features may change or be withdrawn.
            </P>
            <P>
              Nothing in this section excludes anything that cannot be excluded by law, including
              liability for death or personal injury caused by negligence, for fraud, and your
              rights as a consumer.
            </P>
          </>
        ),
      },
      {
        id: 'liability',
        heading: 'Limits on liability',
        body: (
          <>
            <P>
              Subject to the paragraph above, we are not liable for loss of profit, loss of
              business, loss of data, or indirect or consequential loss arising from your use of
              the marketplace. We are not liable for the acts or omissions of a seller or a
              buyer.
            </P>
            <P>
              Where we are liable, our total liability arising in any twelve-month period is
              limited to the greater of the fees you paid us in that period and{' '}
              <Placeholder>[cap amount and currency]</Placeholder>.
            </P>
            <P>
              You agree to cover us against claims brought by others that arise from your
              listings, your content, or your breach of these terms.
            </P>
          </>
        ),
      },
      {
        id: 'disputes',
        heading: 'Disputes',
        body: (
          <>
            <P>
              <strong>Between buyers and sellers.</strong> Contact the other party first — most
              problems are settled that way. If you cannot resolve it, contact us and we will try
              to help, but we are not obliged to arbitrate, and a decision by us does not stop
              you pursuing your legal rights.
            </P>
            <P>
              <strong>With us.</strong> Email{' '}
              <a className="font-semibold text-gold-ink underline underline-offset-2" href={`mailto:${CONTACT}`}>
                {CONTACT}
              </a>{' '}
              and set out the problem. We will try in good faith to resolve it before either side
              starts formal proceedings.
            </P>
          </>
        ),
      },
      {
        id: 'general',
        heading: 'General',
        body: (
          <>
            <UL>
              <LI>
                <strong>Changes.</strong> We may update these terms. The date at the top shows
                the current version, and we will give reasonable notice of material changes.
                Continuing to use the site afterwards means you accept them; if you do not, close
                your account.
              </LI>
              <LI>
                <strong>Severability.</strong> If a clause is unenforceable, the rest still
                applies.
              </LI>
              <LI>
                <strong>No waiver.</strong> Not enforcing a term once does not waive it.
              </LI>
              <LI>
                <strong>Transfer.</strong> You may not transfer your rights under these terms. We
                may transfer ours if the business is sold, provided your rights are not reduced.
              </LI>
              <LI>
                <strong>Whole agreement.</strong> These terms, with the seller policies, fees
                page and privacy policy, are the entire agreement between us.
              </LI>
            </UL>
          </>
        ),
      },
      {
        id: 'law',
        heading: 'Governing law',
        body: (
          <>
            <div className="mb-4 flex gap-3 rounded-lg border-2 border-sale/40 bg-sale/10 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-sale" />
              <p className="text-[0.9375rem] leading-7">
                <strong>To be completed.</strong> The governing law and the courts that hear
                disputes depend on where VMK Store is established, which is a decision for the
                operator and their lawyer. Until this clause is completed, the rest of these
                terms still applies, but the forum for a dispute is unsettled.
              </p>
            </div>
            <P>
              These terms are governed by the laws of <Placeholder>[jurisdiction]</Placeholder>,
              and the courts of <Placeholder>[jurisdiction]</Placeholder> have exclusive
              jurisdiction over any dispute. If you are a consumer, this does not deprive you of
              the protection of the mandatory laws of the country where you live, or of your
              right to bring proceedings there.
            </P>
          </>
        ),
      },
      {
        id: 'contact-terms',
        heading: 'Contacting us',
        body: (
          <P>
            Questions about these terms go to{' '}
            <a className="font-semibold text-gold-ink underline underline-offset-2" href={`mailto:${CONTACT}`}>
              {CONTACT}
            </a>
            .
          </P>
        ),
      },
    ]}
  />
);

/* ==========================================================================
 * Cookie Policy
 * ======================================================================== */

/** Lets a visitor see and change the choice the banner recorded. */
const ConsentControls = () => {
  const choice = useConsent();
  const at = getConsentDate();

  return (
    <div className="mb-4 rounded-lg border border-border bg-muted/50 p-5">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-wide">Your current choice</h3>
      {choice === null ? (
        <p className="mb-4 text-[0.9375rem] leading-7 text-muted-foreground">
          You have not made a choice yet. Until you do, optional storage is treated as
          refused.
        </p>
      ) : (
        <p className="mb-4 text-[0.9375rem] leading-7 text-muted-foreground">
          You chose{' '}
          <strong className="text-foreground">
            {choice === 'granted' ? 'to allow optional storage' : 'essential storage only'}
          </strong>
          {at ? ` on ${new Date(at).toLocaleDateString()}` : ''}. Nothing optional is in use at
          present either way.
        </p>
      )}
      <Button variant="outline" onClick={resetConsent}>
        {choice === null ? 'Show the choice again' : 'Change my choice'}
      </Button>
    </div>
  );
};

export const Cookies = () => (
  <LegalDocument
    eyebrow="Legal"
    title="Cookie"
    highlight="Policy"
    icon={Cookie}
    hue="amber"
    sections={[
      {
        id: 'what',
        heading: 'What this covers',
        body: (
          <>
            <P>
              &ldquo;Cookies&rdquo; is the usual shorthand, but this policy covers every way the
              site can keep information in your browser, including local storage — which is what
              VMK Store actually uses.
            </P>
            <P>
              A cookie is a small file a site asks your browser to store and send back on later
              visits. Local storage is similar, but is only read by the site&rsquo;s own code and
              is not attached to every request.
            </P>
          </>
        ),
      },
      {
        id: 'what-we-use',
        heading: 'What VMK Store stores',
        body: (
          <>
            <P>
              This is the complete list. If it changes, this page changes with it and you will be
              asked again where your agreement is needed.
            </P>
            <H3>Strictly necessary</H3>
            <P>
              These make the site work. They cannot be switched off, and no consent is required
              for them, because without them the service you asked for cannot be delivered.
            </P>
            <DataTable
              rows={[
                [
                  'sb-…-auth-token',
                  'Keeps you signed in between pages, and lets the site show your basket, orders and account. Set by our authentication provider, Supabase.',
                  'Until you sign out or it expires',
                ],
                [
                  'vmk-cookie-consent',
                  'Remembers the choice you made below, so you are not asked on every visit.',
                  'Until you clear it or change your choice',
                ],
              ]}
            />

            <H3>Optional</H3>
            <P>
              <strong>None at present.</strong> VMK Store runs no analytics, no advertising
              tags, no social media pixels and no cross-site trackers, and loads no third-party
              scripts or fonts that could be used to track you. If that changes, nothing optional
              will run until you have agreed to it.
            </P>
          </>
        ),
      },
      {
        id: 'choice',
        heading: 'Your choice',
        body: (
          <>
            <P>
              We ask for your decision up front rather than waiting until there is something to
              track, so that your answer is already recorded. Refusing changes nothing about how
              the site behaves today.
            </P>
            <ConsentControls />
            <P>
              You can also clear browser storage for this site at any time through your
              browser&rsquo;s settings. Doing so signs you out, because the sign-in session is
              stored the same way.
            </P>
          </>
        ),
      },
      {
        id: 'third-party',
        heading: 'Third parties',
        body: (
          <>
            <P>
              The site is served by Vercel and its data is held by Supabase. Both keep standard
              server logs, which are generated by handling a request rather than by storing
              anything in your browser. Neither is used to build an advertising profile of you.
            </P>
            <P>
              Product images are served from VMK Store&rsquo;s own domain, not a third-party
              image host, so viewing a product page does not disclose your visit to another
              company.
            </P>
          </>
        ),
      },
      {
        id: 'cookie-changes',
        heading: 'Changes to this policy',
        body: (
          <P>
            If we introduce anything that stores information in your browser beyond the two items
            listed above, we will update this page and ask for your agreement before it runs. The
            date at the top shows the current version.
          </P>
        ),
      },
      {
        id: 'cookie-contact',
        heading: 'Contacting us',
        body: (
          <P>
            Questions about this policy, or about how the site uses your browser, go to{' '}
            <a className="font-semibold text-gold-ink underline underline-offset-2" href={`mailto:${CONTACT}`}>
              {CONTACT}
            </a>
            . See also the{' '}
            <Link to="/privacy" className="font-semibold text-gold-ink underline underline-offset-2">
              privacy policy
            </Link>{' '}
            for how personal information is handled more broadly.
          </P>
        ),
      },
    ]}
  />
);

export default LegalDocument;
