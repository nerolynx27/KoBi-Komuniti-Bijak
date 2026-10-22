// Single source of truth for all 11 slides of the KoBi Township of Tomorrow presentation
// Preserves 100% of verbatim content, speaker notes, and integrates official Sime Darby Property hackathon sections.

export const SLIDE_METADATA = {
  title: 'KoBi — Komuniti Bijak',
  subtitle: 'Smarter way to care for our neighbourhood',
  hackathon: 'Sime Darby Property University Hackathon 2026',
  initiative: 'Township of Tomorrow: From Blueprints to Reality',
  university: 'Universiti Tenaga Nasional (UNITEN) — The Energy University',
  team: {
    name: 'Black Eagle',
    institution: 'Universiti Tenaga Nasional',
    leader: 'Project Lead',
    members: '3–5 Student Innovators',
    contact: 'team@kobi-township.my'
  }
};

export const SLIDES_DATA = [
  {
    id: 1,
    slug: 'cover',
    sdpSection: 'TITLE & INITIATIVE',
    title: 'KoBi',
    tagline: 'SMARTER WAY TO CARE FOR OUR NEIGHBOURHOOD',
    notes: `[Pause for a moment to connect with your audience.]

Today, let's explore a smarter way to care for our neighborhoods. At the heart of this concept is KoBi, an innovative platform designed to enhance community living.

KoBi is not just an app; it's a bridge that connects residents with their surroundings. It empowers communities to take charge, report issues, and stay informed about local developments and activities.

[Gesture to emphasize connection and empowerment.]

Imagine being able to effortlessly report a streetlight outage or a pothole, all while receiving timely updates on the progress of your report. KoBi also brings community events right to your fingertips, ensuring you never miss out on any local happenings.

[Pause briefly to let the audience absorb the information.]

With KoBi, caring for our neighborhoods becomes a collective effort. It's about making our shared spaces better and more inclusive for everyone.

[Smile warmly to engage your audience.]`,
    assets: {
      bg: '/assets/slides/aerial-neighborhood.jpg',
      badge: '/assets/brand/icon only.png',
      uniten: '/assets/slides/uniten-logo.png'
    }
  },
  {
    id: 2,
    slug: 'problems-and-objectives',
    sdpSection: '1. THE PROBLEM & OBJECTIVES',
    sectionNumber: 1,
    headerLeft: 'PROBLEMS',
    headerRight: 'OBJECTIVES',
    pairs: [
      {
        num: 1,
        problemTitle: 'Difficult to Locate Facilities',
        problemDesc: 'Residents may struggle to identify the exact location of a faulty facility.',
        objective: 'Make reporting easier with a map, short description and optional photo.',
        icon: 'location'
      },
      {
        num: 2,
        problemTitle: 'No Clear Progress Updates',
        problemDesc: 'Residents may not know whether their reports have been received or resolved.',
        objective: 'Keep progress updates, staff notes and evidence of completed repairs in one place.',
        icon: 'progress'
      },
      {
        num: 3,
        problemTitle: 'Finding Community Activities',
        problemDesc: 'Residents may miss local events and recycling activities due to scattered announcements.',
        objective: 'Bring announcements and the option to join or cancel participation into the same app.',
        icon: 'calendar'
      }
    ],
    assets: {
      bgRight: '/assets/slides/aerial-neighborhood.jpg',
      uniten: '/assets/slides/uniten-logo.png'
    }
  },
  {
    id: 3,
    slug: 'target-user',
    sdpSection: '2. TARGET USER',
    sectionNumber: 2,
    header: 'WHO IS IT FOR?',
    personas: [
      {
        key: 'residents',
        title: 'Residents',
        desc: 'Report issues, track repairs and join community activities.',
        photo: '/assets/slides/crowd-residents.png',
        icon: '/assets/slides/community-icon.png',
        tag: 'Civic Community'
      },
      {
        key: 'sdp',
        title: 'Sime Darby Property',
        desc: 'Manage facility reports, update progress and organise activities.',
        photo: '/assets/slides/sime-darby-building.png',
        icon: '/assets/slides/sime-darby-logo.png',
        tag: 'Township Operations'
      }
    ],
    assets: {
      uniten: '/assets/slides/uniten-logo.png'
    }
  },
  {
    id: 4,
    slug: 'solution-overview',
    sdpSection: '3. YOUR SOLUTION',
    sectionNumber: 3,
    header: 'CORE CAPABILITIES',
    pillars: [
      {
        num: '01',
        title: 'Report an Issue',
        slug: 'report',
        summary: 'Pinpoint facility on 2D map + instant submission',
        surface: 'gold',
        icon: 'report'
      },
      {
        num: '02',
        title: 'Track Repair Progress',
        slug: 'track',
        summary: 'Transparent audit timeline + pixel worker animation',
        surface: 'vanilla',
        icon: 'progress'
      },
      {
        num: '03',
        title: 'Discover AND \nJoin Activities',
        slug: 'activities',
        summary: 'Neighbourhood clean-ups, recycling and civic events',
        surface: 'wine',
        icon: 'activity'
      }
    ],
    assets: {
      uniten: '/assets/slides/uniten-logo.png'
    }
  },
  {
    id: 5,
    slug: 'pillar-1-report',
    sdpSection: '5. HOW IT WORKS — PILLAR 1',
    sectionNumber: 5,
    pillarIndex: 1,
    activeTitle: 'Report an Issue',
    stamp: 'INTERFACE',
    bullets: [
      'Select a facility on the neighbourhood map.',
      'Describe the problem and upload a photo (optional).',
      'Submit the report to SDP and track it in your report list.'
    ],
    mockup: {
      screenId: 'UI-05',
      screenName: 'Report a problem',
      facility: 'LAMP-001 (Streetlight)',
      state: 'Normal → Reported',
      actionLabel: 'Send report'
    },
    assets: {
      uniten: '/assets/slides/uniten-logo.png'
    }
  },
  {
    id: 6,
    slug: 'pillar-2-track',
    sdpSection: '5. HOW IT WORKS — PILLAR 2',
    sectionNumber: 5,
    pillarIndex: 2,
    activeTitle: 'Track Repair Progress',
    stamp: 'INTERFACE',
    bullets: [
      'SDP updates the status: \n   Received → In Progress → Resolved.',
      'Staff add updates and photos as proof of completion.',
      'A pixel worker animation shows repair progress based on staff updates, not real-time tracking.'
    ],
    mockup: {
      screenId: 'UI-07 / UI-15',
      screenName: 'Report details & SDP action',
      statuses: ['Received', 'In progress', 'Resolved'],
      workerAnimation: 'Worker repairing LAMP-001'
    },
    assets: {
      uniten: '/assets/slides/uniten-logo.png'
    }
  },
  {
    id: 7,
    slug: 'pillar-3-activities',
    sdpSection: '5. HOW IT WORKS — PILLAR 3',
    sectionNumber: 5,
    pillarIndex: 3,
    activeTitle: 'Discover AND \nJoin Activities',
    stamp: 'INTERFACE',
    bullets: [
      'Explore community activities through a list or map.',
      'View event details and tap Join or Cancel.',
      'Activities include clean-ups, recycling events and community programmes.'
    ],
    mockup: {
      screenId: 'UI-08 / UI-09',
      screenName: 'Activities & Participation',
      categories: ['All', 'Community', 'Recycling', 'Joined'],
      actionLabel: 'Join activity'
    },
    assets: {
      uniten: '/assets/slides/uniten-logo.png'
    }
  },
  {
    id: 8,
    slug: 'differentiation-and-impact',
    sdpSection: '4. INNOVATION & 6. IMPACT',
    sectionNumber: 4,
    leftHeader: 'WHAT MAKES KoBi DIFFERENT?',
    rightHeader: 'The impact we want to achieve',
    differentiators: [
      {
        title: 'THE MAP MAKES IT EASY',
        desc: 'Residents can tap a facility on the map to report a problem or discover community activities.',
        icon: 'map'
      },
      {
        title: 'PROGRESS YOU CAN SEE',
        desc: 'Repair updates appear on the map, showing facility changes through a pixel worker.',
        icon: 'eye'
      },
      {
        title: 'FACILITY CARE + COMMUNITY LIFE',
        desc: 'KoBi helps residents care for shared facilities, discover activities and build a stronger community.',
        icon: 'leaf'
      }
    ],
    impacts: [
      {
        stakeholder: 'RESIDENTS',
        desc: 'Easier reporting and activity discovery.',
        icon: 'profile'
      },
      {
        stakeholder: 'SIME DARBY PROPERTY',
        desc: 'Better report organisation and repair tracking.',
        icon: 'settings'
      },
      {
        stakeholder: 'COMMUNITY AND ENVIRONMENT',
        desc: 'Stronger community connections and greater awareness of recycling.',
        icon: 'recycle'
      }
    ],
    assets: {
      uniten: '/assets/slides/uniten-logo.png'
    }
  },
  {
    id: 9,
    slug: 'feasibility-and-implementation',
    sdpSection: '7. FEASIBILITY & 8. IMPLEMENTATION',
    sectionNumber: 7,
    topHeader: 'WHAT THE FIRST VERSION INCLUDE?',
    bottomHeader: 'HOW WE MEASURE SUCCESS?',
    firstVersionFeatures: [
      'Problem reporting with photos',
      'Repair status updates',
      'Pixel repair worker',
      'Community and recycling events',
      'Join or cancel activities'
    ],
    successMetrics: [
      'Can residents submit reports without help?',
      'Can they understand repair progress?',
      'Can they find and register for activities easily?',
      'How complete are reports, and how long do repairs take?'
    ],
    assets: {
      uniten: '/assets/slides/uniten-logo.png'
    }
  },
  {
    id: 10,
    slug: 'main-goal',
    sdpSection: 'WHY YOUR TEAM SHOULD WIN',
    sectionNumber: 8,
    header: 'WHAT’S OUR MAIN GOAL?',
    manifesto: 'To make neighbourhood care and community participation part of everyday life long after the keys are handed over.',
    assets: {
      bg: '/assets/slides/township-entrance.png',
      uniten: '/assets/slides/uniten-logo.png'
    }
  },
  {
    id: 11,
    slug: 'closing',
    sdpSection: 'PRESENTATION CLOSING & Q&A',
    header: 'THANK YOU',
    tagline: 'KoBi — Komuniti Bijak for Township of Tomorrow',
    assets: {
      bgRight: '/assets/slides/township-render.png',
      badge: '/assets/brand/icon only.png',
      uniten: '/assets/slides/uniten-logo.png'
    }
  }
];
