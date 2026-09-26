import { describe, expect, it } from 'vitest';
import { convertWebflowRedirects, redirectExpectations, unescapeWebflowPath } from '../src/redirects.mjs';

const csv = ['Old path,Redirect to path', '/products/kl%-250,/machines', '/en/(.*),/%1', '"/old%_page",/contact', ''].join(
  '\r\n',
);

describe('Webflow redirects converter', () => {
  it('removes Webflow % escapes from old paths', () => {
    expect(unescapeWebflowPath('/request%-a%-quote')).toBe('/request-a-quote');
  });

  it('produces 301 Astro redirects, including a rest parameter for a wildcard', () => {
    expect(convertWebflowRedirects(csv).redirects).toEqual({
      '/products/kl-250': { status: 301, destination: '/machines' },
      '/en/[...slug]': { status: 301, destination: '/[...slug]' },
      '/old_page': { status: 301, destination: '/contact' },
    });
  });

  it('expands wildcard rules into concrete test pairs', () => {
    expect(redirectExpectations(csv)).toContainEqual({ from: '/en/contact', to: '/contact' });
  });

  it('rejects wildcard shapes Astro redirects cannot express', () => {
    expect(() => convertWebflowRedirects('/a/(.*)/(.*),/b/%1/%2')).toThrow(/only one trailing/);
    expect(() => convertWebflowRedirects('/collections/(.*),/collections')).toThrow(/only one trailing/);
  });

  it('rejects duplicate old paths', () => {
    expect(() => convertWebflowRedirects('/a,/b\n/a,/c')).toThrow(/duplicate/);
  });
});
