import { describe, it, expect } from 'vitest';
import { LANDING_MESSAGES, landingMessages, toLandingLocale, translate, type Messages } from '../src/i18n';

function keys(node: Messages, prefix = ''): string[] {
  return Object.entries(node).flatMap(([k, v]) =>
    typeof v === 'string' ? [`${prefix}${k}`] : keys(v, `${prefix}${k}.`),
  );
}

describe('landing dictionaries', () => {
  it('ship the same key set in English and Spanish', () => {
    expect(keys(LANDING_MESSAGES.en).sort()).toEqual(keys(LANDING_MESSAGES.es).sort());
  });

  it('own exactly the marketing namespaces', () => {
    expect(Object.keys(LANDING_MESSAGES.en).sort()).toEqual(
      ['connectPage', 'documentsPage', 'landing', 'verticalsPage'].sort(),
    );
  });

  it('fall back to Spanish for an unknown locale', () => {
    expect(toLandingLocale('fr')).toBe('es');
    expect(toLandingLocale(undefined)).toBe('es');
    expect(landingMessages('de')).toBe(LANDING_MESSAGES.es);
  });
});

describe('translate', () => {
  const dict: Messages = { a: { b: 'Hello {name}, {n} left' } };

  it('resolves nested keys and interpolates values', () => {
    expect(translate(dict, 'a.b', { name: 'Ada', n: 3 })).toBe('Hello Ada, 3 left');
  });

  it('returns the key itself when missing, so a gap is visible on the page', () => {
    expect(translate(dict, 'a.missing')).toBe('a.missing');
    expect(translate(dict, 'a')).toBe('a');
  });

  it('leaves an unknown placeholder untouched', () => {
    expect(translate(dict, 'a.b', { name: 'Ada' })).toBe('Hello Ada, {n} left');
  });
});
