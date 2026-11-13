// @doctiling/landing — the marketing surface of Doctiling as a package.
//
// A host mounts one route per slug in ./routes, wraps them in
// <LandingHostProvider host={…}> (./host) and imports ./styles.css once. Pages
// are client components; metadata and JSON-LD come from ./seo so the host's
// server renders them into the initial HTML.

export {
  LandingHostProvider,
  useLandingHost,
  useLandingText,
  DEFAULT_LANDING_ROUTES,
  type LandingHost,
  type LandingRoutes,
  type LandingConsent,
  type LandingNotice,
  type DemoRequestInput,
  type DemoRequestOutcome,
} from './host';

export { default as LandingPage } from './components/LandingClient';
export { default as DocumentsPage } from './components/DocumentsPageClient';
export { default as ConnectPage } from './components/ConnectPageClient';
export { default as VerticalsPage } from './components/VerticalsPageClient';
export { default as UseCasePage, USE_CASE_CTA } from './components/UseCasePageClient';

export {
  LANDING_HOME_SLUG,
  LANDING_SUBPAGE_SLUGS,
  LANDING_SLUGS,
  LANDING_PUBLIC_SEGMENTS,
  LANDING_SEGMENTS,
  LANDING_USE_CASES_SEGMENT,
  LANDING_PAGE_PATHS,
  useCasePath,
  landingSitemapEntries,
  landingRobotsAllow,
  type LandingSlug,
  type LandingPagePath,
  type UseCasePath,
} from './routes';

export { USE_CASE_SLUGS, USE_CASES, isUseCaseSlug, type UseCaseSlug } from './use-cases';

export { landingMetadata, landingHomeJsonLd, verticalsJsonLd, useCaseJsonLd, LANDING_SEO_COPY } from './seo';

export {
  LANDING_LOCALES,
  LANDING_MESSAGES,
  landingMessages,
  toLandingLocale,
  translate,
  type LandingLocale,
  type TranslateFn,
} from './i18n';

export { LandingAnalytics, type LandingAnalyticsProps } from './components/LandingAnalytics';
export {
  LANDING_EVENTS,
  dataLayerTrack,
  CONSENT_STORAGE_KEY,
  CONSENT_COOKIE,
  CONSENT_COOKIE_MAX_AGE,
  type LandingEventName,
  type LandingEventParams,
  type LandingTrackFn,
} from './analytics';
