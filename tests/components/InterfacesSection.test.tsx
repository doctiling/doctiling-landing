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

import { InterfacesSection } from '../../src/components/InterfacesSection';

describe('InterfacesSection', () => {
  it('puts the surface tabs above the panel and opens on the studio', () => {
    const { container } = renderWithHost(<InterfacesSection />);
    const tablist = screen.getByRole('tablist', { name: 'landing.anywhere.tablistLabel' });
    const panel = container.querySelector('#anywhere-panel')!;
    expect(tablist.compareDocumentPosition(panel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'landing.anywhere.studio.tab' })).toHaveAttribute('aria-selected', 'true');
  });

  it('switches surface on click', async () => {
    renderWithHost(<InterfacesSection />);
    await userEvent.click(screen.getByRole('tab', { name: 'landing.anywhere.mcp.tab' }));
    expect(screen.getByText('landing.anywhere.mcp.answer')).toBeInTheDocument();
    expect(screen.getByText('landing.anywhere.mcp.body')).toBeInTheDocument();
  });
});
