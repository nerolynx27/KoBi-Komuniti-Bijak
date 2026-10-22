import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';

// The master catalog owns the assembly; export it without catalog click handlers.
const catalog = await readFile(new URL('../public/compiled-gallery.html', import.meta.url), 'utf8');
const assembled = catalog.match(/<svg\s+id="real-assembled-map-svg"[\s\S]*?<\/svg>/)?.[0];
assert(assembled, 'Master catalog map is missing');
assert.equal((assembled.match(/class="map-streetlight"/g) || []).length, 12);
const map = assembled
  .replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
  .replace(/\s+xlink:href="[^"]*"/g, '')
  .replace(/\s+on(?:click|mouseenter)="[^"]*"/g, '')
  .replace('aria-label="Official Assembled Real 2D Pixel Map of Elmina Seksyen U16"', 'aria-label="Elmina sample neighbourhood map with twelve curb-mounted streetlights"')
  .replace('<defs>', `<style>@font-face{font-family:Bungee;src:url('/assets/ui/bungee-regular.ttf')}@font-face{font-family:'Yanone Kaffeesatz';src:url('/assets/ui/yanone-kaffeesatz-variable.ttf')}</style>\n          <defs>`);
await writeFile(new URL('../public/assets/world/elmina-map.svg', import.meta.url), `${map}\n`);

// Split the trusted catalog SVG into scenery and independently selectable objects.
const inner = map.replace(/^<svg\b[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const stack = [], groups = [];
for (const token of inner.matchAll(/<\/?g\b[^>]*>/g)) {
  if (!token[0].startsWith('</')) stack.push({ start: token.index, open: token[0], parent: stack.at(-1)?.start });
  else {
    const group = stack.pop();
    assert(group, 'Unbalanced SVG group');
    groups.push({ ...group, end: token.index + token[0].length, markup: inner.slice(group.start, token.index + token[0].length) });
  }
}
assert.equal(stack.length, 0);
const byId = id => groups.find(g => g.open.includes(`id="${id}"`));
const objects = [], removals = [];
function add(group, placement, hit, light = '') {
  assert(group, `Missing art for ${placement.objectId}`);
  objects.push({ ...placement, markup: group.markup, hit, light, order: group.start });
  removals.push(group);
}
const amenities = [
  ['dewan', 'hall', 'hall-01', 'Dewan Komuniti', 21, 6, 4, 3, [418, 99, 84, 76]],
  ['surau', 'hall', 'surau-01', 'Masjid Al Falah', 22, 16, 4, 3, [438, 320, 84, 76]],
  ['park', 'park', 'park-01', 'Elmina Central Park', 10, 15, 3, 3, [192, 290, 80, 64]],
  ['lake', 'park', 'lake-01', 'Tasik Ekologi', 13, 16, 4, 4, [267, 321, 73, 63]],
  ['recycling', 'recycling', 'recycling-01', 'Recycling point', 27, 7, 2, 2, [530, 128, 60, 52]],
];
for (const [id, assetKey, facilityId, label, x, y, width, height, hit] of amenities) {
  add(byId(`map-amenity-${id}`), { objectId: `object-${facilityId}`, facilityId, assetKey, label, x, y, width, height }, hit);
}
const alex = byId('map-amenity-alex');
add(alex, { objectId: 'object-house-01', facilityId: 'house-01', assetKey: 'house', label: 'Alex Home (Lot 12)', x: 4, y: 8, width: 2, height: 2 }, [62, 130, 76, 70]);
// inspectHouse handlers were removed in the public SVG, so identify the remaining house groups by their lot text.
for (const group of groups.filter(g => g.open.includes('class="map-hotspot"') && !g.open.includes('id='))) {
  const lot = group.markup.match(/>LOT (\d+)<\/text>/)?.[1];
  if (!lot) continue;
  const [x, y] = group.open.match(/translate\(([^)]+)\)/)[1].split(/[, ]+/).map(Number);
  add(group, { objectId: `object-house-${lot}`, facilityId: null, assetKey: 'house', label: `Lot ${lot}`, x: x / 20, y: y / 20, width: 2, height: 2 }, [x, y, 40, 40]);
}
const lampIds = { 'f1-north': '01', 'f1-middle': '02', 'boulevard-west': '03', 'f1-south': '04', 'boulevard-east': '05', 'boulevard-central': '06', 'f1-end': '07', 'f2-north': '08', 'f2-middle': '09', 'f2-south': '10', f3: '11', f4: '12' };
const lampNames = ['f1-north', 'f1-middle', 'f1-south', 'f1-end', 'f2-north', 'f2-middle', 'f2-south', 'boulevard-west', 'boulevard-central', 'boulevard-east', 'f3', 'f4'];
const lamps = groups.filter(g => g.open.includes('class="map-streetlight"')).sort((a, b) => a.start - b.start);
for (const [index, group] of lamps.entries()) {
  const name = lampNames[index], id = lampIds[name];
  const x = Number(group.open.match(/data-base-x="([^"]+)"/)[1]);
  const y = Number(group.open.match(/data-base-y="([^"]+)"/)[1]);
  const light = groups.find(g => g.open.includes(`data-lamp="${name}"`));
  assert(light);
  const hitX = group.markup.includes('scale(-1, 1)') ? x - 18 : x - 4;
  add(group, { objectId: `object-lamp-${id}`, facilityId: `lamp-${id}`, assetKey: 'lamp', label: `Streetlight #${id}`, x: Math.floor(x / 20), y: Math.floor(y / 20), width: 1, height: 1 }, [hitX, y - 26, 24, 30], light.markup);
}
const trees = byId('shady-trees');
for (const [index, group] of groups.filter(g => g.parent === trees.start).sort((a, b) => a.start - b.start).entries()) {
  const id = String(index + 1).padStart(2, '0');
  const [x, y] = group.open.match(/translate\(([^)]+)\)/)[1].split(/[, ]+/).map(Number);
  add(group, { objectId: `object-tree-${id}`, facilityId: null, assetKey: 'tree', label: 'Garden tree', x: Math.floor(x / 20), y: Math.floor(y / 20), width: 1, height: 1 }, [x, y, 16, 22]);
}
removals.push(trees, byId('map-group-lamps'), byId('map-road-lighting'));
const outerRemovals = removals.filter(g => !removals.some(parent => parent !== g && parent.start < g.start && parent.end > g.end));
let scenery = inner;
for (const group of outerRemovals.sort((a, b) => b.start - a.start)) scenery = scenery.slice(0, group.start) + scenery.slice(group.end);
const placements = objects.map(({ markup: _markup, hit: _hit, light: _light, order: _order, ...placement }) => placement);
assert.equal(placements.filter(o => o.assetKey === 'lamp').length, 12);
assert(placements.filter(o => o.assetKey === 'house').length >= 20);
const generated = `// Generated from public/compiled-gallery.html by scripts/export-map-overview.mjs.\nexport const approvedPlacements = ${JSON.stringify(placements, null, 2)};\nexport const approvedArtwork = ${JSON.stringify(Object.fromEntries(objects.map(({ objectId, markup, hit, light, order }) => [objectId, { markup, hit, light, order }])), null, 2)};\nexport const approvedScenery = ${JSON.stringify(scenery)};\n`;
await writeFile(new URL('../src/features/world/approvedMap.generated.js', import.meta.url), generated);
console.log(`Exported master catalog assembly and ${placements.length} interactive map assets.`);
