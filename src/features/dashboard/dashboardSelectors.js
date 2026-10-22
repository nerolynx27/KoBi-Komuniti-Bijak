import { selectMyComplaints } from '../complaints/complaintSelectors.js';
import { selectActivities, selectParticipation } from '../activities/activitySelectors.js';

export function selectDashboardSummary(data, actor, nowIso) {
  const reports = selectMyComplaints(data, actor?.id);
  const reportCounts = { received: 0, in_progress: 0, resolved: 0 };
  reports.forEach(report => { if (Object.hasOwn(reportCounts, report.status)) reportCounts[report.status]++; });
  const activities = selectActivities(data, { ...actor, role: 'resident' }, 'all', nowIso)
    .filter(activity => activity.township_id === data.township.id && ['published', 'cancelled'].includes(activity.status));
  const joined = activities.filter(activity => selectParticipation(data, activity.id, actor?.id).joined);
  const future = activity => activity.status === 'published' && Date.parse(activity.starts_at) > Date.parse(nowIso);
  const updates = reports.map(report => {
    const latestAction = data.complaint_updates.filter(action => action.complaint_id === report.id && ['in_progress', 'resolved'].includes(action.status))
      .sort((a,b) => Date.parse(b.created_at) - Date.parse(a.created_at) || a.id.localeCompare(b.id))[0] || null;
    return { report, latestAction, updatedAt: latestAction?.created_at || report.created_at };
  }).sort((a,b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt) || a.report.id.localeCompare(b.report.id));
  return { reportTotal: reports.length, reportCounts, joinedActivityTotal: new Set(joined.map(activity => activity.id)).size, upcomingActivity: activities.find(future) || null, latestReportUpdate: updates[0] || null };
}
