import { COMPARE_SLUGS, type CompareSlug } from './compare';
import { USE_CASE_SLUGS, type UseCaseSlug } from './use-cases';

// The public pages this package renders, as locale-less paths. The host mounts
// one route per slug plus one dynamic route per catalogue segment
// (`use-cases/[slug]`), and uses the same list for its sitemap and robots rules,
// so adding a page here (or an entry to a catalogue) is the only place the surface grows.

export const LANDING_HOME_SLUG = 'landing';
export const LANDING_SUBPAGE_SLUGS = ['documents', 'connect', 'verticals'] as const;
export const LANDING_SLUGS = [LANDING_HOME_SLUG, ...LANDING_SUBPAGE_SLUGS] as const;

export type LandingSlug = (typeof LANDING_SLUGS)[number];

/** Segment of the catalogue-generated use-case pages: `/{locale}/use-cases/{slug}`. */
export const LANDING_USE_CASES_SEGMENT = 'use-cases';

/** Segment of the catalogue-generated comparison pages: `/{locale}/compare/{slug}`. */
export const LANDING_COMPARE_SEGMENT = 'compare';

/** Every top-level path segment the package owns (static pages + catalogue segments). */
export const LANDING_SEGMENTS = [...LANDING_SLUGS, LANDING_USE_CASES_SEGMENT, LANDING_COMPARE_SEGMENT] as const;

export type UseCasePath = `use-cases/${UseCaseSlug}`;
export type ComparePath = `compare/${CompareSlug}`;
/** Any page this package renders, without the locale. */
export type LandingPagePath = LandingSlug | UseCasePath | ComparePath;

export const useCasePath = (slug: UseCaseSlug): UseCasePath => `${LANDING_USE_CASES_SEGMENT}/${slug}`;
export const comparePath = (slug: CompareSlug): ComparePath => `${LANDING_COMPARE_SEGMENT}/${slug}`;

/** Every page, static ones first, then the catalogues. */
export const LANDING_PAGE_PATHS: readonly LandingPagePath[] = [
  ...LANDING_SLUGS,
  ...USE_CASE_SLUGS.map(useCasePath),
  ...COMPARE_SLUGS.map(comparePath),
];

/** Path segments the host must leave reachable without a session (prefixes). */
export const LANDING_PUBLIC_SEGMENTS: readonly string[] = LANDING_SEGMENTS.map((segment) => `/${segment}`);

export interface LandingSitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'weekly';
  priority: number;
  alternates: { languages: Record<string, string> };
}

function priorityOf(path: LandingPagePath): number {
  if (path === LANDING_HOME_SLUG) return 1;
  return path.includes('/') ? 0.7 : 0.8;
}

/** One sitemap entry per page and locale, with hreflang alternates. */
export function landingSitemapEntries(
  siteUrl: string,
  locales: readonly string[],
  now: Date,
): LandingSitemapEntry[] {
  return LANDING_PAGE_PATHS.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}/${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: priorityOf(path),
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}/${path}`])),
      },
    })),
  );
}

/** Paths crawlers may index (`/{locale}/{path}`). */
export function landingRobotsAllow(locales: readonly string[]): string[] {
  return LANDING_PAGE_PATHS.flatMap((path) => locales.map((locale) => `/${locale}/${path}`));
}
