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

  it('contrasts a system of screens with an agent over the base', () => {
    renderWithHost(<DifferentiatorSection />);
    const before = screen.getByTestId('before');
    expect(within(before).getByText('landing.differentiator.before.form.submit')).toBeInTheDocument();
    const after = screen.getByTestId('after');
    expect(within(after).getByText('landing.differentiator.after.chat.u')).toBeInTheDocument();
    expect(within(after).getByText('landing.differentiator.after.chat.x')).toBeInTheDocument();
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
