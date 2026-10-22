import { useEffect, useState } from 'react';
import { selectActivities, selectParticipation } from './activitySelectors.js';
import { NoticeBoard } from './components/NoticeBoard.jsx';
import { PolaroidGalleryCarousel } from './components/PolaroidGalleryCarousel.jsx';
import { ActivityDetailModal } from './components/ActivityDetailModal.jsx';
import { GalleryPreviewModal } from './components/GalleryPreviewModal.jsx';
import { useCommandForm } from '../../app/useCommandForm.js';
import { newDemoId } from '../../lib/demoStore.js';

export const DEFAULT_GALLERY_ITEMS = [
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

const FALLBACK_FLYERS = [
  {
    id: 'act-sample-ewaste',
    category: 'recycling',
    categoryLabel: 'RECYCLING',
    noteTheme: 'sand-cherry',
    title: 'E-Waste & Plastic Drive',
    dateLabel: '22 NOV 2026',
    timeLabel: '9:00 AM – 1:00 PM · Malaysia time',
    location: 'Recycling Point',
    artworkKey: 'ewaste-bins',
    baseParticipantCount: 32,
    tiltDeg: 1.5,
    description:
      'Bring household batteries, small electronics, chargers, and clean sorted plastics for weighing and certified township recycling collection.',
    organizer: 'SDP Sustainability Team',
    isStoreActivity: false,
  },
  {
    id: 'act-sample-upcycle',
    category: 'recycling',
    categoryLabel: 'RECYCLING',
    noteTheme: 'vanilla-cherry',
    title: 'Upcycling Craft Workshop',
    dateLabel: '29 NOV 2026',
    timeLabel: '2:30 PM – 5:00 PM · Malaysia time',
    location: 'Community Hall',
    artworkKey: 'upcycling-craft',
    baseParticipantCount: 14,
    tiltDeg: -2,
    description:
      'Hands-on family workshop turning clean glass jars, fabric offcuts, and cardboard cartons into durable desk organizers and balcony planters.',
    organizer: 'Eco Makers Collective',
    isStoreActivity: false,
  },
  {
    id: 'act-sample-taichi',
    category: 'community',
    categoryLabel: 'COMMUNITY',
    noteTheme: 'gold',
    title: 'Morning Tai Chi Session',
    dateLabel: '05 DEC 2026',
    timeLabel: '7:30 AM – 9:00 AM · Malaysia time',
    location: 'Central Park Pavilion',
    artworkKey: 'tai-chi',
    baseParticipantCount: 21,
    tiltDeg: 2,
    description:
      'Gentle outdoor breathing, balance, and mobility routine open to all ages, followed by warm herbal tea at the Central Park Pavilion.',
    organizer: 'Elmina Wellness Circle',
    isStoreActivity: false,
  },
];

const TILTS = [-3, 1.5, -2, 2];

function formatDateLabel(isoString) {
  if (!isoString) return '07 NOV 2026';
  try {
    const d = new Date(isoString);
    if (!Number.isFinite(d.getTime())) return isoString;
    return d.toLocaleDateString('en-GB', {
      timeZone: 'Asia/Kuala_Lumpur',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).toUpperCase();
  } catch {
    return '07 NOV 2026';
  }
}

function formatTimeRange(startsAt, endsAt) {
  if (!startsAt) return '9:00 AM – 11:00 AM · Malaysia time';
  try {
    const formatTime = iso =>
      new Intl.DateTimeFormat('en-MY', {
        timeZone: 'Asia/Kuala_Lumpur',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(new Date(iso));
    const startStr = formatTime(startsAt);
    const endStr = endsAt ? formatTime(endsAt) : '';
    return endStr ? `${startStr} – ${endStr} · Malaysia time` : `${startStr} · Malaysia time`;
  } catch {
    return 'Malaysia time';
  }
}

function enrichStoreActivity(raw, data, actor, index) {
  const participation = selectParticipation(data, raw.id, actor?.id);
  const facility = data.facilities?.find(f => f.id === raw.facility_id);
  const location = facility?.name || 'Community Garden';
  const category = raw.category === 'recycling' ? 'recycling' : 'community';
  const categoryLabel = category === 'recycling' ? 'RECYCLING' : 'COMMUNITY';
  const noteTheme =
    category === 'recycling'
      ? index % 2 === 0
        ? 'sand-cherry'
        : 'vanilla-cherry'
      : 'gold';

  let artworkKey = 'garden-harvest';
  const titleLower = (raw.title || '').toLowerCase();
  if (
    titleLower.includes('garden') ||
    titleLower.includes('green') ||
    titleLower.includes('harvest')
  ) {
    artworkKey = 'garden-harvest';
  } else if (
    titleLower.includes('waste') ||
    titleLower.includes('recycle') ||
    titleLower.includes('recycling')
  ) {
    artworkKey = 'ewaste-bins';
  } else if (titleLower.includes('craft') || titleLower.includes('upcycle')) {
    artworkKey = 'upcycling-craft';
  } else if (
    titleLower.includes('tai') ||
    titleLower.includes('chi') ||
    titleLower.includes('morning')
  ) {
    artworkKey = 'tai-chi';
  } else if (category === 'recycling') {
    artworkKey = 'ewaste-bins';
  }

  return {
    id: raw.id,
    title: raw.title,
    category,
    categoryLabel,
    noteTheme,
    dateLabel: formatDateLabel(raw.starts_at),
    timeLabel: formatTimeRange(raw.starts_at, raw.ends_at),
    location,
    artworkKey,
    participantCount: participation.participant_count,
    joined: participation.joined,
    tiltDeg: TILTS[index % TILTS.length],
    description: raw.description,
    organizer: 'Township Committee',
    isStoreActivity: true,
  };
}

export function ActivitiesPage(props) {
  return <ResidentActivitiesPage {...props} />;
}

function ResidentActivitiesPage({
  data,
  actor,
  store,
  snapshot,
  filters,
  setFilter,
  notify,
  route,
  navigate,
  registerGuard,
}) {
  const activeFilter = filters?.activities || 'all';

  const [selectedActivityId, setSelectedActivityId] = useState(route?.id || null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
  const [fallbackJoined, setFallbackJoined] = useState({});

  // Command form integration for store command recovery
  const form = useCommandForm({
    store,
    snapshot,
    registerGuard,
    dirty: ['activities.join', 'activities.leave'].includes(
      snapshot?.pendingOperation?.type
    ),
    onSuccess: last => {
      notify?.(
        last?.type === 'activities.join'
          ? 'Joined activity. Saved on this browser.'
          : 'Left activity. Saved on this browser.'
      );
    },
  });

  // Deep-link support for route.id
  useEffect(() => {
    if (route?.id) {
      setSelectedActivityId(route.id);
    }
  }, [route?.id]);

  // Read all published activities from the real store
  const storeRows = selectActivities(
    data,
    { ...actor, role: 'resident' },
    'all'
  );
  const enrichedStoreRows = storeRows.map((raw, idx) =>
    enrichStoreActivity(raw, data, actor, idx)
  );

  // Append fallback display flyers for unpopulated slots up to 4 total
  const slotsRemaining = Math.max(0, 4 - enrichedStoreRows.length);
  const fallbackRows = FALLBACK_FLYERS.slice(0, slotsRemaining).map(
    (flyer, idx) => {
      const isJoined = Boolean(fallbackJoined[flyer.id]);
      const participantCount =
        flyer.baseParticipantCount + (isJoined ? 1 : 0);
      return {
        ...flyer,
        joined: isJoined,
        participantCount,
        tiltDeg: TILTS[(enrichedStoreRows.length + idx) % TILTS.length],
      };
    }
  );

  const allActivities = [...enrichedStoreRows, ...fallbackRows];

  // Apply active category or joined filter
  const displayedActivities = allActivities.filter(activity => {
    if (activeFilter === 'community') return activity.category === 'community';
    if (activeFilter === 'recycling') return activity.category === 'recycling';
    if (activeFilter === 'joined') return Boolean(activity.joined);
    return true;
  });

  const activeDetailActivity = selectedActivityId
    ? allActivities.find(a => a.id === selectedActivityId) || null
    : null;

  function handleFilterChange(nextFilter) {
    if (setFilter) {
      setFilter('activities', nextFilter);
    }
  }

  function handleSelectActivity(activity) {
    setSelectedActivityId(activity.id);
  }

  function handleCloseDetailModal() {
    setSelectedActivityId(null);
    if (route?.id && navigate) {
      navigate('activities');
    }
  }

  function handleJoin(activityId) {
    if (data?.activities?.some(a => a.id === activityId)) {
      if (form) {
        form.submit('activities.join', { id: activityId });
      } else if (store?.execute) {
        store.execute({
          operationId: newDemoId(),
          baseRevision: store.getSnapshot?.()?.revision ?? 0,
          type: 'activities.join',
          input: { id: activityId },
        });
      } else if (store?.dispatch) {
        store.dispatch({ type: 'activities.join', input: { id: activityId } });
      }
      notify?.('Joined activity. Saved on this browser.');
    } else {
      setFallbackJoined(prev => ({ ...prev, [activityId]: true }));
      notify?.('Joined activity.');
    }
  }

  function handleLeave(activityId) {
    if (data?.activities?.some(a => a.id === activityId)) {
      if (form) {
        form.submit('activities.leave', { id: activityId });
      } else if (store?.execute) {
        store.execute({
          operationId: newDemoId(),
          baseRevision: store.getSnapshot?.()?.revision ?? 0,
          type: 'activities.leave',
          input: { id: activityId },
        });
      } else if (store?.dispatch) {
        store.dispatch({ type: 'activities.leave', input: { id: activityId } });
      }
      notify?.('Left activity. Saved on this browser.');
    } else {
      setFallbackJoined(prev => ({ ...prev, [activityId]: false }));
      notify?.('Left activity.');
    }
  }

  return (
    <div className="activities-page-bleed" id="activities-view-root">
      {/* 2026 Township Activities Notice Board */}
      <NoticeBoard
        activities={displayedActivities}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        onSelectActivity={handleSelectActivity}
      />

      {/* Hanging Polaroid Gallery Carousel */}
      <PolaroidGalleryCarousel
        items={DEFAULT_GALLERY_ITEMS}
        selectedId={selectedGalleryItem?.id}
        onSelectPolaroid={item => setSelectedGalleryItem(item)}
      />

      {/* Pop-Out Activity Detail Modal */}
      {activeDetailActivity && (
        <ActivityDetailModal
          activity={activeDetailActivity}
          onClose={handleCloseDetailModal}
          onJoin={handleJoin}
          onLeave={handleLeave}
        />
      )}

      {/* Set 1 Gallery Preview Modal */}
      {selectedGalleryItem && (
        <GalleryPreviewModal
          item={selectedGalleryItem}
          onClose={() => setSelectedGalleryItem(null)}
        />
      )}
    </div>
  );
}
