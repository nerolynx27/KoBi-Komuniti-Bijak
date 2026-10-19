export function selectParticipation(data, activityId, userId) {
  const users = new Set(data.activity_participants.filter(row => row.activity_id === activityId).map(row => row.user_id));
  return { joined: users.has(userId), participant_count: users.size };
}

// Returns activity records; callers derive participant summaries separately.
export function selectActivities(data, viewer, filter = 'all', now = new Date().toISOString()) {
  const current = Date.parse(now);
  return data.activities.filter(activity => {
    if (viewer?.role !== 'staff' && activity.status === 'draft') return false;
    if (filter === 'joined') return selectParticipation(data, activity.id, viewer?.id).joined;
    if (['community', 'recycling'].includes(filter)) return activity.category === filter;
    if (['draft', 'published', 'cancelled'].includes(filter)) return activity.status === filter;
    return true;
  }).sort((a, b) => {
    const aTime = Date.parse(a.starts_at), bTime = Date.parse(b.starts_at);
    const aFuture = aTime > current, bFuture = bTime > current;
    if (aFuture !== bFuture) return aFuture ? -1 : 1;
    const timeOrder = aFuture ? aTime - bTime : bTime - aTime;
    return timeOrder || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  });
}
