import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { publishedPosts } from '../lib/posts';
import { withBase } from '../lib/paths';
import { escapeXml } from '../lib/xml';
import { site } from '../site.config';

export async function GET(context: APIContext) {
  const paths = ['/', '/about/', '/archive/', ...publishedPosts(await getCollection('posts')).map(post => `/posts/${post.id}/`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `<url><loc>${escapeXml(new URL(withBase(path, import.meta.env.BASE_URL), context.site || site.url).href)}</loc></url>`).join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
