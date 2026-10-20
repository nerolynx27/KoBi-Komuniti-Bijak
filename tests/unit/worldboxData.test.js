import { describe, expect, it } from 'vitest';
import {
  ELMINA_TOWNSHIP,
  ELMINA_FACILITIES,
  ELMINA_LAYOUT,
  ELMINA_ROADS,
  calculateDistanceMeters,
  formatWalkingDistance,
  getFacilityReportHistory,
} from '../../src/dev/worldbox/worldboxData.js';

describe('Worldbox Elmina data', () => {
  it('contains the complete Elmina Seksyen U16 layout and amenities', () => {
    expect(ELMINA_TOWNSHIP.address).toContain('Jalan Frekuensi');
    const ids = ELMINA_FACILITIES.map(f => f.id);
    expect(ids).toContain('hall-elmina');
    expect(ids).toContain('park-elmina');
    expect(ids).toContain('surau-elmina');
    expect(ids).toContain('house-frekuensi-12');
  });

  it('includes a dense neighbourhood of at least 16 residential houses without overlapping footprints', () => {
    const houses = ELMINA_LAYOUT.filter(obj => obj.assetKey === 'house');
    expect(houses.length).toBeGreaterThanOrEqual(16);

    // Check no two layout objects overlap
    for (let i = 0; i < ELMINA_LAYOUT.length; i++) {
      for (let j = i + 1; j < ELMINA_LAYOUT.length; j++) {
        const a = ELMINA_LAYOUT[i];
        const b = ELMINA_LAYOUT[j];
        const overlapX = a.x < b.x + b.width && a.x + a.width > b.x;
        const overlapY = a.y < b.y + b.height && a.y + a.height > b.y;
        expect(overlapX && overlapY).toBe(false);
      }
    }
  });

  it('positions user home (obj-house-12) with vertical clearance above it so the MY HOUSE pinpoint never overlaps another house', () => {
    const home = ELMINA_LAYOUT.find(obj => obj.objectId === 'obj-house-12');
    expect(home).toBeDefined();
    // Ensure the 2 tiles directly above home (y - 2 to y) are free of other houses
    const overlappingAbove = ELMINA_LAYOUT.filter(
      obj =>
        obj.objectId !== home.objectId &&
        obj.x < home.x + home.width &&
        obj.x + obj.width > home.x &&
        obj.y + obj.height > home.y - 2 &&
        obj.y <= home.y
    );
    expect(overlappingAbove).toHaveLength(0);
  });

  it('places all streetlights on the roadside verge and never in the middle of any road', () => {
    expect(Array.isArray(ELMINA_ROADS)).toBe(true);
    const lamps = ELMINA_LAYOUT.filter(obj => obj.assetKey === 'lamp');
    expect(lamps.length).toBeGreaterThanOrEqual(5);

    for (const lamp of lamps) {
      for (const road of ELMINA_ROADS) {
        const onRoadX = lamp.x < road.x + road.width && lamp.x + lamp.width > road.x;
        const onRoadY = lamp.y < road.y + road.height && lamp.y + lamp.height > road.y;
        expect(onRoadX && onRoadY).toBe(false);
      }
    }
  });

  it('calculates walking distance and returns formatted text', () => {
    const dist = calculateDistanceMeters({ x: 0, y: 0 }, { x: 4, y: 3 }); // 5 tiles * 15m = 75m
    expect(dist).toBe(75);
    expect(formatWalkingDistance(dist)).toBe('75 m · ~1 min walk');
  });

  it('provides safe report history for facilities', () => {
    const history = getFacilityReportHistory('lamp-frekuensi-01');
    expect(Array.isArray(history)).toBe(true);
    if (history.length > 0) {
      expect(history[0]).toHaveProperty('status');
      expect(history[0]).not.toHaveProperty('resident_id');
      expect(history[0]).not.toHaveProperty('description');
    }
  });
});
