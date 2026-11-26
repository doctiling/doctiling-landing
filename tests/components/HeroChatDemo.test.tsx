import { describe, it, expect } from 'vitest';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithHost } from '../helpers/host';
import { HeroChatDemo } from '../../src/components/HeroChatDemo';

// jsdom has no matchMedia, which the demo reads as "reduced motion": the whole
// script renders at once, so the tests see every line without timers.
describe('HeroChatDemo', () => {
  it('opens on the legal base with the person asking and the agent citing', () => {
    renderWithHost(<HeroChatDemo />);
    expect(screen.getByText('landing.heroDemo.bases.legal.name')).toBeInTheDocument();
    expect(screen.getByText('landing.heroDemo.scripts.legal.u1')).toBeInTheDocument();
    expect(screen.getByText('landing.heroDemo.scripts.legal.a1.cites.c1')).toBeInTheDocument();
    expect(screen.getByText('landing.heroDemo.scripts.legal.x1')).toBeInTheDocument();
  });

  it('offers four domains so the demo never reads as one vertical', () => {
    renderWithHost(<HeroChatDemo />);
    expect(screen.getAllByRole('tab')).toHaveLength(4);
    expect(screen.getByRole('tab', { name: 'landing.heroDemo.domains.legal' })).toHaveAttribute('aria-selected', 'true');
  });

  it('switches base and script when a domain is picked', async () => {
    renderWithHost(<HeroChatDemo />);
    await userEvent.click(screen.getByRole('tab', { name: 'landing.heroDemo.domains.clinic' }));
    expect(screen.getByText('landing.heroDemo.bases.clinic.name')).toBeInTheDocument();
    expect(screen.getByText('landing.heroDemo.scripts.clinic.u1')).toBeInTheDocument();
    expect(screen.queryByText('landing.heroDemo.scripts.legal.u1')).not.toBeInTheDocument();
  });

  it('folds each tool run into one line and opens the source of a citation on focus', async () => {
    renderWithHost(<HeroChatDemo />);
    // The echo `t` gives one call per run, hence the singular line.
    expect(screen.getAllByText('landing.heroDemo.toolDone')).toHaveLength(2);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    const cite = screen.getByRole('button', { name: 'landing.heroDemo.scripts.legal.a1.cites.c1' });
    act(() => cite.focus());
    expect(await screen.findByRole('tooltip')).toHaveTextContent('landing.heroDemo.scripts.legal.a1.sources.c1.quote');
  });

  it('pauses and resumes the replay', async () => {
    renderWithHost(<HeroChatDemo />);
    await userEvent.click(screen.getByRole('button', { name: /landing\.heroDemo\.pause/ }));
    expect(screen.getByRole('button', { name: /landing\.heroDemo\.resume/ })).toBeInTheDocument();
  });

  it('shows the agent writing in every domain: a row, a document or a job', async () => {
    renderWithHost(<HeroChatDemo />);
    for (const d of ['legal', 'clinic', 'ops', 'research']) {
      await userEvent.click(screen.getByRole('tab', { name: `landing.heroDemo.domains.${d}` }));
      expect(screen.getByText(`landing.heroDemo.scripts.${d}.x1`)).toBeInTheDocument();
      expect(screen.getByText(`landing.heroDemo.scripts.${d}.x1Title`)).toBeInTheDocument();
    }
  });
});
