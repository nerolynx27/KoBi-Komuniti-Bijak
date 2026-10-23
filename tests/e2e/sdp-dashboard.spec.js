import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { createSampleData } from '../../src/lib/demoSamples.js';

const now = '2026-10-22T00:00:00Z';
const key = 'kobi.sdp-workspace.v1';
const captures = 'artifacts/sdp-dashboard/phase-2';
async function open(page, data = createSampleData()) {
  await page.clock.install({ time: new Date(now) });
  await page.addInitScript(({ data, key }) => {
    if (!sessionStorage.getItem('sdp-phase2')) {
      localStorage.setItem(key, JSON.stringify({ version: 2, revision: 0, data }));
      localStorage.setItem('kobi.demo.v1', 'main-app-sentinel');
      sessionStorage.setItem('sdp-phase2', 'true');
    }
  }, { data, key });
  await page.goto('/sdp-workspace.html#sdp');
  await expect(page.getByRole('heading', { name: 'SDP workspace — Elmina', exact: true })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}
const nav = page => page.getByRole('navigation', { name: 'SDP navigation' });
const metric = (page, name) => page.locator(`[data-metric="${name}"] .sdp-metric-value`);

test('Elmina pilot loads the original artwork extraction and keeps its caption live', async ({ page }) => {
  await open(page);
  const motif = page.locator('.sdp-card-welcome .sdp-motif');
  await expect(motif.locator('image')).toHaveAttribute('href', '/assets/dashboard/sdp/elmina-extracted-v1.png');
  await expect(motif.locator('text')).toHaveText('Elmina');
  await expect(motif).toHaveAttribute('aria-hidden', 'true');
  await expect(motif).toHaveAttribute('focusable', 'false');
  expect(await motif.evaluate(el => getComputedStyle(el).pointerEvents)).toBe('none');
  const response = await page.request.get('/assets/dashboard/sdp/elmina-extracted-v1.png');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('image/png');
});

test('reference fixture follows the selected portrait geometry', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 699 });
  await page.goto('/tests/fixtures/sdp-dashboard-reference.html');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.sdp-frame').first()).toBeAttached();
  const targets = [
    ['.sdp-dispatch-masthead', 0, 40],
    ['.sdp-card-welcome', 58, 88],
    ['.sdp-dashboard-metrics', 164, 58],
    ['.sdp-attention', 239, 218],
    ['.sdp-card-event', 471, 100],
    ['.sdp-dashboard-shortcuts', 587, 88],
  ];
  for (const [selector, top, height] of targets) {
    const box = await page.locator(selector).boundingBox();
    expect(Math.abs(box.y - top), `${selector} top`).toBeLessThanOrEqual(4);
    expect(Math.abs(box.height - height), `${selector} height`).toBeLessThanOrEqual(4);
  }
  await page.screenshot({ path: `${captures}/reference-fixture.png`, fullPage: true });
});

test('dashboard uses live records and four semantic staff destinations', async ({ page }) => {
  await open(page);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(metric(page, 'open')).toHaveText('2');
  await expect(metric(page, 'progress')).toHaveText('1');
  await expect(metric(page, 'upcoming')).toHaveText('1');
  await expect(page.locator('.sdp-dashboard')).toContainText('The walkway lamp is not lighting up in the evening.');
  await expect(page.getByText('Priority', { exact: true })).toHaveAccessibleDescription('First in this local unresolved report queue; this is not a stored urgency level.');
  await expect(page.locator('.staff-nav, .staff-destinations, .sdp-dispatch-masthead')).toHaveCount(0);
  await expect(nav(page).getByRole('link')).toHaveCount(4);
  for (const name of ['Reports', 'Activities', 'World editor', 'Workspace']) {
    await nav(page).getByRole('link', { name, exact: true }).click();
    await expect(nav(page).getByRole('link', { name, exact: true })).toHaveAttribute('aria-current', 'page');
    await page.reload();
    await expect(nav(page).getByRole('link', { name, exact: true })).toHaveAttribute('aria-current', 'page');
  }
  expect(await page.evaluate(() => localStorage.getItem('kobi.demo.v1'))).toBe('main-app-sentinel');
});

test('clock removes events at the exact start boundary without navigation', async ({ page }) => {
  const data = createSampleData();
  data.activities = data.activities.filter(row => row.status === 'published');
  data.activities[0].starts_at = '2026-10-22T00:00:02Z';
  await open(page, data);
  const initial = Number(await metric(page, 'upcoming').textContent());
  await page.clock.runFor(2000);
  await expect(metric(page, 'upcoming')).toHaveText(String(initial - 1));
  await expect(page.locator('.sdp-card-event')).not.toContainText(data.activities[0].title);
});

