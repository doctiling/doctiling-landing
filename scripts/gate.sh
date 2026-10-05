#!/bin/sh
# The landing gate. Consumers pin tags, so a red tag never reaches them: CI runs this on every tag too.
set -e
ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"
STEP=0
run() { STEP=$((STEP + 1)); echo ""; echo "── gate [$STEP] $1"; shift; "$@"; }

# why: a broken hook, a rule that no longer bites or a stale STATUS.md fail silently.
run "harness self-test" node scripts/harness-selftest.mjs
# why: a doc pointer to a moved file sends the agent to read nothing.
run "docs link-check" node scripts/docs-linkcheck.mjs
# why: the design system is a peer from another checkout; without the link, typecheck and tests resolve nothing.
run "link @doctiling/ui" sh scripts/link-ui.sh
# why: a vendor name in marketing copy compiles and passes tests; only this guard knows the scoped exceptions.
run "white-label guard" node scripts/white-label-guard.mjs --all
# why: vitest transpiles per file and never type-checks; an invalid import or a host-contract break passes the tests.
run "typecheck" npm run typecheck
# why: behaviour of every section and page against a fake host; the only check of the host contract from this side.
run "tests" npm test

# --git-common-dir, not .git: in a worktree .git is a file.
rm -f "$(git -C "$ROOT" rev-parse --git-common-dir)/gate-dirty"
echo ""
echo "gate: GREEN"
