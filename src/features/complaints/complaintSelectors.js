export function selectMyComplaints(data, residentId, filter = 'all') {
  const profile = data.profiles.find(row => row.id === residentId);
  if (!profile || profile.role !== 'resident' || profile.township_id !== data.township.id) return [];
  return data.complaints.filter(report => report.resident_id === residentId && (filter === 'all' || report.status === filter) && data.facilities.some(facility => facility.id === report.facility_id && facility.township_id === data.township.id));
}

export function selectComplaintDetail(data, id, viewer) {
  const profile = data.profiles.find(row => row.id === viewer?.id);
  if (!profile || profile.role !== viewer.role || profile.township_id !== data.township.id) return null;
  const report = data.complaints.find(row => row.id === id);
  if (!report || !data.facilities.some(facility => facility.id === report.facility_id && facility.township_id === data.township.id)) return null;
  return profile.role === 'staff' || (profile.role === 'resident' && report.resident_id === profile.id) ? report : null;
}

export function selectFacilityState(data, facilityId) {
  const reports = data.complaints.filter(report => report.facility_id === facilityId);
  if (reports.some(report => report.status === 'in_progress')) return 'repairing';
  return reports.some(report => report.status === 'received' || report.status === 'submitted') ? 'reported' : 'normal';
}

export function selectFacilities(data) {
  if (!data?.facilities || !Array.isArray(data.facilities)) return [];
  return data.facilities.filter(facility => facility.reportable && facility.township_id === data.township.id);
}

export function selectVisibleComplaints(data, facilityId, statusFilter = 'all', actor = null) {
  if (!data?.complaints || !Array.isArray(data.complaints)) return [];
  return data.complaints.filter(report => {
    if (facilityId && report.facility_id !== facilityId) return false;
    if (actor && actor.role === 'resident' && report.resident_id !== actor.id) return false;
    if (statusFilter === 'all') return true;
    if (statusFilter === 'received' || statusFilter === 'submitted') {
      return report.status === 'received' || report.status === 'submitted';
    }
    return report.status === statusFilter;
  });
}
