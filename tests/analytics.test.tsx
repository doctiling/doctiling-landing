import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  CONSENT_COOKIE,
  CONSENT_STORAGE_KEY,
  readConsentChoice,
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

const clearCookie = () => {
  document.cookie = `${CONSENT_COOKIE}=; Path=/; Max-Age=0`;
};

beforeEach(() => {
  (window as unknown as DL).dataLayer = [];
  window.localStorage.clear();
  clearCookie();
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

  it('bootstraps Consent Mode v2 opt-in everywhere: analytics and ads denied until the visitor accepts', () => {
    const js = consentBootstrapScript();
    expect(js).toContain("gtag('consent','default'");
    expect(js).toMatch(/"ad_user_data":"denied"/);
    const defaults = js.match(/gtag\('consent','default',(\{[^}]*\})\)/g) ?? [];
    expect(defaults).toHaveLength(1);
    expect(defaults[0]).toMatch(/"analytics_storage":"denied"/);
    expect(defaults[0]).not.toContain('granted');
    expect(js).not.toContain('region');
    expect(js).not.toContain('url_passthrough');
    expect(js).toContain(CONSENT_COOKIE);
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
    expect(document.cookie).toContain(`${CONSENT_COOKIE}=accepted`);
    expect(pushed().some((a) => a[0] === 'consent' && a[1] === 'update')).toBe(true);
    expect(screen.queryByRole('dialog')).toBeNull();
    unmount();
    render(<LandingAnalytics tagId="GTM-TEST" locale="es" cookiesHref="/es/cookies" />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('honours a choice made on another subdomain (shared cookie) without asking again', () => {
    document.cookie = `${CONSENT_COOKIE}=rejected; Path=/`;
    render(<LandingAnalytics tagId="GTM-TEST" locale="es" cookiesHref="/es/cookies" />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('migrates the v0.6.0 localStorage choice to the shared cookie', () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
    expect(readConsentChoice()).toBe('accepted');
    expect(document.cookie).toContain(`${CONSENT_COOKIE}=accepted`);
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
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
