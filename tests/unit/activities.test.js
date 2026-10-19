import { describe, expect, it } from 'vitest';
import { applyActivityCommand } from '../../src/features/activities/activityCommands.js';
import { selectActivities, selectParticipation } from '../../src/features/activities/activitySelectors.js';
import { createSampleData, RESIDENT_ID, STAFF_ID } from '../../src/lib/demoSamples.js';
import { validateDemoData } from '../../src/lib/demoSchema.js';

const now = '2026-10-16T00:00:00.000Z';
const start = '2026-11-07T01:00:00.000Z';
const staff = { id: STAFF_ID, role: 'staff' };
const resident = { id: RESIDENT_ID, role: 'resident' };
const values = { title: 'Garden day', description: 'A community garden morning.', category: 'community', instructions: '', facility_id: 'park-01', starts_at: start, ends_at: '2026-11-07T02:00:00.000Z', status: 'draft' };
const run = (data, type, input, actor = staff, clock = now) => applyActivityCommand(data, { type: `activities.${type}`, input }, { actor, now: clock, timestamp: now, newId: () => 'unused' });
const create = (data = createSampleData(), patch = {}) => run(data, 'save', { id: 'new-activity', expectedVersion: null, values: { ...values, ...patch } });

describe('activity authoring', () => {
  it('creates a complete draft without mutating input and safely repeats the same create', () => {
    const data = createSampleData(); const result = create(data);
    expect(result.error).toBeNull();
    expect(result.data.result).toMatchObject({ ...values, id: 'new-activity', version: 1, created_by: STAFF_ID, created_at: now, updated_at: now });
    expect(result.data.entityId).toBe('new-activity');
    expect(data.activities).toHaveLength(1);
    expect(validateDemoData(result.data.nextData).valid).toBe(true);
    const repeated = create(result.data.nextData);
    expect(repeated.data.changed).toBe(false);
    expect(repeated.data.nextData).toBe(result.data.nextData);
    expect(create(result.data.nextData, { title: 'Other title' }).error.code).toBe('CONFLICT');
  });
  it.each([
    ['title', 'abcd'], ['title', 'x'.repeat(101)], ['title', '    '], ['description', '123456789'],
    ['description', 'x'.repeat(2001)], ['instructions', 'x'.repeat(1001)], ['instructions', null],
    ['category', 'sports'], ['facility_id', 'lamp-01'], ['facility_id', 'missing'],
    ['starts_at', now], ['starts_at', 'invalid'], ['starts_at', '2027-02-30T01:00:00Z'],
    ['starts_at', '2027-01-01T24:00:00Z'], ['starts_at', '2027-01-01'],
    ['ends_at', start], ['ends_at', '2027-02-30T01:00:00Z'], ['status', 'cancelled'],
  ])('rejects invalid %s boundary', (field, value) => {
    const result = create(undefined, { [field]: value });
    expect(result).toMatchObject({ data: null, error: { code: 'VALIDATION_ERROR' } });
    expect(result.error.fields[field]).toBeTruthy();
  });
  it('accepts trimmed exact string limits, both categories and all supported locations', () => {
    for (const facility_id of ['park-01', 'hall-01', 'recycling-01']) {
      const result = create(undefined, { title: ` ${'a'.repeat(100)} `, description: 'd'.repeat(2000), instructions: 'i'.repeat(1000), facility_id, category: 'recycling', status: 'published' });
      expect(result.error).toBeNull(); expect(result.data.result.title).toHaveLength(100);
    }
    expect(create(undefined, { title: '12345', description: '1234567890' }).error).toBeNull();
  });
  it('rejects extra writable fields and invalid versions', () => {
    expect(create(undefined, { created_by: RESIDENT_ID }).error.code).toBe('VALIDATION_ERROR');
    expect(run(createSampleData(), 'save', { id: 'new', values, expectedVersion: 0 }).error.code).toBe('VALIDATION_ERROR');
  });
  it('requires full drafts and rejects invalid end dates and missing references', () => {
    for (const key of ['title', 'description', 'instructions', 'category', 'facility_id', 'starts_at', 'ends_at', 'status']) {
      const incomplete = { ...values }; delete incomplete[key];
      expect(run(createSampleData(), 'save', { id: 'new', values: incomplete, expectedVersion: null }).error.code).toBe('VALIDATION_ERROR');
    }
    expect(create(undefined, { ends_at: 'invalid' }).error.fields.ends_at).toBeTruthy();
    expect(run(createSampleData(), 'save', { id: 'missing', values, expectedVersion: 1 }).error.code).toBe('NOT_FOUND');
    const data = createSampleData(); data.facilities[2].township_id = 'another-township';
    expect(create(data).error.fields.facility_id).toBeTruthy();
  });
  it('requires a selected persona and staff authoring role', () => {
    expect(run(createSampleData(), 'save', { id: 'new', expectedVersion: null, values }, null).error.code).toBe('UNAUTHENTICATED');
    for (const type of ['save', 'cancel']) expect(run(createSampleData(), type, { id: 'new', expectedVersion: null, values }, resident).error.code).toBe('FORBIDDEN');
  });
  it('rejects unknown or mismatched demo actors and cross-township identities', () => {
    const data = createSampleData();
    expect(run(data, 'save', { id: 'new', expectedVersion: null, values }, { id: 'unknown', role: 'staff' }).error.code).toBe('FORBIDDEN');
    expect(run(data, 'save', { id: 'new', expectedVersion: null, values }, { id: RESIDENT_ID, role: 'staff' }).error.code).toBe('FORBIDDEN');
    data.profiles.find(profile => profile.id === STAFF_ID).township_id = 'another-township';
    expect(run(data, 'save', { id: 'new', expectedVersion: null, values }).error.code).toBe('FORBIDDEN');
  });
  it('rejects unsupported actions before applying role inference', () => {
    expect(run(createSampleData(), 'unsupported', {}, staff).error.code).toBe('UNAVAILABLE');
  });
  it('canonicalizes offset date/time inputs to UTC for storage', () => {
    const result = create(undefined, { starts_at: '2026-11-07T09:00:00+08:00', ends_at: '2026-11-07T10:00:00+08:00' });
    expect(result.data.result).toMatchObject({ starts_at: start, ends_at: '2026-11-07T02:00:00.000Z' });
  });
  it('edits preserve identity and memberships, advance version, and refuse unpublishing or stale versions', () => {
    const data = createSampleData(); const item = data.activities[0];
    data.activity_participants.push({ activity_id: item.id, user_id: RESIDENT_ID, created_at: now });
    const input = { id: item.id, expectedVersion: 1, values: { ...values, status: 'published' } };
    const result = run(data, 'save', input);
    expect(result.data.result).toMatchObject({ id: item.id, version: 2, created_at: item.created_at, created_by: STAFF_ID });
    expect(result.data.nextData.activity_participants).toEqual(data.activity_participants);
    expect(run(result.data.nextData, 'save', input).error.code).toBe('CONFLICT');
    expect(run(data, 'save', { ...input, values }).error.code).toBe('VALIDATION_ERROR');
    expect(run(data, 'save', input, staff, start).error.code).toBe('ACTIVITY_CLOSED');
    expect(run(data, 'save', input, staff, '2026-11-07T01:00:00.001Z').error.code).toBe('ACTIVITY_CLOSED');
    expect(run(data, 'save', input, staff, '2026-11-07T00:59:59.999Z').error).toBeNull();
  });
  it('publishes a draft and makes cancellation terminal while retaining memberships even after start', () => {
    let data = create().data.nextData;
    const published = run(data, 'save', { id: 'new-activity', expectedVersion: 1, values: { ...values, status: 'published' } });
    expect(published.data.result.status).toBe('published'); data = published.data.nextData;
    data.activity_participants.push({ activity_id: 'new-activity', user_id: RESIDENT_ID, created_at: now });
    const cancelled = run(data, 'cancel', { id: 'new-activity', expectedVersion: 2 }, staff, start);
    expect(cancelled.data.result).toMatchObject({ status: 'cancelled', version: 3 });
    expect(cancelled.data.nextData.activity_participants).toEqual(data.activity_participants);
    expect(run(cancelled.data.nextData, 'save', { id: 'new-activity', expectedVersion: 3, values }).error.code).toBe('ACTIVITY_CLOSED');
    expect(run(data, 'cancel', { id: 'new-activity', expectedVersion: 1 }).error.code).toBe('CONFLICT');
    expect(run(cancelled.data.nextData, 'cancel', { id: 'new-activity', expectedVersion: 3 }).data.changed).toBe(false);
  });
});