test('empty content, guarded navigation, failed save and sandbox-only reset', async ({ page }) => {
  const data = createSampleData(); data.complaints = []; data.complaint_updates = []; data.activities = []; data.activity_participants = [];
  await open(page, data);
  await expect(page.getByText('No reports need attention.')).toBeVisible();
  await expect(page.getByText('No upcoming activities', { exact: true })).toBeVisible();
  await nav(page).getByRole('link', { name: 'Activities', exact: true }).click();
  await page.getByRole('link', { name: 'New activity', exact: true }).click();
  await page.getByLabel(/^Title/).fill('Unsaved community morning');
  await nav(page).getByRole('link', { name: 'Workspace', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Discard changes?' })).toBeVisible();
  await page.getByRole('button', { name: 'Keep editing', exact: true }).click();
  await expect(page.getByLabel(/^Title/)).toHaveValue('Unsaved community morning');
  await nav(page).getByRole('link', { name: 'Workspace', exact: true }).click();
  await page.getByRole('button', { name: 'Discard changes', exact: true }).click();
  await page.getByRole('button', { name: 'Open app menu', exact: true }).click();
  await page.evaluate(() => { window.savedSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.getByRole('button', { name: 'Reset demo data', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Reset demo', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('alert')).toBeVisible();
  await expect(page.getByText('Demo reset.')).toHaveCount(0);
  await page.evaluate(() => { Storage.prototype.setItem = window.savedSetItem; });
  await page.getByRole('dialog').getByRole('button', { name: 'Retry storage', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(metric(page, 'open')).toHaveText('2');
  expect(await page.evaluate(() => localStorage.getItem('kobi.demo.v1'))).toBe('main-app-sentinel');
});

test('report transition updates metrics, survives reload and supports Back', async ({ page }) => {
  await open(page);
  await page.locator('.sdp-report-priority h3 a').click();
  await page.getByLabel(/^Action note/).fill('The maintenance team is inspecting this lamp.');
  await page.getByRole('button', { name: 'Start work', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Report action saved' })).toBeVisible();
  await nav(page).getByRole('link', { name: 'Workspace', exact: true }).click();
  await expect(metric(page, 'progress')).toHaveText('2');
  await page.reload();
  await expect(metric(page, 'progress')).toHaveText('2');
  await nav(page).getByRole('link', { name: 'Reports', exact: true }).click();
  await page.goBack();
  await expect(page.locator('.sdp-dashboard')).toBeVisible();
});

test('published and cancelled activities update the desk and persist', async ({ page }) => {
  await open(page);
  await nav(page).getByRole('link', { name: 'Activities', exact: true }).click();
  await page.getByRole('link', { name: 'New activity', exact: true }).click();
  await page.getByLabel(/^Title/).fill('Community morning together');
  await page.getByLabel(/^Description/).fill('Meet at the community garden for a shared planting morning.');
  await page.getByLabel(/^Location/).selectOption('park-01');
  await page.getByLabel(/^Start date/).fill('2026-10-24');
  await page.getByLabel(/^Start time/).fill('08:00');
  await page.getByLabel(/^End date/).fill('2026-10-24');
  await page.getByLabel(/^End time/).fill('10:00');
  await page.getByRole('button', { name: 'Publish activity', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Manage activities');
  await nav(page).getByRole('link', { name: 'Workspace', exact: true }).click();
  await expect(metric(page, 'upcoming')).toHaveText('2');
  await expect(page.locator('.sdp-card-event')).toContainText('Community morning together');
  await page.reload();
  await expect(metric(page, 'upcoming')).toHaveText('2');
  await nav(page).getByRole('link', { name: 'Activities', exact: true }).click();
  await page.locator('.record-row').filter({ has: page.getByRole('heading', { name: 'Community morning together' }) }).getByRole('button', { name: 'Cancel activity', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel activity', exact: true }).click();
  await nav(page).getByRole('link', { name: 'Workspace', exact: true }).click();
  await expect(metric(page, 'upcoming')).toHaveText('1');
  await page.reload();
  await expect(page.locator('.sdp-card-event')).toContainText('A greener Saturday');
});

test('long real names stay accessible at doubled text and keyboard navigation remains visible', async ({ page }) => {
  const data = createSampleData();
  const name = 'Walkway lamp beside the community garden and pedestrian crossing on Jalan Frekuensi';
  data.facilities.find(row => row.id === 'lamp-01').name = name;
  data.complaints[0].description = 'A detailed maintenance report. '.repeat(20);
  data.activities[0].title = 'A community garden morning for every neighbour and family in Elmina West';
  await page.setViewportSize({ width: 360, height: 800 });
  await open(page, data);
  await page.evaluate(() => document.documentElement.style.fontSize = '200%');
  await expect(page.locator('.sdp-report-priority h3 a')).toHaveAccessibleName(name);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await nav(page).getByRole('link', { name: 'World editor', exact: true }).focus();
  await page.keyboard.press('Shift+Tab');
  await expect(nav(page).getByRole('link', { name: 'Activities', exact: true })).toBeFocused();
  expect(await nav(page).getByRole('link', { name: 'Activities', exact: true }).evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none');
  await page.screenshot({ path: `${captures}/long-content-keyboard-200.png`, fullPage: true });
});

test('dashboard follows native 402x874 portrait geometry', async ({ page }) => {
  await page.setViewportSize({ width: 402, height: 874 });
  await open(page);
  await expect(page.locator('.app-header.bulletin-header')).toBeVisible();
  const event = await page.locator('.sdp-card-event').boundingBox();
  const shortcuts = await page.locator('.sdp-dashboard-shortcuts').boundingBox();
  expect(event.y + event.height).toBeLessThan(shortcuts.y);
  await page.screenshot({ path: `${captures}/native-402x874.png`, fullPage: false });
});

for (const [width, height] of [[360, 800], [390, 844], [402, 874], [768, 1024], [1280, 800], [390, 699]]) {

  test(`dashboard reflows at ${width}x${height} and doubled text`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await open(page);
    await mkdir(captures, { recursive: true });
    for (const size of ['100%', '200%']) {
      await page.evaluate(size => { document.documentElement.style.fontSize = size; }, size);
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await page.locator('.sdp-dashboard h1, .sdp-dashboard h2, .sdp-dashboard h3, .sdp-dashboard p, .sdp-bottom-nav a').evaluateAll(els => els.filter(el => el.scrollWidth > el.clientWidth + 1).map(el => el.textContent))).toEqual([]);
      const last = page.locator('.sdp-shortcut-link').last();
      await last.focus(); await last.scrollIntoViewIfNeeded();
      expect((await last.boundingBox()).y + (await last.boundingBox()).height).toBeLessThanOrEqual((await nav(page).boundingBox()).y);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `${captures}/${width}x${height}-${size}.png`, fullPage: true });
    }
  });
}
