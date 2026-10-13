# CLAUDE.md — doctiling-landing

Marketing surface of Doctiling as a host-agnostic package (`@doctiling/landing`, raw TS, no build step).
- **Host contract** is `src/host.tsx`: the landing never imports product code. Auth, the lead action, the
  toaster, consent copy and nav slots arrive through `LandingHostProvider`; product routes go through
  `href()`. Tests render with `tests/helpers/host.tsx` (`renderWithHost`, `t` echoes the key).
- **Copy** lives in `src/i18n/{en,es}.json` (namespaces `landing`, `verticalsPage`, `documentsPage`,
  `connectPage`), both locales in the same commit. Vendor names never reach copy
  (`scripts/white-label-guard.mjs`, BLOCKING in the gate).
- **Design system**: `@doctiling/ui` is a peer from the private doctiling-web checkout, resolved through the
  `.ui` symlink (`scripts/link-ui.mjs`). Never copy an atom here; never import `@/`.
- **Gate (BLOCKING)**: `npm run gate`. Every change ships as a new tag; the host pins tags.
- **Agent harness**: `docs/agent-harness.md`; principles in `CONSTITUTION.md`; verified state in
  `STATUS.md`; incidents in `docs/gotchas.md` via `/lesson`. Install the pre-commit once per clone:
  `npm run hooks:install`.
- Public repo: nothing secret, no `.env`.
