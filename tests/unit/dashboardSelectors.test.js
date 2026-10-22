import { describe, expect, it } from 'vitest';
import { createSampleData, RESIDENT_ID, STAFF_ID } from '../../src/lib/demoSamples.js';
import { selectDashboardSummary } from '../../src/features/dashboard/dashboardSelectors.js';

const now = '2026-10-22T00:00:00Z';
const actor = { id: RESIDENT_ID, role: 'resident' };
function fixture() {
  const data = createSampleData();
  const event = data.activities[0];
  data.activities = [
    { ...event, id: 'future-b', starts_at: '2026-10-24T01:00:00Z' },
    { ...event, id: 'future-a', starts_at: '2026-10-24T01:00:00Z' },
    { ...event, id: 'past', starts_at: '2026-10-21T01:00:00Z' },
    { ...event, id: 'started', starts_at: now },
    { ...event, id: 'draft', status: 'draft' },
    { ...event, id: 'cancelled', status: 'cancelled' },
    { ...event, id: 'foreign', township_id: 'elsewhere', starts_at: '2026-10-23T01:00:00Z' },
  ];
  data.activity_participants = ['future-b', 'future-b', 'past', 'draft', 'cancelled'].map(activity_id => ({ activity_id, user_id: RESIDENT_ID }));
  return data;
}
describe('dashboard summaries', () => {
  it('uses only the current resident reports and counts each status', () => {
    const data = fixture(), original = data.complaints[0];
    data.complaints = ['received', 'in_progress', 'resolved'].map((status, i) => ({ ...original, id: `mine-${i}`, resident_id: RESIDENT_ID, status }));
    data.complaints.push({ ...original, id: 'private', resident_id: 'another-resident' });
    const summary = selectDashboardSummary(data, actor, now);
    expect(summary.reportTotal).toBe(3);
    expect(summary.reportCounts).toEqual({ received: 1, in_progress: 1, resolved: 1 });
    expect(selectDashboardSummary(data, { id: STAFF_ID, role: 'staff' }, now).reportTotal).toBe(0);
    expect(selectDashboardSummary(data, { id: 'missing', role: 'resident' }, now).reportTotal).toBe(0);
  });
  it('deduplicates participation, excludes drafts and foreign events, retains cancellations', () => {
    const summary = selectDashboardSummary(fixture(), actor, now);
    expect(summary.joinedActivityTotal).toBe(3);
    expect(summary.upcomingActivity.id).toBe('future-a');
  });
  it('does not promote past, started, draft or cancelled events', () => {
    const data = fixture();
    data.activities = data.activities.filter(event => !event.id.startsWith('future'));
    const summary = selectDashboardSummary(data, actor, now);
    expect(summary.upcomingActivity).toBeNull();
  });
  it('keeps an upcoming event with an absent facility and handles empty data without mutation', () => {
    const data = fixture();
    data.activities[1].facility_id = 'missing';
    const before = JSON.stringify(data);
    expect(selectDashboardSummary(data, actor, now).upcomingActivity.facility_id).toBe('missing');
    expect(JSON.stringify(data)).toBe(before);
    data.activities = []; data.complaints = []; data.activity_participants = [];
    expect(selectDashboardSummary(data, actor, now)).toEqual({ reportTotal: 0, reportCounts: { received: 0, in_progress: 0, resolved: 0 }, joinedActivityTotal: 0, upcomingActivity: null, latestReportUpdate: null });
  });
  it('selects the newest own maintenance action without exposing another report', () => {
    const data = fixture(), report = data.complaints[0];
    data.complaints.push({ ...report, id: 'private', resident_id: 'other' });
    data.complaint_updates = [
      { id: 'old', complaint_id: report.id, status: 'in_progress', created_at: '2026-10-20T00:00:00Z', note: 'Old note' },
      { id: 'new', complaint_id: report.id, status: 'resolved', created_at: '2026-10-21T00:00:00Z', note: 'Repair completed' },
      { id: 'secret', complaint_id: 'private', status: 'resolved', created_at: '2027-10-21T00:00:00Z', note: 'PRIVATE NOTE' },
    ];
    expect(selectDashboardSummary(data, actor, now).latestReportUpdate).toEqual({ report, latestAction: data.complaint_updates[1], updatedAt: data.complaint_updates[1].created_at });
    expect(JSON.stringify(selectDashboardSummary(data, actor, now))).not.toContain('PRIVATE NOTE');
  });
  it('uses report creation when there is no maintenance action and breaks ties by report ID', () => {
    const data = fixture();
    data.complaint_updates = [];
    data.complaints.reverse();
    const report = [...data.complaints].sort((a,b) => a.id.localeCompare(b.id))[0];
    expect(selectDashboardSummary(data, actor, now).latestReportUpdate).toEqual({ report, latestAction: null, updatedAt: report.created_at });
    data.complaint_updates.push({ id: 'receipt', complaint_id: report.id, status: 'received', created_at: '2030-01-01T00:00:00Z', note: 'Initial receipt' });
    expect(selectDashboardSummary(data, actor, now).latestReportUpdate.latestAction).toBeNull();
  });
});
