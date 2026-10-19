const error = (message, fields, code = 'VALIDATION_ERROR') => ({ data: null, error: { code, message, fields } });
export const validEmail = value => typeof value === 'string' && value.trim().length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
export function validateAccountForm(values, registration = false) {
  const fields = {};
  if (registration && (typeof values.displayName !== 'string' || values.displayName.trim().length < 2 || values.displayName.trim().length > 60)) fields.displayName = 'Enter a name between 2 and 60 characters.';
  if (!validEmail(values.email)) fields.email = 'Enter a valid email address.';
  if (!values.password) fields.password = 'Enter a password for this form demonstration.';
  if (registration && values.confirmation !== values.password) fields.confirmation = 'The passwords must match.';
  return fields;
}
export function applyAccountCommand(data, command, { actor }) {
  if (!['profile.prepareResident', 'profile.updateName'].includes(command.type)) return error('This profile action is unavailable.', null, 'UNAVAILABLE');
  const { displayName, email } = command.input;
  if (!actor || !data.profiles.some(profile => profile.id === actor.id)) return error('Choose a demo view first.', null, 'UNAUTHENTICATED');
  const current = data.profiles.find(profile => profile.id === actor.id);
  if (current.role !== actor.role || current.township_id !== data.township.id) return error('Use the matching demo view for this profile.', null, 'FORBIDDEN');
  if (command.type === 'profile.prepareResident' && actor.role !== 'resident') return error('Switch to the resident demo to prepare its profile.', null, 'FORBIDDEN');
  const fields = {};
  if (typeof displayName !== 'string' || displayName.trim().length < 2 || displayName.trim().length > 60) fields.displayName = 'Enter a name between 2 and 60 characters.';
  if (command.type === 'profile.prepareResident' && !validEmail(email)) fields.email = 'Enter a valid email address.';
  if (Object.keys(fields).length) return error('Check the highlighted fields.', fields);
  const profile = data.profiles.find(row => row.id === actor.id);
  const updated = { ...profile, display_name: displayName.trim(), ...(command.type === 'profile.prepareResident' ? { email: email.trim() } : {}) };
  return { data: { nextData: { ...data, profiles: data.profiles.map(row => row.id === updated.id ? updated : row) }, result: updated, entityId: updated.id, changed: JSON.stringify(updated) !== JSON.stringify(profile) }, error: null };
}
