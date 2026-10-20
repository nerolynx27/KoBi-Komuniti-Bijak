import { test, expect } from '@playwright/test';
import { createSampleData } from '../../src/lib/demoSamples.js';
import { openPart3, PART3_NOW, readPart3Bytes, readPart3Envelope } from '../helpers/part3.js';
import { button, link, commit, coordinates, fillActivity } from '../helpers/shellActions.js';

const key = 'kobi.demo.v1';

test('repeated activation commits report transition publish join placement and removal once', async ({ page }) => {
  const twice = control => control.evaluate(el => { el.click(); el.click(); });
  await openPart3(page, 'reports/new');
  await page.getByLabel(/^Facility/).selectOption('hall-01');
  await page.getByLabel(/^Description/).fill('Rapid activation must create this report only once.');
  let result = await commit(page, () => twice(button(page, 'Send report')));
  expect(result.data.complaints).toHaveLength(3);
  const report = result.data.complaints.at(-1);
  await page.goto(`/#sdp/reports/${report.id}`);
  await page.getByLabel(/^Action note/).fill('Rapid activation begins this inspection once.');
  result = await commit(page, () => twice(button(page, 'Start work')));
  expect(result.data.complaint_updates.filter(row => row.complaint_id === report.id)).toHaveLength(2);
  await page.goto('/#sdp/activities/new'); await fillActivity(page, 'Rapid activation activity');
  result = await commit(page, () => twice(button(page, 'Publish activity')));
  expect(result.data.activities).toHaveLength(2);
  const activity = result.data.activities.at(-1);
  await button(page, 'Exit SDP workspace').click();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Activities', exact: true }).click();
  await link(page, activity.title).click();
  result = await commit(page, () => twice(button(page, 'Join activity')));
  expect(result.data.activity_participants.filter(row => row.activity_id === activity.id)).toHaveLength(1);
  await page.goto('/#sdp/world'); await button(page, 'Enter editor').click();
  const before = await readPart3Envelope(page);
  await button(page, 'Add component').click(); await page.getByRole('dialog').getByRole('button', { name: /^Tree/ }).click();
  await coordinates(page, 31, 23);
  result = await commit(page, () => twice(button(page, 'Place component')));
  expect(result.data.layout).toHaveLength(before.data.layout.length + 1);
  const object = result.data.layout.at(-1);
  await button(page, 'Remove').click();
  result = await commit(page, () => twice(page.getByRole('dialog').getByRole('button', { name: 'Remove component', exact: true })));
  expect(result.data.layout).toEqual(before.data.layout);
  expect(result.data.layout.some(row => row.objectId === object.objectId)).toBe(false);
});

