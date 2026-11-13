import { describe, it, expect, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

import ComparePageClient, { COMPARE_CTA } from '../../src/components/ComparePageClient';
import { COMPARE, COMPARE_FAQ_KEYS, COMPARE_ROW_KEYS } from '../../src/compare';
import { USE_CASE_SLUGS } from '../../src/use-cases';

describe('ComparePageClient', () => {
  it('opens with the H1 and the two-line verdict', () => {
    renderWithHost(<ComparePageClient slug="guru" />, { locale: 'en' });
    expect(screen.getByRole('heading', { level: 1, name: 'comparePage.items.guru.h1' })).toBeInTheDocument();
    expect(screen.getByText('comparePage.items.guru.verdict')).toBeInTheDocument();
    expect(screen.getByText('comparePage.items.guru.verdict2')).toBeInTheDocument();
  });

  it('renders one table row per criterion, each competitor cell linked to its official source', () => {
    renderWithHost(<ComparePageClient slug="glean" />);
    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row').slice(1);
    expect(rows).toHaveLength(COMPARE_ROW_KEYS.length);
    COMPARE_ROW_KEYS.forEach((row, i) => {
      expect(within(rows[i]).getByText(`comparePage.doctiling.${row}`)).toBeInTheDocument();
      const source = within(rows[i]).getByRole('link', { name: 'comparePage.labels.source' });
      expect(source).toHaveAttribute('href', COMPARE.glean.sources[row]);
      expect(source.getAttribute('rel')).toContain('nofollow');
    });
  });

  it('shows when to choose each product and every FAQ entry', () => {
    renderWithHost(<ComparePageClient slug="notion-ai" />);
    expect(screen.getByText('comparePage.items.notion-ai.chooseDoctiling.c1')).toBeInTheDocument();
    expect(screen.getByText('comparePage.items.notion-ai.chooseOther.c3')).toBeInTheDocument();
    for (const q of COMPARE_FAQ_KEYS) {
      expect(screen.getByText(`comparePage.items.notion-ai.faq.${q}.q`)).toBeInTheDocument();
    }
  });

  it('measures its CTAs as compare_cta and captures the email when signed out', () => {
    const { container } = renderWithHost(<ComparePageClient slug="guru" />);
    expect(screen.getByLabelText('landing.hero.access.emailLabel')).toBeInTheDocument();
    expect(container.querySelectorAll(`[data-analytics="${COMPARE_CTA}"]`).length).toBeGreaterThanOrEqual(2);
  });

  it('links to the other comparisons and to every use case', () => {
    const { container } = renderWithHost(<ComparePageClient slug="guru" />, { locale: 'en' });
    const hrefs = [...container.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/en/compare/notion-ai');
    expect(hrefs).toContain('/en/compare/glean');
    expect(hrefs).not.toContain('/en/compare/guru');
    for (const useCase of USE_CASE_SLUGS) expect(hrefs).toContain(`/en/use-cases/${useCase}`);
  });
});
