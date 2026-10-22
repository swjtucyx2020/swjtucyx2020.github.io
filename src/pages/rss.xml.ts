import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { publishedPosts } from '../lib/posts';
import { withBase } from '../lib/paths';
import { escapeXml } from '../lib/xml';
import { site } from '../site.config';

export async function GET(context: APIContext) {
  const origin = context.site || new URL(site.url);
  const absolute = (path: string) => new URL(withBase(path, import.meta.env.BASE_URL), origin).href;
  const posts = publishedPosts(await getCollection('posts'));
  const items = posts.map(post => `<item><title>${escapeXml(post.data.title)}</title><link>${escapeXml(absolute(`/posts/${post.id}/`))}</link><guid isPermaLink="true">${escapeXml(absolute(`/posts/${post.id}/`))}</guid><description>${escapeXml(post.data.description)}</description><pubDate>${post.data.pubDate.toUTCString()}</pubDate><category>${escapeXml(post.data.category)}</category></item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escapeXml(site.name)}</title><link>${escapeXml(absolute('/'))}</link><description>${escapeXml(site.description)}</description><language>zh-cn</language><atom:link href="${escapeXml(absolute('/rss.xml'))}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
