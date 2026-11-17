'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { useLandingHost, useLandingText } from '../host';
import { Button } from '@doctiling/ui/atoms/button';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { Reveal } from './Reveal';

// Who pays: a person (their own account in the shared studio) or a company (a private
// studio plus each member's plan). The two never share a price, so each gets its own tab.
const AUDIENCE_KEYS = ['personal', 'gold'] as const;
type Audience = (typeof AUDIENCE_KEYS)[number];
// The other two ways in: a sponsored seat by invitation and a sovereign, custom studio.
const OTHER_KEYS = ['free', 'platinum'] as const;
// Same plans for both audiences: the plan sets the AI queries and the space, not who pays.
const PLAN_KEYS = ['basic', 'advanced', 'max'] as const;
// The plan names the billing service and the paid sign-up use (doctiling-billing `GET /v1/plans`).
const BILLING_PLAN = { basic: 'basico', advanced: 'avanzado', max: 'maximo' } as const;
const BENEFIT_KEYS = ['b1', 'b2', 'b3', 'b4', 'b5'] as const;
const USE_KEYS = ['s1', 's2', 's3'] as const;
const TOPUP_STEP_KEYS = ['s1', 's2', 's3', 's4'] as const;
const PACK_KEYS = ['p50', 'p200', 'p500', 'p1000'] as const;
const PART_KEYS = ['compute', 'studio', 'info', 'ai'] as const;
const BILLING_KEYS = ['fixed', 'monthly', 'annual', 'ownAi', 'overdue', 'cancel'] as const;
// d9 (external chat) reads before d8, which closes the list: what is still being switched on.
const DISCLAIMER_KEYS = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd9', 'd8'] as const;
// A company may bring its own AI provider and its own database: it then pays only the studio.
const BYO_KEYS = ['ai', 'db'] as const;

