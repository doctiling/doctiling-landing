'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import {
  LANDING_EVENTS,
  consentBootstrapScript,
  ctaFromHref,
  dataLayerTrack,
  readConsentChoice,
  saveConsentChoice,
  type ConsentChoice,
} from '../analytics';
import { landingMessages, translate, type LandingLocale } from '../i18n';

export interface LandingAnalyticsProps {
  /** Google tag / Tag Manager container id (`GTM-…`, `GT-…` or a `G-…` measurement id). Absent = no tag. */
  tagId?: string;
  locale: LandingLocale;
  /** Absolute or root-relative link to the cookie policy (the host owns that page). */
  cookiesHref: string;
  /**
   * Parent domain for the consent cookie (e.g. `.doctiling.app`) so the choice
   * made on the landing also holds on the studio subdomain. Absent = this host only.
   */
  consentCookieDomain?: string;
}

// Mounted once by the host, in the layout of its marketing routes (the studio
// has its own tag; both share the consent cookie). Lives outside
// LandingHostProvider on purpose: it only needs the locale and one link.
export function LandingAnalytics({ tagId, locale, cookiesHref, consentCookieDomain }: LandingAnalyticsProps) {
  const t = (key: string) => translate(landingMessages(locale), key);
  const [choice, setChoice] = useState<ConsentChoice | null | 'unknown'>('unknown');

  useEffect(() => setChoice(readConsentChoice(consentCookieDomain)), [consentCookieDomain]);

  // One delegated listener measures every CTA without touching the sections:
  // product links (sign in / open the app), downloads, and any element that
  // opts in with `data-analytics="name"`.
  useEffect(() => {
    if (!tagId) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.('a[href], [data-analytics]');
      if (!el) return;
      const named = el.getAttribute('data-analytics');
      const href = el.getAttribute('href') ?? '';
      const cta = named ?? ctaFromHref(href);
      if (!cta) return;
      dataLayerTrack(LANDING_EVENTS.ctaClick, {
        cta,
        link_url: href || undefined,
        link_text: (el.textContent ?? '').trim().slice(0, 80) || undefined,
        section: el.closest('section[id]')?.id,
      });
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, [tagId]);

  if (!tagId) return null;

  const decide = (c: ConsentChoice) => {
    saveConsentChoice(c, consentCookieDomain);
    setChoice(c);
  };

  return (
    <>
      <Script id="landing-consent" strategy="beforeInteractive">
        {consentBootstrapScript()}
      </Script>
      <Script
        id="landing-tag"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/${tagId.startsWith('GTM-') ? 'gtm.js' : 'gtag/js'}?id=${encodeURIComponent(tagId)}`}
      />
      {!tagId.startsWith('GTM-') && (
        <Script id="landing-tag-config" strategy="afterInteractive">
          {`gtag('config',${JSON.stringify(tagId)});`}
        </Script>
      )}
      {choice === null && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label={t('landing.cookies.title')}
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto flex max-w-2xl flex-col gap-3 border border-border bg-background/95 p-4 text-sm text-foreground shadow-lg backdrop-blur sm:flex-row sm:items-center"
        >
          <p className="flex-1 text-muted-foreground">
            {t('landing.cookies.message')}{' '}
            <a href={cookiesHref} className="underline underline-offset-4 hover:text-foreground">
              {t('landing.cookies.policy')}
            </a>
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => decide('rejected')}
              className="border border-border px-3 py-1.5 text-xs font-medium uppercase tracking-widest hover:bg-muted"
            >
              {t('landing.cookies.reject')}
            </button>
            <button
              type="button"
              onClick={() => decide('accepted')}
              className="bg-foreground px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-background hover:opacity-90"
            >
              {t('landing.cookies.accept')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
