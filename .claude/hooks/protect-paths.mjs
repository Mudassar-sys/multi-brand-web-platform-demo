// PreToolUse guard. Exit code 2 blocks the tool call and sends the message
// on stderr back to the assistant. Protects the shared tracking and forms
// packages, CI workflows, the redirects converter and these guardrails.
import { readFileSync } from 'node:fs';
import path from 'node:path';

const PROTECTED = [
  'packages/tracking/',
  'packages/forms/',
  '.github/',
  'packages/config/src/redirects.mjs',
  '.claude/settings.json',
  '.claude/hooks/',
];

let input;
try {
  input = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  // Fail closed: if the request cannot be read, nothing is allowed through.
  process.stderr.write('BLOCKED: the guardrail hook could not read this request.\n');
  process.exit(2);
}
const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();

function relative(file) {
  return path.relative(root, path.resolve(root, file)).split(path.sep).join('/');
}

function protectedEntry(rel) {
  return PROTECTED.find((entry) => (entry.endsWith('/') ? rel.startsWith(entry) : rel === entry));
}

function block(target, entry) {
  process.stderr.write(
    `BLOCKED: ${target} is protected (${entry}). The tracking and forms packages, CI workflows, ` +
      'the redirects converter and these guardrails affect ad spend and lead data for every brand, ' +
      'so only a developer may change them in a reviewed pull request. Tell the owner this change ' +
      'needs a developer, and do not try another way to make it.\n',
  );
  process.exit(2);
}

const tool = input.tool_name;
const params = input.tool_input ?? {};

if (['Edit', 'Write', 'MultiEdit', 'NotebookEdit'].includes(tool)) {
  const file = params.file_path ?? params.notebook_path;
  if (file) {
    const rel = relative(file);
    const entry = protectedEntry(rel);
    if (entry) block(`"${rel}"`, entry);
  }
}

if (tool === 'Bash') {
  const command = String(params.command ?? '');
  const normalized = command.replace(/\\/g, '/');
  const entry = PROTECTED.find((p) => normalized.includes(p.replace(/\/$/, '')));
  const writes =
    /(^|[^<])>|\btee\b|\bsed\b[^|;&]*\s-i|\bperl\b[^|;&]*\s-i|\b(mv|cp|rm|truncate|touch|install|patch)\b|\bgit\s+(checkout|restore|apply|rm|mv|stash)\b|\b(node|python3?|deno|bun)\s+-(e|c)\b/.test(
      normalized,
    );
  if (entry && writes) block('This shell command writes to a protected path', entry);
}

process.exit(0);
