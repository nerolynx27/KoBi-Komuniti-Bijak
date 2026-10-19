const failure = (code, message, fields) => ({ data: null, error: { code, message, ...(fields ? { fields } : {}) } });
const success = (nextData, result, changed = true) => ({ data: { nextData, result, entityId: result.id, changed }, error: null });
const validId = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 255 && !/^(blob:|data:)/i.test(value);
const metadataKeys = ['id', 'kind', 'file_name', 'mime_type', 'size_bytes'];
const sameMetadata = (left, right) => metadataKeys.every(key => left?.[key] === right?.[key]);
const pathFor = attachment => attachment ? `demo-attachment:${attachment.id}` : null;
const hasOnly = (input, keys) => input && typeof input === 'object' && !Array.isArray(input) && Object.keys(input).every(key => keys.includes(key));

function checkAttachment(data, attachment, kind, context, requireFile) {
  if (attachment == null) return { error: null, attachments: data.attachments };
  if (!hasOnly(attachment, metadataKeys) || Object.keys(attachment).length !== metadataKeys.length || !validId(attachment.id) || !validId(attachment.file_name) || /base64,/i.test(attachment.file_name) || attachment.kind !== kind || !['image/jpeg', 'image/png', 'image/webp'].includes(attachment.mime_type) || !Number.isInteger(attachment.size_bytes) || attachment.size_bytes < 1 || attachment.size_bytes > 5000000) {
    return failure('VALIDATION_ERROR', 'Choose a valid JPEG, PNG or WebP image between 1 and 5,000,000 bytes.', { attachment: 'Choose a valid image.' });
  }
  const existing = data.attachments.find(row => row.id === attachment.id);
  if (existing && !sameMetadata(existing, attachment)) return failure('CONFLICT', 'This image ID already belongs to another image.');
  if (requireFile) {
    const file = context.resolveAttachment?.(attachment.id);
    if (typeof globalThis.File !== 'function' || !(file instanceof globalThis.File) || file.name !== attachment.file_name || file.type !== attachment.mime_type || file.size !== attachment.size_bytes) return failure('VALIDATION_ERROR', 'Select this image again before saving.', { attachment: 'The selected image is unavailable or does not match.' });
  }
  const metadata = Object.fromEntries(metadataKeys.map(key => [key, attachment[key]]));
  return { error: null, attachments: existing ? data.attachments : [...data.attachments, metadata] };
}

