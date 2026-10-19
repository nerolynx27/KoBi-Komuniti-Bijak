import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = 'docs/verification/part-3';
const captures = `${root}/automated/captures`;
await mkdir(captures, { recursive: true });
// These unchanged regressions generate fresh state evidence in their established
// Part Two paths. Copy the current run, rather than duplicating those workflows.
const states = ['report-validation-390x844', 'report-save-failure-390x844', 'report-resolved-evidence-390x844', 'photo-preview-dialog-390x844', 'activity-dirty-confirmation-390x844', 'editor-catalog-390x844', 'editor-invalid-preview-390x844', 'editor-valid-preview-390x844', 'editor-reference-blocker-390x844', 'report-photo-unavailable-1280x800', 'photo-invalid-replacement-390x844', 'activity-unsaved-preview-390x844'];
for (const name of states) await copyFile(`docs/verification/part-2/${name}.png`, `${captures}/state-${name}.png`);
async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? files(path.join(directory, entry.name)) : path.join(directory, entry.name)))).flat();
}
async function manifest(paths, destination) {
  const result = [];
  for (const file of paths.sort()) {
    const bytes = await readFile(file);
    result.push({ path: file.replaceAll('\\', '/'), bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
  }
  await writeFile(destination, JSON.stringify(result, null, 2) + '\n');
  return result;
}
const source = [...await files('src'), ...await files('tests'), ...await files('scripts'), 'package.json', 'package-lock.json', 'playwright.config.js', 'playwright.production.config.js', 'vite.config.js', 'eslint.config.js', 'index.html'];
await manifest(source, `${root}/source-final.json`);
await manifest(await files('dist'), `${root}/build-final.json`);
await manifest(await files(captures), `${root}/capture-manifest.json`);
console.log(`Recorded ${source.length} source files and ${(await files(captures)).length} captures; copied ${states.length} freshly rerun state captures.`);
