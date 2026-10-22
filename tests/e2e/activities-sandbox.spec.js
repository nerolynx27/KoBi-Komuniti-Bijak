import { test, expect } from '@playwright/test';

const wine = 'rgb(108, 26, 33)',
  cherry = 'rgb(185, 44, 44)',
  gold = 'rgb(206, 162, 87)',
  sand = 'rgb(209, 191, 154)',
  vanilla = 'rgb(229, 224, 205)';

test.describe('Activities Design Sandbox (Set 3 Landing + Set 1 Gallery Modal)', () => {
  test('renders original app KoBi header, Reports-matched section background, 2026 notice board, and hanging Polaroid gallery with actual event pictures and names', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/activities-sandbox.html');
    await page.evaluate(() => document.fonts.ready);

    // Original app header (KoBi brand + burger menu) & ACTIVITIES heading
    await expect(page.getByRole('link', { name: 'KoBi home' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Open app menu' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'ACTIVITIES', level: 1 })
    ).toBeVisible();
    await expect(page.getByText('2026', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'GALLERY' })).toBeVisible();

    // Section background matches Reports section (Gold outer frame + Vanilla interior surface)
    const surfaceBg = await page
      .locator('.act-notice-board-surface')
      .evaluate(el => getComputedStyle(el).backgroundColor);
    expect(surfaceBg).toBe(vanilla);

    // Pinned notes for Community and Recycling
    await expect(
      page.getByRole('button', { name: /Gotong-Royong Garden/i })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /E-Waste & Plastic Drive/i })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Upcycling Craft Workshop/i })
    ).toBeVisible();

    // Gallery Polaroids display actual event names and pictures, and G1-G4 buttons are removed
    await expect(page.getByText('Park Clean-Up')).toBeVisible();
    await expect(page.getByText('Garden Harvest')).toBeVisible();
    await expect(page.getByText('Recycling Drive')).toBeVisible();
    await expect(page.locator('.act-gallery-dots-row')).toHaveCount(0);
    await expect(page.locator('.act-gallery-code-pill')).toHaveCount(0);

    await page.screenshot({
      path: 'test-results/activities-sandbox-landing.png',
    });

    // No horizontal overflow at 390x844 and 360x800
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true);
    await page.setViewportSize({ width: 360, height: 800 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true);
    await page.setViewportSize({ width: 390, height: 844 });

    // Strictly uses the 5-colour palette
    const textColors = await page
      .locator(':is(h1,h2,h3,p,span,button)')
      .evaluateAll(els =>
        els
          .filter(el => el.checkVisibility())
          .map(el => getComputedStyle(el).color)
      );
    for (const c of textColors) {
      expect([wine, cherry, gold, sand, vanilla]).toContain(c);
    }
  });

  test('pops out Activity Detail Modal when a pinned note is clicked and allows joining and leaving', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/activities-sandbox.html');

    await page.getByRole('button', { name: /Gotong-Royong Garden/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole('heading', { name: 'Gotong-Royong Garden' })
    ).toBeVisible();
    await expect(dialog.getByText(/18 joined/i)).toBeVisible();

    await dialog.getByRole('button', { name: /Join activity/i }).click();
    await expect(dialog.getByText(/19 joined/i)).toBeVisible();
    await expect(dialog.getByText(/Joined/i).first()).toBeVisible();

    // Confirmed leave flow
    await dialog.getByRole('button', { name: /Leave Activity/i }).click();
    await expect(
      dialog.getByRole('button', { name: /Confirm Leave/i })
    ).toBeVisible();
    await dialog.getByRole('button', { name: /Confirm Leave/i }).click();
    await expect(dialog.getByText(/18 joined/i)).toBeVisible();

    // Re-join and close with Escape
    await dialog.getByRole('button', { name: /Join activity/i }).click();
    await expect(dialog.getByText(/19 joined/i)).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('selects Polaroid on string and opens Set 1 Gallery Preview Modal with CLOSE PREVIEW button when tapped', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/activities-sandbox.html');

    const polaroidG2 = page.getByRole('button', {
      name: /G2.*Community Garden Harvest Day/i,
    });
    await polaroidG2.click();

    await expect(polaroidG2).toHaveClass(/is-selected/);
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(
      modal.getByRole('heading', { name: 'Community Garden Harvest Day' })
    ).toBeVisible();
    await expect(modal.getByText('12 Oct 2026')).toBeVisible();
    await expect(
      modal.getByText(/Successful neighbourhood harvest gathering/i)
    ).toBeVisible();

    const closeBtn = modal.getByRole('button', { name: 'CLOSE PREVIEW' });
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });
});
