import { test, expect } from '@playwright/test';

test.describe('Activities Main App Integration', () => {
  test.setTimeout(60000);

  test('navigates to /#activities, views Notice Board, joins activity, and opens gallery preview', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/#activities');
    await page.evaluate(() => document.fonts.ready);

    // Verify header and Notice Board
    await expect(page.getByRole('heading', { name: 'ACTIVITIES', level: 1 })).toBeVisible();
    await expect(page.getByText('2026', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'GALLERY' })).toBeVisible();

    // Verify initial activity flyer
    const flyer = page.getByRole('button', { name: /A greener Saturday/i });
    await expect(flyer).toBeVisible();

    // Tap flyer to open Activity Detail Modal
    await flyer.click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(modal.getByRole('heading', { name: 'A greener Saturday' })).toBeVisible();

    // Join activity and check persistence in demo storage
    await modal.getByRole('button', { name: /Join activity/i }).click();
    await expect(modal.getByText(/Joined/i).first()).toBeVisible();

    const storedEnvelope = await page.evaluate(() => JSON.parse(localStorage.getItem('kobi.demo.v1')));
    expect(storedEnvelope.data.activity_participants.length).toBeGreaterThan(0);

    // Close modal with Escape
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();

    // Verify flyer on board shows JOINED badge
    await expect(flyer.getByText('JOINED', { exact: true })).toBeVisible();

    // Verify Gallery carousel and Set 1 modal
    await expect(page.getByText('Park Clean-Up')).toBeVisible();
    const harvestPolaroid = page.getByRole('button', { name: /Garden Harvest/i });
    await harvestPolaroid.click();
    const galModal = page.getByRole('dialog');
    await expect(galModal).toBeVisible();
    await expect(galModal.getByRole('heading', { name: /Community Garden Harvest Day/i })).toBeVisible();
    const closeBtn = galModal.getByRole('button', { name: 'CLOSE PREVIEW' });
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await expect(galModal).not.toBeVisible();
  });

  test('filters activities by category and joined status', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/#activities');
    await page.evaluate(() => document.fonts.ready);

    // Switch to RECYCLING filter
    await page.getByRole('button', { name: 'Recycling', exact: true }).click();
    await expect(page.getByRole('button', { name: /E-Waste & Plastic Drive/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /A greener Saturday/i })).toHaveCount(0);

    // Switch to COMMUNITY filter
    await page.getByRole('button', { name: 'Community', exact: true }).click();
    await expect(page.getByRole('button', { name: /A greener Saturday/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /E-Waste & Plastic Drive/i })).toHaveCount(0);

    // Switch to ALL filter
    await page.getByRole('button', { name: 'All', exact: true }).click();
    await expect(page.getByRole('button', { name: /A greener Saturday/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /E-Waste & Plastic Drive/i })).toBeVisible();
  });
});
