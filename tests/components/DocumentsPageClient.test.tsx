import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

import DocumentsPageClient from '../../src/components/DocumentsPageClient';

describe('DocumentsPageClient', () => {
  it('carries the document-type and agent-output sections moved off the landing', () => {
    const { container } = renderWithHost(<DocumentsPageClient />);
    expect(container.querySelector('section#doc-types')).not.toBeNull();
    expect(container.querySelector('section#agent-output')).not.toBeNull();
    expect(container.querySelector('section#cycle')).not.toBeNull();
  });

  it('states its own promise and offers a way back to the landing', () => {
    renderWithHost(<DocumentsPageClient />);
    expect(screen.getByText('documentsPage.hero.title')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /landing\.nav\.brand/ })[0]).toHaveAttribute(
      'href',
      '/es/landing',
    );
  });
});
