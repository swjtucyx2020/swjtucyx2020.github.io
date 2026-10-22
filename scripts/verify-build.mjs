import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve('dist');
const base = `/${(process.env.BASE_PATH || '/').split('/').filter(Boolean).join('/')}`.replace(/\/$/, '');
const walk = async directory => (await Promise.all((await readdir(directory, { withFileTypes: true })).map(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : path.join(directory, entry.name)))).flat();
const files = await walk(root);
const htmlFiles = files.filter(file => file.endsWith('.html'));
const errors = [];
let links = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  assert.match(html, /<html lang="zh-CN"/);
  assert.match(html, /<title>[^<]+<\/title>/);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    if (base && !href.startsWith(`${base}/`)) { errors.push(`${file}: outside base ${href}`); continue; }
    let local = decodeURIComponent(href.slice(base.length).split(/[?#]/)[0]);
    if (local.endsWith('/')) local += 'index.html';
    try { assert.equal((await stat(path.join(root, local))).isFile(), true); links++; }
    catch { errors.push(`${path.relative(root, file)}: broken ${href}`); }
  }
}
for (const name of ['index.html', 'about/index.html', 'archive/index.html', '404.html', 'rss.xml', 'sitemap.xml', 'robots.txt', 'favicon.svg']) assert.ok(files.includes(path.join(root, name)), `Missing ${name}`);
assert.equal(errors.length, 0, errors.join('\n'));
const rss = await readFile(path.join(root, 'rss.xml'), 'utf8');
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
const articleCount = htmlFiles.filter(file => path.relative(root, file).split(path.sep)[0] === 'posts').length;
assert.equal((rss.match(/<item>/g) || []).length, articleCount, 'RSS must contain every published article');
assert.equal((sitemap.match(/<url>/g) || []).length, articleCount + 3, 'Sitemap must contain static pages and published articles');
if (process.env.DRAFT_SENTINEL) {
  for (const file of files.filter(file => /\.(html|xml|js|json|txt)$/.test(file))) assert.ok(!(await readFile(file, 'utf8')).includes(process.env.DRAFT_SENTINEL), `Draft leaked in ${file}`);
}
console.log(`Verified ${htmlFiles.length} HTML pages, ${links} internal links, ${articleCount} RSS articles and sitemap. Base: ${base || '/'}`);
