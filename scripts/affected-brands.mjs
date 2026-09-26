// Works out which brands a set of changed files affects, using the same
// rule Vercel uses to skip unaffected projects in a workspace monorepo:
// - a file inside a workspace package affects the apps that depend on that
//   package (directly or through other packages)
// - a file outside every workspace package is a global change and
//   affects every app
//
//   node scripts/affected-brands.mjs <base-sha> <head-sha>
// Prints JSON and, inside GitHub Actions, writes `affected` and
// `unaffected` (space-separated brand names) to $GITHUB_OUTPUT.
import { execFileSync } from 'node:child_process';
import { appendFileSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const [base, head] = process.argv.slice(2);
if (!base || !head) {
  console.error('Usage: node scripts/affected-brands.mjs <base-sha> <head-sha>');
  process.exit(2);
}

const changed = execFileSync('git', ['diff', '--name-only', `${base}...${head}`], { encoding: 'utf8' })
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

// Workspace packages: folder -> { name, deps }
const workspaces = ['apps', 'packages']
  .flatMap((dir) => readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => `${dir}/${d.name}`))
  .concat(['tests']);
const packages = new Map();
for (const folder of workspaces) {
  const pkg = JSON.parse(readFileSync(join(folder, 'package.json'), 'utf8'));
  const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).filter((d) => d.startsWith('@platform/'));
  packages.set(folder, { name: pkg.name, deps });
}
const byName = new Map([...packages].map(([folder, info]) => [info.name, { folder, ...info }]));

function dependsOn(appFolder, targetName, seen = new Set()) {
  for (const dep of packages.get(appFolder).deps) {
    if (dep === targetName) return true;
    const next = byName.get(dep);
    if (next && !seen.has(next.folder)) {
      seen.add(next.folder);
      if (dependsOn(next.folder, targetName, seen)) return true;
    }
  }
  return false;
}

const brands = readdirSync('apps', { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
const affected = new Set();
const reasons = {};

for (const file of changed) {
  const owner = workspaces.find((folder) => file === folder || file.startsWith(`${folder}/`));
  if (!owner) {
    brands.forEach((b) => affected.add(b));
    reasons[file] = 'outside workspace packages: global change, affects every brand';
    continue;
  }
  const { name } = packages.get(owner);
  const hit = brands.filter((b) => `apps/${b}` === owner || dependsOn(`apps/${b}`, name));
  hit.forEach((b) => affected.add(b));
  reasons[file] = hit.length ? `affects ${hit.join(', ')}` : 'no brand depends on this package';
}

const result = {
  affected: brands.filter((b) => affected.has(b)),
  unaffected: brands.filter((b) => !affected.has(b)),
  reasons,
};
console.log(JSON.stringify(result, null, 2));
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `affected=${result.affected.join(' ')}\nunaffected=${result.unaffected.join(' ')}\n`);
}
