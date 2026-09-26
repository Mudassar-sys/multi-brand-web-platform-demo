// @ts-check
/**
 * Webflow 301 redirects CSV -> Astro `redirects` config.
 *
 * Input: the CSV exported from Webflow (Site settings > Publishing >
 * 301 redirects). It has two columns, old path then redirect-to path. The
 * header names are not documented, so columns are read by position and a
 * first row that does not start with "/" is treated as the header.
 *
 * Webflow syntax handled:
 * - `%` escapes in the old path (for example `/old%-page` means `/old-page`)
 * - one `(.*)` wildcard at the end of the old path, with `%1` at the end of
 *   the target, becomes an Astro rest parameter: `/en/(.*)` -> `/%1` turns
 *   into `'/en/[...slug]': '/[...slug]'`
 *
 * Output entries use status 301. With the Vercel adapter, Astro serves GET
 * redirects with that status (a plain vercel.json `permanent: true` rule
 * would be a 308).
 */
import { readFileSync } from 'node:fs';

/** Minimal RFC 4180 parser (quotes, escaped quotes, CRLF). */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += char;
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

/** Removes Webflow's `%` escapes from an old path. */
export function unescapeWebflowPath(path) {
  return path.replace(/%([%\-&*()=_+?])/g, '$1');
}

const WILDCARD = '(.*)';

/**
 * @param {string} csvText
 * @returns {{ redirects: Record<string, { status: 301, destination: string }>, rules: Array<{ from: string, to: string, wildcard: boolean }> }}
 */
export function convertWebflowRedirects(csvText) {
  const rows = parseCsv(csvText);
  if (rows.length > 0 && !rows[0][0].trim().startsWith('/')) rows.shift();

  /** @type {Record<string, { status: 301, destination: string }>} */
  const redirects = {};
  const rules = [];
  rows.forEach((row, index) => {
    const line = index + 2;
    const [rawFrom = '', rawTo = ''] = row.map((cell) => cell.trim());
    if (!rawFrom.startsWith('/') || !rawTo) {
      throw new Error(`redirects.csv row ${line}: expected "old path,redirect-to path", got "${row.join(',')}"`);
    }
    const wildcards = rawFrom.split(WILDCARD).length - 1;
    let from;
    let to;
    if (wildcards === 0) {
      from = unescapeWebflowPath(rawFrom).replace(/\/+$/, '') || '/';
      to = rawTo;
      if (from.includes('?')) {
        throw new Error(`redirects.csv row ${line}: query-string rules are not supported, add them to vercel.json`);
      }
    } else if (wildcards === 1 && rawFrom.endsWith(`/${WILDCARD}`) && rawTo.endsWith('%1')) {
      const prefix = unescapeWebflowPath(rawFrom.slice(0, -WILDCARD.length));
      from = `${prefix}[...slug]`;
      to = `${rawTo.slice(0, -2)}[...slug]`;
    } else {
      throw new Error(
        `redirects.csv row ${line}: only one trailing "(.*)" mapped to a trailing "%1" is supported (got "${rawFrom}" -> "${rawTo}")`,
      );
    }
    if (redirects[from]) throw new Error(`redirects.csv row ${line}: duplicate old path "${from}"`);
    redirects[from] = { status: 301, destination: to };
    rules.push({ from, to, wildcard: wildcards === 1 });
  });
  return { redirects, rules };
}

/** Reads a brand's redirects.csv and returns the Astro `redirects` object. */
export function loadRedirects(csvPath) {
  return convertWebflowRedirects(readFileSync(csvPath, 'utf8')).redirects;
}

/**
 * Concrete old -> new pairs for tests. Wildcard rules are expanded with a
 * sample path segment.
 */
export function redirectExpectations(csvText, sample = 'contact') {
  return convertWebflowRedirects(csvText).rules.map((rule) =>
    rule.wildcard
      ? { from: rule.from.replace('[...slug]', sample), to: rule.to.replace('[...slug]', sample) }
      : { from: rule.from, to: rule.to },
  );
}
