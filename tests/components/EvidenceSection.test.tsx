import { describe, it, expect, vi } from 'vitest';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { screen } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';
import userEvent from '@testing-library/user-event';

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

import { EvidenceSection, EVIDENCE_TABS } from '../../src/components/EvidenceSection';

describe('EvidenceSection', () => {
  it('offers one tab per capability the captures prove', () => {
    renderWithHost(<EvidenceSection />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.textContent)).toEqual(
      EVIDENCE_TABS.map((tab) => `landing.evidence.tabs.${tab.key}.label`),
    );
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('swaps the captures when another tab is chosen', async () => {
    const user = userEvent.setup();
    renderWithHost(<EvidenceSection />);
    expect(screen.getByAltText('landing.evidence.tabs.analysis.shots.0.alt')).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'landing.evidence.tabs.tables.label' }));
    expect(screen.getByAltText('landing.evidence.tabs.tables.shots.0.alt')).toBeInTheDocument();
    expect(screen.queryByAltText('landing.evidence.tabs.analysis.shots.0.alt')).not.toBeInTheDocument();
  });

  it('discloses that the captures run on demo data', () => {
    renderWithHost(<EvidenceSection />);
    expect(screen.getByText('landing.evidence.footnote')).toBeInTheDocument();
  });

  it('only points at captures that ship in public/', () => {
    for (const tab of EVIDENCE_TABS) {
      for (const src of tab.shots) {
        expect(existsSync(path.join(process.cwd(), 'public', src)), src).toBe(true);
      }
    }
  });

  it('carries an anchor the hero can point at', () => {
    const { container } = renderWithHost(<EvidenceSection />);
    expect(container.querySelector('section#evidence')).not.toBeNull();
  });
});
