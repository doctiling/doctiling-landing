import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { LLMS_SITE_URL, llmsFullTxt, llmsTxt } from '../src/llms';
import { LANDING_PAGE_PATHS } from '../src/routes';
// @ts-expect-error — plain .mjs helper shared with scripts/white-label-guard.mjs
import { VENDOR } from '../scripts/lib/vendor-pattern.mjs';

// public/llms.txt and public/llms-full.txt are generated: edit the copy or the
// catalogue, then regenerate with `UPDATE_LLMS=1 npx vitest run tests/llms.test.ts`.
const FILES = {
  'llms.txt': llmsTxt,
  'llms-full.txt': llmsFullTxt,
} as const;

describe('llms.txt', () => {
  for (const [name, generate] of Object.entries(FILES)) {
    it(`public/${name} matches the generator`, () => {
      const path = resolve(process.cwd(), 'public', name);
      const expected = generate();
      if (process.env.UPDATE_LLMS) writeFileSync(path, expected);
      expect(existsSync(path), `public/${name} missing — run UPDATE_LLMS=1`).toBe(true);
      expect(readFileSync(path, 'utf8'), `public/${name} is stale — run UPDATE_LLMS=1`).toBe(expected);
    });
  }

  it('links every public page in both languages', () => {
    const txt = llmsTxt();
    for (const path of LANDING_PAGE_PATHS) {
      for (const locale of ['en', 'es']) expect(txt).toContain(`(${LLMS_SITE_URL}/${locale}/${path})`);
    }
  });

  it('opens with the llmstxt.org header: H1 name, then a blockquote summary', () => {
    const [h1, blank, quote] = llmsTxt().split('\n');
    expect(h1).toBe('# Doctiling');
    expect(blank).toBe('');
    expect(quote.startsWith('> ')).toBe(true);
  });

  it('never names the AI vendor (P4) — the files are marketing copy too', () => {
    expect(llmsFullTxt()).not.toMatch(VENDOR);
  });

  it('carries the competitor sources into the full text', () => {
    expect(llmsFullTxt()).toContain('https://docs.glean.com/get-started/prepare/about-deployment');
  });
});
