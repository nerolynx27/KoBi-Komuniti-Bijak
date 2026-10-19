# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: recovery-navigation.spec.js >> missing and malformed deep links recover without mutation
- Location: tests\e2e\recovery-navigation.spec.js:53:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Map', exact: true })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to content" [ref=e4] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e5]:
    - link "KoBi home" [ref=e6] [cursor=pointer]:
      - /url: "#map"
      - generic [ref=e7]: KoBi
    - generic [ref=e9]:
      - generic [ref=e10]: Demo mode
      - generic [ref=e11]: SDP view · simulated
  - main [ref=e12]:
    - generic [ref=e14]:
      - text: SDP demo workspace
      - heading "SDP report details" [active] [level=1] [ref=e15]
    - navigation "SDP navigation" [ref=e16]:
      - link "Workspace" [ref=e17] [cursor=pointer]:
        - /url: "#sdp"
      - link "Reports" [ref=e22] [cursor=pointer]:
        - /url: "#sdp/reports"
      - link "Activities" [ref=e25] [cursor=pointer]:
        - /url: "#sdp/activities"
      - link "World editor" [ref=e28] [cursor=pointer]:
        - /url: "#sdp/world"
      - button "Exit SDP workspace" [ref=e31] [cursor=pointer]
    - generic [ref=e38]:
      - heading "Report unavailable" [level=2] [ref=e39]
      - paragraph [ref=e40]: This report is not available in the current demo view.
      - button "Back to reports" [ref=e42] [cursor=pointer]
    - generic [ref=e45]:
      - paragraph [ref=e46]: Saved on this browser
      - paragraph [ref=e48]: Local demo only. No real submissions.
      - link "Development specimen" [ref=e49] [cursor=pointer]:
        - /url: "#design-system"
  - status
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { createSampleData } from '../../src/lib/demoSamples.js';
  3   | import { openPart3, PART3_NOW, readPart3Bytes, readPart3Envelope } from '../helpers/part3.js';
  4   | 
  5   | const key = 'kobi.demo.v1';
  6   | 
  7   | test('failed join retried after start remains unjoined', async ({ page }) => {
  8   |   const data = createSampleData(PART3_NOW);
  9   |   data.activities[0].starts_at = '2026-10-18T01:01:00.000Z';
  10  |   data.activities[0].ends_at = '2026-10-18T02:00:00.000Z';
  11  |   await openPart3(page, `activities/${data.activities[0].id}`, { data });
  12  |   const before = await readPart3Bytes(page);
  13  |   await page.evaluate(() => { window.part3SetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  14  |   try {
  15  |     await page.getByRole('button', { name: 'Join activity', exact: true }).click();
  16  |     expect(await readPart3Bytes(page)).toBe(before);
  17  |   } finally { await page.evaluate(() => { Storage.prototype.setItem = window.part3SetItem; }); }
  18  |   await page.clock.setFixedTime(new Date(data.activities[0].starts_at));
  19  |   await page.evaluate(() => { document.dispatchEvent(new Event('visibilitychange')); window.dispatchEvent(new Event('focus')); });
  20  |   await page.getByRole('button', { name: 'Retry storage', exact: true }).first().click();
  21  |   await expect(page.getByRole('alert').first()).toContainText(/started|closed/i);
  22  |   expect(await readPart3Bytes(page)).toBe(before);
  23  |   expect((await readPart3Envelope(page)).data.activity_participants).toEqual([]);
  24  |   await expect(page.getByText('Joined', { exact: true })).toHaveCount(0);
  25  |   await expect(page.getByRole('button', { name: 'Join activity', exact: true })).toBeDisabled();
  26  |   await page.getByRole('button', { name: 'Discard pending change', exact: true }).first().click();
  27  | });
  28  | 
  29  | test('external write between failed save and retry is never overwritten', async ({ page }) => {
  30  |   await openPart3(page, 'reports/new');
  31  |   await page.getByLabel(/^Facility/).selectOption('hall-01');
  32  |   const description = 'Keep this pending hall inspection report until explicit discard.';
  33  |   await page.getByLabel(/^Description/).fill(description);
  34  |   const before = await readPart3Envelope(page);
  35  |   await page.evaluate(() => { window.part3SetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  36  |   try { await page.getByRole('button', { name: 'Send report', exact: true }).click(); }
  37  |   finally { await page.evaluate(() => { Storage.prototype.setItem = window.part3SetItem; }); }
  38  |   const external = { ...before, revision: before.revision + 1, data: structuredClone(before.data) };
  39  |   external.data.profiles[0].display_name = 'Newer external resident';
  40  |   const bytes = JSON.stringify(external);
  41  |   await page.evaluate(bytes => localStorage.setItem('kobi.demo.v1', bytes), bytes);
  42  |   await page.getByRole('button', { name: 'Retry storage', exact: true }).first().click();
  43  |   await expect(page.getByRole('alert').first()).toContainText('another tab');
  44  |   expect(await readPart3Bytes(page)).toBe(bytes);
  45  |   await expect(page.getByLabel(/^Description/)).toHaveValue(description);
  46  |   await page.getByRole('button', { name: 'Discard pending change', exact: true }).first().click();
  47  |   await page.reload();
  48  |   expect(await readPart3Bytes(page)).toBe(bytes);
  49  |   await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Profile', exact: true }).click();
  50  |   await expect(page.getByLabel('Display name')).toHaveValue('Newer external resident');
  51  | });
  52  | 
  53  | test('missing and malformed deep links recover without mutation', async ({ page }) => {
  54  |   const errors = []; page.on('pageerror', e => errors.push(e.message));
  55  |   await openPart3(page);
  56  |   const before = await readPart3Bytes(page);
  57  |   for (const route of ['reports/missing-id', 'activities/missing-id', 'sdp/reports/missing-id', 'sdp/activities/missing-id/edit', '%E0%A4%A', 'unknown/path']) {
  58  |     await page.goto(`/#${route}`);
  59  |     await expect(page.getByText(/not found|no longer available|unavailable/i).first()).toBeVisible();
  60  |     expect(await readPart3Bytes(page)).toBe(before);
> 61  |     await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Map', exact: true }).click();
      |                                                                                                                     ^ Error: locator.click: Test timeout of 30000ms exceeded.
  62  |     await expect(page.getByRole('heading', { level: 1 })).toHaveText('Map');
  63  |   }
  64  |   expect(errors).toEqual([]);
  65  | });
  66  | 
  67  | test('empty collections and empty filters retain recovery actions', async ({ page }) => {
  68  |   const data = createSampleData(PART3_NOW);
  69  |   for (const name of ['complaints', 'complaint_updates', 'activities', 'activity_participants', 'attachments']) data[name] = [];
  70  |   await openPart3(page, 'reports', { data });
  71  |   const before = await readPart3Bytes(page);
  72  |   for (const [route, message, create] of [['reports', 'No reports here', 'New report'], ['activities', 'No activities here yet'], ['sdp/reports', 'No reports here'], ['sdp/activities', 'No activities here yet', 'New activity']]) {
  73  |     await page.goto(`/#${route}`);
  74  |     await expect(page.getByText(message, { exact: true })).toBeVisible();
  75  |     if (create) await expect(page.getByRole('link', { name: create, exact: true })).toBeVisible();
  76  |     await page.getByRole('button', { name: /^Refresh/ }).click();
  77  |     expect(await readPart3Bytes(page)).toBe(before);
  78  |   }
  79  | });
  80  | 
  81  | test('empty status and Joined filters recover without a write', async ({ page }) => {
  82  |   await openPart3(page, 'reports');
  83  |   const before = await readPart3Bytes(page);
  84  |   await page.getByRole('button', { name: 'Resolved', exact: true }).click();
  85  |   await expect(page.getByText('No reports here', { exact: true })).toBeVisible();
  86  |   await page.getByRole('button', { name: 'All', exact: true }).click();
  87  |   await expect(page.locator('.record-row')).toHaveCount(2);
  88  |   await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Activities', exact: true }).click();
  89  |   await page.getByRole('button', { name: 'Joined', exact: true }).click();
  90  |   await expect(page.locator('.record-row')).toHaveCount(0);
  91  |   await page.getByRole('button', { name: 'All', exact: true }).click();
  92  |   await expect(page.locator('.record-row')).toHaveCount(1);
  93  |   expect(await readPart3Bytes(page)).toBe(before);
  94  | });
  95  | 
  96  | test('Back restores a remembered bare-URL workspace and its selected demo actor', async ({ page }) => {
  97  |   await page.goto('/#map');
  98  |   await page.getByRole('button', { name: 'Enter SDP demo workspace', exact: true }).click();
  99  |   await page.goto('/'); await page.reload();
  100 |   await expect(page.getByRole('heading', { name: 'SDP workspace', exact: true })).toBeVisible();
  101 |   await page.getByRole('button', { name: 'Exit SDP demo workspace', exact: true }).click();
  102 |   await page.goBack();
  103 |   await expect(page.getByRole('heading', { name: 'SDP workspace', exact: true })).toBeVisible();
  104 |   await page.getByRole('link', { name: 'Review reports', exact: true }).click();
  105 |   await page.getByRole('link', { name: 'Walkway lamp', exact: true }).click();
  106 |   await page.getByLabel(/^Action note/).fill('The restored SDP demo actor starts this inspection.');
  107 |   await page.getByRole('button', { name: 'Start work', exact: true }).click();
  108 |   await expect(page.getByRole('heading', { name: 'Mark resolved', exact: true })).toBeVisible();
  109 | });
  110 | 
  111 | test('pending writes explain and disable refresh until recovery completes', async ({ page }) => {
  112 |   await page.goto('/#settings');
  113 |   await page.evaluate(() => { window.reviewSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  114 |   await page.getByLabel('Remember demo workspace').click();
  115 |   await expect(page.getByRole('button', { name: 'Reload saved data', exact: true })).toBeDisabled();
  116 |   await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Activities', exact: true }).click();
  117 |   await expect(page.getByRole('button', { name: 'Refresh activities', exact: true })).toBeDisabled();
  118 |   await expect(page.getByText('Retry or discard the pending change before refreshing.', { exact: true })).toBeVisible();
  119 |   await page.evaluate(() => { Storage.prototype.setItem = window.reviewSetItem; });
  120 |   await page.getByRole('button', { name: 'Retry storage', exact: true }).click();
  121 |   await expect(page.getByRole('button', { name: 'Refresh activities', exact: true })).toBeEnabled();
  122 |   await page.getByRole('button', { name: 'Refresh activities', exact: true }).click();
  123 |   await expect(page.getByRole('alert')).toHaveCount(0);
  124 | });
  125 | 
  126 | test('clean Back and Forward traverse accepted routes without adding history entries', async ({ page }) => {
  127 |   await page.goto('/#map');
  128 |   const nav = page.getByRole('navigation', { name: 'Main navigation' });
  129 |   await nav.getByRole('link', { name: 'Reports', exact: true }).click();
  130 |   await nav.getByRole('link', { name: 'Activities', exact: true }).click();
  131 |   const length = await page.evaluate(() => history.length);
  132 |   await page.goBack();
  133 |   await expect(page.getByRole('heading', { name: 'Reports', exact: true })).toBeVisible();
  134 |   await page.goBack();
  135 |   await expect(page.getByRole('heading', { name: 'Map', exact: true })).toBeVisible();
  136 |   await page.goForward();
  137 |   await expect(page.getByRole('heading', { name: 'Reports', exact: true })).toBeVisible();
  138 |   await page.goForward();
  139 |   await expect(page.getByRole('heading', { name: 'Activities', exact: true })).toBeVisible();
  140 |   expect(await page.evaluate(() => history.length)).toBe(length);
  141 | });
  142 | 
  143 | test('dirty Back cancellation preserves the history destination for the next Back and Forward', async ({ page }) => {
  144 |   await page.goto('/#map');
  145 |   const nav = page.getByRole('navigation', { name: 'Main navigation' });
  146 |   await nav.getByRole('link', { name: 'Reports', exact: true }).click();
  147 |   await nav.getByRole('link', { name: 'Profile', exact: true }).click();
  148 |   await page.getByLabel('Display name').fill('Do not lose history');
  149 |   await page.goBack();
  150 |   await page.getByRole('dialog').getByRole('button', { name: 'Keep editing', exact: true }).click();
  151 |   await expect(page.getByLabel('Display name')).toHaveValue('Do not lose history');
  152 |   await page.goBack();
  153 |   await page.getByRole('dialog').getByRole('button', { name: 'Discard changes', exact: true }).click();
  154 |   await expect(page.getByRole('heading', { name: 'Reports', exact: true })).toBeVisible();
  155 |   await page.goBack(); await expect(page.getByRole('heading', { name: 'Map', exact: true })).toBeVisible();
  156 |   await page.goForward(); await expect(page.getByRole('heading', { name: 'Reports', exact: true })).toBeVisible();
  157 |   await page.goForward(); await expect(page.getByLabel('Display name')).toHaveValue('Alex Tan');
  158 |   await expect(page.getByRole('dialog')).not.toBeVisible();
  159 | });
  160 | test('dirty profile internal navigation and browser hash navigation retain values until discard', async ({ page }) => {
  161 |   await page.goto('/#profile');
```