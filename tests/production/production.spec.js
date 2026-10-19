import { test as base, expect } from '@playwright/test';
import { readdir, readFile } from 'node:fs/promises';
import { openPart3, readPart3Envelope, readPart3Bytes } from '../helpers/part3.js';
import { button, link, nav, commit, enterEditor, addComponent, coordinates, fillActivity } from '../helpers/shellActions.js';

const test = base.extend({
  page: async ({ page }, runTest) => {
    const errors = [], failed = [], external = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('requestfailed', request => failed.push({ url: request.url(), error: request.failure()?.errorText }));
    page.on('response', response => { if (response.status() >= 400) failed.push({ url: response.url(), status: response.status() }); });
    page.on('request', request => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url()); });
    await runTest(page);
    expect(errors, 'production page/console errors').toEqual([]);
    expect(failed, 'production failed resources').toEqual([]);
    expect(external, 'production external requests').toEqual([]);
  },
});

test('published activity joins and leaves durably', async ({ page }) => {
  await openPart3(page);
  await button(page, 'Enter SDP demo workspace').click();
  await link(page, 'Manage activities').click(); await link(page, 'New activity').click();
  await fillActivity(page, 'Production neighbours morning', 'hall-01');
  const authored = await commit(page, () => button(page, 'Publish activity').click());
  const activity = authored.data.activities.find(row => row.title === 'Production neighbours morning');
  expect(activity).toMatchObject({ status: 'published', facility_id: 'hall-01', starts_at: '2026-10-25T01:30:00.000Z' });
  await button(page, 'Exit SDP workspace').click();
  await nav(page, 'Activities').click(); await link(page, activity.title).click();
  const joined = await commit(page, () => button(page, 'Join activity').click());
  expect(joined.data.activity_participants.filter(row => row.activity_id === activity.id)).toHaveLength(1);
  const bytes = await readPart3Bytes(page);
  await page.reload();
  await expect(page.getByText('Joined', { exact: true })).toBeVisible();
  await expect(page.getByText('1 joined', { exact: true })).toBeVisible();
  expect(await readPart3Bytes(page)).toBe(bytes);
  await button(page, 'Leave activity').click();
  await commit(page, () => page.getByRole('dialog').getByRole('button', { name: 'Leave activity', exact: true }).click());
  await page.reload();
  await expect(page.getByText('0 joined', { exact: true })).toBeVisible();
  const final = await readPart3Envelope(page);
  expect(final.data.activities.find(row => row.id === activity.id)).toEqual(activity);
  expect(final.data.activity_participants.filter(row => row.activity_id === activity.id)).toHaveLength(0);
  await expect(button(page, 'Join activity')).toBeEnabled();
});

test('editor placement and move persist and confirmed removal cleans selection', async ({ page }) => {
  await openPart3(page); await enterEditor(page);
  const before = await readPart3Envelope(page);
  const tree = await addComponent(page, 'Tree', 27, 18);
  await button(page, 'Move').click(); await coordinates(page, 28, 18);
  const moved = await commit(page, () => button(page, 'Confirm move').click());
  expect(moved.data.layout.find(row => row.objectId === tree.objectId)).toEqual({ ...tree, x: 28 });
  const bytes = await readPart3Bytes(page);
  await page.reload(); expect(await readPart3Bytes(page)).toBe(bytes);
  await button(page, 'Enter editor').click(); await page.getByRole('button', { name: /^Neighbourhood tree/ }).click();
  await button(page, 'Remove').click(); await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click();
  expect(await readPart3Bytes(page)).toBe(bytes);
  await button(page, 'Remove').click();
  const removed = await commit(page, () => page.getByRole('dialog').getByRole('button', { name: 'Remove component', exact: true }).click());
  expect(removed.data.layout).toEqual(before.data.layout);
  expect(removed.data.facilities).toEqual(before.data.facilities);
  await expect(button(page, 'Add component')).toBeFocused();
  await expect(page.locator('.schematic-ghost')).toHaveCount(0);
  await expect(page.locator('.place-button.is-selected')).toHaveCount(0);
  await page.reload();
  expect((await readPart3Envelope(page)).data.layout).toEqual(before.data.layout);
  await expect(page.getByRole('button', { name: /^Neighbourhood tree/ })).toHaveCount(0);
});

test('production preview runs locally with fonts/icons and excludes development artwork and entry', async ({ page }) => {
  const urls = [];
  page.on('request', request => urls.push(request.url()));
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { name: 'Map', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Development specimen' })).toHaveCount(0);
  expect(await page.evaluate(() => document.fonts.check('16px "Yanone Kaffeesatz"') && document.fonts.check('700 16px "Yanone Kaffeesatz"') && document.fonts.check('20px Bungee'))).toBe(true);
  expect(urls.filter(url => !url.startsWith('http://127.0.0.1:4173'))).toEqual([]);
  expect(urls.some(url => url.includes('icons.svg'))).toBe(true);
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Reports', exact: true }).click();
  await page.getByLabel(/Facility/).selectOption('hall-01');
  await page.getByLabel(/Description/).fill('The community hall entrance needs a maintenance inspection.');
  await page.getByRole('button', { name: 'Send report', exact: true }).click();
  const reportId = await page.evaluate(() => JSON.parse(localStorage.getItem('kobi.demo.v1')).data.complaints.at(-1).id);
  await page.getByRole('button', { name: 'Enter SDP demo workspace', exact: true }).click();
  await page.goto(`/#sdp/reports/${reportId}`);
  await page.getByLabel(/Action note/).fill('Inspection assigned to the local demo maintenance team.');
  await page.getByRole('button', { name: 'Start work', exact: true }).click();
  await expect(page.getByText('Inspection assigned to the local demo maintenance team.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Exit SDP workspace', exact: true }).click();
  await page.goto(`/#reports/${reportId}`);
  await expect(page.getByText('Inspection assigned to the local demo maintenance team.', { exact: true })).toBeVisible();
  expect(urls.filter(url => !url.startsWith('http://127.0.0.1:4173'))).toEqual([]);
  await page.goto('/#design-system');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Run simulated save' })).toHaveCount(0);
  const assets = await readdir('dist/assets');
  expect(assets.filter(name => /specimen|DesignSystem|pixel-stickers|\.png$/.test(name))).toEqual([]);
  for (const filename of assets.filter(name => name.endsWith('.js'))) {
    const code = await readFile(`dist/assets/${filename}`, 'utf8');
    expect(code).not.toContain('Run simulated save');
    expect(code).not.toContain('Development specimen');
  }
});
