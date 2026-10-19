import { expect, it } from 'vitest';
import { createSampleData } from '../../src/lib/demoSamples.js';
import { resolveFacilityObject, selectPublicObject } from '../../src/features/world/worldSelectors.js';
it('resolves current positions and projects only public facility information', () => {
  const data = createSampleData();
  data.layout[0].x = 22;
  expect(resolveFacilityObject(data, 'lamp-01').x).toBe(22);
  expect(resolveFacilityObject(data, 'missing')).toBeNull();
  const sheet = selectPublicObject(data, 'object-lamp-01');
  expect(sheet.state).toBe('reported');
  expect(JSON.stringify(sheet)).not.toContain(data.complaints[0].description);
  expect(sheet).not.toHaveProperty('resident_id');
  expect(selectPublicObject(data, 'object-house-01')).toMatchObject({ reportable: false, facilityId: null });
  data.activities.push({ ...data.activities[0], id: 'second' });
  expect(selectPublicObject(data, 'object-park-01').activities).toHaveLength(2);
  data.activities[0].status = 'draft';
  expect(selectPublicObject(data, 'object-park-01').activities).toHaveLength(1);
});
