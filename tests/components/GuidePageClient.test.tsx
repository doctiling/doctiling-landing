import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

import GuidePageClient, { GUIDE_CTA } from '../../src/components/GuidePageClient';
import { GUIDES, GUIDE_FAQ_KEYS, GUIDE_SECTION_KEYS } from '../../src/guides';

describe('GuidePageClient', () => {
  it('renders the keyword H1 and answers the question in the lede', () => {
    renderWithHost(<GuidePageClient slug="what-is-mcp" />, { locale: 'en' });
    expect(screen.getByRole('heading', { level: 1, name: 'guidesPage.items.what-is-mcp.h1' })).toBeInTheDocument();
    expect(screen.getByText('guidesPage.items.what-is-mcp.lede')).toBeInTheDocument();
  });

  it('renders every section as an h2 with its body, inside an article', () => {
    const { container } = renderWithHost(<GuidePageClient slug="ai-knowledge-base" />);
    const article = container.querySelector('article#guide')!;
    expect(article).not.toBeNull();
    for (const key of GUIDE_SECTION_KEYS) {
      expect(
        screen.getByRole('heading', { level: 2, name: `guidesPage.items.ai-knowledge-base.sections.${key}.h` }),
      ).toBeInTheDocument();
      expect(article).toHaveTextContent(`guidesPage.items.ai-knowledge-base.sections.${key}.body`);
    }
  });

  it('shows its updated date as a machine-readable time', () => {
    const { container } = renderWithHost(<GuidePageClient slug="rag-vs-curated-knowledge-base" />);
    expect(container.querySelector('time')?.getAttribute('datetime')).toBe(GUIDES['rag-vs-curated-knowledge-base'].updated);
  });

  it('shows every FAQ entry', () => {
    renderWithHost(<GuidePageClient slug="what-is-mcp" />);
    for (const q of GUIDE_FAQ_KEYS) {
      expect(screen.getByText(`guidesPage.items.what-is-mcp.faq.${q}.q`)).toBeInTheDocument();
    }
  });

  it('links to its use cases and to the other guides', () => {
    renderWithHost(<GuidePageClient slug="what-is-mcp" />);
    expect(screen.getByRole('link', { name: /useCasesPage\.items\.engineering-teams\.h1/ })).toHaveAttribute(
      'href',
      '/es/use-cases/engineering-teams',
    );
    expect(screen.getByRole('link', { name: /guidesPage\.items\.ai-knowledge-base\.h1/ })).toHaveAttribute(
      'href',
      '/es/guides/ai-knowledge-base',
    );
  });

  it('offers the email capture as a named guide CTA when signed out', () => {
    const { container } = renderWithHost(<GuidePageClient slug="what-is-mcp" />);
    expect(screen.getByLabelText('landing.hero.access.emailLabel')).toBeInTheDocument();
    expect(container.querySelector(`[data-analytics="${GUIDE_CTA}"]`)).not.toBeNull();
  });
});
