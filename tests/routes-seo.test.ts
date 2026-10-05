import { describe, it, expect } from 'vitest';
import {
  LANDING_PUBLIC_SEGMENTS,
  LANDING_SLUGS,
  landingRobotsAllow,
  landingSitemapEntries,
} from '../src/routes';
import { landingHomeJsonLd, landingMetadata, verticalsJsonLd, LANDING_SEO_COPY } from '../src/seo';
import { FAQ_KEYS } from '../src/components/faq-keys';

const SITE = 'https://www.doctiling.app';
const LOCALES = ['en', 'es'] as const;

describe('routes', () => {
  it('exposes the home plus the three deep-dive pages', () => {
    expect(LANDING_SLUGS).toEqual(['landing', 'documents', 'connect', 'verticals']);
    expect(LANDING_PUBLIC_SEGMENTS).toEqual(['/landing', '/documents', '/connect', '/verticals']);
  });

  it('builds one sitemap entry per page and locale, the home first in priority', () => {
    const now = new Date('2026-10-05T00:00:00Z');
    const entries = landingSitemapEntries(SITE, LOCALES, now);
    expect(entries).toHaveLength(LANDING_SLUGS.length * LOCALES.length);
    const home = entries.find((e) => e.url === `${SITE}/en/landing`);
    expect(home?.priority).toBe(1);
    expect(home?.alternates.languages.es).toBe(`${SITE}/es/landing`);
    expect(entries.find((e) => e.url === `${SITE}/es/connect`)?.priority).toBe(0.8);
  });

  it('lists every page for every locale in the robots allow list', () => {
    const allow = landingRobotsAllow(LOCALES);
    expect(allow).toContain('/en/landing');
    expect(allow).toContain('/es/verticals');
    expect(allow).toHaveLength(LANDING_SLUGS.length * LOCALES.length);
  });
});

describe('seo', () => {
  it('has copy for every page in both locales', () => {
    for (const slug of LANDING_SLUGS) {
      for (const locale of LOCALES) {
        const copy = LANDING_SEO_COPY[slug][locale];
        expect(copy.title.length).toBeGreaterThan(10);
        expect(copy.keywords.length).toBeGreaterThan(3);
      }
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
