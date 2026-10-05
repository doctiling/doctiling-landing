import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';


import { ThesisSection } from '../../src/components/ThesisSection';

const SHIFTS = ['project', 'scope', 'reach', 'ownership'] as const;

describe('ThesisSection', () => {
  it('contrasts the old RAG project against operating knowledge bases', () => {
    renderWithHost(<ThesisSection />);
    for (const shift of SHIFTS) {
      expect(screen.getByText(`landing.thesis.shifts.${shift}.before`)).toBeInTheDocument();
      expect(screen.getByText(`landing.thesis.shifts.${shift}.after`)).toBeInTheDocument();
      expect(screen.getByText(`landing.thesis.shifts.${shift}.body`)).toBeInTheDocument();
    }
  });

  it('carries an anchor the nav can point at', () => {
    const { container } = renderWithHost(<ThesisSection />);
    expect(container.querySelector('section#thesis')).not.toBeNull();
  });
});
