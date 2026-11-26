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

vi.mock('../../src/components/DemoRequestForm', () => ({ DemoRequestForm: () => <div data-testid="demo-form" /> }));
vi.mock('../../src/components/QuoteRequestForm', () => ({ QuoteRequestForm: () => <div data-testid="quote-form" /> }));

import { ContactSection } from '../../src/components/ContactSection';

const quote = vi.fn(async () => ({ ok: true }));

describe('ContactSection', () => {
  it('shows one form at a time: access first, the quote behind its tab', async () => {
    renderWithHost(<ContactSection />, { submitQuoteRequest: quote });
    expect(screen.getByTestId('demo-form')).toBeInTheDocument();
    expect(screen.queryByTestId('quote-form')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('tab', { name: 'landing.contact.tabs.quote' }));
    expect(screen.getByTestId('quote-form')).toBeInTheDocument();
    expect(screen.queryByTestId('demo-form')).not.toBeInTheDocument();
    expect(screen.getByText('landing.quote.title')).toBeInTheDocument();
  });

  it('opens the quote tab from #cotizar and keeps both anchors on one section', () => {
    window.location.hash = '#cotizar';
    try {
      const { container } = renderWithHost(<ContactSection />, { submitQuoteRequest: quote });
      expect(screen.getByRole('tab', { name: 'landing.contact.tabs.quote' })).toHaveAttribute('aria-selected', 'true');
      expect(container.querySelector('section#demo #cotizar')).not.toBeNull();
    } finally {
      window.location.hash = '';
    }
  });

  it('is just the access form where the host takes no quotes', () => {
    renderWithHost(<ContactSection />);
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.getByTestId('demo-form')).toBeInTheDocument();
  });
});
