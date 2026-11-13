// Catalogue of the comparison pages (`/{locale}/compare/{slug}`). Same shape as
// src/use-cases.ts: route, sitemap, metadata, JSON-LD and the page come from this
// list plus the `comparePage.items.{slug}` copy.
//
// Honesty rule: every competitor cell in the table carries the URL of the
// competitor's OWN page that supports it, and the date it was checked. A cell
// without a source does not ship — the test in tests/routes-seo.test.ts fails.

export const COMPARE_SLUGS = ['notion-ai', 'guru', 'glean'] as const;

export type CompareSlug = (typeof COMPARE_SLUGS)[number];

/** Rows of the comparison table (`comparePage.rows.{key}` label, `…doctiling.{key}`, `…items.{slug}.rows.{key}`). */
export const COMPARE_ROW_KEYS = [
  'focus',
  'citations',
  'structure',
  'sources',
  'mcp',
  'selfHost',
  'freePlan',
  'pricing',
] as const;

export type CompareRowKey = (typeof COMPARE_ROW_KEYS)[number];

export const COMPARE_FAQ_KEYS = ['q1', 'q2', 'q3'] as const;
export const COMPARE_CHOICE_KEYS = ['c1', 'c2', 'c3'] as const;

export interface CompareEntry {
  /** Official site of the competitor (shown as the brand link, `rel="nofollow"`). */
  site: string;
  /** Date the competitor cells were checked against `sources` (ISO, YYYY-MM-DD). */
  verifiedOn: string;
  /** One official URL per table row supporting the competitor's cell. */
  sources: Record<CompareRowKey, string>;
}

export const COMPARE: Record<CompareSlug, CompareEntry> = {
  'notion-ai': {
    site: 'https://www.notion.com/product/ai',
    verifiedOn: '2026-11-13',
    sources: {
      focus: 'https://www.notion.com/product/ai',
      citations: 'https://www.notion.com/product/ai',
      structure: 'https://www.notion.com/product/ai',
      sources: 'https://www.notion.com/product/ai',
      mcp: 'https://www.notion.com/help/notion-mcp',
      selfHost: 'https://www.notion.com/pricing',
      freePlan: 'https://www.notion.com/pricing',
      pricing: 'https://www.notion.com/pricing',
    },
  },
  guru: {
    site: 'https://www.getguru.com',
    verifiedOn: '2026-11-13',
    sources: {
      focus: 'https://www.getguru.com/',
      citations: 'https://www.getguru.com/',
      structure: 'https://www.getguru.com/',
      sources: 'https://www.getguru.com/integrations',
      mcp: 'https://help.getguru.com/docs/connecting-gurus-mcp-server',
      selfHost: 'https://www.getguru.com/',
      freePlan: 'https://www.getguru.com/pricing',
      pricing: 'https://www.getguru.com/pricing',
    },
  },
  glean: {
    site: 'https://www.glean.com',
    verifiedOn: '2026-11-13',
    sources: {
      focus: 'https://www.glean.com/',
      citations: 'https://www.glean.com/product/assistant',
      structure: 'https://www.glean.com/product/assistant',
      sources: 'https://www.glean.com/connectors',
      mcp: 'https://docs.glean.com/administration/platform/mcp/about',
      selfHost: 'https://docs.glean.com/get-started/prepare/about-deployment',
      freePlan: 'https://www.glean.com/pricing',
      pricing: 'https://www.glean.com/pricing',
    },
  },
};

export function isCompareSlug(value: string): value is CompareSlug {
  return (COMPARE_SLUGS as readonly string[]).includes(value);
}
