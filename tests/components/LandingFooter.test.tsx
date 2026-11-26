import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';

import { LandingFooter } from '../../src/components/LandingFooter';
import { SOCIAL_PROFILES } from '../../src/social';

const props = { locale: 'es', isAuthed: false, appHref: '/app', signinHref: '/signin', deckHref: '/deck.pdf' };

describe('LandingFooter', () => {
  it('links every brand profile, opening off-site in a new tab', () => {
    renderWithHost(<LandingFooter {...props} />);
    for (const { label, url } of SOCIAL_PROFILES) {
      const link = screen.getByRole('link', { name: label });
      expect(link).toHaveAttribute('href', url);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
      expect(link.getAttribute('rel')).toContain('me');
    }
  });

  it('keeps the support email next to the profiles', () => {
    renderWithHost(<LandingFooter {...props} />);
    const mail = screen.getByRole('link', { name: /landing\.footer\.support\.email|@/ });
    expect(mail.getAttribute('href')).toMatch(/^mailto:/);
  });
});
