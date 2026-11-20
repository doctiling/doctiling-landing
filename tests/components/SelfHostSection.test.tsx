import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';


import {
  SelfHostSection,
  INSTALL_COMMANDS,
  LICENSE_URL,
  RELEASES_URL,
} from '../../src/components/SelfHostSection';

const writeText = vi.fn(async () => {});

beforeEach(() => {
  writeText.mockClear();
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });
});

describe('SelfHostSection', () => {
  it('offers the three real install channels with their exact commands', () => {
    renderWithHost(<SelfHostSection />);
    for (const { command } of INSTALL_COMMANDS) {
      expect(screen.getByText(command)).toBeInTheDocument();
    }
  });

  it('points at the public releases repo, not this private code repo', () => {
    renderWithHost(<SelfHostSection />);
    expect(RELEASES_URL).toBe('https://github.com/doctiling/releases');
    const link = screen.getByRole('link', { name: /landing\.selfHost\.repoCta/ });
    expect(link).toHaveAttribute('href', RELEASES_URL);
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  // fireEvent, not userEvent: userEvent.setup() installs its own clipboard stub
  // and would shadow the mock this assertion reads.
  it('copies a command to the clipboard', async () => {
    renderWithHost(<SelfHostSection />);
    const [{ key, command }] = INSTALL_COMMANDS;

    fireEvent.click(screen.getByRole('button', { name: new RegExp(`landing\\.selfHost\\.copy.*${key}$`) }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(command));
  });

  it('sells self-host as a license, not as a free install', () => {
    renderWithHost(<SelfHostSection />);
    expect(screen.getByText('landing.selfHost.license.title')).toBeInTheDocument();
    expect(screen.getByText('landing.selfHost.hosted.title')).toBeInTheDocument();
    for (const p of ['p1', 'p2', 'p3'] as const) {
      expect(screen.getByText(`landing.selfHost.license.bullets.${p}`)).toBeInTheDocument();
      expect(screen.getByText(`landing.selfHost.hosted.bullets.${p}`)).toBeInTheDocument();
    }
    expect(screen.queryByText(/landing\.selfHost\.free/)).not.toBeInTheDocument();
  });

  it('links the license text published next to the installers', () => {
    renderWithHost(<SelfHostSection />);
    expect(LICENSE_URL).toBe('https://github.com/doctiling/releases/blob/main/LICENSE');
    const link = screen.getByRole('link', { name: /landing\.selfHost\.licenseLink/ });
    expect(link).toHaveAttribute('href', LICENSE_URL);
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('asks for a license quote on the home page from the connect page', () => {
    renderWithHost(<SelfHostSection />);
    expect(screen.getByRole('link', { name: /landing\.selfHost\.licenseCta/ })).toHaveAttribute('href', '/es#demo');
  });

  it('inside the pricing tabs, quotes on the same page and carries no second #self-host', () => {
    const { container } = renderWithHost(<SelfHostSection variant="panel" />);
    expect(screen.getByRole('link', { name: /landing\.selfHost\.licenseCta/ })).toHaveAttribute('href', '#demo');
    expect(container.querySelector('#self-host')).toBeNull();
  });

  it('carries an anchor the nav can point at', () => {
    const { container } = renderWithHost(<SelfHostSection />);
    expect(container.querySelector('section#self-host')).not.toBeNull();
  });
});
