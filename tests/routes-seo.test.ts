import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  LANDING_PAGE_PATHS,
  LANDING_PUBLIC_SEGMENTS,
  LANDING_SEGMENTS,
  LANDING_SLUGS,
  landingRobotsAllow,
  landingSitemapEntries,
  useCasePath,
} from '../src/routes';
import {
  landingHomeJsonLd,
  landingMetadata,
  useCaseJsonLd,
  verticalsJsonLd,
  LANDING_SEO_COPY,
} from '../src/seo';
import { USE_CASE_FAQ_KEYS, USE_CASE_SLUGS, USE_CASES } from '../src/use-cases';
import { LANDING_MESSAGES } from '../src/i18n';
import { FAQ_KEYS } from '../src/components/faq-keys';

const SITE = 'https://www.doctiling.app';
const LOCALES = ['en', 'es'] as const;

describe('routes', () => {
  it('exposes the home plus the three deep-dive pages', () => {
    expect(LANDING_SLUGS).toEqual(['landing', 'documents', 'connect', 'verticals']);
    expect(LANDING_PUBLIC_SEGMENTS).toEqual(['/landing', '/documents', '/connect', '/verticals', '/use-cases']);
  });

  it('generates one use-case page per catalogue entry', () => {
    expect(USE_CASE_SLUGS).toEqual(['legal', 'consulting', 'healthcare', 'finance', 'research', 'engineering-teams']);
    expect(LANDING_PAGE_PATHS).toEqual([...LANDING_SLUGS, ...USE_CASE_SLUGS.map((s) => `use-cases/${s}`)]);
  });

  it('builds one sitemap entry per page and locale, the home first in priority', () => {
    const now = new Date('2026-10-05T00:00:00Z');
    const entries = landingSitemapEntries(SITE, LOCALES, now);
    expect(entries).toHaveLength(LANDING_PAGE_PATHS.length * LOCALES.length);
    const home = entries.find((e) => e.url === `${SITE}/en/landing`);
    expect(home?.priority).toBe(1);
    expect(home?.alternates.languages.es).toBe(`${SITE}/es/landing`);
    expect(entries.find((e) => e.url === `${SITE}/es/connect`)?.priority).toBe(0.8);
    const legal = entries.find((e) => e.url === `${SITE}/en/use-cases/legal`);
    expect(legal?.priority).toBe(0.7);
    expect(legal?.alternates.languages.es).toBe(`${SITE}/es/use-cases/legal`);
  });

  it('lists every page for every locale in the robots allow list', () => {
    const allow = landingRobotsAllow(LOCALES);
    expect(allow).toContain('/en/landing');
    expect(allow).toContain('/es/verticals');
    expect(allow).toContain('/es/use-cases/engineering-teams');
    expect(allow).toHaveLength(LANDING_PAGE_PATHS.length * LOCALES.length);
  });
});

