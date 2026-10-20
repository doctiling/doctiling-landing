# @doctiling/landing

The marketing surface of Doctiling — the landing page and its three deep-dive pages (`/documents`,
`/connect`, `/verticals`) with their copy (en/es), SEO metadata, JSON-LD and static assets — as a
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
