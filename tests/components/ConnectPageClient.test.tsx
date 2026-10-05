import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

import ConnectPageClient from '../../src/components/ConnectPageClient';

describe('ConnectPageClient', () => {
  it('gathers the connection story: diagram, sharing, security and self-hosting', () => {
    const { container } = renderWithHost(<ConnectPageClient />);
    for (const id of ['connect', 'sharing', 'security', 'self-host']) {
      expect(container.querySelector(`section#${id}`)).not.toBeNull();
    }
  });

  it('states its own promise and offers a way back to the landing', () => {
    renderWithHost(<ConnectPageClient />);
    expect(screen.getByText('connectPage.hero.title')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /landing\.nav\.brand/ })[0]).toHaveAttribute(
      'href',
      '/es/landing',
    );
  });
});
