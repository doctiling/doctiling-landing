import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';


import { AgentOutputSection } from '../../src/components/AgentOutputSection';

const OUTPUTS = ['chart', 'diagram', 'mindmap', 'table'] as const;

describe('AgentOutputSection', () => {
  it('shows what the agent can draw, not just write', () => {
    renderWithHost(<AgentOutputSection />);
    for (const output of OUTPUTS) {
      expect(screen.getByText(`landing.agentOutput.items.${output}.title`)).toBeInTheDocument();
      expect(screen.getByText(`landing.agentOutput.items.${output}.body`)).toBeInTheDocument();
      expect(
        screen.getByRole('img', { name: `landing.agentOutput.items.${output}.previewAlt` }),
      ).toBeInTheDocument();
    }
  });

  it('carries a nav anchor', () => {
    const { container } = renderWithHost(<AgentOutputSection />);
    expect(container.querySelector('section#agent-output')).not.toBeNull();
  });
});
