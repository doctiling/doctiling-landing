'use client';

import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { useLandingText } from '../host';
import { Button } from '@doctiling/ui/atoms/button';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { Reveal } from './Reveal';

const TIER_KEYS = ['free', 'gold', 'platinum'] as const;

export function TiersSection({ requestAccessHref }: { requestAccessHref: string }) {
  const { t } = useLandingText();

  return (
    <section id="stack" className="border-t border-border bg-card/60">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-10">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <MiniTitle>{t('landing.tiers.eyebrow')}</MiniTitle>
          <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
            {t('landing.tiers.title')}
          </H2>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{t('landing.tiers.body')}</p>
        </Reveal>
        <div className="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
          {TIER_KEYS.map((tier, i) => {
            const highlighted = tier === 'gold';
            return (
              <Reveal key={tier} delay={i * 120}>
                <article
                  className={`landing-card landing-card-hover relative flex h-full flex-col p-8 ${
                    highlighted ? '!border-accent !bg-accent text-accent-foreground' : ''
                  }`}
                >
                  {highlighted && (
                    <span className="absolute right-6 top-0 -translate-y-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground shadow-sm">
                      {t('landing.tiers.items.gold.badge')}
                    </span>
                  )}
                  <span
                    className={`font-mono text-[10px] uppercase tracking-widest ${
                      highlighted ? 'text-accent-foreground/60' : 'text-muted-foreground'
                    }`}
                  >
                    {t(`landing.tiers.items.${tier}.eyebrow`)}
                  </span>
                  <h3 className="mt-3 font-display text-2xl leading-snug">{t(`landing.tiers.items.${tier}.name`)}</h3>
                  <p className="mt-2 font-display text-4xl tracking-tight">{t(`landing.tiers.items.${tier}.price`)}</p>
                  <p
                    className={`mt-4 text-sm leading-relaxed ${
                      highlighted ? 'text-accent-foreground/80' : 'text-muted-foreground'
                    }`}
                  >
                    {t(`landing.tiers.items.${tier}.body`)}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {(['p1', 'p2', 'p3'] as const).map((p) => {
                      const key = `landing.tiers.items.${tier}.bullets.${p}`;
                      const text = t(key);
                      if (text === key) return null;
                      return (
                        <li key={p} className="flex gap-2.5 text-sm">
                          <Check
                            className={`mt-0.5 size-4 shrink-0 ${highlighted ? 'text-primary' : 'text-emerald-600'}`}
                            aria-hidden="true"
                          />
                          <span className={highlighted ? 'text-accent-foreground/90' : 'text-foreground/85'}>{text}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-auto pt-8">
                    <Button
                      asChild
                      variant={highlighted ? 'pill-outline' : 'pill'}
                      size="pill"
                      className={
                        highlighted
                          ? 'w-full border-accent-foreground/40 bg-transparent text-accent-foreground hover:border-accent-foreground hover:bg-accent-foreground hover:text-accent'
                          : 'w-full'
                      }
                    >
                      <Link href={tier === 'free' ? requestAccessHref : '#demo'}>
                        {t(`landing.tiers.items.${tier}.cta`)} <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
