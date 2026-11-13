'use client';

import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { useLandingHost } from '../host';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { Reveal } from './Reveal';
import { SubPageShell } from './SubPageShell';
import { HeroAccessForm } from './HeroAccessForm';
import { FaqList } from './FaqList';
import { comparePath, useCasePath } from '../routes';
import {
  COMPARE,
  COMPARE_CHOICE_KEYS,
  COMPARE_FAQ_KEYS,
  COMPARE_ROW_KEYS,
  COMPARE_SLUGS,
  type CompareSlug,
} from '../compare';
import { USE_CASE_SLUGS } from '../use-cases';

function SourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className="whitespace-nowrap text-xs text-accent underline-offset-4 hover:underline"
    >
      {label}
    </a>
  );
}

/** Name of the comparison CTAs in `cta_click` / `generate_lead` (LandingAnalytics). */
export const COMPARE_CTA = 'compare_cta';

// One component renders every "Doctiling vs X" page from the catalogue
// (src/compare.ts) and the `comparePage.items.{slug}` copy. The verdict opens the
// page in two lines so it can be quoted alone; every competitor cell links to the
// competitor's own page that supports it.
export default function ComparePageClient({ slug }: { slug: CompareSlug }) {
  const { t, locale, isAuthenticated, landingHref } = useLandingHost();
  const k = (key: string) => `comparePage.items.${slug}.${key}`;
  const entry = COMPARE[slug];
  const name = t(k('name'));
  const page = comparePath(slug);

  return (
    <SubPageShell
      eyebrow={t('comparePage.labels.eyebrow')}
      title={t(k('h1'))}
      lede={
        <div className="flex max-w-2xl flex-col gap-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>{t(k('verdict'))}</p>
          <p>{t(k('verdict2'))}</p>
        </div>
      }
      heroAction={
        isAuthenticated ? null : (
          <div id="access" className="mt-2">
            <HeroAccessForm detailsHref={`${landingHref()}#demo`} form="compare" page={page} analytics={COMPARE_CTA} />
          </div>
        )
      }
      ctaAnalytics={COMPARE_CTA}
      siblings={[
        { href: `/${locale}/documents`, label: t('landing.nav.links.docTypes') },
        { href: `/${locale}/connect`, label: t('landing.nav.links.connect') },
      ]}
    >
      {/* TABLE */}
      <section id="table" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
          <H2 className="text-balance text-3xl not-italic leading-tight">
            {t('comparePage.labels.tableTitle', { name })}
          </H2>
          <div className="mt-10 hidden overflow-x-auto rounded-lg border border-border md:block">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <caption className="sr-only">{t('comparePage.labels.tableTitle', { name })}</caption>
              <thead className="bg-card/60">
                <tr>
                  <th scope="col" className="w-1/5 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t('comparePage.labels.criterion')}
                  </th>
                  <th scope="col" className="w-2/5 px-4 py-3 font-display text-lg">Doctiling</th>
                  <th scope="col" className="w-2/5 px-4 py-3 font-display text-lg">{name}</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROW_KEYS.map((row) => (
                  <tr key={row} className="border-t border-border align-top">
                    <th scope="row" className="px-4 py-4 font-medium text-foreground">
                      {t(`comparePage.rows.${row}`)}
                    </th>
                    <td className="px-4 py-4 leading-relaxed text-foreground/80">{t(`comparePage.doctiling.${row}`)}</td>
                    <td className="px-4 py-4 leading-relaxed text-muted-foreground">
                      {t(k(`rows.${row}`))}{' '}
                      <SourceLink href={entry.sources[row]} label={t('comparePage.labels.source')} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Phone: one card per criterion instead of a table that scrolls sideways. */}
          <dl className="mt-8 flex flex-col gap-4 md:hidden">
            {COMPARE_ROW_KEYS.map((row) => (
              <div key={row} className="rounded-lg border border-border p-4">
                <dt className="font-medium text-foreground">{t(`comparePage.rows.${row}`)}</dt>
                <dd className="mt-3 text-sm leading-relaxed">
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Doctiling</span>
                  <span className="text-foreground/80">{t(`comparePage.doctiling.${row}`)}</span>
                </dd>
                <dd className="mt-3 text-sm leading-relaxed">
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{name}</span>
                  <span className="text-muted-foreground">{t(k(`rows.${row}`))}</span>{' '}
                  <SourceLink href={entry.sources[row]} label={t('comparePage.labels.source')} />
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {t('comparePage.labels.sourcesNote', { name, date: entry.verifiedOn })}
          </p>
        </div>
      </section>

      {/* WHEN TO CHOOSE EACH */}
      <section id="choose" className="border-b border-border bg-card/60">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-2 lg:px-10">
          {(
            [
              ['chooseDoctiling', t('comparePage.labels.chooseDoctiling')],
              ['chooseOther', t('comparePage.labels.chooseOther', { name })],
            ] as const
          ).map(([group, title], i) => (
            <Reveal key={group} delay={i * 120}>
              <H2 className="text-balance text-2xl not-italic leading-tight">{title}</H2>
              <ul className="mt-6 flex flex-col gap-3">
                {COMPARE_CHOICE_KEYS.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-base leading-relaxed text-muted-foreground">
                    <Check className="mt-1 size-4 shrink-0 text-accent/70" aria-hidden="true" />
                    {t(k(`${group}.${c}`))}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <FaqList
        title={t('comparePage.labels.faq')}
        items={COMPARE_FAQ_KEYS.map((q) => ({ id: q, q: t(k(`faq.${q}.q`)), a: t(k(`faq.${q}.a`)) }))}
      />

      {/* INTERNAL LINKS */}
      <section id="related" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
          <MiniTitle className="mb-4">{t('comparePage.labels.otherComparisons')}</MiniTitle>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {COMPARE_SLUGS.filter((s) => s !== slug).map((other) => (
              <li key={other}>
                <Link
                  href={`/${locale}/${comparePath(other)}`}
                  className="inline-flex items-center gap-2 font-display text-lg text-accent transition-colors hover:text-foreground"
                >
                  {t(`comparePage.items.${other}.h1`)}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <MiniTitle className="mb-4 mt-12">{t('comparePage.labels.useCases')}</MiniTitle>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {USE_CASE_SLUGS.map((useCase) => (
              <li key={useCase}>
                <Link
                  href={`/${locale}/${useCasePath(useCase)}`}
                  className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {t(`useCasesPage.items.${useCase}.h1`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SubPageShell>
  );
}
