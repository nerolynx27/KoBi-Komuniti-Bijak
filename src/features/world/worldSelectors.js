import { selectFacilityState } from '../complaints/complaintSelectors.js';

export const resolveFacilityObject = (data, facilityId) =>
  data.layout.find(object => object.facilityId === facilityId || (facilityId === 'house-01' && object.objectId === 'object-house-01')) || null;

/**
 * Calculates straight-line walking distance in meters between two grid coordinates.
 * Each 1x1 grid tile corresponds to roughly 15 meters in Elmina Seksyen U16.
 */
export function calculateDistanceMeters(posA, posB) {
  if (!posA || !posB) return null;
  const dx = posA.x - posB.x;
  const dy = posA.y - posB.y;
  const tileDistance = Math.hypot(dx, dy);
  return Math.round((tileDistance * 15) / 5) * 5; // rounded to nearest 5m
}

export function formatWalkingDistance(meters) {
  if (meters === null || meters === undefined) return null;
  const minutes = Math.max(1, Math.round(meters / 75)); // ~75m per minute walking pace
  return `${meters} m · ~${minutes} min walk`;
}

/**
 * Returns safe public maintenance milestones without exposing resident PII or private report text.
 */
export function selectFacilityReportHistory(data, facilityId) {
  if (!data || !facilityId) return [];
  const facilityComplaints = (data.complaints || []).filter(c => c.facility_id === facilityId);
  const complaintIds = new Set(facilityComplaints.map(c => c.id));
  const updates = (data.complaint_updates || [])
    .filter(u => complaintIds.has(u.complaint_id))
    .map(u => ({
      id: u.id,
      status: u.status,
      note: u.note || (u.status === 'received' ? 'Public report received.' : u.status === 'in_progress' ? 'Maintenance work scheduled.' : 'Maintenance completed.'),
      created_at: u.created_at,
      date: u.created_at,
    }));

  if (updates.length > 0) return updates;

  // Safe public milestones for demo amenities
  const staticMilestones = {
    'park-01': [
      { id: 'rh-park-01', status: 'completed', note: 'Quarterly landscape pruning and trail inspection completed.', created_at: '2026-10-12T11:00:00Z', date: '2026-10-12T11:00:00Z' },
    ],
    'hall-01': [
      { id: 'rh-hall-01', status: 'completed', note: 'Air conditioning serviced ahead of weekend town hall.', created_at: '2026-10-10T16:00:00Z', date: '2026-10-10T16:00:00Z' },
    ],
    'surau-01': [
      { id: 'rh-surau-01', status: 'completed', note: 'Sound system check and ablution area water pressure calibrated.', created_at: '2026-10-08T09:30:00Z', date: '2026-10-08T09:30:00Z' },
    ],
    'recycling-01': [
      { id: 'rh-recycling-01', status: 'completed', note: 'Weekly bin collection and sanitization completed.', created_at: '2026-10-17T07:30:00Z', date: '2026-10-17T07:30:00Z' },
    ],
    'lamp-02': [
      { id: 'rh-lamp-02', status: 'completed', note: 'Routine LED bulb brightness check passed.', created_at: '2026-10-11T09:00:00Z', date: '2026-10-11T09:00:00Z' },
    ],
  };
  return staticMilestones[facilityId] || [];
}

export function selectPublicObject(data, objectId, viewer) {
  const object = data?.layout?.find(row => row.objectId === objectId);
  if (!object) return null;
  const facility = data.facilities?.find(row => row.id === object.facilityId);

  const activeViewer = viewer || data.profiles?.find(p => p.role === 'resident') || data.profiles?.[0] || null;
  const isUserHome = Boolean(
    activeViewer && (
      object.objectId === activeViewer.home_object_id ||
      object.objectId === activeViewer.homeObjectId ||
      (activeViewer.home_facility_id && object.facilityId === activeViewer.home_facility_id) ||
      (activeViewer.homeFacilityId && object.facilityId === activeViewer.homeFacilityId)
    )
  );

  let homeObject = null;
  if (activeViewer) {
    homeObject = data.layout?.find(o =>
      o.objectId === activeViewer.home_object_id ||
      o.objectId === activeViewer.homeObjectId ||
      (activeViewer.home_facility_id && o.facilityId === activeViewer.home_facility_id) ||
      (activeViewer.homeFacilityId && o.facilityId === activeViewer.homeFacilityId)
    ) || null;
  }

  const distanceMeters = (!isUserHome && homeObject && object) ? calculateDistanceMeters(homeObject, object) : null;
  const distanceText = isUserHome
    ? 'Your registered home'
    : (distanceMeters !== null ? formatWalkingDistance(distanceMeters) : null);

  const facilityId = facility?.id || null;
  const reportHistory = facilityId ? selectFacilityReportHistory(data, facilityId) : [];

  const defaultName = object.assetKey === 'house'
    ? (object.label ? `Neighbourhood house (${object.label})` : 'Neighbourhood house')
    : 'Neighbourhood tree';

  const activities = (data.activities || [])
    .filter(activity => activity.facility_id === facility?.id && activity.status !== 'draft')
    .map(({ id, title, category, starts_at, status }) => ({ id, title, category, starts_at, status }));

  return {
    objectId,
    facilityId,
    name: facility?.name || defaultName,
    type: object.assetKey,
    label: object.label || null,
    reportable: isUserHome ? false : Boolean(facility?.reportable),
    state: facility ? selectFacilityState(data, facility.id) : 'normal',
    activities,
    reportHistory,
    isUserHome,
    distanceText,
    distanceMeters,
    location: { x: object.x, y: object.y, width: object.width, height: object.height },
  };
}
