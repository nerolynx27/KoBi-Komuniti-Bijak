import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TemporaryMap } from '../../src/features/world/TemporaryMap.jsx';
import { createSampleData, upgradeApprovedMap } from '../../src/lib/demoSamples.js';
import { migrateV1, readDemoEnvelope, validateDemoData } from '../../src/lib/demoSchema.js';
import { selectPublicObject } from '../../src/features/world/worldSelectors.js';
import { createV1Fixture } from '../helpers/demoFixtures.js';
import { approvedPlacements } from '../../src/features/world/approvedMap.generated.js';

describe('approved master map integration', () => {
  it('upgrades the untouched six-object pilot without changing records or profile edits', () => {
    const old = migrateV1(createV1Fixture());
    old.profiles[0].display_name = 'Saved name';
    const result = readDemoEnvelope(JSON.stringify({ version: 2, revision: 9, data: old })).data;
    expect(result.data.layout.filter(o => o.assetKey === 'house')).toHaveLength(23);
    expect(result.data.layout.filter(o => o.assetKey === 'lamp')).toHaveLength(12);
    expect(result.data.complaints).toEqual(old.complaints);
    expect(result.data.activities).toEqual(old.activities);
    expect(result.data.profiles[0].display_name).toBe('Saved name');
    expect(result.revision).toBe(9);
    expect(result.migrated).toBe(true);
  });

  it('preserves ambiguous edited pilot layouts and approved removals', () => {
    const old = migrateV1(createV1Fixture());
    old.layout[0].x = 5;
    expect(upgradeApprovedMap(old)).toBe(old);
    const approved = createSampleData();
    approved.layout = approved.layout.filter(o => o.objectId !== 'object-house-08');
    expect(upgradeApprovedMap(approved)).toBe(approved);
    expect(approved.layout.some(o => o.objectId === 'object-house-08')).toBe(false);
  });

  it('repairs only the exact partial pilot upgrade, including a preserved revision and records', () => {
    const old = migrateV1(createV1Fixture());
    old.township.map_id = 'elmina-approved-v1';
    old.layout = old.layout.map(o => {
      const next = approvedPlacements.find(p => p.objectId === o.objectId);
      return next ? { ...o, facilityId: o.facilityId || next.facilityId, label: next.label } : o;
    });
    old.layout.push(...approvedPlacements.filter(o => /^object-(tree-(?:0[2-9]|1[0-4])|lamp-(?:0[7-9]|1[0-2])|lake-01)$/.test(o.objectId)).map(o => ({ ...o })));
    for (const o of old.layout) if (o.facilityId && !old.facilities.some(f => f.id === o.facilityId)) old.facilities.push({ id:o.facilityId, name:o.label, type:o.assetKey, township_id:old.township.id, reportable:true });
    const repaired = readDemoEnvelope(JSON.stringify({ version:2, revision:15, data:old })).data;
    expect(repaired.data.layout).toEqual(approvedPlacements);
    expect(repaired.data.complaints).toEqual(old.complaints);
    expect(repaired.revision).toBe(15);
    expect(repaired.migrated).toBe(true);
    expect(upgradeApprovedMap(repaired.data)).toBe(repaired.data);
    const moved = structuredClone(old); moved.layout[0].x++;
    expect(upgradeApprovedMap(moved)).toBe(moved);
    const removed = structuredClone(old); removed.layout.pop();
    expect(upgradeApprovedMap(removed)).toBe(removed);
    const added = structuredClone(old); added.layout.push({ ...old.layout[0], objectId:'custom-light' });
    expect(upgradeApprovedMap(added)).toBe(added);
  });
  it('uses the approved artwork and gives every streetlight a distinct reportable facility', () => {
    const data = createSampleData();
    const html = renderToStaticMarkup(React.createElement(TemporaryMap, { data }));
    expect(html).toContain('approved-map');
    expect(html).toContain('MASJID AL FALAH');
    expect(html).not.toContain('>PERSIARAN ELMINA<');
    expect(data.layout.some(o => o.objectId === 'object-bench-01')).toBe(false);
    const lamps = data.layout.filter(o => o.assetKey === 'lamp');
    expect(lamps).toHaveLength(12);
    expect(new Set(lamps.map(o => o.facilityId)).size).toBe(12);
    for (const lamp of lamps) {
      expect(selectPublicObject(data, lamp.objectId).reportable).toBe(true);
      expect(html).toContain(`id="${lamp.objectId}"`);
    }
    expect(selectPublicObject(data, 'object-lake-01').reportable).toBe(true);
    expect(selectPublicObject(data, 'object-house-01').reportable).toBe(false);
    expect(html.indexOf('id="object-tree-02"')).toBeLessThan(html.indexOf('id="object-house-01"'));
    expect(validateDemoData(data)).toEqual({ valid: true, issues: [] });
  });

  it('upgrades old browser saves once without resetting reports, profile, or edited placements', () => {
    const legacy = createSampleData();
    legacy.township.map_id = 'pilot-map';
    legacy.layout = legacy.layout.filter(o => !/^object-lamp-(?:0[7-9]|1[0-2])$/.test(o.objectId) && o.objectId !== 'object-lake-01');
    legacy.facilities = legacy.facilities.filter(f => !/^lamp-(?:0[7-9]|1[0-2])$/.test(f.id) && f.id !== 'lake-01');
    legacy.layout.find(o => o.objectId === 'object-house-30').x = 0;
    legacy.profiles[0].display_name = 'Saved resident';
    const reports = JSON.stringify(legacy.complaints);
    const result = readDemoEnvelope(JSON.stringify({ version: 2, revision: 7, data: legacy }));
    expect(result.error).toBeNull();
    expect(result.data.migrated).toBe(true);
    expect(result.data.revision).toBe(7);
    const data = result.data.data;
    expect(data.profiles[0].display_name).toBe('Saved resident');
    expect(JSON.stringify(data.complaints)).toBe(reports);
    expect(data.layout.find(o => o.objectId === 'object-house-30').x).toBe(0);
    expect(data.layout.filter(o => o.assetKey === 'lamp')).toHaveLength(12);
    expect(upgradeApprovedMap(data)).toBe(data);
    expect(readDemoEnvelope(JSON.stringify({ version: 2, revision: 7, data })).data.migrated).toBe(false);
  });
});
