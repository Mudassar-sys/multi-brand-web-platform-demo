// Runs every local check for one brand, in the order CI runs them.
//   pnpm verify kestrel
// Used by the /check skill and before every push.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const brand = process.argv[2];
if (!brand || !existsSync(`apps/${brand}`)) {
  console.error('Usage: pnpm verify <brand>   (brands are the folders in apps/)');
  process.exit(2);
}

const steps = [
  ['Section catalogs are up to date', 'pnpm', ['sections:check']],
  [
    `Build, type-check and unit tests for ${brand}`,
    'pnpm',
    ['exec', 'turbo', 'run', 'build', 'check', 'test', `--filter=@platform/${brand}...`],
  ],
];

for (const [label, command, args] of steps) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) {
    console.error(`\nFAILED: ${label}. Fix the error above, then run "pnpm verify ${brand}" again.`);
    process.exit(result.status ?? 1);
  }
}
console.log(`\nAll checks passed for ${brand}.`);
