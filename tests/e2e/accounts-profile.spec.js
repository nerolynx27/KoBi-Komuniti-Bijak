import { expect, test } from '@playwright/test';
test('account forms are simulations and profile preferences survive reload', async ({ page }) => {
  await page.goto('/#create-account');
  await page.getByLabel('Display name').fill('Jamie Lee');
  await page.getByLabel(/^Email/).fill('jamie@example.com');
  await page.getByLabel(/^Password/).fill('sample');
  await page.getByLabel(/^Confirm password/).fill('sample');
  await page.getByRole('button', { name: 'Show password', exact: true }).first().click();
  await expect(page.getByLabel(/^Password/)).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Profile');
  await expect(page.getByLabel('Email', { exact: true })).toHaveValue('jamie@example.com');
  await page.getByLabel('Display name').fill('Jamie Garden');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await page.reload();
  await expect(page.getByLabel('Display name')).toHaveValue('Jamie Garden');
  expect(await page.evaluate(() => localStorage.getItem('kobi.demo.v1'))).not.toMatch(/password|confirmation|sample"/);
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Profile');
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sign in');
});

test('account validation focuses fields and selected SDP sign-in uses the same demo actor', async ({ page }) => {
  await page.goto('/#sign-in');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByLabel(/^Email/)).toBeFocused();
  await expect(page.getByText('Enter a valid email address.', { exact: true })).toBeVisible();
  await page.getByLabel(/^Email/).fill('staff@example.com');
  await page.getByLabel(/^Password/).fill('never-store-this-review-password');
  await page.getByRole('radio', { name: 'SDP', exact: true }).check();
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'SDP workspace', exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('kobi.demo.v1'))).not.toContain('never-store-this-review-password');
  await page.goto('/#profile');
  // Hash navigation within this page retains the selected transient persona on common screens.
  await expect(page.getByLabel('Demo role')).toHaveValue('SDP');
  await page.getByRole('button', { name: 'Enter SDP demo workspace', exact: true }).click();
  await page.getByRole('button', { name: 'Exit SDP demo workspace', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Map', exact: true })).toBeVisible();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Profile', exact: true }).click();
  await expect(page.getByLabel('Demo role')).toHaveValue('Resident');
});

test('registration mismatch preserves inputs and prepares only the fixed resident profile', async ({ page }) => {
  await page.goto('/#create-account');
  await page.getByLabel('Display name').fill('  Casey Resident  ');
  await page.getByLabel(/^Email/).fill('casey@example.com');
  await page.getByLabel(/^Password/).fill('private-form-value');
  await page.getByLabel(/^Confirm password/).fill('different');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByLabel(/^Confirm password/)).toBeFocused();
  await expect(page.getByLabel('Display name')).toHaveValue('  Casey Resident  ');
  await page.getByLabel(/^Confirm password/).fill('private-form-value');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Profile', exact: true })).toBeVisible();
  await expect(page.getByLabel('Display name')).toHaveValue('Casey Resident');
  await expect(page.getByLabel('Email', { exact: true })).toHaveJSProperty('readOnly', true);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('kobi.demo.v1')));
  expect(saved.data.profiles).toHaveLength(2);
  expect(saved.data.profiles.find(row => row.role === 'resident')).toMatchObject({ id: '00000000-0000-4000-8000-000000000002', display_name: 'Casey Resident', email: 'casey@example.com' });
  expect(JSON.stringify(saved)).not.toMatch(/private-form-value|different|password|confirmation/);
});

test('settings preference is committed before its state changes and global retry recovers it', async ({ page }) => {
  await page.goto('/#settings');
  await expect(page.getByLabel('Remember demo workspace')).toBeChecked();
  await page.evaluate(() => { window.reviewSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.getByLabel('Remember demo workspace').click();
  await expect(page.getByRole('alert')).toContainText('Changes were not saved');
  await expect(page.getByLabel('Remember demo workspace')).toBeChecked();
  await page.evaluate(() => { Storage.prototype.setItem = window.reviewSetItem; });
  await page.getByRole('button', { name: 'Retry storage', exact: true }).click();
  await expect(page.getByLabel('Remember demo workspace')).not.toBeChecked();
  await page.reload();
  await expect(page.getByLabel('Remember demo workspace')).not.toBeChecked();
  await expect(page.getByRole('heading', { name: 'A little help', exact: true })).toBeVisible();
});
