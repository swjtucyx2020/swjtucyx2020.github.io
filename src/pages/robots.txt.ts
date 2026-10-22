import type { APIContext } from 'astro';
import { withBase } from '../lib/paths';
import { site } from '../site.config';

export function GET(context: APIContext) {
  const sitemap = new URL(withBase('/sitemap.xml', import.meta.env.BASE_URL), context.site || site.url).href;
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemap}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
