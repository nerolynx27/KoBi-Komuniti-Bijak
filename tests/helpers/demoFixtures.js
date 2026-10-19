const townshipId = '00000000-0000-4000-8000-000000000001';
const residentId = '00000000-0000-4000-8000-000000000002';
const staffId = '00000000-0000-4000-8000-000000000003';
const stamp = '2026-10-16T00:00:00Z';

export function createV1Fixture() {
  const facilities = [
    ['lamp-01', 'Walkway lamp', 'lamp'], ['bench-01', 'Garden bench', 'bench'],
    ['park-01', 'Community garden', 'park'], ['hall-01', 'Community hall', 'hall'],
    ['recycling-01', 'Recycling point', 'recycling'],
  ].map(([id, name, type]) => ({ id, name, type, township_id: townshipId, reportable: true }));
  return {
    township: { id: townshipId, name: 'KoBi pilot neighbourhood', map_id: 'pilot-map' },
    profiles: [
      { id: residentId, township_id: townshipId, display_name: 'Alex Tan', role: 'resident', created_at: stamp },
      { id: staffId, township_id: townshipId, display_name: 'SDP demo team', role: 'staff', created_at: stamp },
    ],
    preferences: { rememberWorkspace: true, workspace: 'resident' },
    facilities,
    complaints: [
      { id: '00000000-0000-4000-8000-000000000011', facility_id: 'lamp-01', resident_id: residentId, description: 'The walkway lamp is not lighting up in the evening.', photo_path: null, status: 'received', version: 1, created_at: stamp, updated_at: stamp },
      { id: '00000000-0000-4000-8000-000000000012', facility_id: 'bench-01', resident_id: residentId, description: 'One of the garden bench boards needs securing.', photo_path: null, status: 'in_progress', version: 2, created_at: stamp, updated_at: stamp },
    ],
    complaint_updates: [
      { id: '00000000-0000-4000-8000-000000000021', complaint_id: '00000000-0000-4000-8000-000000000011', actor_id: residentId, status: 'received', note: 'Sample report received.', evidence_path: null, created_at: stamp },
      { id: '00000000-0000-4000-8000-000000000022', complaint_id: '00000000-0000-4000-8000-000000000012', actor_id: residentId, status: 'received', note: 'Sample report received.', evidence_path: null, created_at: stamp },
      { id: '00000000-0000-4000-8000-000000000023', complaint_id: '00000000-0000-4000-8000-000000000012', actor_id: staffId, status: 'in_progress', note: 'Sample maintenance work scheduled.', evidence_path: null, created_at: stamp },
    ],
    activities: [{ id: '00000000-0000-4000-8000-000000000031', township_id: townshipId, facility_id: 'park-01', title: 'A greener Saturday', description: 'Meet your neighbours for a community garden morning.', category: 'community', instructions: 'Bring a water bottle and comfortable shoes.', starts_at: '2026-11-07T01:00:00Z', ends_at: '2026-11-07T03:00:00Z', status: 'published', created_by: staffId, version: 1, created_at: stamp, updated_at: stamp }],
    activity_participants: [],
    layout: [
      ...facilities.map((f, index) => ({ objectId: `object-${f.id}`, facilityId: f.id, assetKey: f.type, x: 3 + index * 4, y: 8, width: 1, height: 1 })),
      { objectId: 'object-house-01', facilityId: null, assetKey: 'house', x: 4, y: 3, width: 3, height: 3 },
    ],
  };
}


