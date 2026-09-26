/**
 * Footer copyright line, for example "© 2026 Kestrel Machine Co." or
 * "© 2026 Paintline Murals.": one space after the year, and no second
 * period when the brand name already ends with one.
 */
export function copyrightLine(name: string, year: number = new Date().getFullYear()): string {
  const trimmed = name.trim();
  return `© ${year} ${trimmed}${trimmed.endsWith('.') ? '' : '.'}`;
}
