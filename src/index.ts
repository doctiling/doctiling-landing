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
  type QuoteRequestInput,
  type QuoteRequestOutcome,
} from './host';
export { QuoteRequestForm } from './components/QuoteRequestForm';

export { default as LandingPage } from './components/LandingClient';
export { default as DocumentsPage } from './components/DocumentsPageClient';
export { default as ConnectPage } from './components/ConnectPageClient';
export { default as VerticalsPage } from './components/VerticalsPageClient';
export { default as PricingPage } from './components/PricingPageClient';
export { default as UseCasePage, USE_CASE_CTA } from './components/UseCasePageClient';
export { default as ComparePage, COMPARE_CTA } from './components/ComparePageClient';
export { default as GuidePage, GUIDE_CTA } from './components/GuidePageClient';

export {
  LANDING_HOME_SLUG,
  LANDING_SUBPAGE_SLUGS,
  LANDING_SLUGS,
  LANDING_PUBLIC_SEGMENTS,
  LANDING_SEGMENTS,
  LANDING_USE_CASES_SEGMENT,
  LANDING_COMPARE_SEGMENT,
  LANDING_GUIDES_SEGMENT,
  comparePath,
  guidePath,
  LANDING_PAGE_PATHS,
  useCasePath,
  landingSitemapEntries,
  landingRobotsAllow,
  type LandingSlug,
  type LandingPagePath,
  type UseCasePath,
  type ComparePath,
  type GuidePath,
} from './routes';

export { USE_CASE_SLUGS, USE_CASES, isUseCaseSlug, type UseCaseSlug } from './use-cases';
export { COMPARE_SLUGS, COMPARE, isCompareSlug, type CompareSlug } from './compare';
export { GUIDE_SLUGS, GUIDES, isGuideSlug, type GuideSlug } from './guides';

export { llmsTxt, llmsFullTxt, LLMS_SITE_URL } from './llms';

export {
  landingMetadata,
  landingHomeJsonLd,
  verticalsJsonLd,
  useCaseJsonLd,
  compareJsonLd,
  guideJsonLd,
  LANDING_SEO_COPY,
} from './seo';

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