export function applyComplaintCommand(data, command, context) {
  const { type, input = {} } = command;
  if (!['complaints.create', 'complaints.transition'].includes(type)) return failure('UNAVAILABLE', 'This report action is unavailable.');
  const role = type === 'complaints.create' ? 'resident' : 'staff';
  const actor = context.actor;
  const profile = data.profiles.find(row => row.id === actor?.id);
  if (!profile || profile.role !== role || actor.role !== role || profile.township_id !== data.township.id) return failure('FORBIDDEN', `Switch to the ${role === 'staff' ? 'SDP' : 'resident'} demo view to perform this action.`);
  const keys = type === 'complaints.create' ? ['id', 'facilityId', 'description', 'attachment'] : ['id', 'expectedVersion', 'nextStatus', 'note', 'updateId', 'attachment'];
  if (!hasOnly(input, keys) || !validId(input.id)) return failure('VALIDATION_ERROR', 'The report action contains invalid fields.');
  if (type === 'complaints.create') {
    const description = typeof input.description === 'string' ? input.description.trim() : '';
    if (description.length < 10 || description.length > 1000) return failure('VALIDATION_ERROR', 'Describe the issue using 10–1000 characters.', { description: 'Use 10–1000 characters.' });
    const facility = data.facilities.find(row => row.id === input.facilityId);
    if (!facility || !facility.reportable || facility.township_id !== data.township.id) return failure('VALIDATION_ERROR', 'Choose a reportable facility in this neighbourhood.', { facilityId: 'Choose an available facility.' });
    const existing = data.complaints.find(row => row.id === input.id);
    const attachmentCheck = checkAttachment(data, input.attachment, 'report', context, !existing);
    if (attachmentCheck.error) return attachmentCheck;
    if (existing) {
      if (existing.resident_id !== profile.id || existing.facility_id !== input.facilityId || existing.description !== description || existing.photo_path !== pathFor(input.attachment)) return failure('CONFLICT', 'This report ID already belongs to a different report.');
      return success(data, existing, false);
    }
    if (!validId(command.operationId)) return failure('VALIDATION_ERROR', 'A stable report operation ID is required.');
    const updateId = `${command.operationId}-received`;
    if (data.complaint_updates.some(row => row.id === updateId)) return failure('CONFLICT', 'This report operation already belongs to another report.');
    const report = { id: input.id, facility_id: facility.id, resident_id: profile.id, description, photo_path: pathFor(input.attachment), status: 'received', version: 1, created_at: context.timestamp, updated_at: context.timestamp };
    const update = { id: updateId, complaint_id: report.id, actor_id: profile.id, status: 'received', note: 'Report received.', evidence_path: null, created_at: context.timestamp };
    return success({ ...data, complaints: [...data.complaints, report], complaint_updates: [...data.complaint_updates, update], attachments: attachmentCheck.attachments }, report);
  }
  const report = data.complaints.find(row => row.id === input.id);
  if (!report) return failure('NOT_FOUND', 'This report could not be found.');
  const facility = data.facilities.find(row => row.id === report.facility_id);
  if (!facility || facility.township_id !== data.township.id || !facility.reportable) return failure('FORBIDDEN', 'This report is outside the pilot neighbourhood.');
  const note = typeof input.note === 'string' ? input.note.trim() : '';
  if (note.length < 5 || note.length > 1000) return failure('VALIDATION_ERROR', 'Add an action note using 5–1000 characters.', { note: 'Use 5–1000 characters.' });
  if (!validId(input.updateId) || !Number.isInteger(input.expectedVersion) || input.expectedVersion < 1 || !['in_progress', 'resolved'].includes(input.nextStatus)) return failure('VALIDATION_ERROR', 'Choose a valid report action and version.');
  if (input.nextStatus === 'resolved' && !input.attachment) return failure('VALIDATION_ERROR', 'Select an evidence image before resolving this report.', { attachment: 'Resolution evidence is required.' });
  const existing = data.complaint_updates.find(row => row.id === input.updateId);
  const attachmentCheck = checkAttachment(data, input.attachment, 'resolution', context, !existing);
  if (attachmentCheck.error) return attachmentCheck;
  if (existing) {
    if (existing.complaint_id !== report.id || existing.actor_id !== profile.id || existing.status !== input.nextStatus || existing.note !== note || existing.evidence_path !== pathFor(input.attachment)) return failure('CONFLICT', 'This action ID already belongs to a different update.');
    return success(data, report, false);
  }
  if (report.version !== input.expectedVersion) return failure('CONFLICT', 'This report changed. Reload the report before saving your action.');
  const nextStatus = report.status === 'received' ? 'in_progress' : report.status === 'in_progress' ? 'resolved' : null;
  if (nextStatus !== input.nextStatus) return failure('VALIDATION_ERROR', 'Reports must move from Received to Work in progress to Resolved.');
  const nextReport = { ...report, status: input.nextStatus, version: report.version + 1, updated_at: context.timestamp };
  const update = { id: input.updateId, complaint_id: report.id, actor_id: profile.id, status: input.nextStatus, note, evidence_path: pathFor(input.attachment), created_at: context.timestamp };
  return success({ ...data, complaints: data.complaints.map(row => row.id === report.id ? nextReport : row), complaint_updates: [...data.complaint_updates, update], attachments: attachmentCheck.attachments }, nextReport);
}
