import { describe, expect, it } from 'vitest';
import {
  ELMINA_TOWNSHIP,
  ELMINA_FACILITIES,
  ELMINA_LAYOUT,
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
