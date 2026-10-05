import { render, type RenderResult } from '@testing-library/react';
import { vi } from 'vitest';
import type { ReactElement } from 'react';
import { LandingHostProvider, type LandingHost } from '../../src/host';

/** Echoes the key back, interpolating `{var}`, so selectors stay stable across copy changes. */
export function translate(key: string, values?: Record<string, unknown>): string {
  if (!values) return key;
  return Object.entries(values).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
    key,
  );
}

export function fakeHost(overrides: Partial<LandingHost> = {}): LandingHost {
  return {
    locale: 'es',
    isAuthenticated: false,
    submitDemoRequest: vi.fn(async () => ({ ok: true })),
    notify: vi.fn(),
    consent: { label: 'consent.demo.label {policy}', policyLabel: 'consent.demo.policy' },
    t: translate,
    ...overrides,
  };
}

export function renderWithHost(ui: ReactElement, overrides: Partial<LandingHost> = {}): RenderResult {
  return render(<LandingHostProvider host={fakeHost(overrides)}>{ui}</LandingHostProvider>);
}
