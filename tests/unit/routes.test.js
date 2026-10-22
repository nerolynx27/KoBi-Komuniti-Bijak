import { expect, it } from 'vitest';
import { parseRoute, buildRoute } from '../../src/app/routes.js';
it('opens Home by default and keeps explicit map destinations', () => {
  for (const hash of ['', '#', '#home']) expect(parseRoute(hash)).toMatchObject({ name: 'home', nav: 'home' });
  expect(parseRoute('#map')).toMatchObject({ name: 'map', nav: 'home' });
  expect(buildRoute({ name: 'map', facilityId: 'lamp-01' })).toBe('#map?facility=lamp-01');
});
it('parses whitelisted nested routes and keeps their navigation context', () => {
  expect(parseRoute('#reports/new?facility=lamp-01')).toMatchObject({ name: 'report-new', facilityId: 'lamp-01', nav: 'reports', staff: false });
  expect(parseRoute('#sdp/activities/event-1/edit')).toMatchObject({ name: 'activity-edit', id: 'event-1', staff: true });
  expect(parseRoute('#reports/%E0%A4%A').name).toBe('not-found');
  expect(parseRoute('#elsewhere').name).toBe('not-found');
  expect(parseRoute('#presentation?deck=deck-b&slide=3')).toMatchObject({ name: 'presentation', deck: 'deck-b', slide: 3, title: 'Presentation Studio' });
  expect(buildRoute({ name: 'map', facilityId: 'lamp-01' })).toBe('#map?facility=lamp-01');
});
