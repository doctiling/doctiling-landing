// Catalogue of the use-case pages (`/{locale}/use-cases/{slug}`). One entry per
// page: the route, the sitemap, the metadata, the JSON-LD and the page itself are
// all generated from this list plus the `useCasesPage.items.{slug}` copy, so a
// new use case is one entry here and one block per dictionary — never a new page file.

export const USE_CASE_SLUGS = [
  'legal',
  'consulting',
  'healthcare',
  'finance',
  'research',
  'engineering-teams',
] as const;

export type UseCaseSlug = (typeof USE_CASE_SLUGS)[number];

/** FAQ entries every use case answers (`useCasesPage.items.{slug}.faq.{key}`). */
export const USE_CASE_FAQ_KEYS = ['q1', 'q2', 'q3', 'q4'] as const;

/** Steps of the "how Doctiling solves it" walk-through (`…items.{slug}.steps.{key}`). */
export const USE_CASE_STEP_KEYS = ['s1', 's2', 's3'] as const;

export interface UseCaseEntry {
  /** Real product capture under public/ shown with the solution. */
  screenshot: string;
  /** Section of the verticals page this use case deepens, when there is one. */
  vertical?: 'legal' | 'health' | 'finance' | 'research' | 'consulting';
}

export const USE_CASES: Record<UseCaseSlug, UseCaseEntry> = {
  legal: { screenshot: '/screenshots/niche-legal.webp', vertical: 'legal' },
  consulting: { screenshot: '/screenshots/niche-consulting.webp', vertical: 'consulting' },
  healthcare: { screenshot: '/screenshots/niche-health.webp', vertical: 'health' },
  finance: { screenshot: '/screenshots/niche-finance.webp', vertical: 'finance' },
  research: { screenshot: '/screenshots/niche-research.webp', vertical: 'research' },
  'engineering-teams': { screenshot: '/screenshots/real-citations.webp' },
};

export function isUseCaseSlug(value: string): value is UseCaseSlug {
  return (USE_CASE_SLUGS as readonly string[]).includes(value);
}

/** The verticals-page section → its use-case page, for the "full use case" links. */
export function useCaseForVertical(vertical: string): UseCaseSlug | undefined {
  return USE_CASE_SLUGS.find((slug) => USE_CASES[slug].vertical === vertical);
}