describe('seo', () => {
  it('has copy for every page in both locales', () => {
    for (const slug of LANDING_PAGE_PATHS) {
      for (const locale of LOCALES) {
        const copy = LANDING_SEO_COPY[slug][locale];
        expect(copy.title.length).toBeGreaterThan(10);
        expect(copy.keywords.length).toBeGreaterThan(3);
      }
    }
  });

  it('keeps every use-case title within 60 characters and description within 155', () => {
    for (const slug of USE_CASE_SLUGS) {
      for (const locale of LOCALES) {
        const copy = LANDING_SEO_COPY[useCasePath(slug)][locale];
        expect(copy.title.length, `${locale}/${slug} title`).toBeLessThanOrEqual(60);
        expect(copy.description.length, `${locale}/${slug} description`).toBeLessThanOrEqual(155);
        expect(copy.description.length).toBeGreaterThan(80);
      }
    }
  });

  it('builds canonical, hreflang and Open Graph metadata for a use-case page', () => {
    const meta = landingMetadata('use-cases/engineering-teams', { siteUrl: SITE, locale: 'es' });
    expect(meta.alternates?.canonical).toBe(`${SITE}/es/use-cases/engineering-teams`);
    expect(meta.alternates?.languages).toEqual({
      en: `${SITE}/en/use-cases/engineering-teams`,
      es: `${SITE}/es/use-cases/engineering-teams`,
      'x-default': `${SITE}/es/use-cases/engineering-teams`,
    });
    expect(meta.title).toEqual({ absolute: LANDING_SEO_COPY['use-cases/engineering-teams'].es.title });
    expect(meta.openGraph?.url).toBe(`${SITE}/es/use-cases/engineering-teams`);
  });

  it('describes a use case with breadcrumb, FAQ and application schemas from the rendered copy', () => {
    const ld = useCaseJsonLd('legal', { siteUrl: SITE, locale: 'en' }) as { '@graph': Array<Record<string, unknown>> };
    const types = ld['@graph'].map((n) => n['@type']);
    expect(types).toEqual(['BreadcrumbList', 'FAQPage', 'SoftwareApplication']);
    const crumbs = ld['@graph'][0] as { itemListElement: Array<{ item: string }> };
    expect(crumbs.itemListElement.map((c) => c.item)).toEqual([
      `${SITE}/en/landing`,
      `${SITE}/en/verticals`,
      `${SITE}/en/use-cases/legal`,
    ]);
    const faq = ld['@graph'][1] as { mainEntity: Array<{ name: string }> };
    const items = (LANDING_MESSAGES.en as { useCasesPage: { items: { legal: { faq: Record<string, { q: string }> } } } })
      .useCasesPage.items.legal.faq;
    expect(faq.mainEntity.map((q) => q.name)).toEqual(USE_CASE_FAQ_KEYS.map((k) => items[k].q));
  });

  it('points every use case at a screenshot that ships in public/', () => {
    for (const slug of USE_CASE_SLUGS) {
      expect(existsSync(resolve(process.cwd(), 'public', USE_CASES[slug].screenshot.slice(1))), slug).toBe(true);
    }
  });

  it('builds canonical, hreflang and social metadata for a page', () => {
    const meta = landingMetadata('connect', { siteUrl: SITE, locale: 'en' });
    expect(meta.title).toEqual({ absolute: LANDING_SEO_COPY.connect.en.title });
    expect(meta.alternates?.canonical).toBe(`${SITE}/en/connect`);
    expect(meta.alternates?.languages).toMatchObject({ 'x-default': `${SITE}/es/connect` });
    expect(meta.openGraph?.url).toBe(`${SITE}/en/connect`);
    expect(JSON.stringify(meta.twitter)).toContain(`${SITE}/og/og-en.png`);
  });

  it('falls back to Spanish metadata for an unknown locale', () => {
    const meta = landingMetadata('landing', { siteUrl: SITE, locale: 'pt' });
    expect(meta.alternates?.canonical).toBe(`${SITE}/es/landing`);
  });

  it('renders the FAQ schema from the same copy the page shows', () => {
    const ld = landingHomeJsonLd({ siteUrl: SITE, locale: 'es' }) as { '@graph': Array<Record<string, unknown>> };
    const faq = ld['@graph'].find((n) => n['@type'] === 'FAQPage') as { mainEntity: Array<{ name: string }> };
    expect(faq.mainEntity).toHaveLength(FAQ_KEYS.length);
    expect(faq.mainEntity[0].name.length).toBeGreaterThan(5);
  });

  it('lists the six sectors in the verticals schema with a breadcrumb back home', () => {
    const ld = verticalsJsonLd({ siteUrl: SITE, locale: 'en' }) as { '@graph': Array<Record<string, unknown>> };
    const list = ld['@graph'].find((n) => n['@type'] === 'ItemList') as { itemListElement: unknown[] };
    expect(list.itemListElement).toHaveLength(6);
    const crumbs = ld['@graph'].find((n) => n['@type'] === 'BreadcrumbList') as { itemListElement: Array<{ item: string }> };
    expect(crumbs.itemListElement[0].item).toBe(`${SITE}/en/landing`);
  });
});

describe('package manifest', () => {
  it('mirrors the slugs for hosts that read package.json without a TS loader', async () => {
    const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')) as {
      doctiling: { slugs: string[]; segments: string[]; useCases: string[] };
    };
    expect(pkg.doctiling.slugs).toEqual([...LANDING_SLUGS]);
    expect(pkg.doctiling.segments).toEqual([...LANDING_SEGMENTS]);
    expect(pkg.doctiling.useCases).toEqual([...USE_CASE_SLUGS]);
  });
});
