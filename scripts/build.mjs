import { rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.resolve(root, 'dist');
if (path.dirname(output) !== path.resolve(root) || path.basename(output) !== 'dist') {
  throw new Error('Refusing to clean an unexpected output path');
}
// Always start from empty generated output, including on Windows where an
// incremental build can otherwise retain an asset from an earlier publication.
await rm(output, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
const result = spawnSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
