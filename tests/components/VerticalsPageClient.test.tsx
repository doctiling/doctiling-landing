import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithHost as renderWithHostEs } from '../helpers/host';
import type { LandingHost } from '../../src/host';
import type { ReactElement } from 'react';
const renderWithHost = (ui: ReactElement, o: Partial<LandingHost> = {}) => renderWithHostEs(ui, { locale: 'en', ...o });

import VerticalsPageClient from '../../src/components/VerticalsPageClient';

describe('VerticalsPageClient', () => {
  it('renders the hero and a section for each vertical', () => {
    const { container } = renderWithHost(<VerticalsPageClient />);
    expect(screen.getByText('verticalsPage.hero.title')).toBeInTheDocument();
    // Six verticals => six anchored sections by id.
    for (const key of ['legal', 'health', 'finance', 'accounting', 'research', 'consulting']) {
      expect(container.querySelector(`section#${key}`)).toBeInTheDocument();
    }
  });

  it('points access CTAs at the demo anchor when unauthenticated', () => {
    renderWithHost(<VerticalsPageClient />);
    const primary = screen.getByRole('link', { name: 'verticalsPage.hero.ctaPrimary' });
    expect(primary).toHaveAttribute('href', '/en/landing#demo');
    const nav = screen.getByRole('link', { name: 'verticalsPage.nav.requestAccess' });
    expect(nav).toHaveAttribute('href', '/en/landing#demo');
  });

  it('points access CTAs at the app when authenticated', () => {
    renderWithHost(<VerticalsPageClient />, { isAuthenticated: true });
    const primary = screen.getByRole('link', { name: 'verticalsPage.hero.ctaPrimary' });
    expect(primary).toHaveAttribute('href', '/en/kb');
  });

  it('renders the capability bullets for each vertical section', () => {
    renderWithHost(<VerticalsPageClient />);
    // Each vertical exposes three capability copy keys; assert one representative.
    expect(
      screen.getByText('verticalsPage.items.legal.capabilities.c1'),
    ).toBeInTheDocument();
  });

  it('links the secondary hero CTA to the cycle section on the documents page', () => {
    renderWithHost(<VerticalsPageClient />);
    const secondary = screen.getByRole('link', { name: /verticalsPage\.hero\.ctaSecondary/ });
    expect(secondary).toHaveAttribute('href', '/en/documents#cycle');
  });
});
