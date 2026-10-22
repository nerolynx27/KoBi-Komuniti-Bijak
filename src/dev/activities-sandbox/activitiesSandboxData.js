export const ACTIVITIES_SANDBOX_STORAGE_KEY = 'kobi.activities.sandbox.v1';

export const SANDBOX_PERSONAS = [
  {
    id: 'resident-aina',
    name: 'Aina Razak',
    role: 'resident',
    roleLabel: 'Resident',
    township: 'Elmina East · Block B',
  },
  {
    id: 'resident-harith',
    name: 'Harith Lim',
    role: 'resident',
    roleLabel: 'Resident',
    township: 'Elmina East · Block D',
  },
  {
    id: 'sdp-farah',
    name: 'Farah Aziz (SDP)',
    role: 'sdp',
    roleLabel: 'SDP Staff',
    township: 'Township Operations',
  },
];

export const INITIAL_SANDBOX_ACTIVITIES = [
  {
    id: 'act-garden-101',
    category: 'community',
    categoryLabel: 'COMMUNITY',
    noteTheme: 'gold',
    title: 'Gotong-Royong Garden',
    dateLabel: '15 NOV 2026',
    timeLabel: '8:00 AM – 11:00 AM · Malaysia time',
    location: 'Community Garden',
    artworkKey: 'garden-harvest',
    participantCount: 18,
    joined: false,
    tiltDeg: -3,
    foldedCorner: 'top-right-bottom-right',
    description:
      'Join neighbours to weed raised vegetable beds, turn compost bins, and harvest fresh herbs and leafy greens for the community kitchen share.',
    organizer: 'Resident Garden Committee',
  },
  {
    id: 'act-ewaste-102',
    category: 'recycling',
    categoryLabel: 'RECYCLING',
    noteTheme: 'sand-cherry',
    title: 'E-Waste & Plastic Drive',
    dateLabel: '22 NOV 2026',
    timeLabel: '9:00 AM – 1:00 PM · Malaysia time',
    location: 'Recycling Point',
    artworkKey: 'ewaste-bins',
    participantCount: 32,
    joined: true,
    tiltDeg: 1.5,
    foldedCorner: 'none',
    description:
      'Bring household batteries, small electronics, chargers, and clean sorted plastics for weighing and certified township recycling collection.',
    organizer: 'SDP Sustainability Team',
  },
  {
    id: 'act-upcycle-103',
    category: 'recycling',
    categoryLabel: 'RECYCLING',
    noteTheme: 'vanilla-cherry',
    title: 'Upcycling Craft Workshop',
    dateLabel: '29 NOV 2026',
    timeLabel: '2:30 PM – 5:00 PM · Malaysia time',
    location: 'Community Hall',
    artworkKey: 'upcycling-craft',
    participantCount: 14,
    joined: false,
    tiltDeg: -2,
    foldedCorner: 'none',
    description:
      'Hands-on family workshop turning clean glass jars, fabric offcuts, and cardboard cartons into durable desk organizers and balcony planters.',
    organizer: 'Eco Makers Collective',
  },
  {
    id: 'act-taichi-104',
    category: 'community',
    categoryLabel: 'COMMUNITY',
    noteTheme: 'gold',
    title: 'Morning Tai Chi Session',
    dateLabel: '05 DEC 2026',
    timeLabel: '7:30 AM – 9:00 AM · Malaysia time',
    location: 'Central Park Pavilion',
    artworkKey: 'tai-chi',
    participantCount: 21,
    joined: false,
    tiltDeg: 2,
    foldedCorner: 'bottom-right',
    description:
      'Gentle outdoor breathing, balance, and mobility routine open to all ages, followed by warm herbal tea at the Central Park Pavilion.',
    organizer: 'Elmina Wellness Circle',
  },
];

