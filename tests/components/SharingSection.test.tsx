import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';


import { SharingSection } from '../../src/components/SharingSection';

const CASES = ['clinical', 'hr', 'sales', 'portfolio'] as const;

describe('SharingSection', () => {
  it('shows who shares a knowledge base with whom', () => {
    renderWithHost(<SharingSection />);
    for (const c of CASES) {
      expect(screen.getByText(`landing.sharing.cases.${c}.title`)).toBeInTheDocument();
      expect(screen.getByText(`landing.sharing.cases.${c}.body`)).toBeInTheDocument();
      expect(screen.getByText(`landing.sharing.cases.${c}.parties`)).toBeInTheDocument();
    }
  });

  it('carries an anchor the nav can point at', () => {
    const { container } = renderWithHost(<SharingSection />);
    expect(container.querySelector('section#sharing')).not.toBeNull();
  });
});
