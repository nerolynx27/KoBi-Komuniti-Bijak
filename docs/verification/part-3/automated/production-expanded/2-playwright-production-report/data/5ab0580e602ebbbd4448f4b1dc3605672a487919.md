# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: production.spec.js >> editor placement and move persist and confirmed removal cleans selection
- Location: tests\production\production.spec.js:48:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /^Tree/ })

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - link "Skip to content" [ref=f1e4] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=f1e5]:
    - link "KoBi home" [ref=f1e6] [cursor=pointer]:
      - /url: "#map"
      - generic [ref=f1e7]: KoBi
    - generic [ref=f1e9]:
      - generic [ref=f1e10]: Demo mode
      - generic [ref=f1e11]: SDP view · simulated
  - main [ref=f1e12]:
    - generic [ref=f1e14]:
      - text: SDP demo workspace
      - heading "World editor" [level=1] [ref=f1e15]
    - navigation "SDP navigation" [ref=f1e16]:
      - link "Workspace" [ref=f1e17] [cursor=pointer]:
        - /url: "#sdp"
      - link "Reports" [ref=f1e22] [cursor=pointer]:
        - /url: "#sdp/reports"
      - link "Activities" [ref=f1e25] [cursor=pointer]:
        - /url: "#sdp/activities"
      - link "World editor" [ref=f1e28] [cursor=pointer]:
        - /url: "#sdp/world"
      - button "Exit SDP workspace" [ref=f1e31] [cursor=pointer]
    - generic [ref=f1e35]:
      - generic [ref=f1e36]:
        - heading "Shape the neighbourhood" [level=2] [ref=f1e37]
        - paragraph [ref=f1e38]: Arrange seven available components on a 32 × 24 tile schematic. These are provisional footprints. Final artwork, hit areas and worker access routes will be validated later.
      - generic [ref=f1e39]:
        - button "Add component" [ref=f1e40] [cursor=pointer]
        - button "Select" [pressed] [ref=f1e46] [cursor=pointer]
        - button "Exit editor" [ref=f1e49] [cursor=pointer]
        - button "Reset demo" [ref=f1e52] [cursor=pointer]
      - generic [ref=f1e57]:
        - generic [ref=f1e58]:
          - generic [ref=f1e59]:
            - generic [ref=f1e60]:
              - text: Sample neighbourhood
              - heading "Places we share" [level=2] [ref=f1e61]
            - generic [ref=f1e62]: 100%
          - generic [ref=f1e63]:
            - button "Zoom out" [disabled] [ref=f1e64]
            - button "Zoom in" [ref=f1e70] [cursor=pointer]
            - button "Reset view" [ref=f1e76] [cursor=pointer]
          - img "Temporary neighbourhood schematic, 32 by 24 tiles. Select a place using the buttons below." [ref=f1e82]:
            - generic [ref=f1e87]: Lamp
            - generic [ref=f1e90]: Bench
            - generic [ref=f1e93]: Garden
            - generic [ref=f1e96]: Hall
            - generic [ref=f1e99]: Recycle
            - generic [ref=f1e102]: House
            - generic [ref=f1e105]: Tree
          - paragraph [ref=f1e108]: Temporary schematic · final pixel artwork and worker routes come later.
        - generic [ref=f1e111]:
          - generic [ref=f1e112]:
            - heading "Select a component" [level=2] [ref=f1e113]
            - generic [ref=f1e114]: 7 places
          - generic [ref=f1e115]:
            - button "Walkway lamp Reported" [ref=f1e116] [cursor=pointer]:
              - generic [ref=f1e120]:
                - strong [ref=f1e121]: Walkway lamp
                - generic [ref=f1e122]: Reported
            - button "Garden bench Work in progress" [ref=f1e125] [cursor=pointer]:
              - generic [ref=f1e129]:
                - strong [ref=f1e130]: Garden bench
                - generic [ref=f1e131]: Work in progress
            - button "Community garden Normal · 1 activity" [ref=f1e134] [cursor=pointer]:
              - generic [ref=f1e138]:
                - strong [ref=f1e139]: Community garden
                - generic [ref=f1e140]: Normal · 1 activity
            - button "Community hall Normal" [ref=f1e143] [cursor=pointer]:
              - generic [ref=f1e147]:
                - strong [ref=f1e148]: Community hall
                - generic [ref=f1e149]: Normal
            - button "Recycling point Normal" [ref=f1e152] [cursor=pointer]:
              - generic [ref=f1e156]:
                - strong [ref=f1e157]: Recycling point
                - generic [ref=f1e158]: Normal
            - button "Neighbourhood house Decorative" [ref=f1e161] [cursor=pointer]:
              - generic [ref=f1e165]:
                - strong [ref=f1e166]: Neighbourhood house
                - generic [ref=f1e167]: Decorative
            - button "Neighbourhood tree Decorative" [ref=f1e170] [cursor=pointer]:
              - generic [ref=f1e174]:
                - strong [ref=f1e175]: Neighbourhood tree
                - generic [ref=f1e176]: Decorative
      - button "Back to workspace" [ref=f1e179] [cursor=pointer]
    - generic [ref=f1e182]:
      - paragraph [ref=f1e183]: Saved on this browser
      - paragraph [ref=f1e185]: Local demo only. No real submissions.
  - status
