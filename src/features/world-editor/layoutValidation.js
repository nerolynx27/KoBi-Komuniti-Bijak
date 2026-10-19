export function validatePlacement(layout, candidate, { excludeObjectId } = {}) {
  if (!['x', 'y', 'width', 'height'].every(key => Number.isInteger(candidate[key]))) return { valid: false, reason: 'Use whole-number tile coordinates.' };
  if (candidate.width < 1 || candidate.height < 1 || candidate.x < 0 || candidate.y < 0 || candidate.x + candidate.width > 32 || candidate.y + candidate.height > 24) return { valid: false, reason: 'Keep the complete component within the 32 × 24 tile map.' };
  if (layout.some(object => object.objectId !== excludeObjectId && candidate.x < object.x + object.width && candidate.x + candidate.width > object.x && candidate.y < object.y + object.height && candidate.y + candidate.height > object.y)) return { valid: false, reason: 'This component overlaps another object.' };
  return { valid: true, reason: 'Ready to place. The simulation footprint is clear.' };
}
export function getRemovalBlockers(data, objectId) {
  const object = data.layout.find(row => row.objectId === objectId);
  if (!object?.facilityId) return [];
  const reports = data.complaints.filter(row => row.facility_id === object.facilityId).length;
  const activities = data.activities.filter(row => row.facility_id === object.facilityId).length;
  return [reports && `${reports} ${reports === 1 ? 'report references' : 'reports reference'} this facility, including report history.`, activities && `${activities} ${activities === 1 ? 'activity references' : 'activities reference'} this facility, including drafts and cancelled activities.`].filter(Boolean);
}