describe('activity participation', () => {
  it('joins and leaves once with derived unique counts and immutable rows', () => {
    const data = createSampleData(); const id = data.activities[0].id;
    const joined = run(data, 'join', { id }, resident);
    expect(joined.data.result).toEqual({ joined: true, participant_count: 1 });
    expect(data.activity_participants).toHaveLength(0);
    expect(joined.data.nextData.activity_participants[0]).toEqual({ activity_id: id, user_id: RESIDENT_ID, created_at: now });
    expect(run(joined.data.nextData, 'join', { id }, resident).data.changed).toBe(false);
    const left = run(joined.data.nextData, 'leave', { id }, resident);
    expect(left.data.result).toEqual({ joined: false, participant_count: 0 });
    expect(run(left.data.nextData, 'leave', { id }, resident).data.changed).toBe(false);
  });
  it.each(['2026-11-07T00:59:59.999Z', start, '2026-11-07T01:00:00.001Z'])('checks join and leave at %s', clock => {
    const data = createSampleData(); const id = data.activities[0].id;
    const joining = run(data, 'join', { id }, resident, clock);
    data.activity_participants.push({ activity_id: id, user_id: RESIDENT_ID, created_at: now });
    const leaving = run(data, 'leave', { id }, resident, clock);
    if (clock < start) { expect(joining.error).toBeNull(); expect(leaving.error).toBeNull(); }
    else { expect(joining.error.code).toBe('ACTIVITY_CLOSED'); expect(leaving.error.code).toBe('ACTIVITY_CLOSED'); }
  });
  it('blocks draft/cancelled join, permits pre-start cancelled leave, and requires resident role', () => {
    const data = createSampleData(); const id = data.activities[0].id;
    expect(run(data, 'join', { id }, staff).error.code).toBe('FORBIDDEN');
    expect(run(data, 'join', { id: 'missing' }, resident).error.code).toBe('NOT_FOUND');
    for (const status of ['draft', 'cancelled']) { data.activities[0].status = status; expect(run(data, 'join', { id }, resident).error.code).toBe('ACTIVITY_CLOSED'); }
    data.activity_participants.push({ activity_id: id, user_id: RESIDENT_ID, created_at: now });
    expect(run(data, 'leave', { id }, resident).data.result.joined).toBe(false);
  });
});

