// White-label guard (CLAUDE.md of doctiling-web, inherited by the landing): vendor
// names must not reach marketing copy.
//
// It replaced a stack of `grep -v` filters because the exceptions are scoped by
// *where the string lives*, not by what it looks like — and grep cannot see the
// JSON path of a matched line. Run standalone or from .githooks/pre-commit.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { VENDOR } from './lib/vendor-pattern.mjs';

// Subtrees of the dictionaries where naming the vendor is an owner-approved
// exception. Everything else in en.json/es.json stays vendor-free.
const ALLOWED_I18N_PREFIXES = [
  // Marketing exception (owner-approved): MCP-aware clients named as
  // integration targets, because that is a positioning lever for enterprise.
  'landing.integrations.',
  'landing.docTypes.items.connect.',
];

// Enum *values* and type unions are code, not copy.
const CODE_SHAPED = [/value=/, /^\s*\/\//, /^\s*\*/, /as const/, /'(haiku|sonnet|opus)'/];

function walk(node, path, out) {
  if (typeof node === 'string') {
    if (VENDOR.test(node) && !ALLOWED_I18N_PREFIXES.some((p) => path.startsWith(p))) {
      out.push(`${path} = ${node.slice(0, 90)}`);
    }
    return;
  }
  if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      walk(value, path ? `${path}.${key}` : key, out);
    }
  }
}

function checkDictionaries(files) {
  const hits = [];
  for (const file of files) {
    if (!existsSync(file)) continue;
    walk(JSON.parse(readFileSync(file, 'utf8')), '', hits.dict ?? (hits.dict = []));
    for (const hit of hits.dict.splice(0)) hits.push(`${file}: ${hit}`);
  }
  return hits;
}

function checkComponents(files) {
  const hits = [];
  for (const file of files) {
    // A caller may hand us a directory (ad-hoc run); only files are scanned.
    if (!existsSync(file) || statSync(file).isDirectory()) continue;
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (!VENDOR.test(line)) return;
      if (CODE_SHAPED.some((re) => re.test(line))) return;
      hits.push(`${file}:${i + 1}: ${line.trim().slice(0, 90)}`);
    });
  }
  return hits;
}

const USER_SURFACE = /^src\/(i18n|components)\//;

function stagedSurface() {
  const out = execSync('git diff --cached --name-only --diff-filter=ACMR', { encoding: 'utf8' });
  return out.split('\n').filter((f) => USER_SURFACE.test(f));
}

// The hook only runs in clones that installed it; the gate (and so CI) runs
// this mode over everything tracked (spec 031 SC-004).
function trackedSurface() {
  const out = execSync('git ls-files -- src/i18n src/components', { encoding: 'utf8' });
  return out.split('\n').filter((f) => USER_SURFACE.test(f) && /\.(tsx?|json)$/.test(f));
}

const args = process.argv.slice(2);
if (args[0] === '--print-surface') {
  console.info(USER_SURFACE.source);
  process.exit(0);
}
let files;
if (args[0] === '--all') files = trackedSurface();
else files = args.length > 0 ? args : stagedSurface();
// Match by shape, not by prefix: callers pass repo-relative paths, tests pass
// absolute ones, and a dictionary is a dictionary either way.
const dictionaries = files.filter((f) => /i18n[\\/].*\.json$/.test(f));
const components = files.filter((f) => !dictionaries.includes(f));

const hits = [...checkDictionaries(dictionaries), ...checkComponents(components)];
if (hits.length > 0) {
  console.error('white-label guard: BLOCKED — vendor name in user-facing copy (CLAUDE.md):');
  for (const hit of hits) console.error(`  ${hit}`);
  console.error('\nAllowed subtrees: ' + ALLOWED_I18N_PREFIXES.join(', '));
  process.exit(1);
}
console.info(`white-label guard: OK (${files.length} file(s) checked)`);
