const offset = 8 * 60 * 60 * 1000;

// Native inputs always mean Malaysia wall time, irrespective of host timezone.
export function parseMalaysiaDateTime(date, time) {
  const invalid = () => ({ data: null, error: { code: 'VALIDATION_ERROR', message: 'Enter a valid Malaysia date and time.' } });
  if (typeof date !== 'string' || typeof time !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return invalid();
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1 || hour > 23 || minute > 59) return invalid();
  const wall = new Date(0);
  wall.setUTCFullYear(year, month - 1, day);
  wall.setUTCHours(hour, minute, 0, 0);
  if (wall.getUTCFullYear() !== year || wall.getUTCMonth() !== month - 1 || wall.getUTCDate() !== day) return invalid();
  return { data: new Date(wall.getTime() - offset).toISOString(), error: null };
}

export function toMalaysiaDateTimeFields(utc) {
  const instant = typeof utc === 'string' ? Date.parse(utc) : NaN;
  if (!Number.isFinite(instant)) return { date: '', time: '' };
  const wall = new Date(instant + offset).toISOString();
  return { date: wall.slice(0, 10), time: wall.slice(11, 16) };
}

export function formatMalaysiaDateTime(utc) {
  if (typeof utc !== 'string' || !Number.isFinite(Date.parse(utc))) return '';
  return new Intl.DateTimeFormat('en-MY', { timeZone: 'Asia/Kuala_Lumpur', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(utc));
}
