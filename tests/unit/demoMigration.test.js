import { describe, expect, it } from 'vitest';
import { createV1Fixture } from '../helpers/demoFixtures.js';
import { createSampleData } from '../../src/lib/demoSamples.js';
import { migrateV1, readDemoEnvelope, validateDemoData } from '../../src/lib/demoSchema.js';

describe('demo envelope migration', () => {
  it('preserves original v1 edits, overlaps and provisional footprints without mutating input', () => {
    const old = createV1Fixture();
    old.profiles[0].display_name = 'Edited resident';
    old.complaints[0].description = 'My edited report must survive migration.';
    old.preferences = { rememberWorkspace: false, workspace: 'sdp' };
    old.layout[0].x = old.layout[1].x;
    const before = structuredClone(old);
    const migrated = migrateV1(old);
    const { attachments, profiles, ...rest } = migrated;
    expect(rest).toEqual(Object.fromEntries(Object.entries(old).filter(([key]) => key !== 'profiles')));
    expect(attachments).toEqual([]);
    expect(profiles.map(({ email, ...profile }) => { expect(email).toMatch(/@example\.com$/); return profile; })).toEqual(old.profiles);
    expect(old).toEqual(before);
    expect(validateDemoData(migrated)).toEqual({ valid: true, issues: [] });
    expect(readDemoEnvelope(JSON.stringify({ version: 1, data: old })).data).toEqual({ version: 2, revision: 0, data: migrated, migrated: true });
  });

  it('reads v2 without reseeding saved dates or changing revisions', () => {
    const data = createSampleData();
    expect(readDemoEnvelope(JSON.stringify({ version: 2, revision: 17, data }))).toEqual({ data: { version: 2, revision: 17, data, migrated: false }, error: null });
  });

  it('keeps deterministic fixtures and explicitly seeds future live activities', () => {
    const first = createSampleData();
    expect(first).toEqual(createSampleData());
    first.preferences.workspace = 'sdp';
    expect(createSampleData().preferences.workspace).toBe('resident');
    const future = createSampleData('2030-01-31T23:30:00Z');
    expect(Date.parse(future.activities[0].starts_at)).toBeGreaterThan(Date.parse('2030-01-31T23:30:00Z'));
    expect(Date.parse(future.activities[0].ends_at)).toBeGreaterThan(Date.parse(future.activities[0].starts_at));
  });

  it.each([
    '{broken', JSON.stringify({ version: 99, data: {} }),
    JSON.stringify({ version: 2, revision: -1, data: createV1Fixture() }),
    JSON.stringify({ version: 1, revision: 0, data: createV1Fixture() }),
  ])('returns a recovery result for malformed or unsupported envelopes: %s', raw => {
    const result = readDemoEnvelope(raw);
    expect(result.data).toBeNull();
    expect(result.error.code).toBeTruthy();
  });

  it.each([
    data => { data.profiles[0].password = 'secret'; },
    data => { data.complaints[0].facility_id = 'missing'; },
    data => { data.complaint_updates[0].actor_id = 'missing'; },
    data => { data.layout[0].x = -1; },
    data => { data.complaints[0].photo_path = 'blob:unsafe'; },
  ])('validates original v1 before filling defaults', edit => {
    const data = createV1Fixture(); edit(data);
    expect(readDemoEnvelope(JSON.stringify({ version: 1, data })).data).toBeNull();
    expect(() => migrateV1(data)).toThrow();
  });

  it('accepts bounded attachment metadata and linked report/evidence references', () => {
    const data = createSampleData();
    data.attachments = [
      { id: 'report-photo', kind: 'report', file_name: 'lamp.png', mime_type: 'image/png', size_bytes: 1 },
      { id: 'evidence-photo', kind: 'resolution', file_name: 'fixed.webp', mime_type: 'image/webp', size_bytes: 5000000 },
    ];
    data.complaints[0].photo_path = 'demo-attachment:report-photo';
    data.complaints[0].status = 'resolved';
    data.complaint_updates[0].status = 'resolved';
    data.complaint_updates[0].evidence_path = 'demo-attachment:evidence-photo';
    expect(validateDemoData(data)).toEqual({ valid: true, issues: [] });
  });

  it.each([
    data => { data.profiles[0].email = 'invalid'; },
    data => { data.preferences.token = 'secret'; },
    data => { data.complaints[0].photo_path = 'demo-attachment:missing'; },
    data => { data.complaints[0].photo_path = 'data:image/png;base64,AAAA'; },
    data => { data.activities[0].facility_id = 'missing'; },
    data => { data.activity_participants = [{ activity_id: 'missing', user_id: data.profiles[0].id, created_at: '2026-10-16T00:00:00Z' }]; },
    data => { data.attachments = [{ id: 'x', kind: 'report', file_name: 'x.png', mime_type: 'image/png', size_bytes: 0 }]; },
    data => { data.attachments = [{ id: 'x', kind: 'report', file_name: 'x.svg', mime_type: 'image/svg+xml', size_bytes: 1 }]; },
    data => { data.attachments = [{ id: 'x', kind: 'report', file_name: 'x.png', mime_type: 'image/png', size_bytes: 5000001 }]; },
    data => { data.profiles.push(structuredClone(data.profiles[0])); },
  ])('rejects corrupt v2 records with useful issues', edit => {
    const data = createSampleData(); edit(data);
    const result = validateDemoData(data);
    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
    expect(readDemoEnvelope(JSON.stringify({ version: 2, revision: 0, data })).data).toBeNull();
  });
});
