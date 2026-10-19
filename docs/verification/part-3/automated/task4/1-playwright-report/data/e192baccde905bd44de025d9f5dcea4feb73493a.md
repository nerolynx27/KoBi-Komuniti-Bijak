# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: part3-accessibility.spec.js >> fallback fonts and reduced motion preserve real forms and specimen feedback
- Location: tests\e2e\part3-accessibility.spec.js:144:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

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
  11  |   expect(await control.evaluate(el => {
  12  |     const r = el.getBoundingClientRect(), v = visualViewport;
  13  |     const x = r.x + r.width / 2, y = r.y + r.height / 2;
  14  |     return x >= 0 && x < v.width && y >= v.offsetTop && y < v.offsetTop + v.height && el.contains(document.elementFromPoint(x, y));
> 15  |   })).toBe(true);
      |       ^ Error: expect(received).toBe(expected) // Object.is equality
  16  |   await expect(control).toBeEnabled(); await expect(control).toBeFocused();
  17  | }
  18  | async function bottomCapture(page, control, name) {
  19  |   await exposed(control);
  20  |   await page.screenshot({ path: `${evidence}/${name}-bottom-390x400.png` });
  21  |   await page.setViewportSize({ width: 390, height: 844 });
  22  |   await exposed(control);
  23  |   await page.screenshot({ path: `${evidence}/${name}-bottom-390x844.png` });
  24  |   await page.setViewportSize({ width: 390, height: 400 });
  25  | }
  26  | async function modal(page, name, safe) {
  27  |   const dialog = page.getByRole('dialog');
  28  |   await expect(page.locator('dialog[open]')).toHaveCount(1);
  29  |   await expect(dialog).toHaveAccessibleName(name);
  30  |   if (safe) await expect(dialog.getByRole('button', { name: safe, exact: true })).toBeFocused();
  31  |   const controls = dialog.locator('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled)').filter({ visible: true });
  32  |   await controls.first().focus(); await page.keyboard.press('Shift+Tab'); await expect(controls.last()).toBeFocused();
  33  |   await page.keyboard.press('Tab'); await expect(controls.first()).toBeFocused();
  34  |   await page.locator('h1').focus();
  35  |   expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  36  | }
  37  | 
  38  | test('required actions remain exposed in short resized viewports and bottom captures', async ({ page }) => {
  39  |   await mkdir(evidence, { recursive: true });
  40  |   await page.setViewportSize({ width: 390, height: 400 });
  41  |   await openPart3(page, 'reports/new');
  42  |   await page.getByLabel(/^Facility/).selectOption('hall-01');
  43  |   await page.getByLabel(/^Description/).fill('A complete disposable report for bottom action visibility.');
  44  |   await bottomCapture(page, button(page, 'Send report'), 'report');
  45  |   await button(page, 'Send report').click();
  46  |   const id = await page.evaluate(() => JSON.parse(localStorage.getItem('kobi.demo.v1')).data.complaints.at(-1).id);
  47  |   await page.goto(`/#sdp/reports/${id}`);
  48  |   await page.getByLabel(/^Action note/).fill('The inspection has started.'); await button(page, 'Start work').click();
  49  |   await page.getByLabel(/^Action note/).fill('The maintenance has been completed and checked.');
  50  |   await page.getByLabel('Resolution evidence', { exact: false }).setInputFiles(image);
  51  |   await expect(page.getByRole('img', { name: 'Selected resolution evidence' })).toBeVisible();
  52  |   await bottomCapture(page, button(page, 'Mark resolved'), 'resolution');
  53  |   await button(page, 'Mark resolved').click();
  54  |   await page.goto('/#sdp/activities/new'); await fillActivity(page, 'Accessible activity morning');
  55  |   await bottomCapture(page, button(page, 'Publish activity'), 'activity');
  56  |   await button(page, 'Publish activity').click();
  57  |   await page.goto('/#sdp/world'); await button(page, 'Enter editor').click(); await button(page, 'Add component').click();
  58  |   await page.getByRole('dialog').getByRole('button', { name: /^Tree/ }).click(); await coordinates(page, 31, 23);
  59  |   await exposed(button(page, 'Place component')); await button(page, 'Place component').click();
  60  |   await button(page, 'Remove').click(); await modal(page, 'Remove tree?', 'Cancel');
  61  |   await exposed(page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }));
  62  |   await page.keyboard.press('Escape'); await expect(button(page, 'Remove')).toBeFocused();
  63  | });
  64  | 
  65  | test('actual sheets photo dirty and reset dialogs contain focus and restore meaningful targets', async ({ page }) => {
  66  |   await openPart3(page);
  67  |   const place = page.getByRole('button', { name: /^Walkway lamp/ });
  68  |   await place.click(); await modal(page, 'Walkway lamp', 'Close sheet');
  69  |   await page.keyboard.press('Escape'); await expect(place).toBeFocused();
  70  |   await page.goto('/#reports/new'); await page.getByLabel('Report photo (optional)').setInputFiles(image);
  71  |   await button(page, 'Preview photo').click(); await modal(page, /photo/i, 'Close');
  72  |   await page.keyboard.press('Escape'); await expect(button(page, 'Preview photo')).toBeFocused();
  73  |   await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Map', exact: true }).click();
  74  |   const before = await readPart3Bytes(page);
  75  |   await modal(page, 'Discard changes?', 'Keep editing');
  76  |   await page.keyboard.press('Escape'); expect(await readPart3Bytes(page)).toBe(before);
  77  |   await expect(page.getByRole('img', { name: 'Selected report photo' })).toBeVisible();
  78  |   await page.reload(); await page.goto('/#settings');
  79  |   await button(page, 'Reset demo').click(); await modal(page, 'Reset demo?', 'Cancel');
  80  |   await page.keyboard.press('Escape'); await expect(button(page, 'Reset demo')).toBeFocused();
  81  | });
  82  | 
  83  | test('Leave and activity cancellation dialogs have safe focus and cancel without mutation', async ({ page }) => {
  84  |   const data = createSampleData(PART3_NOW), activity = data.activities[0];
  85  |   await openPart3(page, `activities/${activity.id}`, { data });
  86  |   await button(page, 'Join activity').click();
  87  |   let before = await readPart3Bytes(page);
  88  |   await button(page, 'Leave activity').click(); await modal(page, `Leave ${activity.title}?`, 'Cancel');
  89  |   await page.keyboard.press('Escape'); await expect(button(page, 'Leave activity')).toBeFocused();
  90  |   expect(await readPart3Bytes(page)).toBe(before);
  91  |   await page.goto('/#sdp/activities'); before = await readPart3Bytes(page);
  92  |   await button(page, 'Cancel activity').click(); await modal(page, `Cancel ${activity.title}?`, 'Cancel');
  93  |   await page.keyboard.press('Escape'); await expect(button(page, 'Cancel activity')).toBeFocused();
  94  |   expect(await readPart3Bytes(page)).toBe(before);
  95  |   await button(page, 'Cancel activity').click();
  96  |   await page.getByRole('dialog').getByRole('button', { name: 'Cancel activity', exact: true }).click();
  97  |   await page.goto(`/#activities/${activity.id}`);
  98  |   await page.screenshot({ path: `${evidence}/activity-cancelled-390x844.png`, fullPage: true });
  99  |   await page.clock.setFixedTime(new Date(activity.starts_at));
  100 |   await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  101 |   await expect(button(page, 'Leave activity')).toBeDisabled();
  102 |   await page.screenshot({ path: `${evidence}/activity-started-390x844.png`, fullPage: true });
  103 | });
  104 | 
  105 | test('keyboard skip labels errors selected states and English icon names work on actual routes', async ({ page }) => {
  106 |   await openPart3(page, 'reports/new');
  107 |   await page.keyboard.press('Tab'); await expect(page.locator('.skip-link')).toBeFocused();
  108 |   await page.keyboard.press('Enter'); await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  109 |   await button(page, 'Send report').focus(); await page.keyboard.press('Space');
  110 |   const field = page.locator('[aria-invalid="true"]').first(); await expect(field).toBeFocused();
  111 |   expect(await field.getAttribute('aria-describedby')).toBeTruthy();
  112 |   await expect(field).toHaveCSS('outline-style', 'solid');
  113 |   await page.goto('/#reports');
  114 |   await button(page, 'Resolved').focus(); await page.keyboard.press('Enter');
  115 |   await expect(button(page, 'Resolved')).toHaveAttribute('aria-pressed', 'true');
```