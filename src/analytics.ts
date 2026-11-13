// Measurement surface of the landing: event names, the consent model and the
// one function every section calls. Vendor-neutral on purpose — events go to
// `window.dataLayer` in the gtag command shape, which a Google tag, a Tag
// Manager container or any dataLayer consumer the host loads can read. A host
// that measures elsewhere passes its own `track` through `LandingHost`.

/** GA4 recommended names where one exists (`generate_lead`), our own otherwise. */
export const LANDING_EVENTS = {
  /** A lead reached the host: hero email capture or the full demo form. */
  lead: 'generate_lead',
  /** A click towards the product (sign in / open the app) or any `data-analytics` element. */
  ctaClick: 'cta_click',
  /** The visitor pressed play on the demo video. */
  videoPlay: 'video_play',
  /** A self-host install command was copied. */
  selfHostCopy: 'self_host_copy',
} as const;

export type LandingEventName = (typeof LANDING_EVENTS)[keyof typeof LANDING_EVENTS];
export type LandingEventParams = Record<string, string | number | boolean | undefined>;
export type LandingTrackFn = (event: LandingEventName, params?: LandingEventParams) => void;

type ConsentValue = 'granted' | 'denied';
export interface ConsentState {
  ad_storage: ConsentValue;
  ad_user_data: ConsentValue;
  ad_personalization: ConsentValue;
  analytics_storage: ConsentValue;
}

/** Where the visitor's choice is remembered (first-party, this origin only). */
export const CONSENT_STORAGE_KEY = 'doctiling.consent.v1';
export type ConsentChoice = 'accepted' | 'rejected';

/**
 * Regions where analytics needs opt-in before any cookie (EEA, UK, Switzerland).
 * Everywhere else analytics starts granted and ads start denied until the
 * visitor accepts (Consent Mode v2 "advanced" — cookieless pings fill the gap).
 */
export const OPT_IN_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT',
  'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
] as const;

export function consentFor(choice: ConsentChoice): ConsentState {
  const v: ConsentValue = choice === 'accepted' ? 'granted' : 'denied';
  return { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v };
}

type DataLayerWindow = Window & { dataLayer?: unknown[] };

/** `gtag(...)` without loading anything: pushes the command for whichever tag reads the dataLayer. */
// A plain `function` (not an arrow) because gtag consumers expect the
// `arguments` object pushed, not an array.
export function gtag(..._args: unknown[]): void {
  if (typeof window === 'undefined') return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer ?? [];
  // eslint-disable-next-line prefer-rest-params
  w.dataLayer.push(arguments);
}

/** Default `track`: a GA4 event through the dataLayer; never throws, never runs on the server. */
export const dataLayerTrack: LandingTrackFn = (event, params) => {
  try {
    const clean = Object.fromEntries(Object.entries(params ?? {}).filter(([, v]) => v !== undefined));
    gtag('event', event, clean);
  } catch {
    // Measurement must never break the page.
  }
};

export function readConsentChoice(): ConsentChoice | null {
  try {
    const v = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return v === 'accepted' || v === 'rejected' ? v : null;
  } catch {
    return null;
  }
}

export function saveConsentChoice(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Private mode / blocked storage: the choice still applies to this page view.
  }
  gtag('consent', 'update', consentFor(choice));
}

/**
 * Inline script for the <head>, before the tag loads: Consent Mode v2 defaults
 * and the stored choice, so the very first hit already respects it.
 */
export function consentBootstrapScript(): string {
  const denied = consentFor('rejected');
  const defaultsWorld = { ...denied, analytics_storage: 'granted' as const };
  return [
    'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}',
    `gtag('consent','default',${JSON.stringify({ ...defaultsWorld, wait_for_update: 500 })});`,
    `gtag('consent','default',${JSON.stringify({ ...denied, region: OPT_IN_REGIONS })});`,
    "gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',true);",
    `try{var c=localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)});`,
    `if(c==='accepted')gtag('consent','update',${JSON.stringify(consentFor('accepted'))});`,
    `else if(c==='rejected')gtag('consent','update',${JSON.stringify(denied)});}catch(e){}`,
    "gtag('js',new Date());",
  ].join('');
}

/** Classifies a clicked link into a CTA name, or null when it is not one we measure. */
export function ctaFromHref(href: string): string | null {
  let path: string;
  try {
    path = new URL(href, 'https://x.invalid').pathname;
  } catch {
    return null;
  }
  if (/^\/(en|es)\/signin(\/|$)/.test(path)) return 'signin';
  if (/^\/(en|es)\/kb(\/|$)/.test(path)) return 'open_app';
  if (/\.(pdf|pptx?)$/i.test(path)) return 'download';
  return null;
}
