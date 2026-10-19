import { describe, expect, it } from 'vitest';
import { parseMalaysiaDateTime, formatMalaysiaDateTime, toMalaysiaDateTimeFields } from '../../src/features/activities/dateTime.js';

describe('Malaysia wall time', () => {
  it.each([
    ['2027-01-01', '00:00', '2026-12-31T16:00:00.000Z'],
    ['2024-02-29', '23:59', '2024-02-29T15:59:00.000Z'],
    ['2000-02-29', '08:00', '2000-02-29T00:00:00.000Z'],
    ['0099-01-01', '00:00', '0098-12-31T16:00:00.000Z'],
  ])('round trips %s %s independently of host timezone', (date, time, utc) => {
    expect(parseMalaysiaDateTime(date, time)).toEqual({ data: utc, error: null });
    expect(toMalaysiaDateTimeFields(utc)).toEqual({ date, time });
  });
  it.each([
    ['2023-02-29', '10:00'], ['1900-02-29', '10:00'], ['2026-04-31', '10:00'],
    ['2026-13-01', '10:00'], ['2026-00-01', '10:00'], ['2026-01-00', '10:00'],
    ['2026-01-01', '24:00'], ['2026-01-01', '12:60'], ['2026-1-01', '10:00'],
    ['2026-01-01', '1:00'], ['', ''], [null, '10:00'], ['0000-01-01', '10:00'],
  ])('rejects impossible or malformed native fields %s %s', (date, time) => {
    expect(parseMalaysiaDateTime(date, time)).toMatchObject({ data: null, error: { code: 'VALIDATION_ERROR' } });
  });
  it('formats with Malaysia date and 12-hour time', () => {
    const text = formatMalaysiaDateTime('2026-12-31T16:00:00Z');
    expect(text).toMatch(/1 Jan 2027/);
    expect(text).toMatch(/12:00\s*am/i);
    expect(toMalaysiaDateTimeFields('invalid')).toEqual({ date: '', time: '' });
    expect(formatMalaysiaDateTime('invalid')).toBe('');
  });
});
