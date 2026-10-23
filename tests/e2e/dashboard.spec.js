import { exitStaffWorkspace } from '../helpers/shellActions.js';
import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { createSampleData, RESIDENT_ID } from '../../src/lib/demoSamples.js';
import { validateDemoData } from '../../src/lib/demoSchema.js';

const now = '2026-10-22T01:00:00Z';
const root = () => test.info().outputPath('dashboard-captures');
const eventId = '00000000-0000-4000-8000-000000000031';
const key = 'kobi.demo.v1';
function fixture() {
  const data = createSampleData();
  data.activities[0] = { ...data.activities[0], title: 'Neighbourhood clean-up', description: 'Join your neighbours for a cleaner park.', starts_at: '2026-10-24T01:00:00Z', ends_at: '2026-10-24T03:00:00Z' };
  data.facilities.find(row => row.id === 'park-01').name = 'Community park';
  data.facilities.find(row => row.id === 'bench-01').name = 'Park lamp repair';
  data.complaints.push({ ...data.complaints[0], id: '00000000-0000-4000-8000-000000000013', status: 'resolved' });
  data.complaint_updates[2] = { ...data.complaint_updates[2], note: 'Maintenance scheduled', created_at: '2026-10-21T02:00:00Z' };
  data.activities.push({ ...data.activities[0], id: '00000000-0000-4000-8000-000000000032', status: 'cancelled', title: 'Cancelled garden day' });
  data.activity_participants = data.activities.map(activity => ({ activity_id: activity.id, user_id: RESIDENT_ID, created_at: now }));
  return data;
}
async function seed(page, data = fixture(), path = '/') {
  expect(validateDemoData(data)).toEqual({ valid: true, issues: [] });
  await page.clock.setFixedTime(new Date(now));
  await page.addInitScript(data => {
    if (!sessionStorage.getItem('bulletin.seeded')) {
      localStorage.setItem('kobi.demo.v1', JSON.stringify({ version: 2, revision: 0, data }));
      sessionStorage.setItem('bulletin.seeded', 'yes');
    }
  }, data);
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
}
async function home(page) {
  if (await page.locator('.sdp-workspace-shell').count()) await exitStaffWorkspace(page);
  else if (await page.locator('.map-shell').count()) await page.getByRole('button', { name: 'Back', exact: true }).click();
  else await page.getByRole('link', { name: 'KoBi home', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The neighbourhood bulletin');
}

test('Home links real reports and activities and preserves direct map navigation', async ({ page }) => {
  await seed(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The neighbourhood bulletin');
  await expect(page.locator('.bulletin-shortcuts')).toContainText('My reports3');
  await expect(page.locator('.bulletin-shortcuts')).toContainText('My activities2');
  await expect(page.locator('.bulletin-update')).toContainText('Maintenance scheduled');
  await page.getByRole('link', { name: 'Enter World', exact: true }).click();
  await expect(page).toHaveURL(/#map$/);
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The neighbourhood bulletin');
  await page.getByRole('link', { name: 'View activity', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`#activities/${eventId}$`));
  await home(page);
  await page.locator('.bulletin-update a').click();
  await expect(page).toHaveURL(/#reports\/00000000-0000-4000-8000-000000000012$/);
  await home(page);
  await page.locator('.bulletin-shortcuts a').first().click(); await expect(page).toHaveURL(/#reports$/);
  await home(page);
  await page.locator('.bulletin-shortcuts a').last().click(); await expect(page).toHaveURL(/#activities$/);
  await page.goto('/#map?facility=lamp-01');
  await expect(page).toHaveURL(/#map\?facility=lamp-01$/);
  await home(page); await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The neighbourhood bulletin');
});

test('dirty forms guard Home and browser history', async ({ page }) => {
  await seed(page);
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Reports', exact: true }).click();
  await page.goto('/#reports/new');
  await page.getByLabel(/^Description/).fill('Keep this unsaved inspection note.');
  await page.getByRole('link', { name: 'KoBi home', exact: true }).click();
  await page.getByRole('button', { name: 'Keep editing', exact: true }).click();
  await expect(page.getByLabel(/^Description/)).toHaveValue('Keep this unsaved inspection note.');
  await page.goBack();
  await page.getByRole('button', { name: 'Discard changes', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Reports');
  await page.goBack(); await expect(page.getByRole('heading', { level: 1 })).toHaveText('The neighbourhood bulletin');
  await page.goForward(); await expect(page.getByRole('heading', { level: 1 })).toHaveText('Reports');
});

test('artwork failures, empty states and storage recovery keep actions reachable', async ({ page }) => {
  const data = fixture(); data.activities = []; data.activity_participants = []; data.complaints = []; data.complaint_updates = [];
  await page.route('**/assets/dashboard/*.png', route => route.abort());
  await seed(page, data);
  await expect(page.getByText('No upcoming activities', { exact: true })).toBeVisible();
  await expect(page.getByText('No report updates yet', { exact: true })).toBeVisible();
  await expect(page.getByText('Neighbourhood artwork unavailable', { exact: true })).toBeVisible();
  await expect(page.locator('.bulletin-world').getByRole('button', { name: 'Retry artwork', exact: true })).toBeVisible();
  await page.unroute('**/assets/dashboard/*.png');
  await page.locator('.bulletin-world').getByRole('button', { name: 'Retry artwork', exact: true }).click();
  await expect(page.locator('.bulletin-world img')).toBeVisible();
  await page.getByRole('link', { name: 'Enter World', exact: true }).click(); await expect(page).toHaveURL(/#map$/);
  await page.evaluate(key => localStorage.setItem(key, '{bad json'), key);
  await page.goto('/#home'); await page.reload();
  await expect(page.getByRole('alert').first()).toContainText(/stored demo could not be read/i);
  await expect(page.getByRole('link', { name: 'Enter World', exact: true })).toBeVisible();
});

test('remembered SDP and resident workspace keep their landing semantics', async ({ page }) => {
  const data = fixture(); data.preferences.workspace = 'sdp';
  await seed(page, data);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('SDP workspace — Elmina');
  await exitStaffWorkspace(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The neighbourhood bulletin');
  await page.goto('/'); await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The neighbourhood bulletin');
});

test('report creation and maintenance actions refresh the private latest update', async ({ page }) => {
  await seed(page);
  await page.goto('/#reports/new');
  await page.getByLabel(/^Facility/).selectOption('hall-01');
  await page.getByLabel(/^Description/).fill('A new hall inspection report for this resident only.');
  await page.getByRole('button', { name: 'Send report', exact: true }).click();
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key)).data.complaints.length, key)).toBe(4);
  const report = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).data.complaints.at(-1), key);
  await home(page);
  await expect(page.getByRole('link', { name: 'My reports: 4', exact: true })).toBeVisible();
  await expect(page.locator('.bulletin-update')).toContainText('Report received. No maintenance update yet.');
  await page.goto(`/#sdp/reports/${report.id}`);
  await page.getByLabel(/^Action note/).fill('Hall inspection scheduled for tomorrow.');
  await page.getByRole('button', { name: 'Start work', exact: true }).click();
  await home(page);
  await expect(page.locator('.bulletin-update')).toContainText('Hall inspection scheduled for tomorrow.');
  await expect(page.locator('.bulletin-update')).toContainText('In progress');
});

test('join leave cancellation and confirmed reset update counts without fabricated events', async ({ page }) => {
  await seed(page);
  await page.getByRole('link', { name: 'View activity', exact: true }).click();
  await page.getByRole('button', { name: 'Leave activity', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Leave activity', exact: true }).click();
  await home(page);
  await expect(page.getByRole('link', { name: 'My activities: 1', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'View activity', exact: true }).click();
  await page.getByRole('button', { name: 'Join activity', exact: true }).click();
  await home(page);
  await expect(page.getByRole('link', { name: 'My activities: 2', exact: true })).toBeVisible();
  await page.goto('/#sdp/activities');
  await page.getByRole('button', { name: 'Cancel activity', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel activity', exact: true }).click();
  await home(page);
  await expect(page.getByText('No upcoming activities', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'My activities: 2', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Open app menu', exact: true }).click();
  await page.getByRole('button', { name: 'Reset demo data', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Reset demo', exact: true }).click();
  await expect(page.getByRole('link', { name: 'My activities: 0', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'My reports: 2', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'A greener Saturday', exact: true })).toBeVisible();
});

test('private reports stay private and the live clock retires a started story', async ({ page }) => {
  const data = fixture(), foreign = '00000000-0000-4000-8000-000000000099';
  data.profiles.push({ ...data.profiles[0], id: foreign, display_name: 'Another resident', email: 'another@example.com' });
  data.complaints.push({ ...data.complaints[0], id: foreign, resident_id: foreign });
  data.complaint_updates.push({ ...data.complaint_updates[2], id: foreign, complaint_id: foreign, note: 'PRIVATE ACTION NEVER DISPLAY', created_at: '2027-01-01T00:00:00Z' });
  await seed(page, data);
  await expect(page.locator('.bulletin')).not.toContainText('PRIVATE ACTION NEVER DISPLAY');
  await expect(page.getByRole('link', { name: 'My reports: 3', exact: true })).toBeVisible();
  await page.clock.setFixedTime(new Date('2026-10-24T01:00:00Z'));
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.getByText('No upcoming activities', { exact: true })).toBeVisible();
});

test('200 percent text and reduced motion retain readable content and hit targets', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 360, height: 800 }); await seed(page);
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const overflow = await page.locator('.bulletin, .bulletin-header, .bottom-nav').evaluateAll(roots => roots.flatMap(root => [...root.querySelectorAll('*')]).filter(el => el.checkVisibility() && el.getBoundingClientRect().right > innerWidth + 1).map(el => el.className.baseVal || el.className));
  expect(overflow).toEqual([]);
  const targets = await page.locator('.bulletin a, .bulletin button').evaluateAll(elements => elements.filter(el => el.checkVisibility()).map(el => ({ width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height })));
  for (const target of targets) { expect(target.width).toBeGreaterThanOrEqual(44); expect(target.height).toBeGreaterThanOrEqual(44); }
  await page.screenshot({ path: `${root()}/360-200-percent.png`, fullPage: true });
});

test('resident sign-in opens Home and workspace switching waits for draft approval', async ({ page }) => {
  await seed(page, fixture(), '/#sign-in');
  await page.getByLabel(/^Email/).fill('alex.tan@example.com');
  await page.getByLabel(/^Password/).fill('demo-only-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The neighbourhood bulletin');
  await page.getByRole('button', { name: 'Open app menu', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Active account' })).toContainText('Alex Tan');
  await page.keyboard.press('Escape');
  await page.goto('/#reports/new'); await page.getByLabel(/^Description/).fill('Do not switch my workspace before confirming this draft.');
  await page.getByRole('button', { name: 'Open app menu', exact: true }).click();
  await page.getByRole('button', { name: /^SDP WORKSPACE/ }).click();
  await page.getByRole('button', { name: 'Keep editing', exact: true }).click();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).data.preferences.workspace, key)).toBe('resident');
  await expect(page.getByLabel(/^Description/)).toHaveValue('Do not switch my workspace before confirming this draft.');
  await page.getByRole('button', { name: 'Open app menu', exact: true }).click();
  await page.getByRole('button', { name: /^SDP WORKSPACE/ }).click();
  await page.getByRole('button', { name: 'Discard changes', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('SDP workspace — Elmina');
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).data.preferences.workspace, key)).toBe('sdp');
});

for (const [width,height] of [[360,800],[390,844],[768,1024],[1280,800],[390,699],[800,360]]) {
  test(`Bulletin visual and responsive layout ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width,height }); await seed(page);
    await expect(page.locator('.bulletin-world img')).toBeVisible();
    await expect(page.locator('.bulletin-story img')).toBeVisible();
    await page.locator('.bulletin img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
    const imageBox = await page.locator('.bulletin-story img').boundingBox();
    expect(imageBox.height).toBeGreaterThan(100);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await mkdir(root(), { recursive: true });
    const measurements = await page.locator('.bulletin-world, .bulletin-world > *, .bulletin-update, .bulletin-shortcuts, .bulletin-story, .bulletin-story img, .bulletin-story-image, .bulletin-story-image > *').evaluateAll(elements => elements.map(element => {
      const rect = element.getBoundingClientRect(), css = getComputedStyle(element);
      return { tag: element.tagName, className: element.getAttribute('class'), box: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, margin: css.margin, padding: css.padding, gap: css.gap };
    }));
    await writeFile(`${root()}/${width}x${height}-measurements.json`, JSON.stringify(measurements, null, 2));
    await page.screenshot({ path: `${root()}/${width}x${height}.png`, fullPage: true });
    await page.screenshot({ path: `${root()}/${width}x${height}-viewport.png` });
    await page.screenshot({ path: `${root()}/${width}x${height}-flow-comparison.png`, fullPage: true, style: '.bulletin-shell .local-footer { display: none; } .bulletin-shell .bottom-nav { position: relative; left: auto; transform: none; } .bulletin-shell .main-content { padding-bottom: 24px; } .bulletin-header { position: relative; }' });
    await page.locator('.bulletin').screenshot({ path: `${root()}/${width}x${height}-content.png` });
  });
}
