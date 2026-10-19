import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { createSampleData } from '../../src/lib/demoSamples.js';
import { PART3_NOW, openPart3 } from '../helpers/part3.js';

const evidence = 'docs/verification/part-3/automated/captures';
const reportId = '00000000-0000-4000-8000-000000000011';
const activityId = '00000000-0000-4000-8000-000000000031';
const surfaces = [
  ['map', 'map'], ['reports', 'reports'], ['report-form', 'reports/new'],
  ['report-detail', `reports/${reportId}`], ['activities', 'activities'],
  ['activity-detail', `activities/${activityId}`], ['profile', 'profile'],
  ['settings', 'settings'], ['sign-in', 'sign-in'], ['create-account', 'create-account'],
  ['sdp', 'sdp'], ['sdp-reports', 'sdp/reports'], ['sdp-report-detail', `sdp/reports/${reportId}`],
  ['sdp-activities', 'sdp/activities'], ['activity-form', 'sdp/activities/new'], ['editor', 'sdp/world'],
];

async function layout(page, route) {
  const expected = {
    map: 'Map', reports: 'Reports', 'reports/new': 'Report a problem', [`reports/${reportId}`]: 'Report details',
    activities: 'Activities', [`activities/${activityId}`]: 'Activity details', profile: 'Profile', settings: 'Settings',
    'sign-in': 'Sign in', 'create-account': 'Create account', sdp: 'SDP workspace', 'sdp/reports': 'SDP reports',
    [`sdp/reports/${reportId}`]: 'SDP report details', 'sdp/activities': 'Manage activities', 'sdp/activities/new': 'New activity', 'sdp/world': 'World editor',
  };
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(expected[route]);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const metrics = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    lang: document.documentElement.lang,
    targets: [...document.querySelectorAll('button, a[href], input:not([type=checkbox]):not([type=radio]), select, textarea, .choice, .segmented-options label')]
      .filter(el => el.checkVisibility() && !el.classList.contains('skip-link'))
      .map(el => ({ name: el.getAttribute('aria-label') || el.textContent?.trim() || el.id, width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height }))
      .filter(r => r.width < 43.5 || r.height < 43.5),
  }));
  expect(metrics, route).toEqual({ overflow: false, lang: 'en', targets: [] });
}

for (const [width, height] of [[360, 800], [390, 844], [768, 1024], [1280, 800], [800, 360]]) {
  for (const group of [surfaces.slice(0, 8), surfaces.slice(8)]) {
    test(`Part Three routes ${group[0][0]} at ${width}x${height}`, async ({ page }) => {
      await mkdir(evidence, { recursive: true });
      await page.setViewportSize({ width, height });
      await openPart3(page);
      const errors = [], failures = [], external = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('requestfailed', r => failures.push(r.url()));
      page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1:5173') && !r.url().startsWith('ws://127.0.0.1:5173')) external.push(r.url()); });
      for (const [name, route] of group) {
        await page.goto(`/?part3capture=${name}#${route}`);
        await layout(page, route);
        await page.screenshot({ path: `${evidence}/${name}-${width}x${height}-text100.png`, fullPage: true });
      }
      expect(errors).toEqual([]); expect(failures).toEqual([]); expect(external).toEqual([]);
    });
  }
}

for (const [width, height] of [[360, 800], [800, 360]]) {
  test(`Part Three maximum content at 200% ${width}x${height}`, async ({ page }) => {
    await mkdir(evidence, { recursive: true });
    const data = createSampleData(PART3_NOW);
    data.profiles[0].display_name = 'N'.repeat(60);
    data.complaints[0].description = 'D'.repeat(1000);
    data.complaint_updates[0].note = 'A maintenance note with ordinary spaced words. '.repeat(30).slice(0, 1000);
    data.activities[0].title = 'T'.repeat(100);
    data.activities[0].description = 'Neighbourhood description with ordinary spaced words. '.repeat(50).slice(0, 2000);
    data.activities[0].instructions = 'I'.repeat(1000);
    await page.setViewportSize({ width, height });
    await openPart3(page, 'map', { data });
    for (const [name, route] of surfaces.filter(([name]) => ['report-form', 'report-detail', 'activity-form', 'activity-detail', 'settings', 'sdp-report-detail', 'editor'].includes(name))) {
      // Independent captures deliberately load a new document so the previous
      // maximum-length draft does not invoke the app's correct dirty guard.
      await page.goto(`/?part3capture=${name}#${route}`);
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      if (name === 'report-form') await page.getByLabel(/^Description/).fill('D'.repeat(1000));
      if (name === 'sdp-report-detail') await page.getByLabel(/^Action note/).fill('N'.repeat(1000));
      if (name === 'activity-form') {
        await page.getByLabel(/^Title/).fill('T'.repeat(100));
        await page.getByLabel(/^Description/).fill('A neighbourhood morning. '.repeat(100).slice(0, 2000));
        await page.getByLabel('Instructions', { exact: true }).fill('I'.repeat(1000));
      }
      await layout(page, route);
      await page.screenshot({ path: `${evidence}/${name}-${width}x${height}-text200.png`, fullPage: true });
    }
  });
}
