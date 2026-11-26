import { describe, it, expect, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

import { DifferentiatorSection } from '../../src/components/DifferentiatorSection';

describe('DifferentiatorSection', () => {
  it('anchors as #differentiator with its claim', () => {
    const { container } = renderWithHost(<DifferentiatorSection />);
    expect(container.querySelector('section#differentiator')).not.toBeNull();
    expect(screen.getByText('landing.differentiator.title')).toBeInTheDocument();
  });

  it('races building a system (weeks) against asking the agent (seconds), at the end state without motion', () => {
    renderWithHost(<DifferentiatorSection />);
    const before = screen.getByTestId('before');
    for (const step of ['s1', 's2', 's3', 's4', 's5']) {
      expect(within(before).getByText(`landing.differentiator.before.steps.${step}`)).toBeInTheDocument();
    }
    expect(before.querySelector('[data-weeks]')).toHaveTextContent('12');
    const after = screen.getByTestId('after');
    expect(within(after).getByText('landing.differentiator.after.chat.u')).toBeInTheDocument();
    expect(within(after).getByText('landing.differentiator.after.chat.x')).toBeInTheDocument();
    expect(after.querySelector('[data-seconds]')).toHaveTextContent('4');
    expect(screen.getByText('landing.differentiator.note')).toBeInTheDocument();
  });

  it('says how it works in three plain steps', () => {
    renderWithHost(<DifferentiatorSection />);
    for (const step of ['s1', 's2', 's3']) {
      expect(screen.getByText(`landing.differentiator.steps.${step}.title`)).toBeInTheDocument();
    }
  });

  it('folds the architecture under a toggle', () => {
    renderWithHost(<DifferentiatorSection />);
    const toggle = screen.getByText('landing.differentiator.treeToggle');
    expect(toggle.closest('details')).not.toHaveAttribute('open');
  });

  it('draws the tenant as the semantic layer and the hierarchy inside each base', () => {
    renderWithHost(<DifferentiatorSection />);
    const tree = screen.getByRole('img', { name: 'landing.differentiator.tree.label' });
    expect(within(tree).getByText('landing.differentiator.tree.tenant.title')).toBeInTheDocument();
    for (const base of ['hr', 'legal', 'ops', 'research']) {
      expect(within(tree).getByText(`landing.differentiator.tree.bases.${base}.name`)).toBeInTheDocument();
      expect(within(tree).getByText(`landing.differentiator.tree.bases.${base}.roles.reader`)).toBeInTheDocument();
    }
    expect(within(tree).getByText('landing.differentiator.tree.bases.hr.docs.d4.access')).toBeInTheDocument();
  });
});
