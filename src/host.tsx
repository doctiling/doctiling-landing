'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { landingMessages, translate, type LandingLocale, type TranslateFn } from './i18n';

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

export interface DemoRequestOutcome {
  ok: boolean;
  /** Key under `landing.demo.errors.*` when `ok` is false. */
  error?: string;
}

export interface LandingNotice {
  title: string;
  variant?: 'default' | 'destructive';
}

/** Product routes the landing links to, without the locale prefix. */
export interface LandingRoutes {
  app: string;
  signin: string;
  privacy: string;
  dataProcessing: string;
  cookies: string;
  terms: string;
  security: string;
}

export const DEFAULT_LANDING_ROUTES: LandingRoutes = {
  app: '/kb',
  signin: '/signin',
  privacy: '/privacy',
  dataProcessing: '/data-processing',
  cookies: '/cookies',
  terms: '/terms',
  security: '/security',
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
  notify: (notice: LandingNotice) => void;
  consent: LandingConsent;
  routes?: Partial<LandingRoutes>;
  slots?: {
    /** Extra controls in the landing header (e.g. a PWA install button). */
    navExtras?: ReactNode;
  };
  /** Overrides the dictionary lookup (tests echo the key back). */
  t?: TranslateFn;
}

export interface ResolvedLandingHost extends Omit<LandingHost, 'routes' | 't' | 'features'> {
  features: { integrations: boolean };
  routes: LandingRoutes;
  t: TranslateFn;
  /** `/{locale}{route}` for a product route. */
  href: (route: keyof LandingRoutes) => string;
  /** `/{locale}/{slug}` for a landing page (`''` = the home). */
  landingHref: (slug?: string) => string;
}

const LandingHostContext = createContext<ResolvedLandingHost | null>(null);

export function LandingHostProvider({ host, children }: { host: LandingHost; children: ReactNode }) {
  const value = useMemo<ResolvedLandingHost>(() => {
    const routes = { ...DEFAULT_LANDING_ROUTES, ...host.routes };
    const messages = landingMessages(host.locale);
    const t: TranslateFn = host.t ?? ((key, values) => translate(messages, key, values));
    const { routes: _routes, t: _t, features, ...rest } = host;
    return {
      ...rest,
      features: { integrations: features?.integrations ?? false },
      routes,
      t,
      href: (route) => `/${host.locale}${routes[route]}`,
      landingHref: (slug = 'landing') => `/${host.locale}/${slug}`,
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
