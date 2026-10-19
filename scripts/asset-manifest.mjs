import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const provenance = JSON.parse(await readFile('art/source/fonts/provenance.json', 'utf8'));
const assets = [];
for (const record of provenance.records) {
  const buffer = await readFile(record.output);
  const sha256 = createHash('sha256').update(buffer).digest('hex');
  if (sha256 !== record.sha256) throw new Error(`Changed font/license: ${record.output}`);
  assets.push({ key: record.output.split('/').at(-1), url: record.output.replace('public', ''), format: record.output.endsWith('.ttf') ? 'ttf' : 'license', bytes: buffer.length, sha256, source: record.source, revision: record.revision, license: record.license });
}
const sprite = await readFile('public/assets/ui/icons.svg');
const icons = [...sprite.toString().matchAll(/<symbol id="([^"]+)" viewBox="0 0 20 20">/g)].map(match => match[1]);
if (icons.length !== 30 || new Set(icons).size !== 30) throw new Error('Expected 30 unique 20×20 symbols');
assets.push({ key: 'icons', url: '/assets/ui/icons.svg', format: 'svg', bytes: sprite.length, sha256: createHash('sha256').update(sprite).digest('hex'), source: 'KoBi code-authored pixel icons', revision: 'Part 1 / 2026-10-16', license: 'Project-authored; no third-party artwork', symbolWidth: 20, symbolHeight: 20, symbols: icons });
await writeFile('public/assets/manifest.json', JSON.stringify({ version: 1, assets }, null, 2) + '\n');
const csvCell = value => `"${String(value).replaceAll('"', '""')}"`;
const existing = (await readFile('art/ASSET_LEDGER.csv', 'utf8')).split(/\r?\n/);
const unrelated = existing.filter(line => line && !line.startsWith('source,') && !/^"?https:\/\/raw\.githubusercontent\.com\/google\/fonts\/[^/]+\/ofl\/(play|pressstart2p|bungee|yanonekaffeesatz)\//.test(line) && !/^"?KoBi code-authored pixel icons[",]/.test(line));
const ledger = ['source,revision,sha256,author_license,processing,output,qa', ...unrelated, ...provenance.records.map(record => [record.source, record.revision, record.sha256, 'Google Fonts / SIL OFL 1.1', record.processing, record.output, 'Unmodified original / hash verified'].map(csvCell).join(','))];
const icon = assets.at(-1);
ledger.push([icon.source, icon.revision, icon.sha256, icon.license, 'Integer filled paths / currentColor / no raster source', 'public/assets/ui/icons.svg', '30 unique symbols / viewBox 20x20 / browser inspected'].map(csvCell).join(','));
await writeFile('art/ASSET_LEDGER.csv', ledger.join('\n') + '\n');
console.log(`Verified ${assets.length} shipped asset/license files; 30 pixel symbols.`);
