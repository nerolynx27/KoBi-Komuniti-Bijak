export const uiText = {
  demo: 'Demo mode', sample: 'Sample data', saved: 'Saved on this browser',
  cancel: 'Cancel', close: 'Close', retry: 'Retry storage', reset: 'Reset demo',
  closeSheet: 'Close sheet', saving: 'Saving…', resetting: 'Resetting…',
  storageTitle: 'Local storage needs attention',
  resetTitle: 'Reset demo?',
  resetBody: 'This replaces the local reports, action history, activities, participation, world layout, demo profiles and preferences with the original samples. It affects only this browser. This cannot be undone.',
  resetSuccess: 'Demo reset. Original samples restored on this browser.',
  previewOnly: 'Preview only — image will not remain after reload.',
  previewUnavailable: 'Photo preview is no longer available after reload.',
};
export const storageMessages = {
  write: 'Changes were not saved. Browser storage may be full or blocked. Retry to save the pending change, or confirm Reset demo to restore samples.',
  unavailable: 'Browser storage is unavailable. Samples are shown for this session only. Retry storage or allow browser storage; nothing has been saved.',
  version: 'This stored demo version is unsupported. Stored data is untouched. Retry after restoring a compatible version, or confirm Reset demo to replace it with samples.',
  invalid: 'Stored demo could not be read. Stored data is untouched; the samples below are a preview. Retry after repairing storage, or confirm Reset demo to replace it.',
};
export const statusLabels = {
  received: { label: 'Received', icon: 'report', tone: 'subtle' },
  in_progress: { label: 'In progress', icon: 'edit', tone: 'context' },
  resolved: { label: 'Resolved', icon: 'check', tone: 'selected' },
  draft: { label: 'Draft', icon: 'edit', tone: 'muted' },
  published: { label: 'Published', icon: 'calendar', tone: 'context' },
  cancelled: { label: 'Cancelled', icon: 'close', tone: 'error' },
  joined: { label: 'Joined', icon: 'check', tone: 'selected' },
  started: { label: 'Started', icon: 'clock', tone: 'muted' },
};
export const navigation = [
  { id: 'map', label: 'Map', icon: 'map' }, { id: 'reports', label: 'Reports', icon: 'report' },
  { id: 'activities', label: 'Activities', icon: 'activity' }, { id: 'profile', label: 'Profile', icon: 'profile' },
];
