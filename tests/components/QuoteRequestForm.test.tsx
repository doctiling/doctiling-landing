import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithHost } from '../helpers/host';
import { QuoteRequestForm } from '../../src/components/QuoteRequestForm';

// A company asks for a quote (doctiling-billing US13): people per plan, priced and emailed by billing.
const submitQuoteRequest = vi.fn();
const notify = vi.fn();
const host = {
  locale: 'es' as const,
  submitDemoRequest: vi.fn(),
  submitQuoteRequest,
  notify,
  consent: { label: 'consent {policy}', policyLabel: 'policy' },
};

beforeEach(() => {
  submitQuoteRequest.mockReset();
  notify.mockReset();
});

describe('QuoteRequestForm', () => {
  it('sends company, contact and only the plans with people, and confirms by email', async () => {
    submitQuoteRequest.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    renderWithHost(<QuoteRequestForm />, host);
    await user.type(screen.getByLabelText('landing.quote.fields.company'), 'Acme SAS');
    await user.type(screen.getByLabelText('landing.quote.fields.name'), 'Lu');
    await user.type(screen.getByLabelText('landing.quote.fields.email'), 'lu@acme.co');
    await user.type(screen.getByLabelText('landing.quote.plans.avanzado'), '3');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /landing\.quote\.submit/ }));
    await waitFor(() =>
      expect(submitQuoteRequest).toHaveBeenCalledWith(
        expect.objectContaining({ company: 'Acme SAS', contactName: 'Lu', contactEmail: 'lu@acme.co', members: { avanzado: 3 }, consent: true }),
      ),
    );
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ title: 'landing.quote.success' }));
    // the form gives way to a confirmation that stays: where it went, what comes next, check spam
    expect(screen.getByRole('status')).toHaveTextContent('landing.quote.sent.title');
    expect(screen.getByText('landing.quote.sent.spam')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'landing.quote.sent.again' }));
    expect(screen.getByLabelText('landing.quote.fields.company')).toBeInTheDocument();
  });

  it('asks for at least one plan with people before sending', async () => {
    const user = userEvent.setup();
    renderWithHost(<QuoteRequestForm />, host);
    await user.type(screen.getByLabelText('landing.quote.fields.company'), 'Acme SAS');
    await user.type(screen.getByLabelText('landing.quote.fields.name'), 'Lu');
    await user.type(screen.getByLabelText('landing.quote.fields.email'), 'lu@acme.co');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /landing\.quote\.submit/ }));
    expect(submitQuoteRequest).not.toHaveBeenCalled();
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ title: 'landing.quote.errors.invalid_members', variant: 'destructive' }));
  });
});
