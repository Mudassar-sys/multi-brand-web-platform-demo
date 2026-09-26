import { describe, expect, it } from 'vitest';
import { copyrightLine } from '../src/legal';

describe('footer copyright line', () => {
  it('keeps a space after the year', () => {
    expect(copyrightLine('Paintline Murals', 2026)).toBe('© 2026 Paintline Murals.');
  });

  it('does not add a second period when the name ends with one', () => {
    expect(copyrightLine('Kestrel Machine Co.', 2026)).toBe('© 2026 Kestrel Machine Co.');
  });

  it('never produces a double period or a year glued to the name', () => {
    for (const name of ['Kestrel Machine Co.', 'Paintline Murals', ' Brand Inc. ']) {
      const line = copyrightLine(name, 2026);
      expect(line).not.toMatch(/\.\./);
      expect(line).not.toMatch(/\d{4}\S/);
    }
  });
});
