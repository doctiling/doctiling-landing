import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';
import { SecuritySection, FRAMEWORKS } from '../../src/components/SecuritySection';
import en from '../../src/i18n/en.json';
import es from '../../src/i18n/es.json';

describe('SecuritySection — governance row (doctiling-web spec 064)', () => {
  it('shows each framework with its states and links to the trust center [TS-6505]', () => {
    renderWithHost(<SecuritySection />);
    expect(screen.getAllByTestId('framework')).toHaveLength(FRAMEWORKS.length);
    expect(screen.getByText('landing.security.frameworks.iso27001')).toBeInTheDocument();
    expect(screen.getByText('landing.security.statuses.notCertified')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /landing.security.trustCenter/ })).toHaveAttribute('href', '/es/security');
  });

  it('never affirms a certification and carries no numbers, in either language [TS-6505]', () => {
    for (const dict of [en, es]) {
      const copy = JSON.stringify((dict as { landing: { security: unknown } }).landing.security);
      const withoutNegations = copy.replace(/Not certified|No certificado/g, '');
      expect(withoutNegations).not.toMatch(/\\bcertified\\b|\\bcertificado\\b|\\bcertification\\b|\\bcertificación\\b/i);
      const frameworks = JSON.stringify((dict as { landing: { security: { frameworks: unknown; statuses: unknown } } }).landing.security.statuses);
      expect(frameworks).not.toMatch(/\\d/);
    }
  });
});
