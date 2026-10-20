import { expect, it } from 'vitest';
import { createSampleData } from '../../src/lib/demoSamples.js';
import {
  calculateDistanceMeters,
  formatWalkingDistance,
  resolveFacilityObject,
  selectFacilityReportHistory,
  selectPublicObject,
} from '../../src/features/world/worldSelectors.js';

it('resolves current positions and projects only public facility information', () => {
  const data = createSampleData();
  data.layout[0].x = 22;
  expect(resolveFacilityObject(data, 'lamp-01').x).toBe(22);
  expect(resolveFacilityObject(data, 'missing')).toBeNull();
  const sheet = selectPublicObject(data, 'object-lamp-01');
  expect(sheet.state).toBe('reported');
  expect(JSON.stringify(sheet)).not.toContain(data.complaints[0].description);
  expect(sheet).not.toHaveProperty('resident_id');
  expect(selectPublicObject(data, 'object-house-08')).toMatchObject({ reportable: false, facilityId: null });
  expect(selectPublicObject(data, 'object-house-01')).toMatchObject({ reportable: false, isUserHome: true });
  data.activities.push({ ...data.activities[0], id: 'second' });
  expect(selectPublicObject(data, 'object-park-01').activities).toHaveLength(2);
  data.activities[0].status = 'draft';
  expect(selectPublicObject(data, 'object-park-01').activities).toHaveLength(1);
});

it('calculates walking distance and formats distance strings', () => {
  expect(calculateDistanceMeters({ x: 0, y: 0 }, { x: 4, y: 3 })).toBe(75);
  expect(formatWalkingDistance(75)).toBe('75 m · ~1 min walk');
  expect(formatWalkingDistance(140)).toBe('140 m · ~2 min walk');
});

it('provides safe public report history', () => {
  const data = createSampleData();
  const history = selectFacilityReportHistory(data, 'lamp-01');
  expect(Array.isArray(history)).toBe(true);
  expect(history[0]).toHaveProperty('status');
  expect(history[0]).not.toHaveProperty('resident_id');
});
