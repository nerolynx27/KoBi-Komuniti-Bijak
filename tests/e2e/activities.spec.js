import { expect, test } from '@playwright/test';

test.use({ timezoneId: 'America/Los_Angeles' });

const key = 'kobi.demo.v1';
async function saved(page) { return page.evaluate(key => JSON.parse(localStorage.getItem(key)), key); }
async function fillActivity(page, title = 'Neighbourhood recycling morning') {
  await page.getByLabel(/^Title/).fill(title);
  await page.getByLabel(/^Description/).fill('Bring your clean recyclable materials and meet your neighbours.');
  await page.getByLabel(/^Category/).selectOption('recycling');
  await page.getByLabel(/^Location/).selectOption('recycling-01');
  await page.getByLabel(/^Start date/).fill('2030-05-20');
  await page.getByLabel(/^Start time/).fill('09:30');
  await page.getByLabel(/^End date/).fill('2030-05-20');
  await page.getByLabel(/^End time/).fill('11:00');
  await page.getByLabel('Instructions', { exact: true }).fill('Bring gloves and a water bottle.');
}
async function newActivity(page) {
  await page.goto('/#map');
  await page.getByRole('button', { name: 'Enter SDP demo workspace', exact: true }).click();
  await page.getByRole('link', { name: 'Manage activities', exact: true }).click();
  await page.getByRole('link', { name: 'New activity', exact: true }).click();
}
test('complete draft, unsaved preview, publication, membership, edit, cancellation and leave', async ({ page }) => {
  await newActivity(page); await fillActivity(page);
  await page.getByRole('button', { name: 'Save draft', exact: true }).click();
  let envelope = await saved(page);
  const activity = envelope.data.activities.find(row => row.title === 'Neighbourhood recycling morning');
  expect(activity).toMatchObject({ status: 'draft', starts_at: '2030-05-20T01:30:00.000Z', ends_at: '2030-05-20T03:00:00.000Z' });
  await page.goto('/#activities');
  await expect(page.getByRole('link', { name: 'Neighbourhood recycling morning', exact: true })).toHaveCount(0);
  await page.goto('/#sdp/activities');
  await page.getByRole('button', { name: 'Draft', exact: true }).click();
  await page.getByRole('link', { name: 'Edit activity', exact: true }).click();
  await page.getByLabel(/^Title/).fill('Recycling together');
  const before = await saved(page);
  await page.getByRole('button', { name: 'Preview activity', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Recycling together');
  await expect(dialog.getByRole('button', { name: 'Join activity', exact: true })).toHaveCount(0);
  expect(await saved(page)).toEqual(before);
  await dialog.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.getByLabel(/^Title/)).toHaveValue('Recycling together');
  await page.getByRole('button', { name: 'Publish activity', exact: true }).click();
  await page.goto(`/#activities/${activity.id}`);
  await page.getByRole('button', { name: 'Switch to resident demo', exact: true }).click();
  await page.getByRole('button', { name: 'Join activity', exact: true }).click();
  await expect(page.getByText('Joined', { exact: true })).toBeVisible();
  await expect(page.getByText('1 joined', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Joined', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Back to activities', exact: true }).click();
  await page.getByRole('button', { name: 'Recycling', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Recycling together', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'A greener Saturday', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Joined', exact: true }).click();
  await page.getByRole('link', { name: 'Recycling together', exact: true }).click();
  await page.getByRole('button', { name: 'Enter SDP demo workspace', exact: true }).click();
  await page.getByRole('link', { name: 'Manage activities', exact: true }).click();
  const card = page.locator('.record-row').filter({ has: page.getByRole('heading', { name: 'Recycling together', exact: true }) });
  await card.getByRole('link', { name: 'Edit activity', exact: true }).click();
  await expect(page.getByLabel(/^Start time/)).toHaveValue('09:30');
  await page.getByLabel('Instructions', { exact: true }).fill('Bring gloves, a water bottle and a hat.');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  envelope = await saved(page);
  expect(envelope.data.activity_participants.filter(row => row.activity_id === activity.id)).toHaveLength(1);
  await card.getByRole('button', { name: 'Cancel activity', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel activity', exact: true }).click();
  await card.getByRole('link', { name: 'View activity', exact: true }).click();
  await expect(page.getByLabel(/^Title/)).toBeDisabled();
  await expect(page.getByText('Cancelled activities are read-only.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save changes', exact: true })).toHaveCount(0);
  await page.goto(`/#activities/${activity.id}`);
  await expect(page.getByText('Cancelled', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Switch to resident demo', exact: true }).click();
  await page.getByRole('button', { name: 'Leave activity', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByText('Joined', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Leave activity', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Leave activity', exact: true }).click();
  expect((await saved(page)).data.activity_participants.filter(row => row.activity_id === activity.id)).toHaveLength(0);
});

test('failed saves retain all fields and global retry completes once; dirty Cancel is guarded', async ({ page }) => {
  await newActivity(page); await fillActivity(page, 'Retained recycling activity');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Keep editing', exact: true }).click();
  await expect(page.getByLabel(/^Title/)).toHaveValue('Retained recycling activity');
  await page.evaluate(() => { window.activitySetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.getByRole('button', { name: 'Publish activity', exact: true }).click();
  await expect(page.getByLabel(/^Title/)).toHaveValue('Retained recycling activity');
  expect((await saved(page)).data.activities.some(row => row.title === 'Retained recycling activity')).toBe(false);
  await page.evaluate(() => { Storage.prototype.setItem = window.activitySetItem; });
  await page.getByRole('button', { name: 'Retry storage', exact: true }).first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Manage activities');
  expect((await saved(page)).data.activities.filter(row => row.title === 'Retained recycling activity')).toHaveLength(1);
});

test('invalid complete draft is rejected and exact start closes participation while open', async ({ page }) => {
  await newActivity(page);
  await page.getByRole('button', { name: 'Save draft', exact: true }).click();
  await expect(page.getByText('Enter a valid Malaysia date and time.', { exact: true }).first()).toBeVisible();
  expect((await saved(page)).data.activities).toHaveLength(1);
  await page.goto('/#activities');
  await page.getByRole('link', { name: 'A greener Saturday', exact: true }).click();
  const activity = (await saved(page)).data.activities[0];
  await page.clock.install({ time: new Date(Date.parse(activity.starts_at) - 1000) });
  await page.reload();
  await expect(page.getByRole('button', { name: 'Join activity', exact: true })).toBeVisible();
  await page.clock.fastForward(1001);
  await expect(page.getByText('Participation is closed because this activity has started.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Join activity', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Enter SDP demo workspace', exact: true }).click();
  await page.goto(`/#sdp/activities/${activity.id}/edit`);
  await expect(page.getByLabel(/^Title/)).toBeDisabled();
  await expect(page.getByText('This activity has started. Activity details are read-only.', { exact: true })).toBeVisible();
});

test('failed participation leaves committed membership unchanged until Retry', async ({ page }) => {
  await page.goto('/#activities');
  await page.getByRole('link', { name: 'A greener Saturday', exact: true }).click();
  await page.evaluate(() => { window.activitySetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.getByRole('button', { name: 'Join activity', exact: true }).click();
  await expect(page.getByText('0 joined', { exact: true })).toBeVisible();
  expect((await saved(page)).data.activity_participants).toHaveLength(0);
  await page.evaluate(() => { Storage.prototype.setItem = window.activitySetItem; });
  await page.getByRole('button', { name: 'Retry storage', exact: true }).first().click();
  await expect(page.getByText('1 joined', { exact: true })).toBeVisible();
});

test('stale activity save preserves edits and reload requires discarding them', async ({ page }) => {
  await newActivity(page); await fillActivity(page, 'Stale activity example');
  await page.getByRole('button', { name: 'Save draft', exact: true }).click();
  const activity = (await saved(page)).data.activities.find(row => row.title === 'Stale activity example');
  await page.getByRole('button', { name: 'Draft', exact: true }).click();
  await page.getByRole('link', { name: 'Edit activity', exact: true }).click();
  await page.getByLabel(/^Title/).fill('My unsaved activity edit');
  await page.evaluate(({ key, id }) => {
    const envelope = JSON.parse(localStorage.getItem(key));
    const row = envelope.data.activities.find(item => item.id === id);
    row.title = 'Another tab changed this'; row.version += 1; envelope.revision += 1;
    localStorage.setItem(key, JSON.stringify(envelope));
  }, { key, id: activity.id });
  await page.getByRole('button', { name: 'Save draft', exact: true }).click();
  await expect(page.getByLabel(/^Title/)).toHaveValue('My unsaved activity edit');
  await page.getByRole('button', { name: 'Reload activity', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByLabel(/^Title/)).toHaveValue('My unsaved activity edit');
  await page.getByRole('button', { name: 'Reload activity', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Reload activity', exact: true }).click();
  await expect(page.getByLabel(/^Title/)).toHaveValue('Another tab changed this');
  await page.getByRole('button', { name: 'Publish activity', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Manage activities');
});

