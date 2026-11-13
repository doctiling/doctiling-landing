# STATUS — verified state (doctiling-landing)

Printed by the `SessionStart` hook. **Only what a command verified goes here**; what is assumed goes
under "Known debt".

- **Last full gate:** 2026-11-13, on `main` at `91bea09` (v0.9.0: analytics with opt-in consent v0.6.x, use-case and
  compare pages, llms.txt). Run with `NODE_OPTIONS=--no-experimental-webstorage` on local Node 25 (see Known debt).
- **Verdict:** GREEN (`npm run gate`, 9/9 run: harness self-test · docs link-check · convention lint · artifacts in place · link @doctiling/ui ·
  white-label guard (42 files) · typecheck · tests (149 tests, 28 files) · harness cost (hook latency); code index OMITTED — no `.codegraph`)
- **Consumed by** doctiling-web 0.56.0 (v0.6.3, in production on www since 2026-11-12) and web `main` (v0.9.0, PR #310).

## Known debt

- See `docs/arnes.md` § Known debt.
- Node ≥ 25 exposes a global `localStorage` that shadows jsdom's: tests fail with `window.localStorage.clear is not a
  function` unless run with `NODE_OPTIONS=--no-experimental-webstorage`. CI (Node 20) is unaffected.
