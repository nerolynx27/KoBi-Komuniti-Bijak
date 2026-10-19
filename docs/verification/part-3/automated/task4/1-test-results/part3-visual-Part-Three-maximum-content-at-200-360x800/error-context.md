# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: part3-visual.spec.js >> Part Three maximum content at 200% 360x800
- Location: tests\e2e\part3-visual.spec.js:55:3

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  getByRole('heading', { level: 1 })
Expected: "Report details"
Received: "Report a problem"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" getByRole('heading', { level: 1 }) with timeout 5000ms
  - waiting for getByRole('heading', { level: 1 })
    14 × locator resolved to <h1 tabindex="-1">Report a problem</h1>
       - unexpected value "Report a problem"

```

```yaml
- heading "Report a problem" [level=1]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { mkdir } from 'node:fs/promises';
  3  | import { createSampleData } from '../../src/lib/demoSamples.js';
  4  | import { PART3_NOW, openPart3 } from '../helpers/part3.js';
  5  | 
  6  | const evidence = 'docs/verification/part-3/automated/captures';
  7  | const reportId = '00000000-0000-4000-8000-000000000011';
  8  | const activityId = '00000000-0000-4000-8000-000000000031';
  9  | const surfaces = [
  10 |   ['map', 'map'], ['reports', 'reports'], ['report-form', 'reports/new'],
  11 |   ['report-detail', `reports/${reportId}`], ['activities', 'activities'],
  12 |   ['activity-detail', `activities/${activityId}`], ['profile', 'profile'],
  13 |   ['settings', 'settings'], ['sign-in', 'sign-in'], ['create-account', 'create-account'],
  14 |   ['sdp', 'sdp'], ['sdp-reports', 'sdp/reports'], ['sdp-report-detail', `sdp/reports/${reportId}`],
  15 |   ['sdp-activities', 'sdp/activities'], ['activity-form', 'sdp/activities/new'], ['editor', 'sdp/world'],
  16 | ];
  17 | 
  18 | async function layout(page, route) {
  19 |   const expected = {
> 20 |     map: 'Map', reports: 'Reports', 'reports/new': 'Report a problem', [`reports/${reportId}`]: 'Report details',
     |                                                         ^ Error: expect(locator).toHaveText(expected) failed
  21 |     activities: 'Activities', [`activities/${activityId}`]: 'Activity details', profile: 'Profile', settings: 'Settings',
  22 |     'sign-in': 'Sign in', 'create-account': 'Create account', sdp: 'SDP workspace', 'sdp/reports': 'SDP reports',
  23 |     [`sdp/reports/${reportId}`]: 'SDP report details', 'sdp/activities': 'Manage activities', 'sdp/activities/new': 'New activity', 'sdp/world': 'World editor',
  24 |   };
  25 |   await expect(page.getByRole('heading', { level: 1 })).toHaveText(expected[route]);
  26 |   await page.evaluate(() => document.fonts.ready);
  27 |   await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  28 |   const metrics = await page.evaluate(() => ({
  29 |     overflow: document.documentElement.scrollWidth > innerWidth + 1,
  30 |     lang: document.documentElement.lang,
  31 |     targets: [...document.querySelectorAll('button, a[href], input:not([type=checkbox]):not([type=radio]), select, textarea, .choice, .segmented-options label')]
  32 |       .filter(el => el.checkVisibility() && !el.classList.contains('skip-link'))
  33 |       .map(el => ({ name: el.getAttribute('aria-label') || el.textContent?.trim() || el.id, width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height }))
  34 |       .filter(r => r.width < 43.5 || r.height < 43.5),
  35 |   }));
  36 |   expect(metrics, route).toEqual({ overflow: false, lang: 'en', targets: [] });
  37 | }
  38 | 
  39 | for (const [width, height] of [[360, 800], [390, 844], [768, 1024], [1280, 800], [800, 360]]) {
  40 |   for (const group of [surfaces.slice(0, 8), surfaces.slice(8)]) {
  41 |     test(`Part Three routes ${group[0][0]} at ${width}x${height}`, async ({ page }) => {
  42 |       await mkdir(evidence, { recursive: true });
  43 |       await page.setViewportSize({ width, height });
  44 |       await openPart3(page);
  45 |       const errors = [], failures = [], external = [];
  46 |       page.on('pageerror', e => errors.push(e.message));
  47 |       page.on('requestfailed', r => failures.push(r.url()));
  48 |       page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1:5173') && !r.url().startsWith('ws://127.0.0.1:5173')) external.push(r.url()); });
  49 |       for (const [name, route] of group) {
  50 |         await page.goto(`/#${route}`);
  51 |         await layout(page, route);
  52 |         await page.screenshot({ path: `${evidence}/${name}-${width}x${height}-text100.png`, fullPage: true });
  53 |       }
  54 |       expect(errors).toEqual([]); expect(failures).toEqual([]); expect(external).toEqual([]);
  55 |     });
  56 |   }
  57 | }
  58 | 
  59 | for (const [width, height] of [[360, 800], [800, 360]]) {
  60 |   test(`Part Three maximum content at 200% ${width}x${height}`, async ({ page }) => {
  61 |     await mkdir(evidence, { recursive: true });
  62 |     const data = createSampleData(PART3_NOW);
  63 |     data.profiles[0].display_name = 'N'.repeat(60);
  64 |     data.complaints[0].description = 'D'.repeat(1000);
  65 |     data.complaint_updates[0].note = 'A maintenance note with ordinary spaced words. '.repeat(30).slice(0, 1000);
  66 |     data.activities[0].title = 'T'.repeat(100);
  67 |     data.activities[0].description = 'Neighbourhood description with ordinary spaced words. '.repeat(50).slice(0, 2000);
  68 |     data.activities[0].instructions = 'I'.repeat(1000);
  69 |     await page.setViewportSize({ width, height });
  70 |     await openPart3(page, 'map', { data });
  71 |     for (const [name, route] of surfaces.filter(([name]) => ['report-form', 'report-detail', 'activity-form', 'activity-detail', 'settings', 'sdp-report-detail', 'editor'].includes(name))) {
  72 |       await page.goto(`/#${route}`);
  73 |       await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  74 |       if (name === 'report-form') await page.getByLabel(/^Description/).fill('D'.repeat(1000));
  75 |       if (name === 'sdp-report-detail') await page.getByLabel(/^Action note/).fill('N'.repeat(1000));
  76 |       if (name === 'activity-form') {
  77 |         await page.getByLabel(/^Title/).fill('T'.repeat(100));
  78 |         await page.getByLabel(/^Description/).fill('A neighbourhood morning. '.repeat(100).slice(0, 2000));
  79 |         await page.getByLabel('Instructions', { exact: true }).fill('I'.repeat(1000));
  80 |       }
  81 |       await layout(page, route);
  82 |       await page.screenshot({ path: `${evidence}/${name}-${width}x${height}-text200.png`, fullPage: true });
  83 |     }
  84 |   });
  85 | }
  86 | 
```