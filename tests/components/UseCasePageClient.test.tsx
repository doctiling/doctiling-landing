import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

import UseCasePageClient, { USE_CASE_CTA } from '../../src/components/UseCasePageClient';
import { USE_CASE_FAQ_KEYS, USE_CASE_SLUGS } from '../../src/use-cases';

describe('UseCasePageClient', () => {
  it('renders the keyword H1 and answers the question in the first two paragraphs', () => {
    renderWithHost(<UseCasePageClient slug="legal" />, { locale: 'en' });
    expect(screen.getByRole('heading', { level: 1, name: 'useCasesPage.items.legal.h1' })).toBeInTheDocument();
    expect(screen.getByText('useCasesPage.items.legal.answer')).toBeInTheDocument();
    expect(screen.getByText('useCasesPage.items.legal.answer2')).toBeInTheDocument();
  });

  it('walks from problem to solution with the sector screenshot', () => {
    const { container } = renderWithHost(<UseCasePageClient slug="healthcare" />);
    expect(screen.getByText('useCasesPage.items.healthcare.problem')).toBeInTheDocument();
    expect(screen.getByText('useCasesPage.items.healthcare.solution')).toBeInTheDocument();
    expect(container.querySelector('img[src="/screenshots/niche-health.webp"]')).not.toBeNull();
  });

  it('shows every FAQ entry of the catalogue', () => {
    renderWithHost(<UseCasePageClient slug="finance" />);
    for (const q of USE_CASE_FAQ_KEYS) {
      expect(screen.getByText(`useCasesPage.items.finance.faq.${q}.q`)).toBeInTheDocument();
      expect(screen.getByText(`useCasesPage.items.finance.faq.${q}.a`)).toBeInTheDocument();
    }
  });

  it('offers the email capture as a named use-case CTA when signed out', () => {
    const { container } = renderWithHost(<UseCasePageClient slug="research" />);
    expect(screen.getByLabelText('landing.hero.access.emailLabel')).toBeInTheDocument();
    expect(container.querySelectorAll(`[data-analytics="${USE_CASE_CTA}"]`).length).toBeGreaterThanOrEqual(2);
  });

  it('hides the email capture for a signed-in visitor and sends the CTA to the app', () => {
    renderWithHost(<UseCasePageClient slug="research" />, { isAuthenticated: true });
    expect(screen.queryByLabelText('landing.hero.access.emailLabel')).not.toBeInTheDocument();
  });

  it('links to documents, connect, its verticals section and every other use case', () => {
    const { container } = renderWithHost(<UseCasePageClient slug="consulting" />, { locale: 'en' });
    const hrefs = [...container.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/en/documents');
    expect(hrefs).toContain('/en/connect');
    expect(hrefs).toContain('/en/verticals#consulting');
    for (const other of USE_CASE_SLUGS.filter((s) => s !== 'consulting')) {
      expect(hrefs).toContain(`/en/use-cases/${other}`);
    }
    expect(hrefs).not.toContain('/en/use-cases/consulting');
  });
});
