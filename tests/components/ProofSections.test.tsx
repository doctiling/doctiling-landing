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

import { CompareSection } from '../../src/components/CompareSection';
import { BenchmarkSection, RETRIEVAL_METRICS, AGENT_METRICS } from '../../src/components/BenchmarkSection';
import { ControlSection } from '../../src/components/ControlSection';
import { InterfacesSection } from '../../src/components/InterfacesSection';

describe('CompareSection', () => {
  it('labels the side-by-side as an illustration and can replay it', async () => {
    const user = userEvent.setup();
    renderWithHost(<CompareSection />);
    expect(screen.getByText('landing.compare.footnote')).toBeInTheDocument();
    expect(screen.getAllByText('landing.compare.question')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: /landing\.compare\.replay/ }));
    expect(screen.getByText('landing.compare.ours.answer')).toBeInTheDocument();
    expect(screen.getByText('landing.compare.theirs.answer')).toBeInTheDocument();
  });
});

describe('BenchmarkSection', () => {
  it('prints every measured value, before and after', () => {
    renderWithHost(<BenchmarkSection />);
    for (const m of RETRIEVAL_METRICS) {
      expect(screen.getAllByText(m.after.toFixed(3)).length).toBeGreaterThan(0);
      expect(screen.getAllByText(m.before.toFixed(3)).length).toBeGreaterThan(0);
    }
    for (const m of AGENT_METRICS) {
      expect(screen.getAllByText(`${m.after} %`).length).toBeGreaterThan(0);
      expect(screen.getAllByText(`${m.before} %`).length).toBeGreaterThan(0);
    }
    expect(screen.getByText('landing.benchmarks.footnote')).toBeInTheDocument();
  });

  it('only ever claims an improvement', () => {
    for (const m of [...RETRIEVAL_METRICS, ...AGENT_METRICS]) expect(m.after).toBeGreaterThanOrEqual(m.before);
  });
});

describe('ControlSection', () => {
  it('opens on the dedicated deployment and switches the boundary by tab', async () => {
    const user = userEvent.setup();
    renderWithHost(<ControlSection />);
    expect(screen.getByRole('tab', { name: 'landing.control.deployments.dedicated.tab' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText('landing.control.deployments.dedicated.boundary')).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'landing.control.deployments.local.tab' }));
    expect(screen.getByText('landing.control.deployments.local.boundary')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'landing.control.deployments.local.alt' })).toBeInTheDocument();
  });
});

describe('InterfacesSection', () => {
  it('draws the MCP surface as a legible transcript instead of a capture', async () => {
    const user = userEvent.setup();
    renderWithHost(<InterfacesSection />);
    expect(screen.getByText('landing.anywhere.studio.body')).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'landing.anywhere.mcp.tab' }));
    expect(screen.getByText('search_knowledge_base')).toBeInTheDocument();
    expect(screen.getByText('landing.anywhere.mcp.citations')).toBeInTheDocument();
  });
});
