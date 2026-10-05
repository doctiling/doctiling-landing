import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';


import { CycleSection } from '../../src/components/CycleSection';

const STAGES = ['convert', 'cite', 'stack', 'deliver'] as const;

describe('CycleSection', () => {
  it('shows all four stages of the real loop at once — no tab hides one', () => {
    renderWithHost(<CycleSection />);
    for (const stage of STAGES) {
      expect(screen.getByText(`landing.cycle.stages.${stage}.title`)).toBeInTheDocument();
      expect(screen.getByText(`landing.cycle.stages.${stage}.body`)).toBeInTheDocument();
    }
  });

  it('names what each stage actually does, in order', () => {
    renderWithHost(<CycleSection />);
    const titles = screen
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent);
    expect(titles).toEqual(STAGES.map((s) => `landing.cycle.stages.${s}.title`));
  });

  it('keeps the #cycle anchor the documents page nav links to', () => {
    const { container } = renderWithHost(<CycleSection />);
    expect(container.querySelector('section#cycle')).not.toBeNull();
  });

  it('grounds every stage in a concrete scenario', () => {
    renderWithHost(<CycleSection />);
    for (const stage of STAGES) {
      expect(screen.getByText(`landing.cycle.stages.${stage}.scenario`)).toBeInTheDocument();
    }
  });
});
