import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithHost as renderWithHostEs } from '../helpers/host';
import type { ReactElement } from 'react';
import userEvent from '@testing-library/user-event';
import { DemoRequestForm } from '../../src/components/DemoRequestForm';

const submitDemoRequest = vi.fn();
const toast = vi.fn();

// The host hands the form its lead action, its toaster and the legal notice.
const renderWithHost = (ui: ReactElement) =>
  renderWithHostEs(ui, {
    locale: 'en',
    submitDemoRequest,
    notify: toast,
    consent: {
      label: 'consent.demo.label {policy}',
      policyLabel: 'consent.demo.policy',
      notice: <p data-testid="privacy-notice">consent.notice</p>,
    },
  });

beforeEach(() => {
  submitDemoRequest.mockReset();
  toast.mockReset();
});

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('landing.demo.fields.name'), 'Ada Lovelace');
  await user.type(screen.getByLabelText('landing.demo.fields.company'), 'Engines Inc');
  await user.type(screen.getByLabelText('landing.demo.fields.email'), 'ada@engines.example');
  await user.type(screen.getByLabelText('landing.demo.fields.message'), 'We want a demo.');
  await user.click(screen.getByRole('checkbox'));
}

describe('DemoRequestForm', () => {
  it('blocks submit and warns when the email is empty', async () => {
    const user = userEvent.setup();
    renderWithHost(<DemoRequestForm />);
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /landing\.demo\.submit/ }));
    expect(submitDemoRequest).not.toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'landing.demo.errors.invalid_email' }),
    );
  });

  it('submits with the email alone — the other fields are optional', async () => {
    submitDemoRequest.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    renderWithHost(<DemoRequestForm />);
    await user.type(screen.getByLabelText('landing.demo.fields.email'), 'solo@engines.example');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /landing\.demo\.submit/ }));

    await waitFor(() => expect(submitDemoRequest).toHaveBeenCalledTimes(1));
    expect(submitDemoRequest.mock.calls[0][0]).toMatchObject({ email: 'solo@engines.example' });
  });

  it('submits the payload and shows a success toast on ok', async () => {
    submitDemoRequest.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    renderWithHost(<DemoRequestForm />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /landing\.demo\.submit/ }));

    await waitFor(() => expect(submitDemoRequest).toHaveBeenCalledTimes(1));
    expect(submitDemoRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Ada Lovelace',
        company: 'Engines Inc',
        email: 'ada@engines.example',
        message: 'We want a demo.',
        website: '',
      }),
    );
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'landing.demo.success' }));
  });

  it('surfaces the server error key on failure', async () => {
    submitDemoRequest.mockResolvedValue({ ok: false, error: 'mailer_failed' });
    const user = userEvent.setup();
    renderWithHost(<DemoRequestForm />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /landing\.demo\.submit/ }));

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'landing.demo.errors.mailer_failed', variant: 'destructive' }),
      ),
    );
  });

  it('falls back to the unknown error key when the server omits an error', async () => {
    submitDemoRequest.mockResolvedValue({ ok: false });
    const user = userEvent.setup();
    renderWithHost(<DemoRequestForm />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /landing\.demo\.submit/ }));

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'landing.demo.errors.unknown', variant: 'destructive' }),
      ),
    );
  });

  it('shows the unknown error toast when the request throws', async () => {
    const err = new Error('network down');
    submitDemoRequest.mockRejectedValue(err);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();
    renderWithHost(<DemoRequestForm />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /landing\.demo\.submit/ }));

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'landing.demo.errors.unknown', variant: 'destructive' }),
      ),
    );
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('clears the form after a successful submit', async () => {
    submitDemoRequest.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    renderWithHost(<DemoRequestForm />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /landing\.demo\.submit/ }));
    await waitFor(() => expect(toast).toHaveBeenCalledWith({ title: 'landing.demo.success' }));
    await waitFor(() =>
      expect(screen.getByLabelText('landing.demo.fields.name')).toHaveValue(''),
    );
  });

  it('updates the honeypot field value when filled', async () => {
    renderWithHost(<DemoRequestForm />);
    const honeypot = document.getElementById('demo-website') as HTMLInputElement;
    fireEvent.change(honeypot, { target: { value: 'spam' } });
    expect(honeypot).toHaveValue('spam');
  });

  it('keeps submit disabled and shows the notice until the authorization is ticked', async () => {
    const user = userEvent.setup();
    renderWithHost(<DemoRequestForm />);
    const button = screen.getByRole('button', { name: /landing\.demo\.submit/ });
    expect(button).toBeDisabled();
    expect(screen.getByTestId('privacy-notice')).toBeInTheDocument();

    await user.type(screen.getByLabelText('landing.demo.fields.email'), 'ada@engines.example');
    expect(button).toBeDisabled();

    await user.click(screen.getByRole('checkbox'));
    expect(button).not.toBeDisabled();
  });

  it('sends consent and locale with the payload', async () => {
    submitDemoRequest.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    renderWithHost(<DemoRequestForm />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /landing\.demo\.submit/ }));

    await waitFor(() => expect(submitDemoRequest).toHaveBeenCalledTimes(1));
    expect(submitDemoRequest).toHaveBeenCalledWith(
      expect.objectContaining({ consent: true, locale: 'en' }),
    );
  });
});
