'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { cn } from '@doctiling/ui/cn';
import { useLandingHost } from '../host';
import { Reveal } from './Reveal';
import { DemoRequestForm } from './DemoRequestForm';
import { QuoteRequestForm } from './QuoteRequestForm';

// One place to get in touch. A person (or a team trying it) asks for access; a
// company asks for a quote — two tabs of one section instead of two forms one
// after the other. `#demo` opens the access tab, `#cotizar` the quote tab; the
// quote exists only where the host can take it (doctiling-billing US13).
export const QUOTE_HASH = '#cotizar';
type Tab = 'demo' | 'quote';

export function ContactSection() {
  const { t, submitQuoteRequest } = useLandingHost();
  const canQuote = Boolean(submitQuoteRequest);
  const [tab, setTab] = useState<Tab>('demo');

  useEffect(() => {
    if (!canQuote) return;
    const openFromHash = () => {
      if (window.location.hash === QUOTE_HASH) setTab('quote');
      else if (window.location.hash === '#demo') setTab('demo');
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [canQuote]);

  const copy = tab === 'quote' ? 'landing.quote' : 'landing.demo';

  return (
    <section id="demo" className="relative scroll-mt-16 border-t border-border">
      {/* The quote anchor lands on the same section. */}
      <span id="cotizar" className="absolute -top-16" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <MiniTitle className="mb-6">{t(`${copy}.eyebrow`)}</MiniTitle>
            <H2 className="max-w-md text-balance text-4xl not-italic leading-tight sm:text-5xl">{t(`${copy}.title`)}</H2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">{t(`${copy}.body`)}</p>
            {tab === 'demo' && (
              <p className="mt-6 flex items-start gap-2 text-sm font-medium text-foreground/80">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                {t('landing.hero.freeBadge')}
              </p>
            )}
          </Reveal>
          <Reveal delay={140} className="lg:col-span-7">
            {canQuote && (
              <div
                role="tablist"
                aria-label={t('landing.contact.tablistLabel')}
                className="mb-4 inline-flex rounded-full border border-border bg-card p-1"
              >
                {(['demo', 'quote'] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    id={`contact-tab-${key}`}
                    aria-selected={tab === key}
                    aria-controls="contact-panel"
                    onClick={() => setTab(key)}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                      tab === key ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {t(`landing.contact.tabs.${key}`)}
                  </button>
                ))}
              </div>
            )}
            <div
              id="contact-panel"
              role={canQuote ? 'tabpanel' : undefined}
              aria-labelledby={canQuote ? `contact-tab-${tab}` : undefined}
              className="landing-card p-6 sm:p-8"
            >
              {tab === 'quote' && canQuote ? <QuoteRequestForm /> : <DemoRequestForm />}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
