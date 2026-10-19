import { selectFacilityState } from '../complaints/complaintSelectors.js';
export const resolveFacilityObject = (data, facilityId) => data.layout.find(object => object.facilityId === facilityId) || null;
export function selectPublicObject(data, objectId) {
  const object = data.layout.find(row => row.objectId === objectId);
  if (!object) return null;
  const facility = data.facilities.find(row => row.id === object.facilityId);
  return {
    objectId, facilityId: facility?.id || null, name: facility?.name || (object.assetKey === 'house' ? 'Neighbourhood house' : 'Neighbourhood tree'), type: object.assetKey,
    reportable: Boolean(facility?.reportable), state: facility ? selectFacilityState(data, facility.id) : 'normal',
    activities: data.activities.filter(activity => activity.facility_id === facility?.id && activity.status !== 'draft').map(({ id, title, category, starts_at, status }) => ({ id, title, category, starts_at, status })),
  };
}
