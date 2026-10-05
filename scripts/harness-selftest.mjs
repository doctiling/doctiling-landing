// Proof of life of the agent harness (not the product's chat harness in
// src/harness/): every hook blocks what it says it blocks and lets the rest
// through, and no config path points at nothing. Runs inside the gate, so a
// broken hook fails the build instead of failing silently. Docs: docs/agent-harness.md.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCoreChecks } from './harness-core-checks.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cfg = JSON.parse(readFileSync(path.join(root, '.claude', 'harness.config.json'), 'utf8'));
const settings = JSON.parse(readFileSync(path.join(root, '.claude', 'settings.json'), 'utf8'));

const failures = [];
const skipped = [];
const check = (name, ok, detail = '') => {
  if (!ok) failures.push(`${name}${detail ? `: ${detail}` : ''}`);
};

runCoreChecks({ root, cfg, settings, check, skip: (s) => skipped.push(s) });

if (failures.length) {
  console.error('harness-selftest: FAIL\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}
for (const s of skipped) console.warn(`harness-selftest: omitted — ${s}`);
console.info(`harness-selftest: OK (generic checks over .claude/harness.config.json${skipped.length ? `, ${skipped.length} omitted` : ''})`);
