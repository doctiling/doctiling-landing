# Constitution — doctiling-landing

**Version 2.0.0** · Principles of the marketing-surface package consumed by doctiling-web.
Every principle states its strength: **BLOCKING** names the command that fails; otherwise it is
**REVIEW** (judged by the `reviewer` subagent and the human). Amendments bump the version, in their own
commit.

2.0.0 — the harness is now the config-driven [agent-harness](https://github.com/raalzate/agent-harness)
(`scripts/gate.mjs`, `repo-lint`, `cycle-check`, `commit-msg`/`pre-push`); P3 gains the `HOST-IMPORT`
lint rule; P8 records work and enforces PRs.

## P1 — Nothing ships without a green gate · BLOCKING

*Mechanism:* `npm run gate` (`scripts/gate.mjs` over `gate.signals`: harness self-test · docs link-check ·
convention lint · artifacts in place · link @doctiling/ui · white-label guard · typecheck · tests · code
index · hook latency), the `Stop` hook (`.claude/hooks/gate-stop.mjs`), and `.github/workflows/ci.yml`
on every push, PR and `v*` tag. An omitted signal is not green.

## P2 — Assertion integrity · REVIEW

An assertion is never adjusted to make a test pass; a wrong test is fixed in its own commit.

## P3 — Host-agnostic: the landing never imports the product · BLOCKING

Everything the landing needs from its host crosses `LandingHost` (`src/host.tsx`). No `@/` import, no
`next-auth`, no server action, no product i18n.

*Mechanism:* `npm run typecheck` (no path alias for `@/` exists here, so such an import does not
compile), the `HOST-IMPORT` rule of `node scripts/repo-lint.mjs`, and `tests/host.test.tsx`.

## P4 — White label: the copy never names the AI vendor · BLOCKING

*Mechanism:* `node scripts/white-label-guard.mjs --all` in the gate; the only allowed subtrees are
`landing.integrations.*` and `landing.docTypes.items.connect.*` (owner-approved marketing exception).

## P5 — Both locales, same keys · BLOCKING

*Mechanism:* `tests/i18n.test.ts` (en and es expose the same key set; only the marketing namespaces).

## P6 — Studio edition ships without the landing · BLOCKING in doctiling-web

The host mounts this package only in its SaaS edition; a self-host release carries no landing route,
copy or asset.

*Mechanism:* `doctiling-web/scripts/self-host/assert-studio-build.mjs` (run by `release.yml` and
`doctiling-web/scripts/self-host/pack.sh`) and `doctiling-web/tests/edition.test.ts`. Here: REVIEW.

## P7 — Consumers pin tags · REVIEW

Every change ships as a new `vX.Y.Z` tag with the `version` bumped; the host pins the HTTPS tarball.

## P8 — Work is recorded and enters by PR · BLOCKING

*Mechanism:* `.githooks/commit-msg` (`#N` or `no-issue: <why>` on code commits) and `.githooks/pre-push`
(`main` only by pull request) + `scripts/cycle-check.mjs` (branch names).

## P9 — Conduct on error · REVIEW

Read the real output before retrying; after 2 failed attempts on the same error, stop and escalate.
