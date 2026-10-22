import { readFile, readdir, writeFile, mkdir, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import path from 'node:path';

// Real production build regression: checks binary asset names and bytes as well
// as page/feed contents. Fixtures use exclusive creation and are always removed.
const sentinel = 'PRIVATE_DRAFT_REGRESSION_20261023';
const draft = 'src/content/posts/qa-private-draft-regression.md';
const image = 'src/content/posts/images/qa-private-image-regression.png';
const stale = 'dist/_astro/qa-private-stale.png';
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aVR0AAAAASUVORK5CYII=', 'base64');
let createdDraft = false;
let createdImage = false;
try {
  await mkdir(path.dirname(image), { recursive: true });
  await writeFile(image, png, { flag: 'wx' });
  createdImage = true;
  await writeFile(draft, `---\ntitle: ${sentinel}\ndescription: ${sentinel}\npubDate: 2026-10-23\ncategory: private\ndraft: true\n---\n${sentinel}\n![private](./images/qa-private-image-regression.png)\n`, { flag: 'wx' });
  createdDraft = true;
  await mkdir(path.dirname(stale), { recursive: true });
  await writeFile(stale, png);
  const build = spawnSync(process.execPath, ['scripts/build.mjs'], { encoding: 'utf8', env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' } });
  if (build.status !== 0) throw new Error(build.stderr || build.stdout || build.error?.message || 'Build failed');
  const walk = async directory => (await Promise.all((await readdir(directory, { withFileTypes: true })).map(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : path.join(directory, entry.name)))).flat();
  for (const file of await walk('dist')) {
    const bytes = await readFile(file);
    assert.ok(!file.includes('qa-private-'), `Draft path or asset leaked: ${file}`);
    assert.ok(!bytes.includes(Buffer.from(sentinel)), `Draft text leaked: ${file}`);
    assert.ok(!bytes.equals(png), `Draft binary image leaked: ${file}`);
  }
  console.log('Draft regression passed: no private text, route or binary image in production output.');
} finally {
  if (createdDraft) await rm(draft);
  if (createdImage) await rm(image);
  await rm(stale, { force: true });
}
