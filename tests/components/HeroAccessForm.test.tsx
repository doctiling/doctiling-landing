import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithHost as renderWithHostBase } from '../helpers/host';
import type { ReactElement } from 'react';
import userEvent from '@testing-library/user-event';
import { HeroAccessForm } from '../../src/components/HeroAccessForm';

const submitDemoRequest = vi.fn();
const toast = vi.fn();

const track = vi.fn();
const renderWithHost = (ui: ReactElement) => renderWithHostBase(ui, { submitDemoRequest, notify: toast, track });

beforeEach(() => {
  submitDemoRequest.mockReset();
  toast.mockReset();
});

const emailField = () => screen.getByLabelText('landing.hero.access.emailLabel');
const submitBtn = () => screen.getByRole('button', { name: /landing\.hero\.access\.submit/ });

describe('HeroAccessForm', () => {
  it('captures a lead from the email alone', async () => {
    submitDemoRequest.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    renderWithHost(<HeroAccessForm detailsHref="#demo" />);

    await user.type(emailField(), 'ada@engines.example');
    await user.click(submitBtn());

    await waitFor(() => expect(submitDemoRequest).toHaveBeenCalledTimes(1));
    expect(submitDemoRequest.mock.calls[0][0]).toMatchObject({ email: 'ada@engines.example' });
  });

  it('reports the lead as the hero form when no page is given', async () => {
    submitDemoRequest.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    renderWithHost(<HeroAccessForm detailsHref="#demo" />);

    await user.type(emailField(), 'ada@engines.example');
    await user.click(submitBtn());

    await waitFor(() => expect(track).toHaveBeenCalledWith('generate_lead', { form: 'hero', page: undefined }));
  });

  it('attributes the lead to the page that produced it and tags the submit as a named CTA', async () => {
    submitDemoRequest.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    renderWithHost(
      <HeroAccessForm detailsHref="#demo" form="use_case" page="use-cases/legal" analytics="use_case_cta" />,
    );

    expect(submitBtn()).toHaveAttribute('data-analytics', 'use_case_cta');
    await user.type(emailField(), 'ada@engines.example');
    await user.click(submitBtn());

    await waitFor(() =>
      expect(track).toHaveBeenCalledWith('generate_lead', { form: 'use_case', page: 'use-cases/legal' }),
    );
  });

  it('replaces the field with a confirmation that points at the full form', async () => {
    submitDemoRequest.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    renderWithHost(<HeroAccessForm detailsHref="#demo" />);

    await user.type(emailField(), 'ada@engines.example');
    await user.click(submitBtn());

    await waitFor(() => expect(screen.getByText('landing.hero.access.success')).toBeInTheDocument());
    expect(screen.queryByLabelText('landing.hero.access.emailLabel')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /landing\.hero\.access\.details/ })).toHaveAttribute(
      'href',
      '#demo',
    );
  });

  it('warns without calling the server when the email is empty', async () => {
    const user = userEvent.setup();
    renderWithHost(<HeroAccessForm detailsHref="#demo" />);

    await user.click(submitBtn());

    expect(submitDemoRequest).not.toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'landing.demo.errors.invalid_email' }),
    );
  });

  it('surfaces the server error and keeps the field so the visitor can retry', async () => {
    submitDemoRequest.mockResolvedValue({ ok: false, error: 'rate_limited' });
    const user = userEvent.setup();
    renderWithHost(<HeroAccessForm detailsHref="#demo" />);

    await user.type(emailField(), 'ada@engines.example');
    await user.click(submitBtn());

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'landing.demo.errors.rate_limited' }),
      ),
    );
    expect(emailField()).toBeInTheDocument();
  });

  it('drops the second click of a double-submit', async () => {
    let release: (v: { ok: boolean }) => void = () => {};
    submitDemoRequest.mockImplementation(
      () => new Promise<{ ok: boolean }>((res) => { release = res; }),
    );
    const user = userEvent.setup();
    renderWithHost(<HeroAccessForm detailsHref="#demo" />);

    await user.type(emailField(), 'ada@engines.example');
    // The label flips to "submitting" mid-flight, so hold the node itself.
    const btn = submitBtn();
    await user.click(btn);
    await user.click(btn);

    expect(submitDemoRequest).toHaveBeenCalledTimes(1);
    release({ ok: true });
  });
});
