import { createSampleData } from './demoSamples.js';
import { applyAccountCommand } from '../features/account/accountCommands.js';
import { applyComplaintCommand } from '../features/complaints/complaintCommands.js';
import { applyActivityCommand } from '../features/activities/activityCommands.js';
import { applyLayoutCommand } from '../features/world-editor/layoutCommands.js';

export const commandError = (code, message, fields) => ({ data: null, error: { code, message, ...(fields ? { fields } : {}) } });
export const commandSuccess = (nextData, result, entityId = null, changed = true) => ({ data: { nextData, result, entityId, changed }, error: null });
export function applyDemoCommand(data, command, context) {
  const { type, input = {} } = command;
  if (type.startsWith('profile.')) return applyAccountCommand(data, command, context);
  if (type.startsWith('complaints.')) return applyComplaintCommand(data, command, context);
  if (type.startsWith('activities.')) return applyActivityCommand(data, command, context);
  if (type.startsWith('world.')) return applyLayoutCommand(data, command, context);
  if (type === 'demo.reset') return commandSuccess(createSampleData(context.timestamp), { reset: true });
  if (type === 'preferences.setRememberWorkspace') {
    if (typeof input.rememberWorkspace !== 'boolean') return commandError('VALIDATION_ERROR', 'Choose a valid workspace preference.');
    const preferences = { ...data.preferences, rememberWorkspace: input.rememberWorkspace, workspace: input.rememberWorkspace ? data.preferences.workspace : 'resident' };
    return commandSuccess({ ...data, preferences }, preferences, null, JSON.stringify(preferences) !== JSON.stringify(data.preferences));
  }
  if (type === 'preferences.setWorkspace') {
    if (!['resident', 'sdp'].includes(input.workspace)) return commandError('VALIDATION_ERROR', 'Choose a valid demo workspace.');
    const preferences = { ...data.preferences, workspace: input.workspace };
    return commandSuccess({ ...data, preferences }, preferences, null, preferences.workspace !== data.preferences.workspace);
  }
  return commandError('UNAVAILABLE', 'This demo action is unavailable.');
}
