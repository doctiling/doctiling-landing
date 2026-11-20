'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useLandingHost } from '../host';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { SubPageShell } from './SubPageShell';
import { HeroAccessForm } from './HeroAccessForm';
import { FaqList } from './FaqList';
import { guidePath, useCasePath } from '../routes';
import { GUIDES, GUIDE_FAQ_KEYS, GUIDE_SECTION_KEYS, GUIDE_SLUGS, paragraphs, type GuideSlug } from '../guides';

/** Name of the guide CTAs in `cta_click` / `generate_lead` (LandingAnalytics). */
export const GUIDE_CTA = 'guide_cta';

// One component renders every guide from the catalogue (src/guides.ts) and the
// `guidesPage.items.{slug}` copy. The lede answers the searched question on its
// own; the sections are plain HTML headings and paragraphs, so the whole article
// is in the server-rendered page without JavaScript.
export default function GuidePageClient({ slug }: { slug: GuideSlug }) {
  const { t, locale, isAuthenticated, landingHref } = useLandingHost();
  const k = (key: string) => `guidesPage.items.${slug}.${key}`;
  const entry = GUIDES[slug];
  const page = guidePath(slug);
  const others = GUIDE_SLUGS.filter((s) => s !== slug);

  return (
    <SubPageShell
      eyebrow={t('guidesPage.labels.eyebrow')}
      title={t(k('h1'))}
      lede={
        <div className="flex max-w-2xl flex-col gap-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>{t(k('lede'))}</p>
          <p className="text-sm">
            <time dateTime={entry.updated}>
              {t('guidesPage.labels.updated', {
                date: new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(
                  new Date(`${entry.updated}T00:00:00Z`),
                ),
              })}
            </time>
          </p>
        </div>
      }
      heroAction={
        isAuthenticated ? null : (
          <div id="access" className="mt-2">
            <HeroAccessForm detailsHref={`${landingHref()}#demo`} form="guide" page={page} analytics={GUIDE_CTA} />
          </div>
        )
      }
      ctaAnalytics={GUIDE_CTA}
      siblings={[
        { href: `/${locale}/documents`, label: t('landing.nav.links.docTypes') },
        { href: `/${locale}/connect`, label: t('landing.nav.links.connect') },
      ]}
    >
      <article id="guide" className="border-b border-border">
        <div className="mx-auto flex max-w-3xl flex-col gap-14 px-6 py-20 lg:px-10">
          {GUIDE_SECTION_KEYS.map((section) => (
            <section key={section} id={section} className="flex flex-col gap-4">
              <H2 className="text-balance text-3xl not-italic leading-tight">{t(k(`sections.${section}.h`))}</H2>
              {paragraphs(t(k(`sections.${section}.body`))).map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-foreground/85">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>

      <FaqList
        title={t('guidesPage.labels.faq')}
        items={GUIDE_FAQ_KEYS.map((q) => ({ id: q, q: t(k(`faq.${q}.q`)), a: t(k(`faq.${q}.a`)) }))}
      />

      {/* INTERNAL LINKS */}
      <section id="related" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <MiniTitle className="mb-4">{t('guidesPage.labels.useCases')}</MiniTitle>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {entry.useCases.map((useCase) => (
              <li key={useCase}>
                <Link
                  href={`/${locale}/${useCasePath(useCase)}`}
                  className="inline-flex items-center gap-2 font-display text-lg text-accent transition-colors hover:text-foreground"
                >
                  {t(`useCasesPage.items.${useCase}.h1`)}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>

          <H2 className="mt-16 text-balance text-3xl not-italic leading-tight">{t('guidesPage.labels.related')}</H2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {others.map((other) => (
              <Link
                key={other}
                href={`/${locale}/${guidePath(other)}`}
                className="flex h-full flex-col gap-3 rounded-lg border border-border bg-background p-6 transition-colors hover:border-accent/50 hover:bg-card/60"
              >
                <span className="font-display text-xl leading-snug">{t(`guidesPage.items.${other}.h1`)}</span>
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {t(`guidesPage.items.${other}.card`)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SubPageShell>
  );
}
