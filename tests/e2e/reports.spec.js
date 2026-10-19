import { test, expect } from '@playwright/test';
import { openPart3, readPart3Bytes } from '../helpers/part3.js';

const image = { name: 'repair.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64') };

test('cancel or newer photo selection wins over pending decode', async ({ page }) => {
  await openPart3(page, 'reports/new');
  await attach(page, 'Report photo (optional)');
  const before = await readPart3Bytes(page);
  await page.getByLabel('Report photo (optional)').setInputFiles([]);
  await expect(page.getByRole('img', { name: 'Selected report photo' })).toBeVisible();
  await page.evaluate(() => {
    window.part3Decode = Image.prototype.decode;
    let first = true;
    Image.prototype.decode = function () {
      if (!first) return window.part3Decode.call(this);
      first = false;
      return new Promise(resolve => { window.finishPart3Decode = () => window.part3Decode.call(this).then(resolve); });
    };
  });
  try {
    await page.getByLabel('Report photo (optional)').setInputFiles({ ...image, name: 'older.png' });
    await expect(page.getByText('Checking image…')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send report', exact: true })).toBeDisabled();
    await page.getByLabel('Report photo (optional)').setInputFiles({ ...image, name: 'newer.png' });
    await expect(page.locator('.photo-preview figcaption')).toContainText('newer.png');
    await page.evaluate(() => window.finishPart3Decode());
    await expect(page.locator('.photo-preview figcaption')).toContainText('newer.png');
    await expect(page.locator('.photo-preview figcaption')).not.toContainText('older.png');
    expect(await readPart3Bytes(page)).toBe(before);
    await page.getByRole('button', { name: 'Remove photo', exact: true }).click();
    await expect(page.getByRole('img', { name: 'Selected report photo' })).toHaveCount(0);
  } finally { await page.evaluate(() => { Image.prototype.decode = window.part3Decode; }); }
});
const savedData = page => page.evaluate(() => JSON.parse(localStorage.getItem('kobi.demo.v1')).data);
async function fillReport(page, description = 'The community garden gate needs a repair.') {
  await page.getByLabel(/^Facility/).selectOption('park-01');
  await page.getByLabel(/^Description/).fill(description);
}
async function attach(page, label) {
  await page.getByLabel(label).setInputFiles(image);
  await expect(page.getByText('Checking image…', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('img', { name: /Selected/ })).toBeVisible();
}

test('resident report, SDP work and evidence resolution share history and survive reload', async ({ page }) => {
  await page.goto('/#reports/new');
  await fillReport(page);
  await page.getByRole('button', { name: 'Send report', exact: true }).click();
  await expect(page).toHaveURL(/#reports\/[a-f0-9-]+$/);
  const id = page.url().split('/').at(-1);
  await expect(page.getByRole('list', { name: 'Report history' })).toContainText('Report received.');
  await page.getByRole('button', { name: 'Enter SDP demo workspace', exact: true }).click();
  await page.getByRole('link', { name: 'Review reports', exact: true }).click();
  await page.locator(`a[href="#sdp/reports/${id}"]`).click();
  await page.getByRole('button', { name: 'Start work', exact: true }).click();
  await expect(page.getByLabel(/^Action note/)).toBeFocused();
  await page.getByLabel(/^Action note/).fill('The maintenance team has started the repair.');
  await page.getByRole('button', { name: 'Start work', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mark resolved', exact: true })).toBeVisible();
  await page.getByLabel(/^Action note/).fill('The gate is repaired and checked for safe use.');
  await page.getByRole('button', { name: 'Mark resolved', exact: true }).click();
  await expect(page.getByText('Select resolution evidence.', { exact: true })).toBeVisible();
  await attach(page, /^Resolution evidence/);
  await page.getByRole('button', { name: 'Mark resolved', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Resolution complete', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Exit SDP workspace', exact: true }).click();
  await page.goto(`/#reports/${id}`);
  const history = page.getByRole('list', { name: 'Report history' });
  await expect(history.locator('li')).toHaveCount(3);
  await expect(history).toContainText('The gate is repaired and checked for safe use.');
  await expect(history.getByRole('img')).toBeVisible();
  await page.reload();
  await expect(history.locator('li')).toHaveCount(3);
  await expect(history).toContainText('Photo preview is no longer available after reload.');
  expect((await savedData(page)).complaints.find(row => row.id === id)).toMatchObject({ status: 'resolved', version: 3 });
  await page.getByRole('link', { name: 'View on map', exact: true }).click();
  const place = page.getByRole('button', { name: /^Community garden/ });
  await expect(place).toBeFocused();
  await expect(place).toContainText('Normal');
  await place.click();
  await expect(page.getByRole('dialog').getByText('Normal', { exact: true })).toBeVisible();
  await expect(page.getByRole('dialog')).not.toContainText('The garden gate');
});

for (const retry of ['local', 'global']) test(`failed report storage retains draft and photo; ${retry} retry commits once`, async ({ page }) => {
  await page.goto('/#reports/new');
  await fillReport(page, 'The garden gate has a loose hinge that needs repair.');
  await attach(page, /^Report photo/);
  const before = await savedData(page);
  await page.evaluate(() => { window.reportSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.getByRole('button', { name: 'Send report', exact: true }).click();
  await expect(page.getByLabel(/^Description/)).toHaveValue('The garden gate has a loose hinge that needs repair.');
  await expect(page.getByRole('img', { name: 'Selected report photo' })).toBeVisible();
  expect((await savedData(page)).complaints).toHaveLength(before.complaints.length);
  await page.evaluate(() => { Storage.prototype.setItem = window.reportSetItem; });
  const region = retry === 'local' ? page.locator('form') : page.locator('.storage-recovery');
  await region.getByRole('button', { name: 'Retry storage', exact: true }).click();
  await expect(page).toHaveURL(/#reports\/[a-f0-9-]+$/);
  const after = await savedData(page);
  expect(after.complaints).toHaveLength(before.complaints.length + 1);
  expect(after.complaint_updates).toHaveLength(before.complaint_updates.length + 1);
  await expect(page.getByRole('img', { name: 'Selected report photo' })).toBeVisible();
});

test('report validation and guarded departure preserve draft until explicit discard', async ({ page }) => {
  await page.goto('/#reports/new');
  await page.getByRole('button', { name: 'Send report', exact: true }).click();
  await expect(page.getByLabel(/^Facility/)).toBeFocused();
  await page.getByLabel(/^Facility/).selectOption('park-01');
  await page.getByLabel(/^Description/).fill('short');
  await page.getByRole('button', { name: 'Send report', exact: true }).click();
  await expect(page.getByLabel(/^Description/)).toBeFocused();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Keep editing', exact: true }).click();
  await expect(page.getByLabel(/^Description/)).toHaveValue('short');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Discard changes', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Reports');
});

test('resident details filter out a different resident report', async ({ page }) => {
  await page.goto('/#reports');
  const foreignId = await page.evaluate(() => {
    const envelope = JSON.parse(localStorage.getItem('kobi.demo.v1'));
    const resident = envelope.data.profiles.find(row => row.role === 'resident');
    const foreign = { ...resident, id: crypto.randomUUID(), display_name: 'Other resident', email: 'other@example.com' };
    envelope.data.profiles.push(foreign);
    const report = envelope.data.complaints[0]; report.resident_id = foreign.id;
    localStorage.setItem('kobi.demo.v1', JSON.stringify(envelope)); return report.id;
  });
  await page.reload();
  await expect(page.locator(`a[href="#reports/${foreignId}"]`)).toHaveCount(0);
  await page.goto(`/#reports/${foreignId}`);
  await expect(page.getByRole('heading', { name: 'Report unavailable', exact: true })).toBeVisible();
  await expect(page.getByText('The walkway lamp is not lighting up in the evening.', { exact: true })).toHaveCount(0);
});

test('failed resolution retains evidence and note without changing status or duplicating history', async ({ page }) => {
  const id = '00000000-0000-4000-8000-000000000012';
  await page.goto(`/#sdp/reports/${id}`);
  await page.getByLabel(/^Action note/).fill('The loose board is secured and the bench is safe.');
  await attach(page, /^Resolution evidence/);
  const before = await savedData(page);
  await page.evaluate(() => { window.reportSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.getByRole('button', { name: 'Mark resolved', exact: true }).click();
  await expect(page.getByLabel(/^Action note/)).toHaveValue('The loose board is secured and the bench is safe.');
  await expect(page.getByRole('img', { name: 'Selected resolution evidence' })).toBeVisible();
  expect((await savedData(page)).complaints.find(row => row.id === id).status).toBe('in_progress');
  await expect(page.getByRole('button', { name: 'Mark resolved', exact: true })).toBeDisabled();
  await page.evaluate(() => { Storage.prototype.setItem = window.reportSetItem; });
  await page.locator('form').getByRole('button', { name: 'Retry storage', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Resolution complete', exact: true })).toBeVisible();
  const after = await savedData(page);
  expect(after.complaints.find(row => row.id === id)).toMatchObject({ status: 'resolved', version: 3 });
  expect(after.complaint_updates).toHaveLength(before.complaint_updates.length + 1);
  await expect(page.getByRole('list', { name: 'Report history' }).getByRole('img')).toBeVisible();
});

test('stale staff action keeps draft until confirmed explicit reload', async ({ page, context }) => {
  const id = '00000000-0000-4000-8000-000000000011';
  await page.goto(`/#sdp/reports/${id}`);
  await page.getByLabel(/^Action note/).fill('Keep this draft note for review.');
  const other = await context.newPage();
  await other.goto(`/#sdp/reports/${id}`);
  await other.getByLabel(/^Action note/).fill('Another demo staff view has started work.');
  await other.getByRole('button', { name: 'Start work', exact: true }).click();
  await expect(other.getByRole('heading', { name: 'Mark resolved', exact: true })).toBeVisible();
  await page.locator('.storage-recovery').getByRole('button', { name: 'Reload saved data', exact: true }).click();
  await expect(page.getByLabel(/^Action note/)).toHaveValue('Keep this draft note for review.');
  await expect(page.getByRole('button', { name: 'Start work', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Reload report', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByLabel(/^Action note/)).toHaveValue('Keep this draft note for review.');
  await page.getByRole('button', { name: 'Reload report', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Reload report', exact: true }).click();
  await expect(page.getByLabel(/^Action note/)).toHaveValue('');
  await expect(page.getByRole('heading', { name: 'Mark resolved', exact: true })).toBeVisible();
  await expect(page.getByLabel(/^Resolution evidence/)).toBeVisible();
  await other.close();
});

test('invalid photo replacement preserves selection and remove clears it', async ({ page }) => {
  await page.goto('/#reports/new');
  await attach(page, /^Report photo/);
  await page.getByLabel(/^Report photo/).setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('not an image') });
  await expect(page.getByText('This image could not be opened. Choose another JPEG, PNG or WebP image.', { exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Selected report photo' })).toBeVisible();
  await page.getByRole('button', { name: 'Remove photo', exact: true }).click();
  await expect(page.getByRole('img', { name: 'Selected report photo' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Add photo', exact: true })).toBeVisible();
});
