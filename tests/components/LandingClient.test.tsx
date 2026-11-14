import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';
import userEvent from '@testing-library/user-event';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

vi.mock('../../src/components/DemoRequestForm', () => ({
  DemoRequestForm: () => <div data-testid="demo-form" />,
}));
vi.mock('@doctiling/ui/molecules/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import LandingClient from '../../src/components/LandingClient';

describe('LandingClient', () => {
  it('asks a signed-out visitor for one field in the hero (invitation-only)', () => {
    renderWithHost(<LandingClient />);
    expect(screen.getByLabelText('landing.hero.access.emailLabel')).toBeInTheDocument();
  });

  it('swaps the hero capture for an app link when signed in', () => {
    renderWithHost(<LandingClient />, { isAuthenticated: true });
    expect(screen.queryByLabelText('landing.hero.access.emailLabel')).not.toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /landing\.nav\.openApp/ })[0]).toHaveAttribute(
      'href',
      '/es/kb',
    );
  });

  it('routes every tier CTA to the demo request when signed out', async () => {
    const user = userEvent.setup();
    renderWithHost(<LandingClient />);
    // The company tab is the default; a person's CTA appears once its tab is picked.
    for (const tier of ['free', 'gold', 'platinum']) {
      expect(
        screen.getByRole('link', { name: new RegExp(`landing\\.tiers\\.items\\.${tier}\\.cta`) }),
      ).toHaveAttribute('href', '#demo');
    }
    await user.click(screen.getByRole('tab', { name: 'landing.tiers.tabs.personal' }));
    expect(screen.getByRole('link', { name: /landing\.tiers\.items\.personal\.cta/ })).toHaveAttribute(
      'href',
      '#demo',
    );
  });

  it('prices a person and a company apart, each panel with its own three plan prices', () => {
    const { container } = renderWithHost(<LandingClient />);
    for (const audience of ['personal', 'gold']) {
      const panel = container.querySelector(`[data-audience="${audience}"]`);
      expect(panel).not.toBeNull();
      for (const plan of ['basic', 'advanced', 'max']) {
        expect(panel!.querySelector(`[data-plan="${plan}"]`)).toHaveTextContent(
          `landing.tiers.plans.items.${plan}.queries`,
        );
        expect(panel!.querySelector(`[data-plan="${plan}"]`)).toHaveTextContent(
          `landing.tiers.items.${audience}.prices.${plan}`,
        );
      }
      for (const key of ['price', 'priceNote', 'priceLabel', 'note', 'benefitsTitle', 'useTitle']) {
        expect(panel).toHaveTextContent(`landing.tiers.items.${audience}.${key}`);
      }
      for (const b of ['b1', 'b2', 'b3', 'b4', 'b5']) {
        expect(panel).toHaveTextContent(`landing.tiers.items.${audience}.benefits.${b}`);
      }
      for (const s of ['s1', 's2', 's3']) {
        expect(panel).toHaveTextContent(`landing.tiers.items.${audience}.use.${s}.title`);
      }
    }
    // A company panel never carries a person's prices, nor the other way round.
    expect(container.querySelector('[data-audience="gold"]')).not.toHaveTextContent('landing.tiers.items.personal.prices');
    expect(container.querySelector('[data-audience="personal"]')).not.toHaveTextContent('landing.tiers.items.gold.prices');
  });

  it('reads in dollars in English, with the peso charge under each plan price', () => {
    const { container } = renderWithHost(<LandingClient />, { locale: 'en', t: undefined });
    for (const audience of ['personal', 'gold']) {
      for (const plan of ['basic', 'advanced', 'max']) {
        const card = container.querySelector(`[data-audience="${audience}"] [data-plan="${plan}"]`);
        expect(card!.querySelector('[data-price]')).toHaveTextContent(/^≈ USD \d+$/);
        expect(card!.querySelector('[data-billed]')).toHaveTextContent(/^billed as COP [\d,]+$/);
      }
    }
    for (const pack of ['p200', 'p500', 'p1000']) {
      expect(container.querySelector(`[data-pack="${pack}"]`)).toHaveTextContent(/≈ USD \d+.*≈ USD 0\.14/);
    }
    // The table stays in one currency; the peso charge of the three packs sits in its note.
    expect(container.querySelector('section#stack table + p')).toHaveTextContent(
      /COP 90,000, COP 225,000 or COP 450,000: COP 450 per query/,
    );
    // The reference rate is stated once, in the fine print.
    expect(container.querySelector('[data-disclaimer="d1"]')).toHaveTextContent(/USD.*COP 3,270/);
  });

  it('keeps Spanish in pesos alone: no dollar figure and no second price line', () => {
    const { container } = renderWithHost(<LandingClient />, { locale: 'es', t: undefined });
    const section = container.querySelector('section#stack');
    expect(section).not.toHaveTextContent('USD');
    expect(section!.querySelectorAll('[data-billed]')).toHaveLength(0);
    expect(section!.querySelector('[data-audience="gold"] [data-plan="basic"] [data-price]')).toHaveTextContent('$77.900');
  });

  it('opens on the company tab and keeps the other panel in the document, hidden', () => {
    const { container } = renderWithHost(<LandingClient />);
    expect(screen.getByRole('tablist', { name: 'landing.tiers.tabs.label' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'landing.tiers.tabs.gold' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'landing.tiers.tabs.personal' })).toHaveAttribute('aria-selected', 'false');
    expect(container.querySelector('[data-audience="gold"]')).not.toHaveAttribute('hidden');
    // Hidden, not removed: crawlers still read a person's prices.
    expect(container.querySelector('[data-audience="personal"]')).toHaveAttribute('hidden');
  });

  it('switches the visible panel when the other tab is picked', async () => {
    const user = userEvent.setup();
    const { container } = renderWithHost(<LandingClient />);
    await user.click(screen.getByRole('tab', { name: 'landing.tiers.tabs.personal' }));
    expect(screen.getByRole('tab', { name: 'landing.tiers.tabs.personal' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'landing.tiers.tabs.gold' })).toHaveAttribute('aria-selected', 'false');
    expect(container.querySelector('[data-audience="personal"]')).not.toHaveAttribute('hidden');
    expect(container.querySelector('[data-audience="gold"]')).toHaveAttribute('hidden');
    await user.click(screen.getByRole('tab', { name: 'landing.tiers.tabs.gold' }));
    expect(container.querySelector('[data-audience="gold"]')).not.toHaveAttribute('hidden');
    expect(container.querySelector('[data-audience="personal"]')).toHaveAttribute('hidden');
  });

  it('explains top-ups in four steps and lists the three packs with price and price per query', () => {
    const { container } = renderWithHost(<LandingClient />);
    expect(screen.getByText('landing.tiers.topups.title')).toBeInTheDocument();
    for (const step of ['s1', 's2', 's3', 's4']) {
      expect(screen.getByText(`landing.tiers.topups.steps.${step}.title`)).toBeInTheDocument();
    }
    for (const col of ['pack', 'price', 'each']) {
      expect(screen.getByRole('columnheader', { name: `landing.tiers.topups.cols.${col}` })).toBeInTheDocument();
    }
    expect(container.querySelectorAll('[data-pack]')).toHaveLength(3);
    for (const pack of ['p200', 'p500', 'p1000']) {
      const row = container.querySelector(`[data-pack="${pack}"]`);
      for (const cell of ['name', 'price', 'each']) {
        expect(row).toHaveTextContent(`landing.tiers.topups.packs.${pack}.${cell}`);
      }
    }
    expect(screen.getByText('landing.tiers.topups.note')).toBeInTheDocument();
  });

  it('says what the price is made of and how billing works, top-ups out of the billing facts', () => {
    renderWithHost(<LandingClient />);
    for (const part of ['compute', 'studio', 'info', 'ai']) {
      expect(screen.getByText(`landing.tiers.parts.items.${part}.title`)).toBeInTheDocument();
    }
    for (const fact of ['fixed', 'monthly', 'annual', 'ownAi', 'overdue', 'cancel']) {
      expect(screen.getByText(`landing.tiers.billing.items.${fact}.title`)).toBeInTheDocument();
    }
    expect(screen.queryByText('landing.tiers.billing.items.topup.title')).not.toBeInTheDocument();
  });

  it('prints the eight plain-words notices', () => {
    const { container } = renderWithHost(<LandingClient />);
    expect(screen.getByText('landing.tiers.disclaimers.title')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-disclaimer]')).toHaveLength(8);
    for (const d of ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8']) {
      expect(container.querySelector(`[data-disclaimer="${d}"]`)).toHaveTextContent(
        `landing.tiers.disclaimers.items.${d}`,
      );
    }
  });

  it('points the free tier CTA to the app when signed in', () => {
    renderWithHost(<LandingClient />, { isAuthenticated: true });
    expect(screen.getByRole('link', { name: /landing\.tiers\.items\.free\.cta/ })).toHaveAttribute(
      'href',
      '/es/kb',
    );
  });

  it('reveals an FAQ answer when its question is clicked', async () => {
    const user = userEvent.setup();
    renderWithHost(<LandingClient />);
    expect(screen.queryByText('landing.faq.items.grounded.a')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /landing\.faq\.items\.grounded\.q/ }));
    expect(screen.getByText('landing.faq.items.grounded.a')).toBeInTheDocument();
  });

  it('keeps the header to two menus and three anchors', () => {
    renderWithHost(<LandingClient />);
    expect(screen.getByText('landing.nav.links.product')).toBeInTheDocument();
    expect(screen.getByText('landing.nav.resources')).toBeInTheDocument();
    expect(screen.getAllByText('landing.nav.links.verticals').length).toBeGreaterThan(0);
    expect(screen.getByText('landing.nav.links.selfHost')).toBeInTheDocument();
    expect(screen.getByText('landing.nav.links.faq')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'landing.nav.links.benchmarks' })).toHaveAttribute('href', '#benchmarks');
    expect(screen.getByRole('link', { name: 'landing.nav.links.control' })).toHaveAttribute('href', '/es/connect#control');
  });

  it('the hero shows the live chat demo (the video short moved out of the hero) and still points at the real captures', () => {
    const { container } = renderWithHost(<LandingClient />);
    expect(container.querySelector('iframe')).toBeNull();
    expect(screen.getByLabelText('landing.heroDemo.label')).toBeInTheDocument();
    expect(screen.getByText('landing.heroDemo.scripts.legal.u1')).toBeInTheDocument();
    expect(container.querySelector('section#differentiator')).not.toBeNull();
    expect(container.querySelector('section#video')).toBeNull();
    // The MCP hub diagram moved from the hero to the interfaces section.
    expect(container.querySelector('#anywhere svg[aria-label="landing.connect.diagramAlt"]')).not.toBeNull();
    expect(screen.getByRole('link', { name: 'landing.hero.ctaSecondary' })).toHaveAttribute(
      'href',
      '/es/documents#evidence',
    );
  });

  it('leads with the differentiator, then benchmarks; captures and data control live on their own pages', () => {
    const { container } = renderWithHost(<LandingClient />);
    const ids = Array.from(container.querySelectorAll('section[id]')).map((s) => s.id);
    for (const gone of ['paradigm', 'compare', 'evidence', 'control']) expect(ids).not.toContain(gone);
    const order = ['differentiator', 'benchmarks', 'platform', 'anywhere', 'stack', 'demo'];
    for (const id of order) expect(ids).toContain(id);
    expect(order.map((id) => ids.indexOf(id))).toEqual([...order.map((id) => ids.indexOf(id))].sort((a, b) => a - b));
  });

  it('shows measured outcomes, not a logo wall, right under the hero', () => {
    renderWithHost(<LandingClient />);
    for (const key of ['recall', 'tasks', 'language', 'latency']) {
      expect(screen.getByText(`landing.proof.items.${key}.value`)).toBeInTheDocument();
    }
    expect(screen.getByRole('link', { name: /landing\.proof\.link/ })).toHaveAttribute('href', '#benchmarks');
  });

  it('keeps the header to the brand name so the tagline never collides with the nav links', () => {
    renderWithHost(<LandingClient />);
    expect(screen.queryByText('landing.nav.tagline')).not.toBeInTheDocument();
  });

  it('marks the footer so the sticky CTA can detect it and hide itself', () => {
    const { container } = renderWithHost(<LandingClient />);
    expect(container.querySelector('#site-footer')).toBeInTheDocument();
  });

  it('links the footer to the five legal pages (spec 040, FR-006, SC-007)', () => {
    renderWithHost(<LandingClient />);
    expect(screen.getByRole('link', { name: 'landing.footer.links.privacy' })).toHaveAttribute(
      'href',
      '/es/privacy',
    );
    expect(
      screen.getByRole('link', { name: 'landing.footer.links.dataProcessing' }),
    ).toHaveAttribute('href', '/es/data-processing');
    expect(screen.getByRole('link', { name: 'landing.footer.links.cookies' })).toHaveAttribute(
      'href',
      '/es/cookies',
    );
    expect(screen.getByRole('link', { name: 'landing.footer.links.terms' })).toHaveAttribute(
      'href',
      '/es/terms',
    );
    expect(screen.getByRole('link', { name: 'landing.footer.links.security' })).toHaveAttribute(
      'href',
      '/es/security',
    );
  });
});
