// llms.txt / llms-full.txt (https://llmstxt.org) of the marketing surface,
// generated from the same catalogue and dictionaries the pages render, so an
// AI search engine reads exactly what a visitor sees. The files ship in
// public/ (the host copies them to its web root like every other asset);
// tests/llms.test.ts fails when they drift from this generator and tells how to
// regenerate them.

import { LANDING_MESSAGES, type LandingLocale } from './i18n';
import { LANDING_PAGE_PATHS, comparePath, useCasePath, type LandingPagePath } from './routes';
import { LANDING_SEO_COPY, compareCopy, useCaseCopy } from './seo';
import { USE_CASE_FAQ_KEYS, USE_CASE_SLUGS } from './use-cases';
import { COMPARE, COMPARE_FAQ_KEYS, COMPARE_ROW_KEYS, COMPARE_SLUGS } from './compare';
import { FAQ_KEYS } from './components/faq-keys';

/** Canonical origin the published files point at. */
export const LLMS_SITE_URL = 'https://www.doctiling.app';

type Dict = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const dict = (locale: LandingLocale) => LANDING_MESSAGES[locale] as Dict;

const SECTIONS: Record<LandingLocale, { pages: string; useCases: string; compare: string; heading: string }> = {
  en: { heading: 'English', pages: 'Pages', useCases: 'Use cases', compare: 'Comparisons' },
  es: { heading: 'Español', pages: 'Páginas', useCases: 'Casos de uso', compare: 'Comparativas' },
};

function link(siteUrl: string, locale: LandingLocale, path: LandingPagePath): string {
  const copy = LANDING_SEO_COPY[path][locale];
  return `- [${copy.title}](${siteUrl}/${locale}/${path}): ${copy.description}`;
}

function summary(): string[] {
  const en = dict('en');
  return [
    '# Doctiling',
    '',
    `> ${LANDING_SEO_COPY.landing.en.description}`,
    '',
    `What Doctiling is: ${en.landing.faq.items.what.a}`,
    '',
    `Who it is for: ${USE_CASE_SLUGS.map((s) => en.useCasesPage.items[s].h1).join('; ')}.`,
    '',
    `Access: ${en.landing.faq.items.free.a} Self-hosting: ${en.landing.control.deployments.local.body}`,
    '',
    'Every page exists in English (/en/) and Spanish (/es/).',
  ];
}

function index(siteUrl: string, locale: LandingLocale): string[] {
  const s = SECTIONS[locale];
  const statics = LANDING_PAGE_PATHS.filter((p) => !p.includes('/'));
  return [
    `## ${s.pages} (${s.heading})`,
    '',
    ...statics.map((p) => link(siteUrl, locale, p)),
    '',
    `## ${s.useCases} (${s.heading})`,
    '',
    ...USE_CASE_SLUGS.map((slug) => link(siteUrl, locale, useCasePath(slug))),
    '',
    `## ${s.compare} (${s.heading})`,
    '',
    ...COMPARE_SLUGS.map((slug) => link(siteUrl, locale, comparePath(slug))),
  ];
}

/** Short index: what Doctiling is, for whom, and every public page in both languages. */
export function llmsTxt(siteUrl: string = LLMS_SITE_URL): string {
  return [...summary(), '', ...index(siteUrl, 'en'), '', ...index(siteUrl, 'es'), ''].join('\n');
}

function qa(q: string, a: string): string[] {
  return [`**${q}**`, '', a, ''];
}

function fullLocale(siteUrl: string, locale: LandingLocale): string[] {
  const d = dict(locale);
  const s = SECTIONS[locale];
  const out: string[] = [`# ${s.heading}`, ''];

  out.push(`## ${LANDING_SEO_COPY.landing[locale].title}`, '', `URL: ${siteUrl}/${locale}/landing`, '');
  out.push(LANDING_SEO_COPY.landing[locale].description, '');
  for (const key of FAQ_KEYS) out.push(...qa(d.landing.faq.items[key].q, d.landing.faq.items[key].a));

  for (const slug of USE_CASE_SLUGS) {
    const c = useCaseCopy(slug, locale) as Dict;
    out.push(`## ${c.h1}`, '', `URL: ${siteUrl}/${locale}/${useCasePath(slug)}`, '');
    out.push(c.answer, '', c.answer2, '', c.problem, '', c.solution, '');
    for (const q of USE_CASE_FAQ_KEYS) out.push(...qa(c.faq[q].q, c.faq[q].a));
  }

  for (const slug of COMPARE_SLUGS) {
    const c = compareCopy(slug, locale) as Dict;
    const entry = COMPARE[slug];
    out.push(`## ${c.h1}`, '', `URL: ${siteUrl}/${locale}/${comparePath(slug)}`, '');
    out.push(c.verdict, '', c.verdict2, '');
    out.push(`| ${d.comparePage.labels.criterion} | Doctiling | ${c.name} |`, '| --- | --- | --- |');
    for (const row of COMPARE_ROW_KEYS) {
      out.push(`| ${d.comparePage.rows[row]} | ${d.comparePage.doctiling[row]} | ${c.rows[row]} ([${d.comparePage.labels.source}](${entry.sources[row]})) |`);
    }
    out.push('', d.comparePage.labels.sourcesNote.replace('{name}', c.name).replace('{date}', entry.verifiedOn), '');
    for (const q of COMPARE_FAQ_KEYS) out.push(...qa(c.faq[q].q, c.faq[q].a));
  }
  return out;
}

/** Full text: the index plus the content of the home FAQ, every use case and every comparison, in both languages. */
export function llmsFullTxt(siteUrl: string = LLMS_SITE_URL): string {
  return [llmsTxt(siteUrl), ...fullLocale(siteUrl, 'en'), ...fullLocale(siteUrl, 'es')].join('\n').trimEnd() + '\n';
}
