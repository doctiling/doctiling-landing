import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LandingHostProvider, useLandingHost, type LandingHost } from '../src/host';

const baseHost: LandingHost = {
  locale: 'es',
  isAuthenticated: false,
  submitDemoRequest: vi.fn(async () => ({ ok: true })),
  notify: vi.fn(),
  consent: { label: 'x {policy}', policyLabel: 'p' },
};

function Probe() {
  const host = useLandingHost();
  return (
    <ul>
      <li data-testid="brand">{host.t('landing.nav.brand')}</li>
      <li data-testid="rights">{host.t('landing.footer.rights', { year: 2031 })}</li>
      <li data-testid="app">{host.href('app')}</li>
      <li data-testid="terms">{host.href('terms')}</li>
      <li data-testid="home">{host.landingHref()}</li>
      <li data-testid="docs">{host.landingHref('documents')}</li>
      <li data-testid="integrations">{String(host.features.integrations)}</li>
    </ul>
  );
}

describe('LandingHostProvider', () => {
  it('translates from the package dictionary of the host locale', () => {
    render(
      <LandingHostProvider host={baseHost}>
        <Probe />
      </LandingHostProvider>,
    );
    expect(screen.getByTestId('brand')).toHaveTextContent('Doctiling');
    expect(screen.getByTestId('rights')).toHaveTextContent('2031');
  });

  it('prefixes product routes with the locale and lets the host override them', () => {
    render(
      <LandingHostProvider host={{ ...baseHost, locale: 'en', routes: { app: '/studio' } }}>
        <Probe />
      </LandingHostProvider>,
    );
    expect(screen.getByTestId('app')).toHaveTextContent('/en/studio');
    expect(screen.getByTestId('terms')).toHaveTextContent('/en/terms');
    expect(screen.getByTestId('home')).toHaveTextContent('/en/landing');
    expect(screen.getByTestId('docs')).toHaveTextContent('/en/documents');
  });

  it('uses an absolute route as is, so a product on another origin is linked directly', () => {
    render(
      <LandingHostProvider host={{ ...baseHost, routes: { app: 'https://studio.example.com/es/kb' } }}>
        <Probe />
      </LandingHostProvider>,
    );
    expect(screen.getByTestId('app')).toHaveTextContent(/^https:\/\/studio\.example\.com\/es\/kb$/);
    expect(screen.getByTestId('terms')).toHaveTextContent('/es/terms');
  });

  it('defaults the optional feature switches to off', () => {
    render(
      <LandingHostProvider host={baseHost}>
        <Probe />
      </LandingHostProvider>,
    );
    expect(screen.getByTestId('integrations')).toHaveTextContent('false');
  });

  it('refuses to render a landing component outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/LandingHostProvider/);
    spy.mockRestore();
  });
});


describe('plansHref (doctiling-web spec 079: the paid sign-up lives in Studio)', () => {
  function Probe({ plan }: { plan?: string }) {
    const { plansHref } = useLandingHost();
    return <a href={plansHref(plan)}>x</a>;
  }

  it('builds the localized Studio URL with the plan, and lets the host move it', () => {
    const { rerender } = render(
      <LandingHostProvider host={{ ...baseHost, locale: 'en' }}>
        <Probe plan="avanzado" />
      </LandingHostProvider>,
    );
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://studio.doctiling.app/en/planes?plan=avanzado');
    rerender(
      <LandingHostProvider host={{ ...baseHost, locale: 'es', routes: { plans: '/planes' } }}>
        <Probe />
      </LandingHostProvider>,
    );
    expect(screen.getByRole('link')).toHaveAttribute('href', '/es/planes');
  });
});
