// Tracking contract on built HTML, with a GTM container ID set:
//   dataLayer init -> consent default -> GTM snippet, all before any other script,
//   and the GTM noscript iframe right after <body>.
//   node scripts/check-tracking-order.mjs apps/kestrel/.vercel/output/static
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
const files = readdirSync(dir, { recursive: true })
  .map(String)
  .filter((f) => f.endsWith('.html'))
  .map((f) => join(dir, f));
let failures = 0;

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const head = html.slice(0, html.indexOf('</head>'));
  const scripts = [...head.matchAll(/<script\b[^>]*>/g)].map((m) => m.index);
  const init = head.indexOf('window.dataLayer.push({"site_env"');
  const consent = head.indexOf("gtag('consent', 'default'");
  const gtm = head.indexOf('data-tracking="gtm"');
  const body = html.indexOf('<body');
  const noscript = html.indexOf('googletagmanager.com/ns.html');
  const problems = [];
  if (init < 0 || consent < 0 || gtm < 0) problems.push('missing dataLayer init, consent default or GTM snippet');
  if (!(init < consent && consent < gtm)) problems.push('order is not dataLayer init -> consent default -> GTM');
  if (scripts[0] === undefined || scripts[0] > init) problems.push('another script runs before the dataLayer init');
  if (scripts[1] === undefined || scripts[1] > gtm) problems.push('another script runs between consent default and GTM');
  if (noscript < 0 || html.slice(body, noscript).match(/<(div|header|main|a|section)\b/)) {
    problems.push('GTM noscript iframe is not directly after <body>');
  }
  if (problems.length) {
    failures++;
    console.error(`FAIL ${file}\n  - ${problems.join('\n  - ')}`);
  }
}
console.log(`Tracking order checked in ${files.length} pages: ${failures ? `${failures} failed` : 'all passed'}.`);
process.exit(failures ? 1 : 0);
