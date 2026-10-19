export const SANDBOX_STORAGE_KEY = 'kobi.reports.sandbox.v1';

export const SANDBOX_FOLDERS = [
  { id: 'report', label: 'Report', index: 0 },
  { id: 'received', label: 'Received', index: 1 },
  { id: 'in_progress', label: 'In progress', index: 2 },
  { id: 'resolved', label: 'Resolved', index: 3 },
];

export const SANDBOX_PERSONAS = [
  {
    id: 'aina-resident',
    name: 'Aina',
    roleLabel: 'Resident',
    township: 'Komuniti Bijak',
    workspace: 'resident',
  },
  {
    id: 'rizal-resident',
    name: 'Rizal',
    roleLabel: 'Resident',
    township: 'Komuniti Bijak',
    workspace: 'resident',
  },
  {
    id: 'sdp-staff',
    name: 'SDP Maintenance Team',
    roleLabel: 'SDP workspace',
    township: 'Komuniti Bijak',
    workspace: 'sdp',
  },
];

export const SANDBOX_FACILITIES = [
  {
    id: 'playground-a',
    name: 'Playground',
    artworkKey: 'playground',
    artworkNote: 'Temporary pixel SVG illustration (Playground)',
  },
  {
    id: 'recycling-c',
    name: 'Recycling point',
    artworkKey: 'recycling',
    artworkNote: 'Temporary pixel SVG illustration (Recycling point)',
  },
  {
    id: 'garden-a',
    name: 'Community garden',
    artworkKey: 'garden',
    artworkNote: 'Temporary pixel SVG illustration (Community garden)',
  },
  {
    id: 'lamp-b',
    name: 'Walkway lamp',
    artworkKey: 'lamp',
    artworkNote: 'Temporary pixel SVG illustration (Walkway lamp)',
  },
  {
    id: 'hall-b',
    name: 'Community hall',
    artworkKey: 'hall',
    artworkNote: 'Temporary pixel SVG illustration (Community hall)',
  },
];

