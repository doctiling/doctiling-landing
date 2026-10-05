import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';


import { KnowledgeSection } from '../../src/components/KnowledgeSection';

describe('KnowledgeSection', () => {
  it('contrasts a document manager and a vector store against a knowledge base', () => {
    renderWithHost(<KnowledgeSection />);
    for (const kind of ['dms', 'vector', 'doctiling']) {
      expect(screen.getByText(`landing.knowledge.compare.${kind}.kicker`)).toBeInTheDocument();
      expect(screen.getByText(`landing.knowledge.compare.${kind}.verb`)).toBeInTheDocument();
    }
  });

  it('walks the knowledge lifecycle and says who does each stage', () => {
    renderWithHost(<KnowledgeSection />);
    for (const stage of ['gather', 'structure', 'curate', 'analyze', 'share']) {
      expect(screen.getByText(`landing.knowledge.stages.${stage}.title`)).toBeInTheDocument();
    }
    expect(screen.getAllByText('landing.knowledge.roles.expert').length).toBeGreaterThan(0);
    expect(screen.getAllByText('landing.knowledge.roles.agent').length).toBeGreaterThan(0);
  });

  it('carries an anchor the nav can point at', () => {
    const { container } = renderWithHost(<KnowledgeSection />);
    expect(container.querySelector('section#knowledge')).not.toBeNull();
  });
});
