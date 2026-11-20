import type { UseCaseSlug } from './use-cases';

// Catalogue of the guides (`/{locale}/guides/{slug}`): articles that answer a
// question people search for. Same shape as src/use-cases.ts — route, sitemap,
// metadata, Article JSON-LD, llms.txt and the page come from this list plus the
// `guidesPage.items.{slug}` copy, so a new guide is one entry here and one block
// per dictionary, never a new page file.
//
// The lede answers the question in two or three sentences, so a search engine or
// an LLM can quote it alone; the sections go deeper.

export const GUIDE_SLUGS = ['ai-knowledge-base', 'what-is-mcp', 'rag-vs-curated-knowledge-base'] as const;

export type GuideSlug = (typeof GUIDE_SLUGS)[number];

/** Sections of every guide (`guidesPage.items.{slug}.sections.{key}.{h,body}`); paragraphs split on a blank line. */
export const GUIDE_SECTION_KEYS = ['s1', 's2', 's3', 's4', 's5'] as const;

/** FAQ entries every guide answers (`…items.{slug}.faq.{key}.{q,a}`). */
export const GUIDE_FAQ_KEYS = ['q1', 'q2', 'q3'] as const;

export interface GuideEntry {
  /** First publication day (YYYY-MM-DD), the Article's `datePublished`. */
  published: string;
  /** Day the copy last changed (YYYY-MM-DD): `dateModified` and the sitemap's lastmod. Bump it with the copy. */
  updated: string;
  /** Use cases the guide hands the reader to. */
  useCases: readonly UseCaseSlug[];
}

export const GUIDES: Record<GuideSlug, GuideEntry> = {
  'ai-knowledge-base': { published: '2026-11-20', updated: '2026-11-20', useCases: ['consulting', 'legal'] },
  'what-is-mcp': { published: '2026-11-20', updated: '2026-11-20', useCases: ['engineering-teams'] },
  'rag-vs-curated-knowledge-base': {
    published: '2026-11-20',
    updated: '2026-11-20',
    useCases: ['research', 'finance'],
  },
};

export function isGuideSlug(value: string): value is GuideSlug {
  return (GUIDE_SLUGS as readonly string[]).includes(value);
}

/** Paragraphs of a section body: the dictionary keeps them in one string, split on a blank line. */
export function paragraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
