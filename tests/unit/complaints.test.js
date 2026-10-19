import { describe, expect, it } from 'vitest';
import { applyComplaintCommand } from '../../src/features/complaints/complaintCommands.js';
import { selectMyComplaints, selectComplaintDetail, selectFacilityState } from '../../src/features/complaints/complaintSelectors.js';
import { createSampleData, RESIDENT_ID, STAFF_ID } from '../../src/lib/demoSamples.js';
import { validateDemoData } from '../../src/lib/demoSchema.js';
import { createDemoStore } from '../../src/lib/demoStore.js';

const timestamp = '2026-10-16T03:00:00.000Z';
const resident = { id: RESIDENT_ID, role: 'resident' };
const staff = { id: STAFF_ID, role: 'staff' };
const context = (actor = resident, file = null) => ({ actor, timestamp, now: timestamp, newId: () => 'generated', resolveAttachment: () => file });
const create = (input = {}) => ({ operationId: 'create-op', type: 'complaints.create', input: { id: 'new-report', facilityId: 'lamp-01', description: 'The lamp needs attention.', ...input } });
const transition = (input = {}) => ({ operationId: 'action-op', type: 'complaints.transition', input: { id: createSampleData().complaints[0].id, expectedVersion: 1, nextStatus: 'in_progress', note: 'Inspection is scheduled.', updateId: 'action-update', ...input } });
const photo = (kind = 'resolution') => ({ id: 'image-one', kind, file_name: 'evidence.png', mime_type: 'image/png', size_bytes: 3 });
const file = () => new File(['abc'], 'evidence.png', { type: 'image/png' });

describe('report creation', () => {
  it.each([[9, false], [10, true], [1000, true], [1001, false]])('enforces trimmed description boundary %i', (length, valid) => {
    const data = createSampleData();
    const outcome = applyComplaintCommand(data, create({ description: `  ${'x'.repeat(length)}  ` }), context());
    expect(outcome.error === null).toBe(valid);
    if (valid) {
      expect(outcome.data.result.description).toBe('x'.repeat(length));
      expect(outcome.data.result).toMatchObject({ status: 'received', version: 1, resident_id: RESIDENT_ID, created_at: timestamp, updated_at: timestamp });
      expect(outcome.data.nextData.complaint_updates.at(-1)).toMatchObject({ complaint_id: 'new-report', actor_id: RESIDENT_ID, status: 'received', created_at: timestamp });
      expect(validateDemoData(outcome.data.nextData).valid).toBe(true);
    }
    expect(data.complaints).toHaveLength(2);
  });
  it('returns matching IDs unchanged and conflicts on changed payload or owner', () => {
    const first = applyComplaintCommand(createSampleData(), create(), context()).data;
    const repeat = applyComplaintCommand(first.nextData, create(), context());
    expect(repeat.data.changed).toBe(false);
    expect(repeat.data.nextData).toBe(first.nextData);
    expect(applyComplaintCommand(first.nextData, create({ description: 'A different lamp problem.' }), context()).error.code).toBe('CONFLICT');
    const data = structuredClone(first.nextData);
    data.profiles.push({ ...data.profiles[0], id: 'another-resident' });
    expect(applyComplaintCommand(data, create(), context({ id: 'another-resident', role: 'resident' })).error.code).toBe('CONFLICT');
  });
  it.each(['missing', 'foreign', 'not-reportable'])('rejects unavailable facility %s', kind => {
    const data = createSampleData();
    if (kind === 'foreign') data.facilities[0].township_id = 'elsewhere';
    if (kind === 'not-reportable') data.facilities[0].reportable = false;
    expect(applyComplaintCommand(data, create({ facilityId: kind === 'missing' ? 'missing' : 'lamp-01' }), context()).error).toBeTruthy();
  });
  it.each([null, staff, { id: 'missing', role: 'resident' }, { id: STAFF_ID, role: 'resident' }])('rejects absent or wrong creation actors', actor => {
    expect(applyComplaintCommand(createSampleData(), create(), context(actor)).error).toBeTruthy();
  });
  it('rejects an actor profile from another township', () => {
    const data = createSampleData(); data.profiles[0].township_id = 'elsewhere';
    expect(applyComplaintCommand(data, create(), context()).error).toBeTruthy();
  });
  it('stores photo metadata only and requires matching staged File', () => {
    const metadata = photo('report');
    const command = create({ attachment: metadata, password: 'never-persist' });
    expect(applyComplaintCommand(createSampleData(), command, context()).error).toBeTruthy();
    const outcome = applyComplaintCommand(createSampleData(), create({ attachment: metadata }), context(resident, file()));
    expect(outcome.error).toBeNull();
    expect(outcome.data.result.photo_path).toBe('demo-attachment:image-one');
    expect(outcome.data.nextData.attachments).toEqual([metadata]);
    expect(JSON.stringify(outcome.data.nextData)).not.toMatch(/never-persist|blob:|base64|"password"/);
    expect(validateDemoData(outcome.data.nextData).valid).toBe(true);
    for (const changed of [{ ...metadata, file_name: 'wrong.png' }, { ...metadata, size_bytes: 4 }, { ...metadata, mime_type: 'image/jpeg' }, { ...metadata, size_bytes: 5000001 }]) {
      expect(applyComplaintCommand(createSampleData(), create({ attachment: changed }), context(resident, file())).error).toBeTruthy();
    }
  });
});

