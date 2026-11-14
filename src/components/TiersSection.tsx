'use client';

import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { useLandingText } from '../host';
import { Button } from '@doctiling/ui/atoms/button';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { Reveal } from './Reveal';

// Who pays: a person (their own account in the shared studio) or a company (a private
// studio plus each member's plan). The two never share a price, so each gets its own card.
const AUDIENCE_KEYS = ['personal', 'gold'] as const;
// The other two ways in: a sponsored seat by invitation and a sovereign, custom studio.
const OTHER_KEYS = ['free', 'platinum'] as const;
// Same plans for both audiences: the plan sets the AI queries and the space, not who pays.
const PLAN_KEYS = ['basic', 'advanced', 'max'] as const;
const BILLING_KEYS = ['fixed', 'monthly', 'topup', 'annual', 'ownAi', 'cancel'] as const;
const BULLET_KEYS = ['p1', 'p2', 'p3'] as const;

export function TiersSection({ requestAccessHref }: { requestAccessHref: string }) {
  const { t } = useLandingText();
  // A key the dictionary does not carry echoes itself: that is how optional lines are skipped.
  const optional = (key: string) => {
    const text = t(key);
    return text === key ? null : text;
  };

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

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {AUDIENCE_KEYS.map((tier, i) => {
            const highlighted = tier === 'gold';
            const muted = highlighted ? 'text-accent-foreground/75' : 'text-muted-foreground';
            return (
              <Reveal key={tier} delay={i * 120}>
                <article
                  data-audience={tier}
                  className={`landing-card landing-card-hover relative flex h-full flex-col p-8 ${
                    highlighted ? '!border-accent !bg-accent text-accent-foreground' : ''
                  }`}
                >
                  {highlighted && (
                    <span className="absolute right-6 top-0 -translate-y-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground shadow-sm">
                      {t('landing.tiers.items.gold.badge')}
                    </span>
                  )}
                  <span className={`font-mono text-[11px] uppercase tracking-widest ${muted}`}>
                    {t(`landing.tiers.items.${tier}.eyebrow`)}
                  </span>
                  <h3 className="mt-3 font-display text-2xl leading-snug">{t(`landing.tiers.items.${tier}.name`)}</h3>
                  <p className="mt-3 font-display text-4xl tracking-tight">{t(`landing.tiers.items.${tier}.price`)}</p>
                  <p className={`mt-1 text-xs leading-relaxed ${muted}`}>{t(`landing.tiers.items.${tier}.priceNote`)}</p>
                  <p className={`mt-4 text-sm leading-relaxed ${muted}`}>{t(`landing.tiers.items.${tier}.body`)}</p>

                  <div
                    className={`mt-6 rounded-lg border p-5 ${
                      highlighted ? 'border-accent-foreground/25' : 'border-border bg-background'
                    }`}
                  >
                    <p className={`font-mono text-[10px] uppercase tracking-widest ${muted}`}>
                      {t(`landing.tiers.items.${tier}.plansTitle`)}
                    </p>
                    <dl className="mt-3 space-y-2">
                      {PLAN_KEYS.map((plan) => (
                        <div key={plan} className="flex items-baseline justify-between gap-4">
                          <dt className="text-sm">{t(`landing.tiers.items.${tier}.plans.${plan}`)}</dt>
                          <dd className="font-display text-xl tracking-tight">
                            {t(`landing.tiers.items.${tier}.prices.${plan}`)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <p className={`mt-4 text-xs leading-relaxed ${muted}`}>{t(`landing.tiers.items.${tier}.note`)}</p>
                  </div>

                  <ul className="mt-6 space-y-2.5">
                    {BULLET_KEYS.map((p) => {
                      const text = optional(`landing.tiers.items.${tier}.bullets.${p}`);
                      if (!text) return null;
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
                      <Link href="#demo">
                        {t(`landing.tiers.items.${tier}.cta`)} <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mx-auto mt-24 flex max-w-3xl flex-col items-center gap-3 text-center">
          <h3 className="font-display text-3xl leading-tight sm:text-4xl">{t('landing.tiers.plans.title')}</h3>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{t('landing.tiers.plans.body')}</p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
          {PLAN_KEYS.map((plan, i) => {
            const recommended = plan === 'advanced';
            return (
              <Reveal key={plan} delay={i * 120}>
                <article
                  data-plan={plan}
                  className={`landing-card relative flex h-full flex-col overflow-hidden ${
                    recommended ? '!border-accent' : ''
                  }`}
                >
                  <div className={`px-7 py-6 ${recommended ? 'bg-accent text-accent-foreground' : 'bg-secondary'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-mono text-[11px] uppercase tracking-widest">
                        {t(`landing.tiers.plans.items.${plan}.name`)}
                      </h4>
                      {recommended && (
                        <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                          {t('landing.tiers.plans.badge')}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 font-display text-2xl leading-snug">
                      {t(`landing.tiers.plans.items.${plan}.queries`)}
                    </p>
                  </div>
                  <ul className="space-y-2.5 px-7 py-6">
                    {(['daily', 'info'] as const).map((line) => (
                      <li key={line} className="flex gap-2.5 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                        <span className="text-foreground/85">{t(`landing.tiers.plans.items.${plan}.${line}`)}</span>
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-auto space-y-2 border-t border-border px-7 py-5">
                    {(['personal', 'team'] as const).map((who) => (
                      <div key={who} className="flex items-baseline justify-between gap-4">
                        <dt className="text-xs text-muted-foreground">{t(`landing.tiers.plans.${who}Label`)}</dt>
                        <dd className="font-display text-xl tracking-tight">
                          {t(`landing.tiers.plans.items.${plan}.${who}Price`)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-20">
          <h3 className="text-center font-display text-2xl leading-tight sm:text-3xl">{t('landing.tiers.other')}</h3>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
            {OTHER_KEYS.map((tier) => (
              <article key={tier} className="landing-card landing-card-hover flex h-full flex-col p-7">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {t(`landing.tiers.items.${tier}.eyebrow`)}
                </span>
                <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4 className="font-display text-xl leading-snug">{t(`landing.tiers.items.${tier}.name`)}</h4>
                  <p className="font-display text-2xl tracking-tight">{t(`landing.tiers.items.${tier}.price`)}</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t(`landing.tiers.items.${tier}.body`)}
                </p>
                <div className="mt-auto pt-6">
                  <Button asChild variant="pill" size="pill">
                    <Link href={tier === 'free' ? requestAccessHref : '#demo'}>
                      {t(`landing.tiers.items.${tier}.cta`)} <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-20">
          <h3 className="text-center font-display text-3xl leading-tight sm:text-4xl">
            {t('landing.tiers.billing.title')}
          </h3>
          <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {BILLING_KEYS.map((key) => (
              <div key={key} className="border-t border-border pt-5">
                <dt className="font-display text-xl leading-snug">{t(`landing.tiers.billing.items.${key}.title`)}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`landing.tiers.billing.items.${key}.body`)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
            {t('landing.tiers.billing.note')}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
