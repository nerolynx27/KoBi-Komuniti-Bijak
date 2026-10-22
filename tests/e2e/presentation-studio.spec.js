import { test, expect } from '@playwright/test';

test.describe('Presentation Studio', () => {
  test('Deck A capability icons contain visible artwork', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/#presentation?deck=deck-a&slide=3&export=true');
    await page.evaluate(() => document.fonts.ready);
    const icons = page.locator('.deck-a-s4-col svg');
    await expect(icons).toHaveCount(3);
    await expect.poll(() => icons.evaluateAll(nodes => nodes.every(node => node.getBBox().width > 0 && node.getBBox().height > 0))).toBe(true);
  });

  test('all revised Deck A slides load their images and keep headings on the canvas', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (let index = 0; index < 11; index++) {
      await page.goto(`/#presentation?deck=deck-a&slide=${index}&export=true`);
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(Array.from(document.images, image => image.decode()));
      });
      const issues = await page.locator('.deck-a-container').evaluate(stage => {
        const bounds = stage.getBoundingClientRect();
        const outside = Array.from(stage.querySelectorAll('h1,h2,h3,.deck-a-demo-screen')).filter(node => {
          const rect = node.getBoundingClientRect();
          return rect.left < bounds.left - 1 || rect.right > bounds.right + 1 || rect.top < bounds.top - 1 || rect.bottom > bounds.bottom + 1;
        }).map(node => node.textContent);
        const headings = Array.from(stage.querySelectorAll('.deck-a-pillar-heading'));
        const screens = Array.from(stage.querySelectorAll('.deck-a-demo-screen'));
        const overlaps = headings.some(heading => screens.some(screen => {
          const a = heading.getBoundingClientRect(), b = screen.getBoundingClientRect();
          return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        }));
        return { outside, overlaps };
      });
      expect(issues, `Slide ${index + 1}`).toEqual({ outside: [], overlaps: false });
    }
    expect(errors).toEqual([]);
  });

  test('navigates to presentation studio and toggles decks and slides', async ({ page }) => {
    await page.goto('/#presentation');

    // Verify studio loaded
    const studio = page.locator('.studio-container');
    await expect(studio).toBeVisible();

    // Verify slide stage is rendered
    const stage = page.locator('.slide-stage-16-9');
    await expect(stage).toBeVisible();

    // Check deck switching
    const deckBBtn = page.getByRole('button', { name: 'DECK B (REIMAGINED COMPOSITION)' });
    await deckBBtn.click();
    await expect(deckBBtn).toHaveClass(/active/);

    // Check next slide navigation
    const nextBtn = page.getByRole('button', { name: 'NEXT ▶' });
    await nextBtn.click();
    await expect(page.locator('.studio-topbar')).toContainText('SLIDE 2 / 11');

    // Check Compare mode
    const compareBtn = page.getByRole('button', { name: 'COMPARE (SIDE-BY-SIDE)' });
    await compareBtn.click();
    await expect(page.locator('.studio-compare-grid')).toBeVisible();

    // Check Exit button returns to #map
    const exitBtn = page.getByRole('button', { name: '◀ EXIT STUDIO' });
    await exitBtn.click();
    await expect(page).toHaveURL(/#map/);
  });
});
