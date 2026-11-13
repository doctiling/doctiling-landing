import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  CONSENT_STORAGE_KEY,
  LANDING_EVENTS,
  consentBootstrapScript,
  ctaFromHref,
  dataLayerTrack,
} from '../src/analytics';
import { LandingHostProvider, useLandingHost } from '../src/host';
import { LandingAnalytics } from '../src/components/LandingAnalytics';
import { fakeHost } from './helpers/host';

vi.mock('next/script', () => ({ default: () => null }));

type DL = { dataLayer?: unknown[] };
const pushed = () => ((window as unknown as DL).dataLayer ?? []).map((a) => Array.from(a as ArrayLike<unknown>));

beforeEach(() => {
  (window as unknown as DL).dataLayer = [];
  window.localStorage.clear();
});

describe('analytics', () => {
  it('pushes GA4 events in the gtag shape and drops undefined params', () => {
    dataLayerTrack(LANDING_EVENTS.lead, { form: 'hero', team_size: undefined });
    expect(pushed()).toEqual([['event', 'generate_lead', { form: 'hero' }]]);
  });

  it('classifies product and download links as CTAs', () => {
    expect(ctaFromHref('/es/signin')).toBe('signin');
    expect(ctaFromHref('https://www.doctiling.app/en/kb/abc')).toBe('open_app');
    expect(ctaFromHref('/pitch/deck-es.pdf')).toBe('download');
    expect(ctaFromHref('/es/documents')).toBeNull();
  });

  it('bootstraps Consent Mode v2: ads denied everywhere, analytics opt-in in the EEA', () => {
    const js = consentBootstrapScript();
    expect(js).toContain("gtag('consent','default'");
    expect(js).toMatch(/"ad_user_data":"denied"/);
    expect(js).toContain('"DE"');
    expect(js).toContain(CONSENT_STORAGE_KEY);
  });

  it('the host track defaults to the dataLayer and can be overridden', () => {
    const custom = vi.fn();
    function Probe() {
      const { track } = useLandingHost();
      return <button onClick={() => track(LANDING_EVENTS.videoPlay, { video_id: 'x' })}>go</button>;
    }
    render(
      <LandingHostProvider host={fakeHost({ track: custom })}>
        <Probe />
      </LandingHostProvider>,
    );
    fireEvent.click(screen.getByText('go'));
    expect(custom).toHaveBeenCalledWith('video_play', { video_id: 'x' });
  });
});

describe('LandingAnalytics', () => {
  it('renders nothing without a tag id', () => {
    const { container } = render(<LandingAnalytics locale="es" cookiesHref="/es/cookies" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('asks for consent once and stores the choice', () => {
    const { unmount } = render(<LandingAnalytics tagId="GTM-TEST" locale="es" cookiesHref="/es/cookies" />);
    fireEvent.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe('accepted');
    expect(pushed().some((a) => a[0] === 'consent' && a[1] === 'update')).toBe(true);
    expect(screen.queryByRole('dialog')).toBeNull();
    unmount();
    render(<LandingAnalytics tagId="GTM-TEST" locale="es" cookiesHref="/es/cookies" />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('measures CTA clicks through one delegated listener', () => {
    render(
      <>
        <LandingAnalytics tagId="GTM-TEST" locale="en" cookiesHref="/en/cookies" />
        <section id="hero">
          <a href="/en/signin">Start free</a>
        </section>
      </>,
    );
    fireEvent.click(screen.getByText('Start free'));
    expect(pushed()).toContainEqual([
      'event',
      'cta_click',
      { cta: 'signin', link_url: '/en/signin', link_text: 'Start free', section: 'hero' },
    ]);
  });
});
