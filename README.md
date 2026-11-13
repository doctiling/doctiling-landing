# @doctiling/landing

The marketing surface of Doctiling — the landing page, its three deep-dive pages (`/documents`,
`/connect`, `/verticals`) and the catalogue-generated use-case pages (`/use-cases/{slug}`) with their
copy (en/es), SEO metadata, JSON-LD and static assets — as a
**host-agnostic Next.js package**. Raw TypeScript, no build step; the host transpiles it.

It exists so that the product (`doctiling-web`, private) can ship in two editions from one codebase:

| Edition | Who | Landing |
|---|---|---|
| `saas` | doctiling.app (Railway) | mounted — web = landing + studio |
| `studio` | self-host tarball (`doctiling/releases`, brew, scoop) | **absent from the bundle** |

## Consume

Pin a tag through the HTTPS tarball (no git needed in Docker builders), like `@doctiling/brand`:

```json
"@doctiling/landing": "https://codeload.github.com/doctiling/doctiling-landing/tar.gz/refs/tags/v0.2.0"
```

List it in `transpilePackages`, add `node_modules/@doctiling/landing/src/**/*.{ts,tsx}` to the Tailwind
`content`, import `@doctiling/landing/styles.css` once, and mount the pages inside the host provider:

```tsx
import { LandingHostProvider, LandingPage, landingMetadata, landingHomeJsonLd } from '@doctiling/landing';

<LandingHostProvider host={{ locale, isAuthenticated, submitDemoRequest, notify, consent, recaptchaSiteKey, features, slots }}>
  <LandingPage />
</LandingHostProvider>
```

`LandingHost` (see `src/host.tsx`) is the whole contract: the landing never imports the host. It gets
auth state, the lead action, the toaster, the legal consent copy, the feature switches and optional nav
slots; it gives back `href()` for product routes and the dictionary-backed `t()`.

### Catalogue pages (`/{locale}/use-cases/{slug}`)

Use cases are one entry in `src/use-cases.ts` plus one `useCasesPage.items.{slug}` block per dictionary;
the host mounts **one dynamic route** for all of them and never a page per case:

```tsx
// app/[locale]/(landing)/use-cases/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { UseCasePage, USE_CASE_SLUGS, isUseCaseSlug, landingMetadata, useCaseJsonLd, useCasePath } from '@doctiling/landing';

export const dynamicParams = false;
export const generateStaticParams = () => USE_CASE_SLUGS.map((slug) => ({ slug }));
export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  return isUseCaseSlug(slug) ? landingMetadata(useCasePath(slug), { siteUrl, locale }) : {};
}
export default async function Page({ params }) {
  const { locale, slug } = await params;
  if (!isUseCaseSlug(slug)) notFound();
  return (<>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(useCaseJsonLd(slug, { siteUrl, locale })) }} />
    <UseCasePage slug={slug} />
  </>);
}
```

`landingSitemapEntries`, `landingRobotsAllow` and `LANDING_PUBLIC_SEGMENTS` (now `/use-cases` too) already
include them, so **mount the route in the same change that bumps the pin**, or the sitemap lists 404s.
Plain-Node scripts read `package.json` → `doctiling.segments` (every top-level segment, for the
studio-edition leak check) and `doctiling.useCases`.

Static assets live in `public/` (screenshots, OG images, pitch decks); the host copies them into its own
`public/` at build time in the SaaS edition (`doctiling-web/scripts/landing-assets.mjs`).

### Peer dependency on the design system

The pages are built from `@doctiling/ui` (atoms, molecules, hooks), a raw-TS workspace package inside the
private `doctiling-web` repo. It is a **requirement of the host, not a declared peer**: an unpublished
package in `peerDependencies` makes npm reshuffle the consumer's workspace link on every install, so the
host (which owns `@doctiling/ui`) resolves it from its own workspace. This repo's own
typecheck and tests resolve it through a `.ui` symlink to a web checkout (`scripts/link-ui.sh`,
`../web/packages/ui` by default; `DOCTILING_UI_DIR` in CI, where a sparse checkout needs the
`WEB_READ_TOKEN` secret).

## Analytics and consent

`LandingAnalytics` loads the Google tag behind Consent Mode v2 (analytics and ads denied in every region
until the visitor accepts), shows the cookie banner (copy under `landing.cookies.*`)
and measures CTA clicks with one delegated listener (`/signin`, `/kb`, downloads, or any element with
`data-analytics="name"`). The host mounts it once in the layout of its marketing routes, SaaS edition only:

```tsx
<LandingAnalytics
  tagId={process.env.NEXT_PUBLIC_GOOGLE_TAG_ID}
  locale={locale}
  cookiesHref={`/${locale}/cookies`}
  consentCookieDomain=".doctiling.app"
/>
```

Mount it in the layout of the marketing routes only: the studio has its own tag. The choice lives in
the first-party cookie `doctiling_consent` (`accepted` | `rejected`, `Path=/`, 12 months, `SameSite=Lax`,
`Domain` = `consentCookieDomain`). That name and format are a **contract with the studio**: it reads the
same cookie for its Consent Mode defaults and writes it from its own banner, so a visitor answers once
across `www` and `studio`. The v0.6.0 `localStorage` key is read once and migrated to the cookie.

Sections report through `useLandingHost().track` (default: the dataLayer, GA4 event shape):
`generate_lead` (`form`: `hero` / `use_case` / demo form; `page`: the page path, e.g. `use-cases/legal`),
`cta_click` (use-case CTAs carry `data-analytics="use_case_cta"`), `video_play`. A host that measures elsewhere passes
`track` in `LandingHost`.

## Develop

```
npm ci
npm run gate        # harness self-test · docs link-check · link @doctiling/ui · white-label guard · typecheck · tests
```

Every change ships as a new `vX.Y.Z` tag with the `version` bumped; the host bumps the pin
(`npx -y npm@10.8.2 install`, its lockfile rule). Marketing copy must not name the AI vendor
(`scripts/white-label-guard.mjs`; the only exceptions are the integrations section and the "connect"
document type).

License: see `LICENSE` (public source, not open-licensed).