describe('report transitions', () => {
  it.each([[4, false], [5, true], [1000, true], [1001, false]])('enforces trimmed note boundary %i', (length, valid) => {
    const outcome = applyComplaintCommand(createSampleData(), transition({ note: `  ${'x'.repeat(length)}  ` }), context(staff));
    expect(outcome.error === null).toBe(valid);
    if (valid) expect(outcome.data.nextData.complaint_updates.at(-1).note).toBe('x'.repeat(length));
  });
  it('rejects wrong roles, stale versions, skipped and repeated transitions', () => {
    for (const [command, actor] of [[transition(), resident], [transition({ expectedVersion: 2 }), staff], [transition({ nextStatus: 'resolved' }), staff], [transition({ nextStatus: 'received' }), staff]]) {
      expect(applyComplaintCommand(createSampleData(), command, context(actor)).error).toBeTruthy();
    }
  });
  it('requires matching resolution evidence and commits history/status/version together', () => {
    const data = createSampleData(); const id = data.complaints[1].id;
    const input = { id, expectedVersion: 2, nextStatus: 'resolved', attachment: photo() };
    expect(applyComplaintCommand(data, transition(input), context(staff)).error).toBeTruthy();
    const result = applyComplaintCommand(data, transition(input), context(staff, file()));
    expect(result.error).toBeNull();
    expect(result.data.result).toMatchObject({ status: 'resolved', version: 3, updated_at: timestamp });
    expect(result.data.nextData.complaint_updates.at(-1)).toMatchObject({ complaint_id: id, actor_id: STAFF_ID, status: 'resolved', evidence_path: 'demo-attachment:image-one' });
    expect(validateDemoData(result.data.nextData).valid).toBe(true);
    expect(data.complaints[1].version).toBe(2);
  });
  it('deduplicates update IDs before version checks and conflicts on different payloads', () => {
    const first = applyComplaintCommand(createSampleData(), transition(), context(staff)).data;
    const second = applyComplaintCommand(first.nextData, transition(), context(staff));
    expect(second.data.changed).toBe(false);
    expect(second.data.nextData.complaint_updates).toHaveLength(4);
    expect(applyComplaintCommand(first.nextData, transition({ note: 'A changed action note.' }), context(staff)).error.code).toBe('CONFLICT');
    expect(applyComplaintCommand(first.nextData, transition({ id: first.nextData.complaints[1].id, expectedVersion: 2 }), context(staff)).error.code).toBe('CONFLICT');
  });
});

describe('report selectors', () => {
  it('keeps resident lists/details private to the viewer and staff within the pilot', () => {
    const data = createSampleData(); data.complaints.push({ ...data.complaints[0], id: 'other', resident_id: 'other' });
    expect(selectMyComplaints(data, RESIDENT_ID)).toHaveLength(2);
    expect(selectMyComplaints(data, RESIDENT_ID, 'in_progress')).toHaveLength(1);
    expect(selectComplaintDetail(data, 'other', resident)).toBeNull();
    expect(selectComplaintDetail(data, 'other', staff)?.id).toBe('other');
    expect(selectComplaintDetail(data, data.complaints[0].id, null)).toBeNull();
    data.facilities[0].township_id = 'elsewhere';
    expect(selectComplaintDetail(data, data.complaints[0].id, staff)).toBeNull();
  });
  it('derives facility state across all active reports without exposing report details', () => {
    const data = createSampleData(); const base = data.complaints[0];
    data.complaints.push({ ...base, id: 'second', status: 'in_progress' });
    expect(selectFacilityState(data, 'lamp-01')).toBe('repairing');
    data.complaints[0] = { ...base, status: 'resolved' };
    expect(selectFacilityState(data, 'lamp-01')).toBe('repairing');
    data.complaints[2] = { ...data.complaints[2], status: 'received' };
    expect(selectFacilityState(data, 'lamp-01')).toBe('reported');
    data.complaints[2] = { ...data.complaints[2], status: 'resolved' };
    expect(selectFacilityState(data, 'lamp-01')).toBe('normal');
    expect(selectFacilityState(data, 'missing')).toBe('normal');
  });
});

describe('report store atomicity', () => {
  it.each(['create', 'transition'])('keeps a failed %s candidate unpublished and retries once', type => {
    let raw = null; let fails = false;
    const storage = { getItem: () => raw, setItem: (_key, value) => { if (fails) throw new Error('Full'); raw = value; } };
    const store = createDemoStore(storage, { now: () => timestamp, getDemoActor: () => type === 'create' ? resident : staff, resolveAttachment: () => file() });
    const before = store.getSnapshot();
    const command = type === 'create' ? create({ attachment: photo('report') }) : transition({ id: before.data.complaints[1].id, expectedVersion: 2, nextStatus: 'resolved', attachment: photo() });
    command.baseRevision = before.revision;
    fails = true;
    expect(store.execute(command).error.code).toBe('STORAGE_UNAVAILABLE');
    expect(store.getSnapshot().data).toBe(before.data);
    expect(store.getSnapshot().revision).toBe(before.revision);
    fails = false;
    expect(store.retryPending(command.operationId).error).toBeNull();
    expect(store.getSnapshot().data.complaint_updates).toHaveLength(4);
    expect(store.getSnapshot().data.attachments).toHaveLength(1);
    expect(store.getSnapshot().revision).toBe(before.revision + 1);
  });
});
