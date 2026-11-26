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
  LANDING_PAGE_UPDATED,
  comparePath,
  useCasePath,
} from '../src/routes';
import {
  landingHomeJsonLd,
  landingMetadata,
  useCaseJsonLd,
  compareJsonLd,
  verticalsJsonLd,
  LANDING_SEO_COPY,
  OG_LOCALES,
  ORG_PROFILES,
} from '../src/seo';
import { USE_CASE_FAQ_KEYS, USE_CASE_SLUGS, USE_CASES } from '../src/use-cases';
import { COMPARE, COMPARE_FAQ_KEYS, COMPARE_ROW_KEYS, COMPARE_SLUGS } from '../src/compare';
import { LANDING_MESSAGES } from '../src/i18n';
import { GUIDES, GUIDE_FAQ_KEYS, GUIDE_SECTION_KEYS, GUIDE_SLUGS, paragraphs } from '../src/guides';
import { guideJsonLd } from '../src/seo';
import { guidePath } from '../src/routes';
import { FAQ_KEYS } from '../src/components/faq-keys';

const SITE = 'https://www.doctiling.app';
const LOCALES = ['en', 'es'] as const;

describe('routes', () => {
  it('exposes the home plus the four deep-dive pages', () => {
    expect(LANDING_SLUGS).toEqual(['landing', 'documents', 'connect', 'verticals', 'pricing']);
    expect(LANDING_PUBLIC_SEGMENTS).toEqual(['/landing', '/documents', '/connect', '/verticals', '/pricing', '/use-cases', '/compare', '/guides']);
  });

  it('generates one use-case page per catalogue entry', () => {
    expect(USE_CASE_SLUGS).toEqual(['legal', 'consulting', 'healthcare', 'finance', 'research', 'engineering-teams']);
    expect(LANDING_PAGE_PATHS).toEqual([
      ...LANDING_SLUGS,
      ...USE_CASE_SLUGS.map((s) => `use-cases/${s}`),
      ...COMPARE_SLUGS.map((s) => `compare/${s}`),
      ...GUIDE_SLUGS.map((s) => `guides/${s}`),
    ]);
  });

  it('generates one comparison page per catalogue entry, in the sitemap and robots', () => {
    expect(COMPARE_SLUGS).toEqual(['notion-ai', 'guru', 'glean']);
    const entries = landingSitemapEntries(SITE, LOCALES, new Date('2026-11-13T00:00:00Z'));
    expect(entries.find((e) => e.url === `${SITE}/es/compare/glean`)?.priority).toBe(0.7);
    expect(landingRobotsAllow(LOCALES)).toContain('/en/compare/notion-ai');
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

  it('keeps every comparison title within 60 characters and description within 155', () => {
    for (const slug of COMPARE_SLUGS) {
      for (const locale of LOCALES) {
        const copy = LANDING_SEO_COPY[comparePath(slug)][locale];
        expect(copy.title.length, `${locale}/${slug} title`).toBeLessThanOrEqual(60);
        expect(copy.description.length, `${locale}/${slug} description`).toBeLessThanOrEqual(155);
      }
    }
  });

  it('backs every competitor cell with an official https source and a check date', () => {
    for (const slug of COMPARE_SLUGS) {
      const entry = COMPARE[slug];
      expect(entry.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const host = new URL(entry.site).hostname.replace(/^www\./, '');
      for (const row of COMPARE_ROW_KEYS) {
        const url = new URL(entry.sources[row]);
        expect(url.protocol, `${slug}.${row}`).toBe('https:');
        // the competitor's own domain (or a subdomain of it: help., docs.)
        expect(url.hostname.endsWith(host), `${slug}.${row} → ${url.hostname}`).toBe(true);
      }
    }
  });

  it('describes a comparison with breadcrumb, FAQ and application schemas', () => {
    const ld = compareJsonLd('guru', { siteUrl: SITE, locale: 'es' }) as { '@graph': Array<Record<string, unknown>> };
    expect(ld['@graph'].map((n) => n['@type'])).toEqual(['BreadcrumbList', 'FAQPage', 'SoftwareApplication']);
    const crumbs = ld['@graph'][0] as { itemListElement: Array<{ item: string; name: string }> };
    expect(crumbs.itemListElement.map((c) => c.item)).toEqual([`${SITE}/es/landing`, `${SITE}/es/compare/guru`]);
    expect(crumbs.itemListElement[1].name).toBe('Doctiling vs Guru');
    const faq = ld['@graph'][1] as { mainEntity: unknown[] };
    expect(faq.mainEntity).toHaveLength(COMPARE_FAQ_KEYS.length);
    const meta = landingMetadata('compare/guru', { siteUrl: SITE, locale: 'en' });
    expect(meta.alternates?.canonical).toBe(`${SITE}/en/compare/guru`);
    expect(meta.alternates?.languages).toMatchObject({ 'x-default': `${SITE}/es/compare/guru` });
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
      doctiling: { slugs: string[]; segments: string[]; useCases: string[]; compare: string[]; guides: string[] };
    };
    expect(pkg.doctiling.slugs).toEqual([...LANDING_SLUGS]);
    expect(pkg.doctiling.segments).toEqual([...LANDING_SEGMENTS]);
    expect(pkg.doctiling.useCases).toEqual([...USE_CASE_SLUGS]);
    expect(pkg.doctiling.compare).toEqual([...COMPARE_SLUGS]);
    expect(pkg.doctiling.guides).toEqual([...GUIDE_SLUGS]);
  });
});

describe('search basics of the home (SEO review 2026-11-20)', () => {
  it('leads the home title with the searched phrase and keeps title ≤ 60 and description ≤ 155', () => {
    const lead = { es: 'Base de conocimiento con IA para equipos', en: 'AI knowledge base for teams' };
    for (const locale of LOCALES) {
      const copy = LANDING_SEO_COPY.landing[locale];
      expect(copy.title.startsWith(lead[locale])).toBe(true);
      expect(copy.title.length, `${locale} title`).toBeLessThanOrEqual(60);
      expect(copy.description.length, `${locale} description`).toBeLessThanOrEqual(155);
      expect(copy.description.startsWith(lead[locale])).toBe(true);
    }
  });

  it('puts the searched phrase in the hero eyebrow, which sits inside the h1', () => {
    expect((LANDING_MESSAGES.es as any).landing.hero.eyebrow.toLowerCase()).toContain('base de conocimiento con ia');
    expect((LANDING_MESSAGES.en as any).landing.hero.eyebrow.toLowerCase()).toContain('ai knowledge base');
  });

  it('targets Latin American Spanish in Open Graph, with Spain and English as alternates', () => {
    const og = landingMetadata('landing', { siteUrl: SITE, locale: 'es' }).openGraph as Record<string, unknown>;
    expect(og.locale).toBe('es_419');
    expect(og.alternateLocale).toEqual(['es_ES', 'en_US']);
    expect(OG_LOCALES.en[0]).toBe('en_US');
  });

  it('lists only off-domain profiles in sameAs', () => {
    const ld = landingHomeJsonLd({ siteUrl: SITE, locale: 'es' }) as { '@graph': Array<Record<string, unknown>> };
    const org = ld['@graph'].find((n) => n['@type'] === 'Organization')!;
    expect(org.sameAs).toEqual([...ORG_PROFILES]);
    for (const url of ORG_PROFILES) {
      expect(url.startsWith('https://')).toBe(true);
      expect(url.startsWith(SITE)).toBe(false);
    }
  });

  it('stamps the sitemap with the day each page changed, never the request time', () => {
    const a = landingSitemapEntries(SITE, LOCALES, new Date('2030-01-01T00:00:00Z'));
    const b = landingSitemapEntries(SITE, LOCALES, new Date('2031-06-15T12:00:00Z'));
    expect(a.map((e) => e.lastModified.toISOString())).toEqual(b.map((e) => e.lastModified.toISOString()));
    const home = a.find((e) => e.url === `${SITE}/es/landing`)!;
    expect(home.lastModified.toISOString().slice(0, 10)).toBe(LANDING_PAGE_UPDATED.landing);
    const glean = a.find((e) => e.url === `${SITE}/en/compare/glean`)!;
    expect(glean.lastModified.toISOString().slice(0, 10)).toBe(LANDING_PAGE_UPDATED.compare);
    for (const date of Object.values(LANDING_PAGE_UPDATED)) expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('guides (SEO review 2026-11-20, point 6)', () => {
  it('publishes the three guides the review asked for', () => {
    expect(GUIDE_SLUGS).toEqual(['ai-knowledge-base', 'what-is-mcp', 'rag-vs-curated-knowledge-base']);
  });

  it('keeps every guide title within 60 characters and description within 155', () => {
    for (const slug of GUIDE_SLUGS) {
      for (const locale of LOCALES) {
        const copy = LANDING_SEO_COPY[guidePath(slug)][locale];
        expect(copy.title.length, `${locale}/${slug} title`).toBeLessThanOrEqual(60);
        expect(copy.description.length, `${locale}/${slug} description`).toBeLessThanOrEqual(155);
        expect(copy.description.length).toBeGreaterThan(80);
      }
    }
  });

  it('gives every guide a quotable lede, real sections and its FAQ in both locales', () => {
    for (const slug of GUIDE_SLUGS) {
      for (const locale of LOCALES) {
        const item = (LANDING_MESSAGES[locale] as any).guidesPage.items[slug];
        expect(item.lede.length, `${locale}/${slug} lede`).toBeGreaterThan(150);
        for (const key of GUIDE_SECTION_KEYS) {
          expect(item.sections[key].h.length).toBeGreaterThan(5);
          expect(paragraphs(item.sections[key].body).length, `${locale}/${slug}/${key}`).toBeGreaterThanOrEqual(2);
        }
        for (const q of GUIDE_FAQ_KEYS) expect(item.faq[q].a.length).toBeGreaterThan(40);
      }
    }
  });

  it('describes a guide as an Article with real dates, a breadcrumb and its FAQ', () => {
    const ld = guideJsonLd('what-is-mcp', { siteUrl: SITE, locale: 'es' }) as { '@graph': Array<Record<string, any>> };
    const article = ld['@graph'].find((n) => n['@type'] === 'Article')!;
    expect(article.headline).toBe((LANDING_MESSAGES.es as any).guidesPage.items['what-is-mcp'].h1);
    expect(article.datePublished).toBe(GUIDES['what-is-mcp'].published);
    expect(article.dateModified).toBe(GUIDES['what-is-mcp'].updated);
    expect(article.mainEntityOfPage).toBe(`${SITE}/es/guides/what-is-mcp`);
    expect(article.inLanguage).toBe('es');
    const faq = ld['@graph'].find((n) => n['@type'] === 'FAQPage')!;
    expect(faq.mainEntity).toHaveLength(GUIDE_FAQ_KEYS.length);
    const og = landingMetadata('guides/what-is-mcp', { siteUrl: SITE, locale: 'en' }).openGraph as Record<string, unknown>;
    expect(og.type).toBe('article');
  });

  it('stamps each guide in the sitemap with its own updated date', () => {
    const entries = landingSitemapEntries(SITE, LOCALES);
    const rag = entries.find((e) => e.url === `${SITE}/en/guides/rag-vs-curated-knowledge-base`)!;
    expect(rag.lastModified.toISOString().slice(0, 10)).toBe(GUIDES['rag-vs-curated-knowledge-base'].updated);
    expect(rag.priority).toBe(0.7);
  });
});
