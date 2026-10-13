# The agent harness of doctiling-landing

Same definitions as <https://raalzate.github.io/agent-harness/>, scaled to a package of pages.
**A rule without a command that makes it fail is a suggestion**: every row names that command.

## The gate

`npm run gate` (`scripts/gate.sh`) — the human, the agent (`Stop` hook, `gate-runner`, `/gate`) and CI
(`.github/workflows/gate.yml`, also on tags) run the same line.

| Signal | Command | What it catches that no other signal sees |
|---|---|---|
| harness self-test | `node scripts/harness-selftest.mjs` | a hook that no longer bites (one sample derived from every rule), a guard that bites innocent work, the Stop hook dead in a worktree, a gate signal without `# why:`, a gotcha without its mechanism, CI not running the gate, `core.hooksPath` unset, a stale STATUS.md |
| docs link-check | `node scripts/docs-linkcheck.mjs` | a `docs/...` pointer to a file that is not tracked |
| link @doctiling/ui | `node scripts/link-ui.mjs` | the design-system peer missing: without the `.ui` symlink nothing below resolves |
| white-label guard | `node scripts/white-label-guard.mjs --all` | a vendor name in marketing copy outside the two approved subtrees |
| typecheck | `npm run typecheck` | type errors, a `@/` import into the host, a break of the `LandingHost` contract |
| tests | `npm test` | behaviour of every section and page against a fake host; both locales share one key set; routes and SEO builders |

## Hooks

Generic files, byte-identical with doctiling-web / -cli / -mobile / -brand (doctiling-workspace
the workspace drift check (harness-drift) fails on drift); everything repo-specific is in `.claude/harness.config.json`.

| Event | Hook | What it does |
|---|---|---|
| SessionStart | `session-start.mjs` | prints branch, HEAD and `STATUS.md`; warns if the pre-commit is not installed |
| PreToolUse Write\|Edit | `protected-paths.mjs` | `.env*`, `package-lock.json`, `.git/` |
| PreToolUse Bash | `bash-guard.mjs` | `--no-verify`, `push --force`, `reset --hard`, `git add .` |
| PostToolUse Write\|Edit | `post-edit-check.mjs` | `tsc --noEmit` after editing `src/`, `tests/`, `scripts/`; arms the Stop marker |
| Stop | `gate-stop.mjs` | refuses to finish with code edited and no green gate since |

`.githooks/pre-commit` applies the protected-paths list to what is staged. Install once per clone:
`npm run hooks:install`. Subagents: `gate-runner`, `reviewer`. Commands: `/gate`, `/lesson`, `/harness-audit`.

## Memory

`CLAUDE.md` (conventions) · `CONSTITUTION.md` (principles with strength and mechanism) · `STATUS.md`
(verified state, cites the gated commit) · `docs/gotchas.md` (incidents, `/lesson`).

## Known debt

- The gate needs a doctiling-web checkout for `@doctiling/ui` (private repo). CI reads it with the
  `WEB_READ_TOKEN` secret; until an owner sets it, the CI gate is red while the local gate is green.
  The structural fix is extracting `@doctiling/ui` to its own public repo, pinned by tag like brand.
- P6 (studio edition without landing) is enforced in doctiling-web, not here; this repo cannot see it.

## Señales del gate (por nombre, como en `gate.signals` de `.claude/harness.config.json`)

Desde el port a agent-harness `119695d` (2026-10-12) la definición del gate es la lista `gate.signals`: `scripts/gate.sh` es el wrapper genérico de `scripts/gate.mjs`, que corre cada señal como argv, sin shell, con su `why`. Señales: «harness self-test» · «docs link-check» · «convention lint» · «harness cost (hook latency)» · «link @doctiling/ui» · «white-label guard» · «typecheck» · «tests».
