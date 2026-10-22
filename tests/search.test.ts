import assert from 'node:assert/strict';
import { test } from 'node:test';
import { matchesPost } from '../src/lib/search.ts';

const post = { title: '十月散步与 Astro', description: '秋天的一次慢慢行走', category: '散步随想' };
test('search matches Chinese title and description', () => {
  assert.equal(matchesPost(post, '散步', '全部'), true);
  assert.equal(matchesPost(post, '秋天', '全部'), true);
});
test('search ignores letter case and trims surrounding spaces', () => {
  assert.equal(matchesPost(post, ' ASTRO ', '全部'), true);
  assert.equal(matchesPost(post, '  ', '全部'), true);
});
test('category and text filters must both match', () => {
  assert.equal(matchesPost(post, '十月', '散步随想'), true);
  assert.equal(matchesPost(post, '十月', '生活手记'), false);
  assert.equal(matchesPost(post, '不存在的内容', '散步随想'), false);
});
