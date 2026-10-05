import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';


import { DocTypesSection } from '../../src/components/DocTypesSection';

const TYPES = ['text', 'table', 'graph'] as const;

describe('DocTypesSection', () => {
  it('presents the three document types a knowledge base can hold', () => {
    renderWithHost(<DocTypesSection />);
    for (const type of TYPES) {
      expect(screen.getByText(`landing.docTypes.items.${type}.title`)).toBeInTheDocument();
      expect(screen.getByText(`landing.docTypes.items.${type}.body`)).toBeInTheDocument();
      expect(screen.getByText(`landing.docTypes.items.${type}.kicker`)).toBeInTheDocument();
    }
  });

  it('lists what each type unlocks', () => {
    renderWithHost(<DocTypesSection />);
    for (const type of TYPES) {
      for (const bullet of ['p1', 'p2', 'p3']) {
        expect(
          screen.getByText(`landing.docTypes.items.${type}.bullets.${bullet}`),
        ).toBeInTheDocument();
      }
    }
  });

  it('labels every preview for screen readers and carries a nav anchor', () => {
    const { container } = renderWithHost(<DocTypesSection />);
    expect(container.querySelector('section#doc-types')).not.toBeNull();
    for (const type of TYPES) {
      expect(
        screen.getByRole('img', { name: `landing.docTypes.items.${type}.previewAlt` }),
      ).toBeInTheDocument();
    }
  });
});
