import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

import { ProofSection, PROOF_CLAIMS } from '../../src/components/ProofSection';

// jsdom has no matchMedia, which reads as reduced motion: the figures render at their final value.
describe('ProofSection', () => {
  it('states three measured claims, each at its measured value', () => {
    const { container } = renderWithHost(<ProofSection />);
    expect(PROOF_CLAIMS.map((c) => c.key)).toEqual(['cites', 'small', 'edit']);
    expect(Array.from(container.querySelectorAll('[data-value]')).map((n) => n.textContent)).toEqual(['97 %', '60 %', '5×']);
    expect(container).toHaveTextContent('22 %');
  });

  it('formats percentages per locale', () => {
    const { container } = renderWithHost(<ProofSection />, { locale: 'en' });
    expect(container.querySelector('[data-value="97"]')).toHaveTextContent(/^97%$/);
  });

  it('keeps the nav anchor and sends every claim to the method page', () => {
    const { container } = renderWithHost(<ProofSection />);
    expect(container.querySelector('section#benchmarks')).not.toBeNull();
    const links = screen.getAllByRole('link', { name: /landing\.proof\.link/ });
    expect(links.map((l) => l.getAttribute('href'))).toEqual(Array(3).fill('/es/documents#benchmarks'));
  });

  it('lists what comes with every answer once for assistive tech, the looped copy hidden', () => {
    renderWithHost(<ProofSection />);
    const band = screen.getByRole('region', { name: 'landing.proof.guarantees.label' });
    expect(band.querySelectorAll('ul:not([aria-hidden]) li')).toHaveLength(6);
    expect(band.querySelectorAll('ul[aria-hidden="true"]')).toHaveLength(1);
  });
});
