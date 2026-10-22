import { describe, expect, it } from 'vitest';
import { createSampleData } from '../../src/lib/demoSamples.js';
import {
  calculateDistanceMeters,
  formatWalkingDistance,
  selectFacilityReportHistory,
  selectPublicObject,
} from '../../src/features/world/worldSelectors.js';

describe('Elmina App Integration & Selectors', () => {
  it('anchors township and resident profile to Elmina West Seksyen U16', () => {
    const data = createSampleData();
    expect(data.township.name).toBe('Elmina West (Seksyen U16)');
    expect(data.township.address).toContain('Persiaran Elmina / Jalan Frekuensi');

    const alex = data.profiles.find(p => p.role === 'resident');
    expect(alex).toBeDefined();
    expect(alex.display_name).toBe('Alex Tan');
    expect(alex.home_facility_id).toBe('house-01');
    expect(alex.home_object_id).toBe('object-house-01');
  });

  it('maintains expected facility names and prefixes in demo data', () => {
    const data = createSampleData();
    const facilityMap = Object.fromEntries(data.facilities.map(f => [f.id, f.name]));

    expect(facilityMap['lamp-01']).toBe('Walkway lamp #01 (Jalan Frekuensi)');
    expect(facilityMap['bench-01']).toBe('Garden bench (Elmina Central Park)');
    expect(facilityMap['park-01']).toBe('Community garden & park (Elmina Central Park)');
    expect(facilityMap['hall-01']).toBe('Community hall (Dewan Komuniti Elmina)');
    expect(facilityMap['recycling-01']).toBe('Recycling point (Elmina Station)');
    expect(facilityMap['house-01']).toBe('Neighbourhood house (Alex Tan Home - Lot 12)');
  });

  it('calculates walking distance in meters (1 tile ~ 15m) and formats walk time', () => {
    const posA = { x: 0, y: 0 };
    const posB = { x: 4, y: 3 }; // hypot = 5 tiles -> 75m
    const meters = calculateDistanceMeters(posA, posB);
    expect(meters).toBe(75);
    expect(formatWalkingDistance(meters)).toBe('75 m · ~1 min walk');

    expect(formatWalkingDistance(140)).toBe('140 m · ~2 min walk');
    expect(calculateDistanceMeters(null, posB)).toBeNull();
    expect(formatWalkingDistance(null)).toBeNull();
  });

  it('returns safe public report history without resident PII or private description', () => {
    const data = createSampleData();
    const history = selectFacilityReportHistory(data, 'lamp-01');
    expect(Array.isArray(history)).toBe(true);
    expect(history.length).toBeGreaterThan(0);

    for (const entry of history) {
      expect(entry).toHaveProperty('status');
      expect(entry).toHaveProperty('note');
      expect(entry).not.toHaveProperty('resident_id');
      expect(entry).not.toHaveProperty('actor_id');
      expect(JSON.stringify(entry)).not.toContain(data.complaints[0].description);
    }
  });

  it('projects rich public object details with distanceText, isUserHome, and reportHistory', () => {
    const data = createSampleData();
    const resident = data.profiles.find(p => p.role === 'resident');

    // Alex Tan's house
    const homeObj = selectPublicObject(data, 'object-house-01', resident);
    expect(homeObj.isUserHome).toBe(true);
    expect(homeObj.reportable).toBe(false);
    expect(homeObj.distanceText).toBe('Your registered home');

    // Walkway lamp
    const lampObj = selectPublicObject(data, 'object-lamp-01', resident);
    expect(lampObj.isUserHome).toBe(false);
    expect(lampObj.reportable).toBe(true);
    expect(typeof lampObj.distanceText).toBe('string');
    expect(lampObj.distanceText).toContain('min walk');
    expect(Array.isArray(lampObj.reportHistory)).toBe(true);
  });

  it('includes 20+ residential houses with dedicated clearance above Lot 12', () => {
    const data = createSampleData();
    const houses = data.layout.filter(o => o.assetKey === 'house');
    expect(houses.length).toBeGreaterThanOrEqual(20);

    const myHouse = data.layout.find(o => o.objectId === 'object-house-01');
    expect(myHouse).toBeDefined();

    expect(myHouse).toMatchObject({ x: 4, y: 8, width: 2, height: 2 });
    expect(data.layout.find(o => o.objectId === 'object-surau-01').label).toBe('Masjid Al Falah');
  });
});
