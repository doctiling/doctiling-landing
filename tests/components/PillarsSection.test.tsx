import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';


import { PillarsSection } from '../../src/components/PillarsSection';

const PILLARS = [
  ['documents', '/es/documents'],
  ['connect', '/es/connect'],
  ['verticals', '/es/verticals'],
] as const;

describe('PillarsSection', () => {
  it('sends each pillar to its own page instead of stacking it on the landing', () => {
    renderWithHost(<PillarsSection />);
    for (const [key, href] of PILLARS) {
      expect(screen.getByText(`landing.pillars.items.${key}.title`)).toBeInTheDocument();
      expect(screen.getByText(`landing.pillars.items.${key}.body`)).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: new RegExp(`landing\\.pillars\\.items\\.${key}\\.cta`) }),
      ).toHaveAttribute('href', href);
    }
  });
});
