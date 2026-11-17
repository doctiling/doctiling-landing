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

  it('says what each plan includes: price per person, AI balance, queries, space and who it fits', async () => {
    const user = userEvent.setup();
    renderWithHost(<QuoteRequestForm />, host);
    const plans = { basico: 'basic', avanzado: 'advanced', maximo: 'max' } as const;
    for (const [field, plan] of Object.entries(plans)) {
      // The count input carries the summary as its description, so a screen reader hears it without hovering.
      const input = screen.getByLabelText(`landing.quote.plans.${field}`);
      for (const part of [`landing.tiers.items.gold.prices.${plan}`, `landing.tiers.plans.items.${plan}.queries`, `landing.tiers.plans.items.${plan}.daily`, `landing.tiers.plans.items.${plan}.info`, `landing.tiers.plans.items.${plan}.fit`]) {
        expect(input).toHaveAccessibleDescription(expect.stringContaining(part));
      }
    }
    // Hovering (or focusing) the plan's info button opens the tooltip with the same facts.
    await user.hover(screen.getByRole('button', { name: 'landing.quote.planInfo' + ': landing.quote.plans.avanzado' }));
    const tip = await screen.findByRole('tooltip');
    expect(tip).toHaveTextContent('landing.tiers.items.gold.prices.advanced');
    expect(tip).toHaveTextContent('landing.tiers.plans.items.advanced.fit');
  });
});
