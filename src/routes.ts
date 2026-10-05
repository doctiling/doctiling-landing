// The public pages this package renders, as locale-less slugs. The host mounts
// one route per slug and uses the same list for its sitemap and robots rules,
// so adding a page here is the only place the surface grows.

export const LANDING_HOME_SLUG = 'landing';
export const LANDING_SUBPAGE_SLUGS = ['documents', 'connect', 'verticals'] as const;
export const LANDING_SLUGS = [LANDING_HOME_SLUG, ...LANDING_SUBPAGE_SLUGS] as const;

export type LandingSlug = (typeof LANDING_SLUGS)[number];

/** Path segments the host must leave reachable without a session. */
export const LANDING_PUBLIC_SEGMENTS: readonly string[] = LANDING_SLUGS.map((slug) => `/${slug}`);

export interface LandingSitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'weekly';
  priority: number;
  alternates: { languages: Record<string, string> };
}

/** One sitemap entry per page and locale, with hreflang alternates. */
export function landingSitemapEntries(
  siteUrl: string,
  locales: readonly string[],
  now: Date,
): LandingSitemapEntry[] {
  return LANDING_SLUGS.flatMap((slug) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: slug === LANDING_HOME_SLUG ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}/${slug}`])),
      },
    })),
  );
}

/** Paths crawlers may index (`/{locale}/{slug}`). */
export function landingRobotsAllow(locales: readonly string[]): string[] {
  return LANDING_SLUGS.flatMap((slug) => locales.map((locale) => `/${locale}/${slug}`));
}
