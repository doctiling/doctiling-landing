'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { landingMessages, translate, type LandingLocale, type TranslateFn } from './i18n';
import { dataLayerTrack, type LandingTrackFn } from './analytics';

// Everything the marketing surface needs from the product that hosts it. The
// landing never imports the host: auth state, the lead action, the toaster and
// the legal consent copy all arrive through this contract, so the package can
// be rendered by the SaaS, by a static preview or by a test with a fake host.

export interface DemoRequestInput {
  /** Only the email is required — the hero captures a lead from that alone. */
  email: string;
  name?: string;
  company?: string;
  teamSize?: string;
  message?: string;
  /** Honeypot field: humans never fill it. */
  website?: string;
  captchaToken?: string;
  consent?: boolean;
  locale?: string;
}

/** A company asks for a quote (doctiling-billing US13): billing prices it from the list and emails a link to accept. */
export interface QuoteRequestInput {
  company: string;
  contactName: string;
  contactEmail: string;
  /** People per plan; plans without people are left out. */
  members: Partial<Record<'basico' | 'avanzado' | 'maximo', number>>;
  notes?: string;
  website?: string;
  captchaToken?: string;
  consent: boolean;
  locale?: string;
}

export interface QuoteRequestOutcome {
  ok: boolean;
  /** Key under `landing.quote.errors.*` when `ok` is false. */
  error?: string;
}

export interface DemoRequestOutcome {
  ok: boolean;
  /** Key under `landing.demo.errors.*` when `ok` is false. */
  error?: string;
}

export interface LandingNotice {
  title: string;
  variant?: 'default' | 'destructive';
}

/**
 * Product routes the landing links to, without the locale prefix. A host whose
 * product lives on another origin passes an absolute URL, used as is.
 */
export interface LandingRoutes {
  app: string;
  signin: string;
  privacy: string;
  dataProcessing: string;
  cookies: string;
  terms: string;
  security: string;
  /** Where a person buys a plan: the paid sign-up of the shared studio (doctiling-web spec 079). Absolute by
   *  default — it lives in Studio whatever host mounts the landing. */
  plans: string;
}

export const DEFAULT_LANDING_ROUTES: LandingRoutes = {
  app: '/kb',
  signin: '/signin',
  privacy: '/privacy',
  dataProcessing: '/data-processing',
  cookies: '/cookies',
  terms: '/terms',
  security: '/security',
  plans: 'https://studio.doctiling.app/planes',
};

export interface LandingConsent {
  /** Sentence with a `{policy}` placeholder where the policy link goes. */
  label: string;
  policyLabel: string;
  /** Rendered under the checkbox (the short legal notice the host owns). */
  notice?: ReactNode;
}

export interface LandingHost {
  locale: LandingLocale;
  isAuthenticated: boolean;
  features?: { integrations?: boolean };
  recaptchaSiteKey?: string;
  submitDemoRequest: (input: DemoRequestInput) => Promise<DemoRequestOutcome>;
  /** Optional: where a company's quote request goes. Without it the company buttons keep pointing at the demo form. */
  submitQuoteRequest?: (input: QuoteRequestInput) => Promise<QuoteRequestOutcome>;
  notify: (notice: LandingNotice) => void;
  consent: LandingConsent;
  routes?: Partial<LandingRoutes>;
  slots?: {
    /** Extra controls in the landing header (e.g. a PWA install button). */
    navExtras?: ReactNode;
  };
  /** Overrides the dictionary lookup (tests echo the key back). */
  t?: TranslateFn;
  /** Where landing events go; defaults to the dataLayer (read by the Google tag `LandingAnalytics` loads). */
  track?: LandingTrackFn;
}

export interface ResolvedLandingHost extends Omit<LandingHost, 'routes' | 't' | 'features' | 'track'> {
  features: { integrations: boolean };
  track: LandingTrackFn;
  routes: LandingRoutes;
  t: TranslateFn;
  /** `/{locale}{route}` for a product route. */
  href: (route: keyof LandingRoutes) => string;
  /** `/{locale}/{slug}` for a landing page (`''` = the home). */
  landingHref: (slug?: string) => string;
  /** The paid sign-up in the locale, with the plan preselected (`basico` | `avanzado` | `maximo`). */
  plansHref: (plan?: string) => string;
}

const LandingHostContext = createContext<ResolvedLandingHost | null>(null);

export function LandingHostProvider({ host, children }: { host: LandingHost; children: ReactNode }) {
  const value = useMemo<ResolvedLandingHost>(() => {
    const routes = { ...DEFAULT_LANDING_ROUTES, ...host.routes };
    const messages = landingMessages(host.locale);
    const t: TranslateFn = host.t ?? ((key, values) => translate(messages, key, values));
    const { routes: _routes, t: _t, features, track, ...rest } = host;
    return {
      ...rest,
      features: { integrations: features?.integrations ?? false },
      routes,
      t,
      track: track ?? dataLayerTrack,
      href: (route) => (/^https?:\/\//.test(routes[route]) ? routes[route] : `/${host.locale}${routes[route]}`),
      landingHref: (slug = 'landing') => `/${host.locale}/${slug}`,
      plansHref: (plan) => {
        const base = routes.plans;
        const query = plan ? `?plan=${encodeURIComponent(plan)}` : '';
        if (/^https?:\/\//.test(base)) {
          const u = new URL(base);
          return `${u.origin}/${host.locale}${u.pathname.replace(/\/$/, '')}${query}`;
        }
        return `/${host.locale}${base}${query}`;
      },
    };
  }, [host]);
  return <LandingHostContext.Provider value={value}>{children}</LandingHostContext.Provider>;
}

export function useLandingHost(): ResolvedLandingHost {
  const host = useContext(LandingHostContext);
  if (!host) throw new Error('useLandingHost must be used within a LandingHostProvider');
  return host;
}

/** `t` and the locale, the two things almost every section needs. */
export function useLandingText(): { t: TranslateFn; locale: LandingLocale } {
  const { t, locale } = useLandingHost();
  return { t, locale };
}
