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

  it('routes every tier CTA to the demo request when signed out', () => {
    renderWithHost(<LandingClient />);
    for (const tier of ['free', 'personal', 'gold', 'platinum']) {
      expect(
        screen.getByRole('link', { name: new RegExp(`landing\\.tiers\\.items\\.${tier}\\.cta`) }),
      ).toHaveAttribute('href', '#demo');
    }
  });

  it('prices a person and a company apart, each with its own three plan prices', () => {
    const { container } = renderWithHost(<LandingClient />);
    for (const audience of ['personal', 'gold']) {
      const card = container.querySelector(`[data-audience="${audience}"]`);
      expect(card).not.toBeNull();
      for (const plan of ['basic', 'advanced', 'max']) {
        expect(card).toHaveTextContent(`landing.tiers.items.${audience}.plans.${plan}`);
        expect(card).toHaveTextContent(`landing.tiers.items.${audience}.prices.${plan}`);
      }
      expect(card).toHaveTextContent(`landing.tiers.items.${audience}.note`);
    }
    // A company card never carries a person's prices, nor the other way round.
    expect(container.querySelector('[data-audience="gold"]')).not.toHaveTextContent('landing.tiers.items.personal.prices');
    expect(container.querySelector('[data-audience="personal"]')).not.toHaveTextContent('landing.tiers.items.gold.prices');
  });

  it('shows what each plan includes with both prices labelled, and how billing works', () => {
    renderWithHost(<LandingClient />);
    for (const plan of ['basic', 'advanced', 'max']) {
      expect(screen.getByText(`landing.tiers.plans.items.${plan}.queries`)).toBeInTheDocument();
      expect(screen.getByText(`landing.tiers.plans.items.${plan}.personalPrice`)).toBeInTheDocument();
      expect(screen.getByText(`landing.tiers.plans.items.${plan}.teamPrice`)).toBeInTheDocument();
    }
    expect(screen.getAllByText('landing.tiers.plans.personalLabel')).toHaveLength(3);
    expect(screen.getAllByText('landing.tiers.plans.teamLabel')).toHaveLength(3);
    for (const fact of ['fixed', 'monthly', 'topup', 'annual', 'ownAi', 'cancel']) {
      expect(screen.getByText(`landing.tiers.billing.items.${fact}.title`)).toBeInTheDocument();
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
