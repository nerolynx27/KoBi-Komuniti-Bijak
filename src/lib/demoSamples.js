export const TOWNSHIP_ID = '00000000-0000-4000-8000-000000000001';
export const RESIDENT_ID = '00000000-0000-4000-8000-000000000002';
export const STAFF_ID = '00000000-0000-4000-8000-000000000003';
const stamp = '2026-10-16T00:00:00Z';

export function createSampleData(referenceTime) {
  const start = referenceTime === undefined ? '2026-11-07T01:00:00Z' : new Date(new Date(referenceTime).getTime() + 7 * 86400000).toISOString();
  const end = referenceTime === undefined ? '2026-11-07T03:00:00Z' : new Date(Date.parse(start) + 7200000).toISOString();
  const facilities = [
    ['lamp-01', 'Walkway lamp', 'lamp'], ['bench-01', 'Garden bench', 'bench'],
    ['park-01', 'Community garden', 'park'], ['hall-01', 'Community hall', 'hall'],
    ['recycling-01', 'Recycling point', 'recycling'],
  ].map(([id, name, type]) => ({ id, name, type, township_id: TOWNSHIP_ID, reportable: true }));
  return {
    township: { id: TOWNSHIP_ID, name: 'KoBi pilot neighbourhood', map_id: 'pilot-map' },
    profiles: [
      { id: RESIDENT_ID, township_id: TOWNSHIP_ID, display_name: 'Alex Tan', role: 'resident', email: 'alex.tan@example.com', created_at: stamp },
      { id: STAFF_ID, township_id: TOWNSHIP_ID, display_name: 'SDP demo team', role: 'staff', email: 'sdp.team@example.com', created_at: stamp },
    ],
    preferences: { rememberWorkspace: true, workspace: 'resident' },
    facilities,
    complaints: [
      { id: '00000000-0000-4000-8000-000000000011', facility_id: 'lamp-01', resident_id: RESIDENT_ID, description: 'The walkway lamp is not lighting up in the evening.', photo_path: null, status: 'received', version: 1, created_at: stamp, updated_at: stamp },
      { id: '00000000-0000-4000-8000-000000000012', facility_id: 'bench-01', resident_id: RESIDENT_ID, description: 'One of the garden bench boards needs securing.', photo_path: null, status: 'in_progress', version: 2, created_at: stamp, updated_at: stamp },
    ],
    complaint_updates: [
      { id: '00000000-0000-4000-8000-000000000021', complaint_id: '00000000-0000-4000-8000-000000000011', actor_id: RESIDENT_ID, status: 'received', note: 'Sample report received.', evidence_path: null, created_at: stamp },
      { id: '00000000-0000-4000-8000-000000000022', complaint_id: '00000000-0000-4000-8000-000000000012', actor_id: RESIDENT_ID, status: 'received', note: 'Sample report received.', evidence_path: null, created_at: stamp },
      { id: '00000000-0000-4000-8000-000000000023', complaint_id: '00000000-0000-4000-8000-000000000012', actor_id: STAFF_ID, status: 'in_progress', note: 'Sample maintenance work scheduled.', evidence_path: null, created_at: stamp },
    ],
    activities: [{ id: '00000000-0000-4000-8000-000000000031', township_id: TOWNSHIP_ID, facility_id: 'park-01', title: 'A greener Saturday', description: 'Meet your neighbours for a community garden morning.', category: 'community', instructions: 'Bring a water bottle and comfortable shoes.', starts_at: start, ends_at: end, status: 'published', created_by: STAFF_ID, version: 1, created_at: stamp, updated_at: stamp }],
    activity_participants: [],
    attachments: [],
    layout: [
      ...facilities.map((f, index) => ({ objectId: `object-${f.id}`, facilityId: f.id, assetKey: f.type, x: 3 + index * 4, y: 8, width: 1, height: 1 })),
      { objectId: 'object-house-01', facilityId: null, assetKey: 'house', x: 4, y: 3, width: 3, height: 3 },
    ],
  };
}



