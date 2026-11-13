'use client';

import Link from 'next/link';
import { ArrowUpRight, Briefcase, Code, GraduationCap, Landmark, Scale, Stethoscope } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLandingHost } from '../host';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { BrowserFrame } from '@doctiling/ui/molecules/browser-frame';
import { Reveal } from './Reveal';
import { SubPageShell } from './SubPageShell';
import { HeroAccessForm } from './HeroAccessForm';
import { FaqList } from './FaqList';
import { useCasePath } from '../routes';
import {
  USE_CASES,
  USE_CASE_FAQ_KEYS,
  USE_CASE_SLUGS,
  USE_CASE_STEP_KEYS,
  type UseCaseSlug,
} from '../use-cases';

const ICONS: Record<UseCaseSlug, LucideIcon> = {
  legal: Scale,
  consulting: Briefcase,
  healthcare: Stethoscope,
  finance: Landmark,
  research: GraduationCap,
  'engineering-teams': Code,
};

/** Name of the use-case CTAs in `cta_click` / `generate_lead` (LandingAnalytics). */
export const USE_CASE_CTA = 'use_case_cta';

// One component renders every use case from the catalogue (src/use-cases.ts) and
// the `useCasesPage.items.{slug}` copy. The first two paragraphs answer the
// question the page ranks for, so a search engine or an LLM can quote them alone.
export default function UseCasePageClient({ slug }: { slug: UseCaseSlug }) {
  const { t, locale, isAuthenticated, landingHref } = useLandingHost();
  const k = (key: string) => `useCasesPage.items.${slug}.${key}`;
  const entry = USE_CASES[slug];
  const Icon = ICONS[slug];
  const others = USE_CASE_SLUGS.filter((s) => s !== slug);
  const page = useCasePath(slug);

  return (
    <SubPageShell
      eyebrow={t('useCasesPage.labels.eyebrow')}
      title={t(k('h1'))}
      lede={
        <div className="flex max-w-2xl flex-col gap-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>{t(k('answer'))}</p>
          <p>{t(k('answer2'))}</p>
        </div>
      }
      heroAction={
        isAuthenticated ? null : (
          <div id="access" className="mt-2">
            <HeroAccessForm
              detailsHref={`${landingHref()}#demo`}
              form="use_case"
              page={page}
              analytics={USE_CASE_CTA}
            />
          </div>
        )
      }
      ctaAnalytics={USE_CASE_CTA}
      siblings={[
        { href: `/${locale}/documents`, label: t('landing.nav.links.docTypes') },
        { href: `/${locale}/connect`, label: t('landing.nav.links.connect') },
      ]}
    >
      {/* PROBLEM → SOLUTION */}
      <section id="solution" className="border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-12 lg:px-10">
          <Reveal className="lg:col-span-5">
            <Icon className="size-9 text-accent/70" aria-hidden="true" />
            <MiniTitle className="mb-2 mt-6">{t('useCasesPage.labels.problem')}</MiniTitle>
            <p className="text-base leading-relaxed text-muted-foreground">{t(k('problem'))}</p>
          </Reveal>
          <Reveal delay={120} className="flex flex-col gap-8 lg:col-span-7">
            <div>
              <H2 className="text-balance text-3xl not-italic leading-tight">{t('useCasesPage.labels.solution')}</H2>
              <p className="mt-4 text-base leading-relaxed text-foreground/80">{t(k('solution'))}</p>
            </div>
            <div>
              <MiniTitle className="mb-3">{t('useCasesPage.labels.steps')}</MiniTitle>
              <ol className="flex flex-col gap-3">
                {USE_CASE_STEP_KEYS.map((step, i) => (
                  <li key={step} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span aria-hidden="true" className="font-mono text-xs text-accent/70">
                      0{i + 1}
                    </span>
                    {t(k(`steps.${step}`))}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
        <div className="mx-auto max-w-5xl px-6 pb-20 lg:px-10">
          <Reveal className="flex flex-col gap-5">
            <BrowserFrame src={entry.screenshot} alt={t(k('shotAlt'))} />
            <p className="text-center text-sm leading-relaxed text-muted-foreground">
              {t('useCasesPage.labels.shotCaption')}
            </p>
          </Reveal>
        </div>
      </section>

      <FaqList
        title={t('useCasesPage.labels.faq')}
        items={USE_CASE_FAQ_KEYS.map((q) => ({ id: q, q: t(k(`faq.${q}.q`)), a: t(k(`faq.${q}.a`)) }))}
      />

      {/* INTERNAL LINKS */}
      <section id="related" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <MiniTitle className="mb-4">{t('useCasesPage.labels.explore')}</MiniTitle>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {(
              [
                [`/${locale}/documents`, 'documentsLink'],
                [`/${locale}/connect`, 'connectLink'],
                [`/${locale}/verticals${entry.vertical ? `#${entry.vertical}` : ''}`, 'verticalsLink'],
              ] as const
            ).map(([href, label]) => (
              <li key={label}>
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 font-display text-lg text-accent transition-colors hover:text-foreground"
                >
                  {t(`useCasesPage.labels.${label}`)}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>

          <H2 className="mt-16 text-balance text-3xl not-italic leading-tight">{t('useCasesPage.labels.related')}</H2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other) => {
              const OtherIcon = ICONS[other];
              return (
                <Link
                  key={other}
                  href={`/${locale}/${useCasePath(other)}`}
                  className="flex h-full flex-col gap-3 rounded-lg border border-border bg-background p-6 transition-colors hover:border-accent/50 hover:bg-card/60"
                >
                  <OtherIcon className="size-6 text-accent/70" aria-hidden="true" />
                  <span className="font-display text-xl leading-snug">{t(`useCasesPage.items.${other}.h1`)}</span>
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {t(`useCasesPage.items.${other}.card`)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </SubPageShell>
  );
}