describe('activity selectors', () => {
  it('derives participant counts from unique users without exposing names', () => {
    const data = createSampleData(); const id = data.activities[0].id;
    data.activity_participants = [
      { activity_id: id, user_id: RESIDENT_ID, created_at: now },
      { activity_id: id, user_id: RESIDENT_ID, created_at: now },
      { activity_id: id, user_id: 'another-resident', created_at: now },
    ];
    expect(selectParticipation(data, id, RESIDENT_ID)).toEqual({ joined: true, participant_count: 2 });
  });
  it('hides drafts, filters Joined including cancelled/started, and sorts by time with ID ties', () => {
    const data = createSampleData(); const base = data.activities[0];
    data.activities = [
      { ...base, id: 'past-a', starts_at: '2026-10-15T01:00:00Z' },
      { ...base, id: 'future-b' }, { ...base, id: 'future-a', status: 'cancelled' },
      { ...base, id: 'older', starts_at: '2026-10-14T01:00:00Z', category: 'recycling' },
      { ...base, id: 'draft', status: 'draft' },
    ];
    data.activity_participants = ['past-a', 'future-a'].map(activity_id => ({ activity_id, user_id: RESIDENT_ID, created_at: now }));
    expect(selectActivities(data, resident, 'all', now).map(a => a.id)).toEqual(['future-a', 'future-b', 'past-a', 'older']);
    expect(selectActivities(data, resident, 'joined', now).map(a => a.id)).toEqual(['future-a', 'past-a']);
    expect(selectActivities(data, resident, 'recycling', now).map(a => a.id)).toEqual(['older']);
    expect(selectActivities(data, staff, 'draft', now).map(a => a.id)).toEqual(['draft']);
    expect(selectParticipation(data, 'future-a', RESIDENT_ID)).toEqual({ joined: true, participant_count: 1 });
    expect(selectParticipation(data, 'missing', RESIDENT_ID)).toEqual({ joined: false, participant_count: 0 });
  });
});
