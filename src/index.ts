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

export {
  LANDING_HOME_SLUG,
  LANDING_SUBPAGE_SLUGS,
  LANDING_SLUGS,
  LANDING_PUBLIC_SEGMENTS,
  landingSitemapEntries,
  landingRobotsAllow,
  type LandingSlug,
} from './routes';

export { landingMetadata, landingHomeJsonLd, verticalsJsonLd, LANDING_SEO_COPY } from './seo';

export {
  LANDING_LOCALES,
  LANDING_MESSAGES,
  landingMessages,
  toLandingLocale,
  translate,
  type LandingLocale,
  type TranslateFn,
} from './i18n';
