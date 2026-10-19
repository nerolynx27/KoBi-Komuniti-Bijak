import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Pin all source files to the single revision resolved at acquisition time.
const response = await fetch('https://api.github.com/repos/google/fonts/commits/main', { headers: { 'User-Agent': 'KoBi-font-acquisition' } });
if (!response.ok) throw new Error(`Google Fonts commit: ${response.status}`);
const { sha } = await response.json();
const entries = [
  ['bungee', 'Bungee-Regular.ttf', 'bungee-regular.ttf'],
  ['yanonekaffeesatz', 'YanoneKaffeesatz[wght].ttf', 'yanone-kaffeesatz-variable.ttf'],
  ['bungee', 'OFL.txt', 'licenses/bungee-OFL.txt'],
  ['yanonekaffeesatz', 'OFL.txt', 'licenses/yanone-kaffeesatz-OFL.txt'],
];
const records = [];
for (const [family, filename, output] of entries) {
  const source = `https://raw.githubusercontent.com/google/fonts/${sha}/ofl/${family}/${encodeURIComponent(filename)}`;
  const result = await fetch(source);
  if (!result.ok) throw new Error(`${source}: ${result.status}`);
  const buffer = Buffer.from(await result.arrayBuffer());
  if (filename.endsWith('.ttf') && buffer.readUInt32BE(0) !== 0x00010000) throw new Error(`Invalid TrueType file: ${filename}`);
  if (filename === 'OFL.txt' && !buffer.toString('utf8').includes('SIL OPEN FONT LICENSE')) throw new Error(`Invalid font license: ${family}`);
  const original = `art/source/fonts/${family}/${filename}`;
  const shipped = `public/assets/ui/${output}`;
  await mkdir(`art/source/fonts/${family}`, { recursive: true });
  await mkdir('public/assets/ui/licenses', { recursive: true });
  await writeFile(original, buffer);
  await copyFile(original, shipped);
  records.push({ source, revision: sha, sha256: createHash('sha256').update(buffer).digest('hex'), original, output: shipped, bytes: buffer.length, license: 'SIL Open Font License 1.1', processing: 'Original, unmodified; copied byte-for-byte' });
}
await writeFile('art/source/fonts/provenance.json', JSON.stringify({ acquired: '2026-10-19', records }, null, 2) + '\n');
const csvCell = value => `"${String(value).replaceAll('"', '""')}"`;
let existing = '';
try { existing = await readFile('art/ASSET_LEDGER.csv', 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const unrelated = existing.split(/\r?\n/).filter(line => line && !line.startsWith('source,') && !/^"?https:\/\/raw\.githubusercontent\.com\/google\/fonts\/[^/]+\/ofl\/(play|pressstart2p|bungee|yanonekaffeesatz)\//.test(line));
await writeFile('art/ASSET_LEDGER.csv', 'source,revision,sha256,author_license,processing,output,qa\n' + [...unrelated, ...records.map(r => [r.source, r.revision, r.sha256, 'Google Fonts / SIL OFL 1.1', r.processing, r.output, 'Unmodified original / hash verified'].map(csvCell).join(','))].join('\n') + '\n');
console.log(`Acquired ${records.length} font/license files at ${sha}`);