test('failed join retried after start remains unjoined', async ({ page }) => {
  const data = createSampleData(PART3_NOW);
  data.activities[0].starts_at = '2026-10-18T01:01:00.000Z';
  data.activities[0].ends_at = '2026-10-18T02:00:00.000Z';
  await openPart3(page, `activities/${data.activities[0].id}`, { data });
  const before = await readPart3Bytes(page);
  await page.evaluate(() => { window.part3SetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  try {
    await page.getByRole('button', { name: 'Join activity', exact: true }).click();
    expect(await readPart3Bytes(page)).toBe(before);
  } finally { await page.evaluate(() => { Storage.prototype.setItem = window.part3SetItem; }); }
  await page.clock.setFixedTime(new Date(data.activities[0].starts_at));
  await page.evaluate(() => { document.dispatchEvent(new Event('visibilitychange')); window.dispatchEvent(new Event('focus')); });
  await page.getByRole('button', { name: 'Retry storage', exact: true }).first().click();
  await expect(page.getByRole('alert').first()).toContainText(/started|closed/i);
  expect(await readPart3Bytes(page)).toBe(before);
  expect((await readPart3Envelope(page)).data.activity_participants).toEqual([]);
  await expect(page.getByText('Joined', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Join activity', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Discard pending change', exact: true }).first().click();
});

test('external write between failed save and retry is never overwritten', async ({ page }) => {
  await openPart3(page, 'reports/new');
  await page.getByLabel(/^Facility/).selectOption('hall-01');
  const description = 'Keep this pending hall inspection report until explicit discard.';
  await page.getByLabel(/^Description/).fill(description);
  const before = await readPart3Envelope(page);
  await page.evaluate(() => { window.part3SetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  try { await page.getByRole('button', { name: 'Send report', exact: true }).click(); }
  finally { await page.evaluate(() => { Storage.prototype.setItem = window.part3SetItem; }); }
  const external = { ...before, revision: before.revision + 1, data: structuredClone(before.data) };
  external.data.profiles[0].display_name = 'Newer external resident';
  const bytes = JSON.stringify(external);
  await page.evaluate(bytes => localStorage.setItem('kobi.demo.v1', bytes), bytes);
  await page.getByRole('button', { name: 'Retry storage', exact: true }).first().click();
  await expect(page.getByRole('alert').first()).toContainText('another tab');
  expect(await readPart3Bytes(page)).toBe(bytes);
  await expect(page.getByLabel(/^Description/)).toHaveValue(description);
  await page.getByRole('button', { name: 'Discard pending change', exact: true }).first().click();
  await page.reload();
  expect(await readPart3Bytes(page)).toBe(bytes);
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Profile', exact: true }).click();
  await expect(page.getByLabel('Display name')).toHaveValue('Newer external resident');
});

test('missing and malformed deep links recover without mutation', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await openPart3(page);
  const before = await readPart3Bytes(page);
  for (const route of ['reports/missing-id', 'activities/missing-id', 'sdp/reports/missing-id', 'sdp/activities/missing-id/edit', '%E0%A4%A', 'unknown/path']) {
    await page.goto(`/#${route}`);
    await expect(page.getByText(/not found|no longer available|unavailable/i).first()).toBeVisible();
    expect(await readPart3Bytes(page)).toBe(before);
    await page.locator('.brand').click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Map');
  }
  expect(errors).toEqual([]);
});

test('empty collections and empty filters retain recovery actions', async ({ page }) => {
  const data = createSampleData(PART3_NOW);
  for (const name of ['complaints', 'complaint_updates', 'activities', 'activity_participants', 'attachments']) data[name] = [];
  await openPart3(page, 'reports', { data });
  const before = await readPart3Bytes(page);
  for (const [route, message, create] of [['activities', 'No activities here yet'], ['sdp/reports', 'No reports here'], ['sdp/activities', 'No activities here yet', 'New activity']]) {
    await page.goto(`/#${route}`);
    await expect(page.getByText(message, { exact: true })).toBeVisible();
    if (create) await expect(page.getByRole('link', { name: create, exact: true })).toBeVisible();
    await page.getByRole('button', { name: /^Refresh/ }).click();
    expect(await readPart3Bytes(page)).toBe(before);
  }
});

test('empty status and Joined filters recover without a write', async ({ page }) => {
  await openPart3(page, 'sdp/reports');
  const before = await readPart3Bytes(page);
  await page.getByRole('button', { name: 'Resolved', exact: true }).click();
  await expect(page.getByText('No reports here', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('.record-row')).toHaveCount(2);
  await page.goto('/#activities');
  await page.getByRole('button', { name: 'Joined', exact: true }).click();
  await expect(page.locator('.record-row')).toHaveCount(0);
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('.record-row')).toHaveCount(1);
  expect(await readPart3Bytes(page)).toBe(before);
});

test('Back restores a remembered bare-URL workspace and its selected demo actor', async ({ page }) => {
  await page.goto('/#map');
  await page.getByRole('button', { name: 'Enter SDP demo workspace', exact: true }).click();
  await page.goto('/'); await page.reload();
  await expect(page.getByRole('heading', { name: 'SDP workspace', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Exit SDP demo workspace', exact: true }).click();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'SDP workspace', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Review reports', exact: true }).click();
  await page.getByRole('link', { name: /^Walkway lamp/ }).click();
  await page.getByLabel(/^Action note/).fill('The restored SDP demo actor starts this inspection.');
  await page.getByRole('button', { name: 'Start work', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mark resolved', exact: true })).toBeVisible();
});

test('pending writes explain and disable refresh until recovery completes', async ({ page }) => {
  await page.goto('/#settings');
  await page.evaluate(() => { window.reviewSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.getByLabel('Remember demo workspace').click();
  await expect(page.getByRole('button', { name: 'Reload saved data', exact: true })).toBeDisabled();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Activities', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Refresh activities', exact: true })).toBeDisabled();
  await expect(page.getByText('Retry or discard the pending change before refreshing.', { exact: true })).toBeVisible();
  await page.evaluate(() => { Storage.prototype.setItem = window.reviewSetItem; });
  await page.getByRole('button', { name: 'Retry storage', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Refresh activities', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Refresh activities', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('clean Back and Forward traverse accepted routes without adding history entries', async ({ page }) => {
  await page.goto('/#map');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await nav.getByRole('link', { name: 'Reports', exact: true }).click();
  await nav.getByRole('link', { name: 'Activities', exact: true }).click();
  const length = await page.evaluate(() => history.length);
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Reports', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Map', exact: true })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('heading', { name: 'Reports', exact: true })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('heading', { name: 'Activities', exact: true })).toBeVisible();
  expect(await page.evaluate(() => history.length)).toBe(length);
});

test('dirty Back cancellation preserves the history destination for the next Back and Forward', async ({ page }) => {
  await page.goto('/#map');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await nav.getByRole('link', { name: 'Reports', exact: true }).click();
  await nav.getByRole('link', { name: 'Profile', exact: true }).click();
  await page.getByLabel('Display name').fill('Do not lose history');
  await page.goBack();
  await page.getByRole('dialog').getByRole('button', { name: 'Keep editing', exact: true }).click();
  await expect(page.getByLabel('Display name')).toHaveValue('Do not lose history');
  await page.goBack();
  await page.getByRole('dialog').getByRole('button', { name: 'Discard changes', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Reports', exact: true })).toBeVisible();
  await page.goBack(); await expect(page.getByRole('heading', { name: 'Map', exact: true })).toBeVisible();
  await page.goForward(); await expect(page.getByRole('heading', { name: 'Reports', exact: true })).toBeVisible();
  await page.goForward(); await expect(page.getByLabel('Display name')).toHaveValue('Alex Tan');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('dirty profile internal navigation and browser hash navigation retain values until discard', async ({ page }) => {
  await page.goto('/#profile');
  await page.getByLabel('Display name').fill('Keep this name');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Reports', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Discard changes?');
  await page.getByRole('button', { name: 'Keep editing', exact: true }).click();
  await expect(page.getByLabel('Display name')).toHaveValue('Keep this name');
  await page.evaluate(() => { location.hash = 'activities'; });
  await expect(page.getByRole('dialog')).toContainText('Discard changes?');
  await page.keyboard.press('Escape');
  await expect(page.getByLabel('Display name')).toHaveValue('Keep this name');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Reports', exact: true }).click();
  await page.getByRole('button', { name: 'Discard changes', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Reports');
});

test('cancelling a failed reset discards that operation before a later global retry', async ({ page }) => {
  await page.goto('/#profile');
  await page.getByLabel('Display name').fill('Retained saved name');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  const saved = await page.evaluate(key => localStorage.getItem(key), key);
  await page.evaluate(() => { window.reviewSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.getByRole('button', { name: 'Reset demo', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Reset demo', exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText('Changes were not saved');
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe(saved);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await page.evaluate(() => { Storage.prototype.setItem = window.reviewSetItem; });
  // A later failed preference owns the global Retry; the cancelled reset must stay discarded.
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.getByLabel('Remember demo workspace').click();
  await page.evaluate(() => { Storage.prototype.setItem = window.reviewSetItem; });
  await page.getByRole('button', { name: 'Retry storage', exact: true }).click();
  await expect(page.getByLabel('Display name')).toHaveValue('Retained saved name');
  expect(JSON.parse(await page.evaluate(key => localStorage.getItem(key), key)).data.profiles[0].display_name).toBe('Retained saved name');
});

test('a failed profile command retains fields and global retry completes the originating form once', async ({ page }) => {
  await page.goto('/#profile');
  await page.getByLabel('Display name').fill('Global retry name');
  await page.evaluate(() => { window.reviewSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByLabel('Display name')).toHaveValue('Global retry name');
  expect(JSON.parse(await page.evaluate(key => localStorage.getItem(key), key)).data.profiles[0].display_name).toBe('Alex Tan');
  await page.evaluate(() => { Storage.prototype.setItem = window.reviewSetItem; });
  await page.getByRole('button', { name: 'Retry storage', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Global retry name', exact: true })).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
  const revision = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).revision, key);
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Map', exact: true }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).revision, key)).toBe(revision);
});

test('a failed Leave confirmation retries its original operation without closing the dialog first', async ({ page }) => {
  await page.goto('/#activities/00000000-0000-4000-8000-000000000031');
  await page.getByRole('button', { name: 'Join activity', exact: true }).click();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).data.activity_participants.length, key)).toBe(1);
  await page.getByRole('button', { name: 'Leave activity', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await page.evaluate(() => { window.reviewSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await dialog.getByRole('button', { name: 'Leave activity', exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText('Changes were not saved');
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).data.activity_participants.length, key)).toBe(1);
  await page.evaluate(() => { Storage.prototype.setItem = window.reviewSetItem; });
  await dialog.getByRole('button', { name: /^(Leave activity|Retry storage)$/ }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Join activity', exact: true })).toBeVisible();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).data.activity_participants.length, key)).toBe(0);
});

test('failed activity cancellation retries inside its confirmation and keeps participants', async ({ page }) => {
  await page.goto('/#activities/00000000-0000-4000-8000-000000000031');
  await page.getByRole('button', { name: 'Join activity', exact: true }).click();
  await page.getByRole('button', { name: 'Enter SDP demo workspace', exact: true }).click();
  await page.goto('/#sdp/activities');
  await page.getByRole('button', { name: 'Cancel activity', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await page.evaluate(() => { window.reviewSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await dialog.getByRole('button', { name: 'Cancel activity', exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText('Changes were not saved');
  await page.evaluate(() => { Storage.prototype.setItem = window.reviewSetItem; });
  await dialog.getByRole('button', { name: 'Retry storage', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).data, key);
  expect(saved.activities[0].status).toBe('cancelled');
  expect(saved.activity_participants).toHaveLength(1);
});

test('a failed reset retry retains the original operation time', async ({ page }) => {
  await page.goto('/#profile');
  const operationTime = Date.parse('2035-02-01T00:00:00Z');
  await page.evaluate(now => { Date.now = () => now; window.reviewSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; }, operationTime);
  await page.getByRole('button', { name: 'Reset demo', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Reset demo', exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText('Changes were not saved');
  await page.evaluate(now => { Date.now = () => now; Storage.prototype.setItem = window.reviewSetItem; }, operationTime + 2 * 86400000);
  await dialog.getByRole('button', { name: 'Retry storage', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
  expect(saved.data.activities[0].starts_at).toBe(new Date(operationTime + 7 * 86400000).toISOString());
  expect(saved.data.activity_participants).toEqual([]);
});

test('confirmed reset restores every domain and clears an active editor preview coherently', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/#profile');
  const initial = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).data, key);
  await page.getByLabel('Display name').fill('Reset all domains');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await page.goto('/#reports/new?facility=hall-01');
  await page.getByLabel(/^Description/).fill('A local report created to verify coherent reset across domains.');
  await page.getByRole('button', { name: 'Send report', exact: true }).click();
  const reportId = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).data.complaints.at(-1).id, key);
  await page.getByRole('button', { name: 'Enter SDP demo workspace', exact: true }).click();
  await page.goto(`/#sdp/reports/${reportId}`);
  await page.getByLabel(/^Action note/).fill('Maintenance assigned in this browser demo.');
  await page.getByRole('button', { name: 'Start work', exact: true }).click();
  await page.goto('/#sdp/activities/new');
  await page.getByLabel(/^Title/).fill('Activity for coherent reset');
  await page.getByLabel(/^Description/).fill('A published local activity whose membership must be cleared by reset.');
  await page.getByLabel(/^Location/).selectOption('hall-01');
  const date = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
  await page.getByLabel(/^Start date/).fill(date); await page.getByLabel(/^Start time/).fill('10:00');
  await page.getByLabel(/^End date/).fill(date); await page.getByLabel(/^End time/).fill('12:00');
  await page.getByRole('button', { name: 'Publish activity', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Manage activities');
  const activityId = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).data.activities.at(-1).id, key);
  await page.getByRole('button', { name: 'Exit SDP workspace', exact: true }).click();
  await page.goto(`/#activities/${activityId}`);
  await page.getByRole('button', { name: 'Join activity', exact: true }).click();
  await page.getByRole('button', { name: 'Enter SDP demo workspace', exact: true }).click();
  await page.goto('/#sdp/world');
  await page.getByRole('button', { name: 'Enter editor', exact: true }).click();
  await page.getByRole('button', { name: 'Add component', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: /^Tree/ }).click();
  await page.getByRole('button', { name: 'Place component', exact: true }).click();
  await page.getByRole('button', { name: 'Move', exact: true }).click();
  await page.getByLabel(/^X tile/).fill('1');
  await page.getByRole('button', { name: 'Reset demo', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Reset demo', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Enter editor', exact: true })).toBeVisible();
  await expect(page.locator('.schematic-ghost')).toHaveCount(0);
  const reset = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).data, key);
  for (const name of ['profiles', 'complaints', 'complaint_updates', 'layout', 'facilities', 'preferences']) expect(reset[name], name).toEqual(initial[name]);
  expect(reset.activities).toHaveLength(1); expect(reset.activities[0].id).toBe(initial.activities[0].id);
  expect(reset.activity_participants).toEqual([]); expect(reset.attachments).toEqual([]);
  await page.reload();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).data, key)).toEqual(reset);
  await expect(page.getByRole('alert')).toHaveCount(0);
});
