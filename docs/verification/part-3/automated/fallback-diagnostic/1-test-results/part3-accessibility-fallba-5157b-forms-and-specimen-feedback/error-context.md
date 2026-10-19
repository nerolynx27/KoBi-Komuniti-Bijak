# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: part3-accessibility.spec.js >> fallback fonts and reduced motion preserve real forms and specimen feedback
- Location: tests\e2e\part3-accessibility.spec.js:148:1

# Error details

```
Error: {"exposed":false,"x":82.8984375,"y":820,"viewport":{"height":844,"top":0},"scroll":10,"covering":"<span>Map</span>"}

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
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
      - generic [ref=e11]: Komuniti Bijak
  - main [ref=e12]:
    - generic [ref=e14]:
      - text: KoBi pilot neighbourhood
      - heading "Report a problem" [level=1] [ref=e15]
    - generic [ref=e17]:
      - paragraph [ref=e18]: Describe a problem at a neighbourhood facility. This local demo does not send a real report.
      - generic [ref=e19]:
        - generic [ref=e20]: Facility *
        - combobox "Facility" [ref=e21]:
          - option "Choose a facility" [selected]
          - option "Walkway lamp"
          - option "Garden bench"
          - option "Community garden"
          - option "Community hall"
          - option "Recycling point"
      - generic [ref=e22]:
        - generic [ref=e23]: Description *
        - textbox "Description" [ref=e24]: Fallback font report remains readable and actionable.
        - paragraph [ref=e25]: Use 10–1000 characters. Do not include private contact details.
      - generic [ref=e26]:
        - generic [ref=e27]: Report photo (optional)
        - button "Report photo (optional)" [ref=e28]
        - paragraph [ref=e29]: JPEG, PNG or WebP. Maximum 5 MB (5,000,000 bytes). Preview only — image will not remain after reload.
        - button "Add photo" [ref=e31] [cursor=pointer]
      - generic [ref=e34]:
        - button "Send report" [active] [ref=e35] [cursor=pointer]
        - button "Cancel" [ref=e38] [cursor=pointer]
    - generic [ref=e41]:
      - button "Enter SDP demo workspace" [ref=e42] [cursor=pointer]
      - paragraph [ref=e47]: Open demo navigation. No staff authorization.
    - generic [ref=e48]:
      - paragraph [ref=e49]: Saved on this browser
      - paragraph [ref=e51]: Local demo only. No real submissions.
      - link "Development specimen" [ref=e52] [cursor=pointer]:
        - /url: "#design-system"
  - navigation "Main navigation" [ref=e55]:
    - link "Map" [ref=e56] [cursor=pointer]:
      - /url: "#map"
    - link "Reports" [ref=e61] [cursor=pointer]:
      - /url: "#reports"
    - link "Activities" [ref=e66] [cursor=pointer]:
      - /url: "#activities"
    - link "Profile" [ref=e71] [cursor=pointer]:
      - /url: "#profile"
  - status
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { mkdir } from 'node:fs/promises';
  3   | import { createSampleData } from '../../src/lib/demoSamples.js';
  4   | import { openPart3, PART3_NOW, readPart3Bytes } from '../helpers/part3.js';
  5   | import { button, link, coordinates, fillActivity } from '../helpers/shellActions.js';
  6   | 
  7   | const evidence = 'docs/verification/part-3/automated/captures';
  8   | const image = { name: 'nonpersonal-fixture.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64') };
  9   | async function exposed(control) {
  10  |   await control.focus(); await control.scrollIntoViewIfNeeded();
  11  |   const metrics = await control.evaluate(el => {
  12  |     const r = el.getBoundingClientRect(), v = visualViewport;
  13  |     const x = r.x + r.width / 2, y = r.y + r.height / 2;
  14  |     return { exposed: x >= 0 && x < v.width && y >= v.offsetTop && y < v.offsetTop + v.height && el.contains(document.elementFromPoint(x, y)), x, y, viewport: { height: v.height, top: v.offsetTop }, scroll: scrollY, covering: document.elementFromPoint(x, y)?.outerHTML.slice(0, 200) };
  15  |   });
> 16  |   expect(metrics.exposed, JSON.stringify(metrics)).toBe(true);
      |                                                    ^ Error: {"exposed":false,"x":82.8984375,"y":820,"viewport":{"height":844,"top":0},"scroll":10,"covering":"<span>Map</span>"}
  17  |   await expect(control).toBeEnabled(); await expect(control).toBeFocused();
  18  | }
  19  | async function bottomCapture(page, control, name) {
  20  |   await exposed(control);
  21  |   await page.screenshot({ path: `${evidence}/${name}-bottom-390x400.png` });
  22  |   await page.setViewportSize({ width: 390, height: 844 });
  23  |   await exposed(control);
  24  |   await page.screenshot({ path: `${evidence}/${name}-bottom-390x844.png` });
  25  |   await page.setViewportSize({ width: 390, height: 400 });
  26  | }
  27  | async function modal(page, name, safe) {
  28  |   const dialog = page.getByRole('dialog');
  29  |   await expect(page.locator('dialog[open]')).toHaveCount(1);
  30  |   await expect(dialog).toHaveAccessibleName(name);
  31  |   if (safe) await expect(dialog.getByRole('button', { name: safe, exact: true })).toBeFocused();
  32  |   const controls = dialog.locator('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled)').filter({ visible: true });
  33  |   await controls.first().focus(); await page.keyboard.press('Shift+Tab'); await expect(controls.last()).toBeFocused();
  34  |   await page.keyboard.press('Tab'); await expect(controls.first()).toBeFocused();
  35  |   await page.locator('h1').focus();
  36  |   expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  37  | }
  38  | 
  39  | test('required actions remain exposed in short resized viewports and bottom captures', async ({ page }) => {
  40  |   await mkdir(evidence, { recursive: true });
  41  |   await page.setViewportSize({ width: 390, height: 400 });
  42  |   await openPart3(page, 'reports/new');
  43  |   await page.getByLabel(/^Facility/).selectOption('hall-01');
  44  |   await page.getByLabel(/^Description/).fill('A complete disposable report for bottom action visibility.');
  45  |   await bottomCapture(page, button(page, 'Send report'), 'report');
  46  |   await button(page, 'Send report').click();
  47  |   const id = await page.evaluate(() => JSON.parse(localStorage.getItem('kobi.demo.v1')).data.complaints.at(-1).id);
  48  |   await page.goto(`/#sdp/reports/${id}`);
  49  |   await page.getByLabel(/^Action note/).fill('The inspection has started.'); await button(page, 'Start work').click();
  50  |   await page.getByLabel(/^Action note/).fill('The maintenance has been completed and checked.');
  51  |   await page.getByLabel('Resolution evidence', { exact: false }).setInputFiles(image);
  52  |   await expect(page.getByRole('img', { name: 'Selected resolution evidence' })).toBeVisible();
  53  |   await bottomCapture(page, button(page, 'Mark resolved'), 'resolution');
  54  |   await button(page, 'Mark resolved').click();
  55  |   await page.goto('/#sdp/activities/new'); await fillActivity(page, 'Accessible activity morning');
  56  |   await bottomCapture(page, button(page, 'Publish activity'), 'activity');
  57  |   await button(page, 'Publish activity').click();
  58  |   await page.goto('/#sdp/world'); await button(page, 'Enter editor').click(); await button(page, 'Add component').click();
  59  |   await page.getByRole('dialog').getByRole('button', { name: /^Tree/ }).click(); await coordinates(page, 31, 23);
  60  |   await exposed(button(page, 'Place component')); await button(page, 'Place component').click();
  61  |   await button(page, 'Remove').click(); await modal(page, 'Remove tree?', 'Cancel');
  62  |   await exposed(page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }));
  63  |   await page.keyboard.press('Escape'); await expect(button(page, 'Remove')).toBeFocused();
  64  | });
  65  | 
  66  | test('actual sheets photo dirty and reset dialogs contain focus and restore meaningful targets', async ({ page }) => {
  67  |   await openPart3(page);
  68  |   const place = page.getByRole('button', { name: /^Walkway lamp/ });
  69  |   await place.click(); await modal(page, 'Walkway lamp', 'Close sheet');
  70  |   await page.keyboard.press('Escape'); await expect(place).toBeFocused();
  71  |   await page.goto('/#reports/new'); await page.getByLabel('Report photo (optional)').setInputFiles(image);
  72  |   await button(page, 'Preview photo').click(); await modal(page, /photo/i, 'Close');
  73  |   await page.keyboard.press('Escape'); await expect(button(page, 'Preview photo')).toBeFocused();
  74  |   await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Map', exact: true }).click();
  75  |   const before = await readPart3Bytes(page);
  76  |   await modal(page, 'Discard changes?', 'Keep editing');
  77  |   await page.keyboard.press('Escape'); expect(await readPart3Bytes(page)).toBe(before);
  78  |   await expect(page.getByRole('img', { name: 'Selected report photo' })).toBeVisible();
  79  |   await page.reload(); await page.goto('/#settings');
  80  |   await button(page, 'Reset demo').click(); await modal(page, 'Reset demo?', 'Cancel');
  81  |   await page.keyboard.press('Escape'); await expect(button(page, 'Reset demo')).toBeFocused();
  82  | });
  83  | 
  84  | test('Leave and activity cancellation dialogs have safe focus and cancel without mutation', async ({ page }) => {
  85  |   const data = createSampleData(PART3_NOW), activity = data.activities[0];
  86  |   await openPart3(page, `activities/${activity.id}`, { data });
  87  |   await button(page, 'Join activity').click();
  88  |   let before = await readPart3Bytes(page);
  89  |   await button(page, 'Leave activity').click(); await modal(page, `Leave ${activity.title}?`, 'Cancel');
  90  |   await page.keyboard.press('Escape'); await expect(button(page, 'Leave activity')).toBeFocused();
  91  |   expect(await readPart3Bytes(page)).toBe(before);
  92  |   await page.goto('/#sdp/activities'); before = await readPart3Bytes(page);
  93  |   await button(page, 'Cancel activity').click(); await modal(page, `Cancel ${activity.title}?`, 'Cancel');
  94  |   await page.keyboard.press('Escape'); await expect(button(page, 'Cancel activity')).toBeFocused();
  95  |   expect(await readPart3Bytes(page)).toBe(before);
  96  |   await button(page, 'Cancel activity').click();
  97  |   await page.getByRole('dialog').getByRole('button', { name: 'Cancel activity', exact: true }).click();
  98  |   await page.goto(`/#activities/${activity.id}`);
  99  |   await button(page, 'Switch to resident demo').click();
  100 |   await page.screenshot({ path: `${evidence}/activity-cancelled-390x844.png`, fullPage: true });
  101 |   await page.clock.setFixedTime(new Date(activity.starts_at));
  102 |   await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  103 |   await expect(button(page, 'Leave activity')).toBeDisabled();
  104 |   await page.screenshot({ path: `${evidence}/activity-started-390x844.png`, fullPage: true });
  105 | });
  106 | 
  107 | test('keyboard skip labels errors selected states and English icon names work on actual routes', async ({ page }) => {
  108 |   await openPart3(page, 'reports/new');
  109 |   await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  110 |   await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Shift+Tab');
  111 |   await expect(page.locator('.skip-link')).toBeFocused();
  112 |   await page.keyboard.press('Enter'); await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  113 |   await button(page, 'Send report').focus(); await page.keyboard.press('Space');
  114 |   const field = page.locator('[aria-invalid="true"]').first(); await expect(field).toBeFocused();
  115 |   expect(await field.getAttribute('aria-describedby')).toBeTruthy();
  116 |   await expect(field).toHaveCSS('outline-style', 'solid');
```