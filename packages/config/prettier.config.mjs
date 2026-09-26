/** Shared formatting rules. `pnpm lint` checks them; the PostToolUse hook applies them. */
export default {
  printWidth: 110,
  singleQuote: true,
  trailingComma: 'all',
  plugins: ['prettier-plugin-astro'],
  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
};
