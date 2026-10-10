# The agent harness of doctiling-landing

This repo carries [raalzate/agent-harness](https://github.com/raalzate/agent-harness)
(<https://raalzate.github.io/agent-harness/>): generic hooks and scripts, byte-identical with upstream
and with every doctiling repo (`doctiling-workspace/scripts/harness-files.txt`, checked by its
`node doctiling-workspace/scripts/harness-drift.mjs`), and one repo-specific file, `.claude/harness.config.json`.
Every row names the command that fails. If this page says something no command enforces, that is the bug.

## The gate

`npm run gate` (`node scripts/gate.mjs`) — the human, the agent (`Stop` hook, `gate-runner`, `/gate`) and
CI (`.github/workflows/ci.yml`, on every push, PR and `v*` tag) run the same line. Signals are declared
in `gate.signals`, each with its `why`.

| Signal | Command | What it catches that no other signal sees |
|---|---|---|
| harness self-test | `node scripts/harness-selftest.mjs` | a hook that no longer bites, a guard that bites innocent work, a config key pointing at nothing |
| docs link-check | `node scripts/docs-linkcheck.mjs` | a doc pointer to a file that does not exist |
| convention lint | `node scripts/repo-lint.mjs` | the rules of this repo no compiler sees (`--rules` lists them), e.g. `HOST-IMPORT` |
| artifacts in place | `node scripts/artifacts-check.mjs` | a spec or plan loose here (specs live in doctiling-web) |
| link @doctiling/ui | `npm run link:ui` | the `.ui` symlink to the design system missing (`DOCTILING_UI_DIR`, default `../web/packages/ui`) |
| white-label guard | `node scripts/white-label-guard.mjs --all` | a vendor name in marketing copy |
| typecheck | `npm run typecheck` | an invalid import or a host-contract break the tests transpile past |
| tests | `npm test` | behaviour of every section and page against a fake host |
| code index (codegraph) | `codegraph status` | a stale index; **omitted** until `codegraph init` |
| harness cost (hook latency) | `node scripts/hooks-timing.mjs` | a hook that got slow enough to be disabled |

An **omitted** signal is not green, and `npm run gate:fast` is not a deliverable.

## The hooks

| Event | Hook | What it does |
|---|---|---|
| SessionStart | `session-start.mjs` | prints branch, HEAD, uncommitted changes and `STATUS.md` |
| UserPromptSubmit | `ask-first.mjs` | a question is answered, not acted on |
| UserPromptSubmit | `sdd-router.mjs` | puts the right criteria in front of the agent by request size (`sdd.routes`) |
| UserPromptSubmit | `graph-first.mjs` | index first, files after (`graph`) |
| PreToolUse | `action-guard.mjs` | no repo edits while the turn is a question |
| PreToolUse | `protected-paths.mjs` | `.env*`, `package-lock.json`, `.git/`, `node_modules/`, `.ui/` |
| PreToolUse | `reuse-guard.mjs` | a test mounting `LandingHostProvider` by hand instead of `renderWithHost` (`tests/helpers/host.tsx`) |
| PreToolUse | `bash-guard.mjs` | skipping verification hooks, force push, `reset --hard`, `clean -f`, `git add .`, `find -delete`, piping curl to a shell; asks on `--force-with-lease`, `branch -D` |
| PostToolUse | `post-edit-check.mjs` | lints the edited file and arms the Stop marker |
| Stop | `gate-stop.mjs` | refuses to finish with code edited and no green gate since |
| SubagentStop | `subagent-contract.mjs` | `reviewer` and `gate-runner` close with their `VEREDICTO:` line |

Contract: exit 0 = continue, exit 2 = block. A missing or invalid config **lets through**.

Git hooks (`npm run hooks:install` once per clone): `pre-commit` (protected paths + lint of staged
files), `commit-msg` (code commits reference `#N` or declare `no-issue: <why>`), `pre-push` (`main` only
by PR; branch names via `scripts/cycle-check.mjs`), `post-commit` (no-op without `postCommit`).

Subagents: `explorer`, `reviewer`, `gate-runner`. Commands: `/gate`, `/lesson`, `/harness-audit`,
`/architecture`, `/code-index`. Skill: `new-guardrail`. Map: `node scripts/harness-map.mjs`.
Scheduled sweep (`.github/workflows/drift.yml`): `node scripts/drift-check.mjs`.

## Active rules

```bash
node scripts/repo-lint.mjs --rules
```

## Known debt

- The gate needs a doctiling-web checkout for `@doctiling/ui` (private repo). CI reads it with the
  `WEB_READ_TOKEN` secret; until an owner sets it, the CI gate is red while the local gate is green.
  The structural fix is extracting `@doctiling/ui` to its own public repo, pinned by tag like brand.
- P6 (studio edition without landing) is enforced in doctiling-web, not here; this repo cannot see it.
- Generic-file drift against the other doctiling repos and upstream is checked only from
  doctiling-workspace (`node doctiling-workspace/scripts/harness-drift.mjs`), never in this repo's CI.
