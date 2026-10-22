import assert from 'node:assert/strict';
import { test } from 'node:test';
import { publishedPosts, readingMinutes } from '../src/lib/posts.ts';
import { withBase } from '../src/lib/paths.ts';

test('draft posts are excluded from publication, including featured drafts', () => {
  const posts = [
    { id: 'private', data: { draft: true, featured: true, pubDate: new Date('2026-10-23') } },
    { id: 'public', data: { draft: false, pubDate: new Date('2026-10-22') } },
  ];
  assert.deepEqual(publishedPosts(posts).map(p => p.id), ['public']);
});

test('published articles are sorted newest first without mutating input', () => {
  const posts = [
    { id: 'old', data: { pubDate: new Date('2026-09-01') } },
    { id: 'new', data: { pubDate: new Date('2026-10-23') } },
  ];
  assert.deepEqual(publishedPosts(posts).map(p => p.id), ['new', 'old']);
  assert.equal(posts[0].id, 'old');
});

test('an empty collection remains empty', () => {
  assert.deepEqual(publishedPosts([]), []);
});

test('internal links work under both root and repository subpaths', () => {
  const fixtures = [
    ['/about/', '/', '/about/'],
    ['/about/', '/journal/', '/journal/about/'],
    ['posts/walk/', '/journal', '/journal/posts/walk/'],
    ['/', '/journal/', '/journal/'],
    ['/rss.xml', '/', '/rss.xml'],
  ];
  for (const [path, base, want] of fixtures) assert.equal(withBase(path, base), want);
});

test('reading time counts Chinese characters and English words', () => {
  assert.equal(readingMinutes(''), 1);
  assert.equal(readingMinutes('慢'.repeat(601)), 3);
  assert.equal(readingMinutes('hello '.repeat(301)), 2);
});
