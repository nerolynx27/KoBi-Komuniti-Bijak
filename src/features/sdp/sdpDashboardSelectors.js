export function selectSdpDashboard(data, nowIso) {
  const localFacilities = new Set(data.facilities.filter(row => row.township_id === data.township.id).map(row => row.id));
  const reports = data.complaints.filter(row => localFacilities.has(row.facility_id) && ['received', 'in_progress'].includes(row.status));
  const attentionReports = [...reports].sort((a, b) => Number(a.status === 'in_progress') - Number(b.status === 'in_progress') || Date.parse(a.created_at) - Date.parse(b.created_at) || a.id.localeCompare(b.id)).slice(0, 2);
  const activities = data.activities.filter(row => row.township_id === data.township.id && row.status === 'published' && Date.parse(row.starts_at) > Date.parse(nowIso))
    .sort((a, b) => Date.parse(a.starts_at) - Date.parse(b.starts_at) || a.id.localeCompare(b.id));
  return { openCount: reports.length, inProgressCount: reports.filter(row => row.status === 'in_progress').length, upcomingCount: activities.length, attentionReports, nextActivity: activities[0] || null };
}
