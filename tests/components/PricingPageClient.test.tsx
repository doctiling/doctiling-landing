import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

import PricingPage from '../../src/components/PricingPageClient';

describe('PricingPage', () => {
  it('explains top-ups in four steps and lists the four amounts, the minimum first', () => {
    const { container } = renderWithHost(<PricingPage />);
    expect(container.querySelector('section#top-ups')).not.toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: 'landing.tiers.topups.title' })).toBeInTheDocument();
    for (const step of ['s1', 's2', 's3', 's4']) {
      expect(screen.getByText(`landing.tiers.topups.steps.${step}.title`)).toBeInTheDocument();
    }
    for (const col of ['pack', 'price', 'each']) {
      expect(screen.getByRole('columnheader', { name: `landing.tiers.topups.cols.${col}` })).toBeInTheDocument();
    }
    expect(Array.from(container.querySelectorAll('[data-pack]')).map((r) => r.getAttribute('data-pack'))).toEqual([
      'p50',
      'p200',
      'p500',
      'p1000',
    ]);
    for (const pack of ['p50', 'p200', 'p500', 'p1000']) {
      const row = container.querySelector(`[data-pack="${pack}"]`);
      for (const cell of ['name', 'price', 'each']) {
        expect(row).toHaveTextContent(`landing.tiers.topups.packs.${pack}.${cell}`);
      }
    }
    expect(screen.getByText('landing.tiers.topups.note')).toBeInTheDocument();
  });

  it('reads top-ups in dollars in English, with the peso charge in the note', () => {
    const { container } = renderWithHost(<PricingPage />, { locale: 'en', t: undefined });
    for (const pack of ['p50', 'p200', 'p500', 'p1000']) {
      expect(container.querySelector(`[data-pack="${pack}"]`)).toHaveTextContent(/≈ USD \d+.*[\d,]+ queries/);
    }
    expect(container.querySelector('section#top-ups table + p')).toHaveTextContent(
      /COP 20,000, COP 90,000, COP 225,000 or COP 450,000/,
    );
  });

  it('keeps top-ups in pesos alone in Spanish', () => {
    const { container } = renderWithHost(<PricingPage />, { locale: 'es', t: undefined });
    const section = container.querySelector('section#top-ups');
    expect(section).not.toHaveTextContent('USD');
    expect(section!.querySelector('[data-pack="p50"]')).toHaveTextContent('$20.000');
  });

  it('states its own promise, one h1, and links back to the plans', () => {
    renderWithHost(<PricingPage />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByText('pricingPage.hero.title')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /pricingPage\.plansLink/ })).toHaveAttribute('href', '/es/landing#stack');
  });
});
