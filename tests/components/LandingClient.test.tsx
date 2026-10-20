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
    for (const tier of ['free', 'gold', 'platinum']) {
      expect(
        screen.getByRole('link', { name: new RegExp(`landing\\.tiers\\.items\\.${tier}\\.cta`) }),
      ).toHaveAttribute('href', '#demo');
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
    expect(screen.getByRole('link', { name: 'landing.nav.links.control' })).toHaveAttribute('href', '#control');
  });

  it('no longer embeds the demo video; the hero points at the real captures instead', () => {
    const { container } = renderWithHost(<LandingClient />);
    expect(container.querySelector('iframe')).toBeNull();
    expect(container.querySelector('section#video')).toBeNull();
    expect(screen.getByRole('link', { name: 'landing.hero.ctaSecondary' })).toHaveAttribute(
      'href',
      '#evidence',
    );
  });

  it('leads with proof: comparison, then benchmarks, then real captures, then data control', () => {
    const { container } = renderWithHost(<LandingClient />);
    const ids = Array.from(container.querySelectorAll('section[id]')).map((s) => s.id);
    const order = ['compare', 'benchmarks', 'evidence', 'control', 'platform', 'anywhere', 'stack', 'demo'];
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
