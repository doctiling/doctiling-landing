import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';


import { ConnectSection } from '../../src/components/ConnectSection';

const CHANNELS = ['app', 'chat', 'code', 'system'] as const;
const STORES = ['text', 'table', 'graph'] as const;

describe('ConnectSection', () => {
  it('names every channel that can talk to a knowledge base', () => {
    renderWithHost(<ConnectSection />);
    for (const channel of CHANNELS) {
      expect(screen.getByText(`landing.connect.channels.${channel}.title`)).toBeInTheDocument();
      expect(screen.getByText(`landing.connect.channels.${channel}.body`)).toBeInTheDocument();
    }
  });

  it('shows the three substrates the knowledge lives in', () => {
    renderWithHost(<ConnectSection />);
    for (const store of STORES) {
      expect(screen.getByText(`landing.connect.stores.${store}`)).toBeInTheDocument();
    }
  });

  it('describes the animated diagram for screen readers and carries a nav anchor', () => {
    const { container } = renderWithHost(<ConnectSection />);
    expect(container.querySelector('section#connect')).not.toBeNull();
    expect(screen.getByRole('img', { name: 'landing.connect.diagramAlt' })).toBeInTheDocument();
  });
});
