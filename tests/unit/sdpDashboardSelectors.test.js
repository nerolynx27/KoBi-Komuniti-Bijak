import { describe, expect, it } from 'vitest';
import { createSampleData } from '../../src/lib/demoSamples.js';
import { selectSdpDashboard } from '../../src/dev/sdp-workspace/sdpDashboardSelectors.js';

const now = '2026-10-22T00:00:00Z';
describe('SDP township dispatch summary', () => {
  it('includes all residents in this township, counts unresolved and orders the queue without mutation', () => {
    const data = createSampleData(), report = data.complaints[0];
    data.facilities.push({ id: 'foreign', township_id: 'elsewhere' });
    data.complaints = [
      { ...report, id: 'progress', status: 'in_progress', created_at: '2026-10-01T00:00:00Z' },
      { ...report, id: 'received-b', resident_id: 'another-resident' },
      { ...report, id: 'received-a' },
      { ...report, id: 'resolved', status: 'resolved' },
      { ...report, id: 'foreign', facility_id: 'foreign' },
      { ...report, id: 'missing', facility_id: 'missing' },
    ];
    const before = structuredClone(data), result = selectSdpDashboard(data, now);
    expect(result.openCount).toBe(3);
    expect(result.inProgressCount).toBe(1);
    expect(result.attentionReports.map(row => row.id)).toEqual(['received-a', 'received-b']);
    expect(result.attentionReports[0]).toBe(data.complaints[2]);
    data.complaints[1].created_at = '2026-10-02T00:00:00Z';
    expect(selectSdpDashboard(data, now).attentionReports.map(row => row.id)).toEqual(['received-b', 'received-a']);
    data.complaints[1].created_at = before.complaints[1].created_at;
    expect(data).toEqual(before);
  });
  it('excludes drafts, cancellations, foreign and started activities including the exact boundary', () => {
    const data = createSampleData(), event = data.activities[0];
    data.activities = [
      { ...event, id: 'b' }, { ...event, id: 'a' },
      { ...event, id: 'draft', status: 'draft' }, { ...event, id: 'cancelled', status: 'cancelled' },
      { ...event, id: 'foreign', township_id: 'elsewhere' },
      { ...event, id: 'boundary', starts_at: now }, { ...event, id: 'past', starts_at: '2026-10-21T23:59:59Z' },
    ];
    const before = structuredClone(data), result = selectSdpDashboard(data, now);
    expect(result.upcomingCount).toBe(2);
    expect(result.nextActivity).toBe(data.activities[1]);
    expect(selectSdpDashboard(data, event.starts_at).nextActivity).toBeNull();
    expect(data).toEqual(before);
    data.activities[0].starts_at = '2026-10-23T00:00:00Z';
    expect(selectSdpDashboard(data, now).nextActivity).toBe(data.activities[0]);
  });
  it('returns zero counts and empty selections for empty inputs', () => {
    expect(selectSdpDashboard({ township: { id: 'empty' }, complaints: [], facilities: [], activities: [] }, now)).toEqual({ openCount: 0, inProgressCount: 0, upcomingCount: 0, attentionReports: [], nextActivity: null });
  });
});
