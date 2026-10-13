# STATUS — verified state (doctiling-landing)

Printed by the `SessionStart` hook. **Only what a command verified goes here**; what is assumed goes
under "Known debt".

- **Last full gate:** 2026-10-12, branch `chore/harness-119695d-sync` (generic files synced to agent-harness `119695d`: pre-commit with
  `preCommit.extra`, self-test cases; `web/` CI checkout excluded from the docs scan), sobre `780538e`
- **Verdict:** GREEN (`npm run gate`, 9/9 run: harness self-test · docs link-check · convention lint · artifacts in place · link @doctiling/ui ·
  white-label guard (32 files) · typecheck · tests (94 tests, 21 files) · harness cost (hook latency, max 156 ms / 900); code index OMITTED — no `.codegraph`)

## Known debt

- See `docs/arnes.md` § Known debt.
