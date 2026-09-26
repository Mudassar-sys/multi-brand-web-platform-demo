// PostToolUse: format the file that was just edited with the repo's
// Prettier config. Never blocks: formatting problems only print a note.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const file = input.tool_input?.file_path;
const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();

if (!file || !/\.(astro|ts|mjs|js|json|md|ya?ml|css)$/i.test(file) || /SECTIONS\.md$|pnpm-lock\.yaml$/i.test(file)) {
  process.exit(0);
}

const result = spawnSync('pnpm', ['exec', 'prettier', '--write', '--log-level', 'warn', file], {
  cwd: root,
  encoding: 'utf8',
  shell: process.platform === 'win32',
  timeout: 20_000,
});
if (result.status !== 0) {
  process.stdout.write(`Formatter skipped for ${file} (run "pnpm install" first if Prettier is missing).\n`);
}
process.exit(0);
