# STATUS — verified state (doctiling-landing)

Printed by the `SessionStart` hook. **Only what a command verified goes here**; what is assumed goes
under "Known debt". The harness self-test fails if the commit cited below is more than 25 commits
behind HEAD.

- **Last full gate:** 2026-10-12, branch `chore/harness-119695d` (working tree, port to agent-harness `119695d`)
- **Verdict:** GREEN (`npm run gate`, 8/8 signals, 56 s: harness self-test · docs link-check · convention lint · harness cost
  (hook latency, max 151 ms / 900) · link @doctiling/ui · white-label guard (32 files) · typecheck · tests — 94 tests, 21 files)

**Port to agent-harness `119695d` (2026-10-12)**: generic files byte-identical to the upstream; the gate is `gate.signals`
in `.claude/harness.config.json`; `scripts/link-ui.mjs` replaces the shell script; `tracker` + `commitMsg` require an issue
or `no-issue:` on code commits; a `reuse` rule denies hard-coded product routes (use `href()`). ADR:
`docs/decisions/0001-agent-harness.md`.

- **Previous full gate:** 2026-10-05, branch `main`, sobre `effb037` — GREEN

## Known debt

- See `docs/agent-harness.md` § Known debt.