```

# Test source

```ts
  1   | import { test as base, expect } from '@playwright/test';
  2   | import { readdir, readFile } from 'node:fs/promises';
  3   | import { openPart3, readPart3Envelope, readPart3Bytes } from '../helpers/part3.js';
  4   | import { button, link, nav, commit, enterEditor, addComponent, coordinates, fillActivity } from '../helpers/shellActions.js';
  5   | 
  6   | const test = base.extend({
  7   |   page: async ({ page }, use) => {
  8   |     const errors = [], failed = [], external = [];
  9   |     page.on('pageerror', e => errors.push(e.message));
  10  |     page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  11  |     page.on('requestfailed', request => failed.push({ url: request.url(), error: request.failure()?.errorText }));
  12  |     page.on('response', response => { if (response.status() >= 400) failed.push({ url: response.url(), status: response.status() }); });
  13  |     page.on('request', request => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url()); });
  14  |     await use(page);
  15  |     expect(errors, 'production page/console errors').toEqual([]);
  16  |     expect(failed, 'production failed resources').toEqual([]);
  17  |     expect(external, 'production external requests').toEqual([]);
  18  |   },
  19  | });
  20  | 
  21  | test('published activity joins and leaves durably', async ({ page }) => {
  22  |   await openPart3(page);
  23  |   await button(page, 'Enter SDP demo workspace').click();
  24  |   await link(page, 'Manage activities').click(); await link(page, 'New activity').click();
  25  |   await fillActivity(page, 'Production neighbours morning', 'hall-01');
  26  |   const authored = await commit(page, () => button(page, 'Publish activity').click());
  27  |   const activity = authored.data.activities.find(row => row.title === 'Production neighbours morning');
  28  |   expect(activity).toMatchObject({ status: 'published', facility_id: 'hall-01', starts_at: '2026-10-25T01:30:00.000Z' });
  29  |   await button(page, 'Exit SDP workspace').click();
  30  |   await nav(page, 'Activities').click(); await link(page, activity.title).click();
  31  |   const joined = await commit(page, () => button(page, 'Join activity').click());
  32  |   expect(joined.data.activity_participants.filter(row => row.activity_id === activity.id)).toHaveLength(1);
  33  |   const bytes = await readPart3Bytes(page);
  34  |   await page.reload();
  35  |   await expect(page.getByText('Joined', { exact: true })).toBeVisible();
  36  |   await expect(page.getByText('1 joined', { exact: true })).toBeVisible();
  37  |   expect(await readPart3Bytes(page)).toBe(bytes);
  38  |   await button(page, 'Leave activity').click();
  39  |   await commit(page, () => page.getByRole('dialog').getByRole('button', { name: 'Leave activity', exact: true }).click());
  40  |   await page.reload();
  41  |   await expect(page.getByText('0 joined', { exact: true })).toBeVisible();
  42  |   const final = await readPart3Envelope(page);
  43  |   expect(final.data.activities.find(row => row.id === activity.id)).toEqual(activity);
  44  |   expect(final.data.activity_participants.filter(row => row.activity_id === activity.id)).toHaveLength(0);
  45  |   await expect(button(page, 'Join activity')).toBeEnabled();
  46  | });
  47  | 
  48  | test('editor placement and move persist and confirmed removal cleans selection', async ({ page }) => {
  49  |   await openPart3(page); await enterEditor(page);
  50  |   const before = await readPart3Envelope(page);
  51  |   const tree = await addComponent(page, 'Tree', 27, 18);
  52  |   await button(page, 'Move').click(); await coordinates(page, 28, 18);
  53  |   const moved = await commit(page, () => button(page, 'Confirm move').click());
  54  |   expect(moved.data.layout.find(row => row.objectId === tree.objectId)).toEqual({ ...tree, x: 28 });
  55  |   const bytes = await readPart3Bytes(page);
  56  |   await page.reload(); expect(await readPart3Bytes(page)).toBe(bytes);
> 57  |   await button(page, 'Enter editor').click(); await page.getByRole('button', { name: /^Tree/ }).click();
      |                                                                                                 ^ Error: locator.click: Test timeout of 30000ms exceeded.
  58  |   await button(page, 'Remove').click(); await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click();
  59  |   expect(await readPart3Bytes(page)).toBe(bytes);
  60  |   await button(page, 'Remove').click();
  61  |   const removed = await commit(page, () => page.getByRole('dialog').getByRole('button', { name: 'Remove component', exact: true }).click());
  62  |   expect(removed.data.layout).toEqual(before.data.layout);
  63  |   expect(removed.data.facilities).toEqual(before.data.facilities);
  64  |   await expect(button(page, 'Add component')).toBeFocused();
  65  |   await expect(page.locator('.schematic-ghost')).toHaveCount(0);
  66  |   await expect(page.locator('.place-button.is-selected')).toHaveCount(0);
  67  |   await page.reload();
  68  |   expect((await readPart3Envelope(page)).data.layout).toEqual(before.data.layout);
  69  |   await expect(page.getByRole('button', { name: /^Tree/ })).toHaveCount(0);
  70  | });
  71  | 
  72  | test('production preview runs locally with fonts/icons and excludes development artwork and entry', async ({ page }) => {
  73  |   const urls = [];
  74  |   page.on('request', request => urls.push(request.url()));
  75  |   await page.goto('/');
  76  |   await page.evaluate(() => document.fonts.ready);
  77  |   await expect(page.getByRole('heading', { name: 'Map', exact: true })).toBeVisible();
  78  |   await expect(page.getByRole('link', { name: 'Development specimen' })).toHaveCount(0);
  79  |   expect(await page.evaluate(() => document.fonts.check('16px Play') && document.fonts.check('700 16px Play') && document.fonts.check('20px "Press Start 2P"'))).toBe(true);
  80  |   expect(urls.filter(url => !url.startsWith('http://127.0.0.1:4173'))).toEqual([]);
  81  |   expect(urls.some(url => url.includes('icons.svg'))).toBe(true);
  82  |   await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Reports', exact: true }).click();
  83  |   await page.getByRole('link', { name: 'New report', exact: true }).click();
  84  |   await page.getByLabel(/Facility/).selectOption('hall-01');
  85  |   await page.getByLabel(/Description/).fill('The community hall entrance needs a maintenance inspection.');
  86  |   await page.getByRole('button', { name: 'Send report', exact: true }).click();
  87  |   await expect(page.getByRole('heading', { level: 1 })).toHaveText('Report details');
  88  |   await expect(page.getByText('The community hall entrance needs a maintenance inspection.', { exact: true })).toBeVisible();
  89  |   const reportId = await page.evaluate(() => JSON.parse(localStorage.getItem('kobi.demo.v1')).data.complaints.at(-1).id);
  90  |   await page.getByRole('button', { name: 'Enter SDP demo workspace', exact: true }).click();
  91  |   await page.goto(`/#sdp/reports/${reportId}`);
  92  |   await page.getByLabel(/Action note/).fill('Inspection assigned to the local demo maintenance team.');
  93  |   await page.getByRole('button', { name: 'Start work', exact: true }).click();
  94  |   await expect(page.getByText('Inspection assigned to the local demo maintenance team.', { exact: true })).toBeVisible();
  95  |   await page.getByRole('button', { name: 'Exit SDP workspace', exact: true }).click();
  96  |   await page.goto(`/#reports/${reportId}`);
  97  |   await expect(page.getByText('Inspection assigned to the local demo maintenance team.', { exact: true })).toBeVisible();
  98  |   expect(urls.filter(url => !url.startsWith('http://127.0.0.1:4173'))).toEqual([]);
  99  |   await page.goto('/#design-system');
  100 |   await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  101 |   await expect(page.getByRole('button', { name: 'Run simulated save' })).toHaveCount(0);
  102 |   const assets = await readdir('dist/assets');
  103 |   expect(assets.filter(name => /specimen|DesignSystem|pixel-stickers|\.png$/.test(name))).toEqual([]);
  104 |   for (const filename of assets.filter(name => name.endsWith('.js'))) {
  105 |     const code = await readFile(`dist/assets/${filename}`, 'utf8');
  106 |     expect(code).not.toContain('Run simulated save');
  107 |     expect(code).not.toContain('Development specimen');
  108 |   }
  109 | });
  110 | 
```