export function TiersSection({ requestAccessHref }: { requestAccessHref: string }) {
  const { t } = useLandingText();
  const { plansHref, submitQuoteRequest } = useLandingHost();
  // A company asks for a quote where the host takes one; otherwise, the demo request (as before).
  const companyHref = submitQuoteRequest ? '#cotizar' : '#demo';
  const [audience, setAudience] = useState<Audience>('gold');

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

        <div
          role="tablist"
          aria-label={t('landing.tiers.tabs.label')}
          className="mx-auto mt-10 flex w-fit max-w-full gap-1 rounded-full border border-border bg-background p-1"
        >
          {AUDIENCE_KEYS.map((key) => {
            const selected = key === audience;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                id={`tiers-tab-${key}`}
                aria-selected={selected}
                aria-controls={`tiers-panel-${key}`}
                onClick={() => setAudience(key)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                  selected ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t(`landing.tiers.tabs.${key}`)}
              </button>
            );
          })}
        </div>

        {/* Both panels stay in the document (the inactive one hidden) so each audience's prices are crawlable. */}
        {AUDIENCE_KEYS.map((key) => (
          <div
            key={key}
            role="tabpanel"
            id={`tiers-panel-${key}`}
            aria-labelledby={`tiers-tab-${key}`}
            data-audience={key}
            hidden={key !== audience}
            className="mt-10"
          >
            <article className="landing-card flex flex-col gap-8 p-8 lg:flex-row lg:items-start lg:gap-12">
              <div className="lg:w-2/5">
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {t(`landing.tiers.items.${key}.eyebrow`)}
                </span>
                <h3 className="mt-3 font-display text-2xl leading-snug">{t(`landing.tiers.items.${key}.name`)}</h3>
                <p className="mt-3 font-display text-4xl tracking-tight">{t(`landing.tiers.items.${key}.price`)}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {t(`landing.tiers.items.${key}.priceNote`)}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {t(`landing.tiers.items.${key}.body`)}
                </p>
                <div className="mt-6">
                  <Button asChild variant="pill" size="pill">
                    {/* A person buys online; a company asks for a quote (the tenant is created from it). */}
                    <Link href={key === 'personal' ? plansHref() : companyHref}>
                      {t(`landing.tiers.items.${key}.cta`)} <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2">
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t(`landing.tiers.items.${key}.benefitsTitle`)}
                  </h4>
                  <ul className="mt-4 space-y-2.5">
                    {BENEFIT_KEYS.map((b) => (
                      <li key={b} className="flex gap-2.5 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                        <span className="text-foreground/85">{t(`landing.tiers.items.${key}.benefits.${b}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t(`landing.tiers.items.${key}.useTitle`)}
                  </h4>
                  <ol className="mt-4 space-y-4">
                    {USE_KEYS.map((s, i) => (
                      <li key={s} className="flex gap-3 text-sm">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-[11px]">
                          {i + 1}
                        </span>
                        <span>
                          <span className="font-medium">{t(`landing.tiers.items.${key}.use.${s}.title`)}</span>{' '}
                          <span className="text-muted-foreground">{t(`landing.tiers.items.${key}.use.${s}.body`)}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </article>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
              {PLAN_KEYS.map((plan) => {
                const recommended = plan === 'advanced';
                // The charge in pesos, where the price above is a reference in another currency;
                // empty in the locale that already prices in pesos.
                const billed = t(`landing.tiers.items.${key}.billed.${plan}`);
                return (
                  <article
                    key={plan}
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
                      {(['daily', 'info', 'ext', 'fit'] as const).map((line) => (
                        <li key={line} className="flex gap-2.5 text-sm">
                          <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                          <span className="text-foreground/85">{t(`landing.tiers.plans.items.${plan}.${line}`)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto border-t border-border px-7 py-5">
                      <p className="text-xs text-muted-foreground">{t(`landing.tiers.items.${key}.priceLabel`)}</p>
                      <p data-price className="mt-1 font-display text-3xl tracking-tight">
                        {t(`landing.tiers.items.${key}.prices.${plan}`)}
                      </p>
                      {billed && (
                        <p data-billed className="mt-1 text-xs text-muted-foreground">
                          {billed}
                        </p>
                      )}
                      {key === 'personal' && (
                        <Button asChild variant={recommended ? 'pill' : 'pill-outline'} size="pill" className="mt-4 w-full">
                          <Link
                            href={plansHref(BILLING_PLAN[plan])}
                            data-buy={BILLING_PLAN[plan]}
                            aria-label={`${t('landing.tiers.plans.choose')}: ${t(`landing.tiers.plans.items.${plan}.name`)}`}
                          >
                            {t('landing.tiers.plans.choose')} <ArrowUpRight className="size-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
              {t(`landing.tiers.items.${key}.note`)}
            </p>
            {key === 'gold' && (
              <article data-byo className="landing-card mt-10 !border-accent p-8">
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {t('landing.tiers.byo.eyebrow')}
                </span>
                <h3 className="mt-3 font-display text-2xl leading-snug">{t('landing.tiers.byo.title')}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {t('landing.tiers.byo.body')}
                </p>
                <dl className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                  {BYO_KEYS.map((item) => (
                    <div key={item} className="rounded-lg border border-border bg-background p-5">
                      <dt className="text-sm font-medium">{t(`landing.tiers.byo.items.${item}.title`)}</dt>
                      <dd className="mt-2 font-display text-2xl tracking-tight">
                        {t(`landing.tiers.byo.items.${item}.price`)}
                      </dd>
                      <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {t(`landing.tiers.byo.items.${item}.body`)}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-xs leading-relaxed text-muted-foreground">{t('landing.tiers.byo.note')}</p>
              </article>
            )}
          </div>
        ))}

        <Reveal className="mt-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
            <h3 className="font-display text-3xl leading-tight sm:text-4xl">{t('landing.tiers.topups.title')}</h3>
            <p className="text-base leading-relaxed text-muted-foreground">{t('landing.tiers.topups.body')}</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <ol className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {TOPUP_STEP_KEYS.map((s, i) => (
                <li key={s} className="border-t border-border pt-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{i + 1}</span>
                  <p className="mt-1 font-display text-xl leading-snug">{t(`landing.tiers.topups.steps.${s}.title`)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`landing.tiers.topups.steps.${s}.body`)}
                  </p>
                </li>
              ))}
            </ol>
            <div className="landing-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-left">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-medium">
                      {t('landing.tiers.topups.cols.pack')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right font-medium">
                      {t('landing.tiers.topups.cols.price')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right font-medium">
                      {t('landing.tiers.topups.cols.each')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PACK_KEYS.map((pack) => (
                    <tr key={pack} data-pack={pack} className="border-t border-border">
                      <th scope="row" className="px-6 py-4 text-left font-normal">
                        {t(`landing.tiers.topups.packs.${pack}.name`)}
                      </th>
                      <td className="px-6 py-4 text-right font-display text-xl tracking-tight">
                        {t(`landing.tiers.topups.packs.${pack}.price`)}
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground">
                        {t(`landing.tiers.topups.packs.${pack}.each`)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-border px-6 py-4 text-xs leading-relaxed text-muted-foreground">
                {t('landing.tiers.topups.note')}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
            <h3 className="font-display text-3xl leading-tight sm:text-4xl">{t('landing.tiers.parts.title')}</h3>
            <p className="text-base leading-relaxed text-muted-foreground">{t('landing.tiers.parts.body')}</p>
          </div>
          <dl className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PART_KEYS.map((part) => (
              <div key={part} className="landing-card p-6">
                <dt className="font-display text-xl leading-snug">{t(`landing.tiers.parts.items.${part}.title`)}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`landing.tiers.parts.items.${part}.body`)}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="mt-24">
          <h3 className="text-center font-display text-3xl leading-tight sm:text-4xl">
            {t('landing.tiers.billing.title')}
          </h3>
          <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {BILLING_KEYS.map((key) => (
              // Own AI is a company's option: a person never sees it, like the [data-byo] card.
              <div
                key={key}
                data-billing={key}
                hidden={key === 'ownAi' && audience !== 'gold'}
                className="border-t border-border pt-5"
              >
                <dt className="font-display text-xl leading-snug">{t(`landing.tiers.billing.items.${key}.title`)}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`landing.tiers.billing.items.${key}.body`)}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

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
                    <Link href={tier === 'free' ? requestAccessHref : companyHref}>
                      {t(`landing.tiers.items.${tier}.cta`)} <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal className="mx-auto mt-20 max-w-4xl">
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {t('landing.tiers.disclaimers.title')}
          </h3>
          <ul className="mt-4 space-y-2 text-xs leading-relaxed text-muted-foreground">
            {DISCLAIMER_KEYS.map((d) => (
              <li key={d} data-disclaimer={d}>
                {t(`landing.tiers.disclaimers.items.${d}`)}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