export const INITIAL_SANDBOX_RECORDS = [
  // Playground
  {
    id: 'sbx-rep-101',
    reference: 'KB-204',
    facilityId: 'playground-a',
    title: 'Loose rubber mat near slide landing',
    description: 'The corner of the cushioned landing pad has lifted slightly and could trip children running past.',
    status: 'received',
    submittedAt: '18 Oct 2026, 4:15 pm',
    sample: true,
    updates: [
      {
        id: 'upd-101-1',
        date: '18 Oct 2026, 4:15 pm',
        actor: 'Resident report (Sample data)',
        status: 'received',
        note: 'Logged for routine playground safety inspection.',
      },
    ],
  },
  {
    id: 'sbx-rep-104',
    reference: 'KB-206',
    facilityId: 'playground-a',
    title: 'Faded age-guide sign by north gate',
    description: 'Sun exposure has bleached the safety notice panel next to the north entrance latch.',
    status: 'received',
    submittedAt: '19 Oct 2026, 8:50 am',
    sample: true,
    updates: [
      {
        id: 'upd-104-1',
        date: '19 Oct 2026, 8:50 am',
        actor: 'Resident report (Sample data)',
        status: 'received',
        note: 'Awaiting signage print batch confirmation.',
      },
    ],
  },
  {
    id: 'sbx-rep-102',
    reference: 'KB-198',
    facilityId: 'playground-a',
    title: 'Chain link wear on east swing bay',
    description: 'Top shackle on the left swing squeaks loudly and shows surface rust after heavy rain.',
    status: 'in_progress',
    submittedAt: '15 Oct 2026, 9:40 am',
    latestUpdate: 'Replacement galvanized shackles ordered; bay taped off during maintenance.',
    updatedAt: '17 Oct 2026, 11:20 am',
    sample: true,
    updates: [
      {
        id: 'upd-102-2',
        date: '17 Oct 2026, 11:20 am',
        actor: 'SDP maintenance team (Sample data)',
        status: 'in_progress',
        note: 'Replacement galvanized shackles ordered; bay taped off during maintenance.',
      },
      {
        id: 'upd-102-1',
        date: '15 Oct 2026, 9:40 am',
        actor: 'Resident report (Sample data)',
        status: 'received',
        note: 'Initial report submitted with location details.',
      },
    ],
  },
  {
    id: 'sbx-rep-105',
    reference: 'KB-195',
    facilityId: 'playground-a',
    title: 'See-saw center pivot lubrication',
    description: 'Pivot bearing creaks when loaded and needs grease packing and bolt torque check.',
    status: 'in_progress',
    submittedAt: '13 Oct 2026, 2:05 pm',
    latestUpdate: 'Bearing housing cleaned and greased; final torque check scheduled for tomorrow morning.',
    updatedAt: '18 Oct 2026, 10:30 am',
    sample: true,
    updates: [
      {
        id: 'upd-105-3',
        date: '18 Oct 2026, 10:30 am',
        actor: 'SDP maintenance team (Sample data)',
        status: 'in_progress',
        note: 'Bearing housing cleaned and greased; final torque check scheduled for tomorrow morning.',
      },
      {
        id: 'upd-105-2',
        date: '14 Oct 2026, 4:00 pm',
        actor: 'SDP maintenance team (Sample data)',
        status: 'in_progress',
        note: 'Assigned to mechanical maintenance crew.',
      },
      {
        id: 'upd-105-1',
        date: '13 Oct 2026, 2:05 pm',
        actor: 'Resident report (Sample data)',
        status: 'received',
        note: 'Resident reported stiff see-saw movement.',
      },
    ],
  },
  {
    id: 'sbx-rep-103',
    reference: 'KB-181',
    facilityId: 'playground-a',
    title: 'Sand border timber step refinished',
    description: 'Splintered timber edge on the north entry step needed smoothing and sealing.',
    status: 'resolved',
    submittedAt: '09 Oct 2026, 5:05 pm',
    completedAt: '12 Oct 2026, 2:30 pm',
    resolutionNote: 'Sanded smooth, replaced two anchor bolts and applied weather seal.',
    evidenceLabel: 'Sample maintenance evidence: North border timber sealed and bolted.',
    evidenceType: 'playground-fix',
    sample: true,
    updates: [
      {
        id: 'upd-103-3',
        date: '12 Oct 2026, 2:30 pm',
        actor: 'SDP maintenance team (Sample data)',
        status: 'resolved',
        note: 'Sanded smooth, replaced two anchor bolts and applied weather seal.',
      },
      {
        id: 'upd-103-2',
        date: '10 Oct 2026, 10:00 am',
        actor: 'SDP maintenance team (Sample data)',
        status: 'in_progress',
        note: 'Carpentry crew scheduled for morning repair.',
      },
      {
        id: 'upd-103-1',
        date: '09 Oct 2026, 5:05 pm',
        actor: 'Resident report (Sample data)',
        status: 'received',
        note: 'Reported rough timber edge on the north playground border.',
      },
    ],
  },

  // Recycling point
  {
    id: 'sbx-rep-201',
    reference: 'KB-209',
    facilityId: 'recycling-c',
    title: 'Paper bin lid hinge bent',
    description: 'Blue paper collection bin lid does not close flat against rain.',
    status: 'received',
    submittedAt: '18 Oct 2026, 6:10 pm',
    sample: true,
    updates: [
      {
        id: 'upd-201-1',
        date: '18 Oct 2026, 6:10 pm',
        actor: 'Resident report (Sample data)',
        status: 'received',
        note: 'Awaiting collection contractor check.',
      },
    ],
  },
  {
    id: 'sbx-rep-202',
    reference: 'KB-194',
    facilityId: 'recycling-c',
    title: 'Sorting sign panel peeling',
    description: 'Corner of the aluminium sorting guide board has detached from the shelter post.',
    status: 'in_progress',
    submittedAt: '14 Oct 2026, 1:15 pm',
    latestUpdate: 'New riveted brackets fitted; waiting for replacement sign decal.',
    updatedAt: '16 Oct 2026, 3:45 pm',
    sample: true,
    updates: [
      {
        id: 'upd-202-2',
        date: '16 Oct 2026, 3:45 pm',
        actor: 'SDP maintenance team (Sample data)',
        status: 'in_progress',
        note: 'New riveted brackets fitted; waiting for replacement sign decal.',
      },
      {
        id: 'upd-202-1',
        date: '14 Oct 2026, 1:15 pm',
        actor: 'Resident report (Sample data)',
        status: 'received',
        note: 'Submitted report for loose sorting guide board.',
      },
    ],
  },

  // Community hall
  {
    id: 'sbx-rep-301',
    reference: 'KB-176',
    facilityId: 'hall-b',
    title: 'Verandah noticeboard latch replaced',
    description: 'Noticeboard door latch was sticking during windy afternoons.',
    status: 'resolved',
    submittedAt: '05 Oct 2026, 8:20 am',
    completedAt: '07 Oct 2026, 4:00 pm',
    resolutionNote: 'Installed brass turn-latch and weather strip along the frame.',
    evidenceLabel: 'Sample maintenance evidence: Verandah noticeboard brass latch installed.',
    evidenceType: 'hall-fix',
    sample: true,
    updates: [
      {
        id: 'upd-301-2',
        date: '07 Oct 2026, 4:00 pm',
        actor: 'SDP maintenance team (Sample data)',
        status: 'resolved',
        note: 'Installed brass turn-latch and weather strip along the frame.',
      },
      {
        id: 'upd-301-1',
        date: '05 Oct 2026, 8:20 am',
        actor: 'Resident report (Sample data)',
        status: 'received',
        note: 'Reported sticky noticeboard latch outside the main entrance.',
      },
    ],
  },
];