export const INITIAL_GALLERY_ITEMS = [
  {
    id: 'gal-1',
    code: 'G1',
    shortCaption: 'Park Clean-Up',
    category: 'community',
    categoryLabel: 'COMMUNITY',
    dateLabel: '04 Oct 2026',
    title: 'Township Clean & Green Day',
    summary:
      'Collected 145 kg of recyclables and cleared walkway planters with 28 resident volunteers.',
    participants: 28,
    artworkKey: 'cleanup-event',
    imageSrc: '/assets/activities/gallery-cleanup.png',
  },
  {
    id: 'gal-2',
    code: 'G2',
    shortCaption: 'Garden Harvest',
    category: 'community',
    categoryLabel: 'COMMUNITY',
    dateLabel: '12 Oct 2026',
    title: 'Community Garden Harvest Day',
    summary:
      'Successful neighbourhood harvest gathering with 35 resident participants.',
    participants: 35,
    artworkKey: 'harvest-day',
    imageSrc: '/assets/activities/gallery-harvest.png',
  },
  {
    id: 'gal-3',
    code: 'G3',
    shortCaption: 'Recycling Drive',
    category: 'recycling',
    categoryLabel: 'RECYCLING',
    dateLabel: '18 Oct 2026',
    title: 'Weekend E-Waste Sorting Drive',
    summary:
      'Sorted 180 kg of household electronics, batteries and recyclable plastics at the Recycling Point.',
    participants: 42,
    artworkKey: 'recycling-drive',
    imageSrc: '/assets/activities/gallery-recycling.png',
  },
  {
    id: 'gal-4',
    code: 'G4',
    shortCaption: 'Tree Planting',
    category: 'community',
    categoryLabel: 'COMMUNITY',
    dateLabel: '19 Oct 2026',
    title: 'Neighbourhood Tree Planting',
    summary:
      'Planted 20 shade saplings along the north playground walkway with families and youth.',
    participants: 30,
    artworkKey: 'tree-planting',
    imageSrc: '/assets/activities/gallery-planting.png',
  },
];

export function joinSandboxActivity(activities, activityId) {
  if (!Array.isArray(activities)) return [];
  return activities.map(activity => {
    if (activity.id !== activityId) return activity;
    if (activity.joined) return activity;
    return {
      ...activity,
      joined: true,
      participantCount: activity.participantCount + 1,
    };
  });
}

export function leaveSandboxActivity(activities, activityId) {
  if (!Array.isArray(activities)) return [];
  return activities.map(activity => {
    if (activity.id !== activityId) return activity;
    if (!activity.joined) return activity;
    return {
      ...activity,
      joined: false,
      participantCount: Math.max(0, activity.participantCount - 1),
    };
  });
}

export function toggleJoinActivity(activities, activityId) {
  const target = Array.isArray(activities)
    ? activities.find(item => item.id === activityId)
    : null;
  if (!target) return activities || [];
  return target.joined
    ? leaveSandboxActivity(activities, activityId)
    : joinSandboxActivity(activities, activityId);
}

export function filterSandboxActivities(activities, filter = 'all') {
  if (!Array.isArray(activities)) return [];
  const normalized = String(filter || 'all').toLowerCase();
  if (normalized === 'community') {
    return activities.filter(item => item.category === 'community');
  }
  if (normalized === 'recycling') {
    return activities.filter(item => item.category === 'recycling');
  }
  if (normalized === 'joined') {
    return activities.filter(item => Boolean(item.joined));
  }
  return activities;
}

export function loadSandboxActivities() {
  try {
    if (typeof localStorage === 'undefined') {
      return INITIAL_SANDBOX_ACTIVITIES;
    }
    const raw = localStorage.getItem(ACTIVITIES_SANDBOX_STORAGE_KEY);
    if (!raw) return INITIAL_SANDBOX_ACTIVITIES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : INITIAL_SANDBOX_ACTIVITIES;
  } catch {
    return INITIAL_SANDBOX_ACTIVITIES;
  }
}

export function saveSandboxActivities(activities) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(
      ACTIVITIES_SANDBOX_STORAGE_KEY,
      JSON.stringify(activities)
    );
  } catch {
    // Ignore storage quota errors in sandbox
  }
}

export function resetSandboxActivities() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(ACTIVITIES_SANDBOX_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
  return INITIAL_SANDBOX_ACTIVITIES;
}

export const loadActivitiesSandboxState = loadSandboxActivities;
export const saveActivitiesSandboxState = saveSandboxActivities;
export const resetActivitiesSandboxState = resetSandboxActivities;
