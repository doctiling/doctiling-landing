import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithHost } from '../helpers/host';

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

import { ParadigmSection } from '../../src/components/ParadigmSection';

const DOCS = ['clients', 'opportunities', 'projects', 'contracts', 'history'] as const;

function usedDocs(container: HTMLElement) {
  return [...container.querySelectorAll('li[data-used]')].map((li) => li.textContent);
}

describe('ParadigmSection', () => {
  it('keeps the #paradigm anchor the hero links to', () => {
    const { container } = renderWithHost(<ParadigmSection />);
    expect(container.querySelector('section#paradigm')).not.toBeNull();
  });

  it('shows table and text documents living in the same base', () => {
    renderWithHost(<ParadigmSection />);
    for (const doc of DOCS) {
      expect(screen.getByText(`landing.paradigm.docs.${doc}`)).toBeInTheDocument();
    }
    expect(screen.getAllByText('landing.paradigm.kinds.table')).toHaveLength(3);
    expect(screen.getAllByText('landing.paradigm.kinds.prose')).toHaveLength(2);
  });

  it('answers the open-contracts question first, crossing contracts and clients', () => {
    const { container } = renderWithHost(<ParadigmSection />);
    expect(screen.getByText('landing.paradigm.prompts.contracts.answer')).toBeInTheDocument();
    expect(usedDocs(container)).toEqual([
      expect.stringContaining('docs.clients'),
      expect.stringContaining('docs.contracts'),
    ]);
  });

  it('draws the funnel from the opportunities table and the meeting history', async () => {
    const { container } = renderWithHost(<ParadigmSection />);
    await userEvent.click(screen.getByRole('tab', { name: 'landing.paradigm.prompts.funnel.chip' }));
    expect(screen.getByText('landing.paradigm.funnel.won')).toBeInTheDocument();
    expect(usedDocs(container)).toEqual([
      expect.stringContaining('docs.opportunities'),
      expect.stringContaining('docs.history'),
    ]);
  });

  it('shows the agent writing: registering a client adds a row to the clients table', async () => {
    renderWithHost(<ParadigmSection />);
    await userEvent.click(screen.getByRole('tab', { name: 'landing.paradigm.prompts.register.chip' }));
    expect(screen.getByText('landing.paradigm.prompts.register.tools')).toBeInTheDocument();
    expect(screen.getByText('landing.paradigm.table.rows.new.name')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'landing.paradigm.prompts.register.chip' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
