# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reports.spec.js >> cancel or newer photo selection wins over pending decode
- Location: tests\e2e\reports.spec.js:6:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('newer.png', { exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('newer.png', { exact: true }) with timeout 5000ms
  - waiting for getByText('newer.png', { exact: true })

```

```yaml
- link "Skip to content":
  - /url: "#main-content"
- banner:
  - link "KoBi home":
    - /url: "#map"
    - text: KoBi
  - text: Demo mode Komuniti Bijak
- main:
  - text: KoBi pilot neighbourhood
  - heading "Report a problem" [level=1]
  - paragraph: Describe a problem at a neighbourhood facility. This local demo does not send a real report.
  - text: Facility
  - combobox "Facility":
    - option "Choose a facility" [selected]
    - option "Walkway lamp"
    - option "Garden bench"
    - option "Community garden"
    - option "Community hall"
    - option "Recycling point"
  - text: Description
  - textbox "Description"
  - paragraph: Use 10–1000 characters. Do not include private contact details.
  - text: Report photo (optional)
  - button "Report photo (optional)"
  - paragraph: JPEG, PNG or WebP. Maximum 5 MB (5,000,000 bytes). Preview only — image will not remain after reload.
  - button "Replace photo"
  - button "Remove photo"
  - figure "newer.png Preview only — image will not remain after reload.":
    - img "Selected report photo"
    - button "Preview photo"
    - text: newer.png Preview only — image will not remain after reload.
  - button "Send report"
  - button "Cancel"
  - button "Enter SDP demo workspace"
  - paragraph: Open demo navigation. No staff authorization.
  - paragraph: Saved on this browser
  - paragraph: Local demo only. No real submissions.
  - link "Development specimen":
    - /url: "#design-system"
- navigation "Main navigation":
  - link "Map":
    - /url: "#map"
  - link "Reports":
    - /url: "#reports"
  - link "Activities":
    - /url: "#activities"
  - link "Profile":
    - /url: "#profile"
- status
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { openPart3, readPart3Bytes } from '../helpers/part3.js';
  3   | 
  4   | const image = { name: 'repair.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64') };
  5   | 
  6   | test('cancel or newer photo selection wins over pending decode', async ({ page }) => {
  7   |   await openPart3(page, 'reports/new');
  8   |   await attach(page, 'Report photo (optional)');
  9   |   const before = await readPart3Bytes(page);
  10  |   await page.getByLabel('Report photo (optional)').setInputFiles([]);
  11  |   await expect(page.getByRole('img', { name: 'Selected report photo' })).toBeVisible();
  12  |   await page.evaluate(() => {
  13  |     window.part3Decode = Image.prototype.decode;
  14  |     let first = true;
  15  |     Image.prototype.decode = function () {
  16  |       if (!first) return window.part3Decode.call(this);
  17  |       first = false;
  18  |       return new Promise(resolve => { window.finishPart3Decode = () => window.part3Decode.call(this).then(resolve); });
  19  |     };
  20  |   });
  21  |   try {
  22  |     await page.getByLabel('Report photo (optional)').setInputFiles({ ...image, name: 'older.png' });
  23  |     await expect(page.getByText('Checking image…')).toBeVisible();
  24  |     await expect(page.getByRole('button', { name: 'Send report', exact: true })).toBeDisabled();
  25  |     await page.getByLabel('Report photo (optional)').setInputFiles({ ...image, name: 'newer.png' });
> 26  |     await expect(page.getByText('newer.png', { exact: true })).toBeVisible();
      |                                                                ^ Error: expect(locator).toBeVisible() failed
  27  |     await page.evaluate(() => window.finishPart3Decode());
  28  |     await expect(page.getByText('newer.png', { exact: true })).toBeVisible();
  29  |     await expect(page.getByText('older.png', { exact: true })).toHaveCount(0);
  30  |     expect(await readPart3Bytes(page)).toBe(before);
  31  |     await page.getByRole('button', { name: 'Remove photo', exact: true }).click();
  32  |     await expect(page.getByRole('img', { name: 'Selected report photo' })).toHaveCount(0);
  33  |   } finally { await page.evaluate(() => { Image.prototype.decode = window.part3Decode; }); }
  34  | });
  35  | const savedData = page => page.evaluate(() => JSON.parse(localStorage.getItem('kobi.demo.v1')).data);
  36  | async function fillReport(page, description = 'The community garden gate needs a repair.') {
  37  |   await page.getByLabel(/^Facility/).selectOption('park-01');
  38  |   await page.getByLabel(/^Description/).fill(description);
  39  | }
  40  | async function attach(page, label) {
  41  |   await page.getByLabel(label).setInputFiles(image);
  42  |   await expect(page.getByText('Checking image…', { exact: true })).toHaveCount(0);
  43  |   await expect(page.getByRole('img', { name: /Selected/ })).toBeVisible();
  44  | }
  45  | 
  46  | test('resident report, SDP work and evidence resolution share history and survive reload', async ({ page }) => {
  47  |   await page.goto('/#reports/new');
  48  |   await fillReport(page);
  49  |   await page.getByRole('button', { name: 'Send report', exact: true }).click();
  50  |   await expect(page).toHaveURL(/#reports\/[a-f0-9-]+$/);
  51  |   const id = page.url().split('/').at(-1);
  52  |   await expect(page.getByRole('list', { name: 'Report history' })).toContainText('Report received.');
  53  |   await page.getByRole('button', { name: 'Enter SDP demo workspace', exact: true }).click();
  54  |   await page.getByRole('link', { name: 'Review reports', exact: true }).click();
  55  |   await page.locator(`a[href="#sdp/reports/${id}"]`).click();
  56  |   await page.getByRole('button', { name: 'Start work', exact: true }).click();
  57  |   await expect(page.getByLabel(/^Action note/)).toBeFocused();
  58  |   await page.getByLabel(/^Action note/).fill('The maintenance team has started the repair.');
  59  |   await page.getByRole('button', { name: 'Start work', exact: true }).click();
  60  |   await expect(page.getByRole('heading', { name: 'Mark resolved', exact: true })).toBeVisible();
  61  |   await page.getByLabel(/^Action note/).fill('The gate is repaired and checked for safe use.');
  62  |   await page.getByRole('button', { name: 'Mark resolved', exact: true }).click();
  63  |   await expect(page.getByText('Select resolution evidence.', { exact: true })).toBeVisible();
  64  |   await attach(page, /^Resolution evidence/);
  65  |   await page.getByRole('button', { name: 'Mark resolved', exact: true }).click();
  66  |   await expect(page.getByRole('heading', { name: 'Resolution complete', exact: true })).toBeVisible();
  67  |   await page.getByRole('button', { name: 'Exit SDP workspace', exact: true }).click();
  68  |   await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Reports', exact: true }).click();
  69  |   await page.getByRole('button', { name: 'Resolved', exact: true }).click();
  70  |   await expect(page.getByRole('button', { name: 'Resolved', exact: true })).toBeFocused();
  71  |   await expect(page.getByRole('status').filter({ hasText: /^1 report$/ })).toBeVisible();
  72  |   await page.locator(`a[href="#reports/${id}"]`).click();
  73  |   const history = page.getByRole('list', { name: 'Report history' });
  74  |   await expect(history.locator('li')).toHaveCount(3);
  75  |   await expect(history).toContainText('The gate is repaired and checked for safe use.');
  76  |   await expect(history.getByRole('img')).toBeVisible();
  77  |   await page.reload();
  78  |   await expect(history.locator('li')).toHaveCount(3);
  79  |   await expect(history).toContainText('Photo preview is no longer available after reload.');
  80  |   expect((await savedData(page)).complaints.find(row => row.id === id)).toMatchObject({ status: 'resolved', version: 3 });
  81  |   await page.getByRole('link', { name: 'View on map', exact: true }).click();
  82  |   const place = page.getByRole('button', { name: /^Community garden/ });
  83  |   await expect(place).toBeFocused();
  84  |   await expect(place).toContainText('Normal');
  85  |   await place.click();
  86  |   await expect(page.getByRole('dialog').getByText('Normal', { exact: true })).toBeVisible();
  87  |   await expect(page.getByRole('dialog')).not.toContainText('The garden gate');
  88  | });
  89  | 
  90  | for (const retry of ['local', 'global']) test(`failed report storage retains draft and photo; ${retry} retry commits once`, async ({ page }) => {
  91  |   await page.goto('/#reports/new');
  92  |   await fillReport(page, 'The garden gate has a loose hinge that needs repair.');
  93  |   await attach(page, /^Report photo/);
  94  |   const before = await savedData(page);
  95  |   await page.evaluate(() => { window.reportSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  96  |   await page.getByRole('button', { name: 'Send report', exact: true }).click();
  97  |   await expect(page.getByLabel(/^Description/)).toHaveValue('The garden gate has a loose hinge that needs repair.');
  98  |   await expect(page.getByRole('img', { name: 'Selected report photo' })).toBeVisible();
  99  |   expect((await savedData(page)).complaints).toHaveLength(before.complaints.length);
  100 |   await page.evaluate(() => { Storage.prototype.setItem = window.reportSetItem; });
  101 |   const region = retry === 'local' ? page.locator('form') : page.locator('.storage-recovery');
  102 |   await region.getByRole('button', { name: 'Retry storage', exact: true }).click();
  103 |   await expect(page).toHaveURL(/#reports\/[a-f0-9-]+$/);
  104 |   const after = await savedData(page);
  105 |   expect(after.complaints).toHaveLength(before.complaints.length + 1);
  106 |   expect(after.complaint_updates).toHaveLength(before.complaint_updates.length + 1);
  107 |   await expect(page.getByRole('img', { name: 'Selected report photo' })).toBeVisible();
  108 | });
  109 | 
  110 | test('report validation and guarded departure preserve draft until explicit discard', async ({ page }) => {
  111 |   await page.goto('/#reports/new');
  112 |   await page.getByRole('button', { name: 'Send report', exact: true }).click();
  113 |   await expect(page.getByLabel(/^Facility/)).toBeFocused();
  114 |   await page.getByLabel(/^Facility/).selectOption('park-01');
  115 |   await page.getByLabel(/^Description/).fill('short');
  116 |   await page.getByRole('button', { name: 'Send report', exact: true }).click();
  117 |   await expect(page.getByLabel(/^Description/)).toBeFocused();
  118 |   await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  119 |   await page.getByRole('dialog').getByRole('button', { name: 'Keep editing', exact: true }).click();
  120 |   await expect(page.getByLabel(/^Description/)).toHaveValue('short');
  121 |   await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  122 |   await page.getByRole('dialog').getByRole('button', { name: 'Discard changes', exact: true }).click();
  123 |   await expect(page.getByRole('heading', { level: 1 })).toHaveText('Reports');
  124 | });
  125 | 
  126 | test('resident details filter out a different resident report', async ({ page }) => {
```