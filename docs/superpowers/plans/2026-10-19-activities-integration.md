# Activities Main App Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the approved Activities Design Sandbox (Set 3 Notice Board + Set 1 Gallery Modal) into the main KoBi application under `#activities`, connecting live store data, participation commands, and the hanging Polaroid carousel.

**Architecture:** Move production components into `src/features/activities/components/`, wire `ActivitiesPage.jsx` to render the resident Notice Board and Hanging Polaroid Gallery Carousel, connect the Activity Detail Pop-Out Modal to `store.dispatch('activities.join')` and `'activities.leave'`, import the stylesheet into the main bundle via `src/styles/activities-board.css`, and preserve deep-link compatibility for `#activities/:id`.

**Tech Stack:** React 19.3.1, Plain CSS, Inline SVG with `shapeRendering="crispEdges"`, Vitest, Playwright.

**Spec:** `docs/product/product.md`, `docs/product/TECHNICAL_DOCUMENTATION.md`, `docs/superpowers/plans/2026-10-19-activities-sandbox.md`.

## Global Constraints

- **5-Colour Palette Only:** Strictly `#6C1A21` (`--color-wine`), `#B92C2C` (`--color-cherry`), `#CEA257` (`--color-gold`), `#D1BF9A` (`--color-sand`), and `#E5E0CD` (`--color-vanilla`).
- **Typography:** Only `Bungee` (titles, headers, badges, buttons) and `Yanone Kaffeesatz` (body, metadata, form text, captions).
- **Zero New Runtime Dependencies:** Plain React + CSS + inline SVGs. No Framer Motion, Tailwind, or third-party carousel libraries.
- **English UI Copy:** All button text, titles, descriptions, and accessible labels in English.
- **Preserve Existing Main App Contracts:** Do not mutate `createSampleData()` in `src/lib/demoSamples.js` (existing tests expect `data.activities.length === 1`). Do not break SDP staff activities (`#sdp/activities` / `ManageActivitiesPage.jsx`).

## Review Focus

1. **Live Participation State in Modal:** Joining or leaving an activity via the pop-out modal must dispatch `activities.join` / `activities.leave` to `store`, updating `data.activity_participants` in `kobi.demo.v1` and reflecting immediately on the pinned note (`JOINED` stamp and incremented count).
2. **Deep-Link Compatibility (`#activities/:id`):** Navigating directly to an activity URL or from `FacilitySheet.jsx` must open the Activity Detail Modal for that activity without breaking browser history.
3. **Filter Interaction:** Filter chips (`All`, `Community`, `Recycling`, `Joined`) must filter the pinned mini-posters according to `selectActivities(data, viewer, filter)` while keeping the 2026 notice board header intact on a single row.
4. **Hanging Gallery String & Modal:** The sagging catenary string carousel must display the 4 completed events (`Park Clean-Up`, `Garden Harvest`, `Recycling Drive`, `Tree Planting`) with actual pixel-art photos and open the Set 1 Gallery Preview Modal with the Brick Red `CLOSE PREVIEW` button.
5. **No Visual Regression on `#reports` or Shell:** Styling additions must not conflict with existing global rules in `app.css`, `components.css`, or `reports-folders.css`.

---

## File Structure Map

- **Components (`src/features/activities/components/`):**
  - `ActivityIllustrations.jsx`: Exports `buildSteppedRect`, `ARTWORK_IMAGE_MAP`, and `ActivityMiniPosterSvg`.
  - `NoticeBoard.jsx`: Notice board plaque, binder clips, pushpins, category header bar, and pinned mini-posters.
  - `PolaroidGalleryCarousel.jsx`: Sagging catenary string, swing physics, hanging Polaroid frames, and pixel arrow buttons.
  - `ActivityDetailModal.jsx`: Pop-out modal for activity details with interactive `Join activity` / confirmed `Leave activity` flows.
  - `GalleryPreviewModal.jsx`: Set 1 gallery modal with category pill, date, large photo, summary, and Brick Red `CLOSE PREVIEW` button.
- **Page Assembly:**
  - `src/features/activities/ActivitiesPage.jsx`: Replaced with the complete resident Activities Board + Gallery assembly.
  - `src/styles/activities-board.css`: Production stylesheet imported in `src/main.jsx`.
  - `src/App.jsx`: Updated page heading class for `#activities`.
- **Tests:**
  - `tests/unit/activitiesPage.test.js`: Unit tests for `ActivitiesPage` rendering and store interaction.
  - `tests/e2e/activities-integration.spec.js`: E2E test verifying main app resident experience at `/#activities`.

---

## Tasks

### Task 1: Production Component Migration & Unit Test Scaffolding

**Files:**
- Create: `src/features/activities/components/ActivityIllustrations.jsx`
- Create: `src/features/activities/components/NoticeBoard.jsx`
- Create: `src/features/activities/components/PolaroidGalleryCarousel.jsx`
- Create: `src/features/activities/components/GalleryPreviewModal.jsx`
- Create: `tests/unit/activitiesPage.test.js`

**Interfaces:**
- Consumes: `ActivityMiniPosterSvg`, `buildSteppedRect` from `ActivityIllustrations.jsx`.
- Produces: Production-ready NoticeBoard, PolaroidGalleryCarousel, and GalleryPreviewModal components for `src/features/activities/`.

- [ ] **Step 1: Write failing unit test in `tests/unit/activitiesPage.test.js`**

```javascript
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { NoticeBoard } from '../../src/features/activities/components/NoticeBoard.jsx';
import { PolaroidGalleryCarousel } from '../../src/features/activities/components/PolaroidGalleryCarousel.jsx';

describe('Activities Production Components', () => {
  it('renders NoticeBoard with filter chips and year label', () => {
    render(<NoticeBoard activities={[]} activeFilter="all" />);
    expect(screen.getByText('2026')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ALL' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'COMMUNITY' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'RECYCLING' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'JOINED' })).toBeInTheDocument();
  });

  it('renders PolaroidGalleryCarousel with actual event names', () => {
    const items = [
      { id: 'g1', code: 'G1', shortCaption: 'Park Clean-Up', title: 'Township Clean & Green Day', dateLabel: '04 Oct 2026', artworkKey: 'cleanup-event' },
    ];
    render(<PolaroidGalleryCarousel items={items} />);
    expect(screen.getByRole('heading', { name: 'GALLERY' })).toBeInTheDocument();
    expect(screen.getByText('Park Clean-Up')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/activitiesPage.test.js`
Expected: FAIL due to missing files/modules.

- [ ] **Step 3: Migrate components into `src/features/activities/components/`**

Copy and adapt `ActivityIllustrations.jsx`, `NoticeBoard.jsx`, `PolaroidGalleryCarousel.jsx`, and `GalleryPreviewModal.jsx` from `src/dev/activities-sandbox/components/` into `src/features/activities/components/`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/activitiesPage.test.js`
Expected: PASS.

---

### Task 2: Activity Detail Modal & Live Store Command Wiring

**Files:**
- Create: `src/features/activities/components/ActivityDetailModal.jsx`
- Modify: `tests/unit/activitiesPage.test.js`

**Interfaces:**
- Consumes: `store` from `demoStore.js`, `useCommandForm` from `src/app/useCommandForm.js`.
- Produces: `ActivityDetailModal` capable of executing `activities.join` and `activities.leave` commands against the real demo store.

- [ ] **Step 1: Add modal join/leave test to `tests/unit/activitiesPage.test.js`**

```javascript
import { ActivityDetailModal } from '../../src/features/activities/components/ActivityDetailModal.jsx';

it('renders ActivityDetailModal and triggers join callback', () => {
  let joined = false;
  const activity = {
    id: 'act-1',
    title: 'Gotong-Royong Garden',
    category: 'community',
    categoryLabel: 'COMMUNITY',
    dateLabel: '15 Nov 2026',
    timeLabel: '8:00 AM – 11:00 AM',
    location: 'Community Garden',
    participantCount: 18,
    joined: false,
    description: 'Weed raised beds and harvest greens.',
  };
  render(<ActivityDetailModal activity={activity} onJoin={() => { joined = true; }} onClose={() => {}} />);
  expect(screen.getByRole('heading', { name: 'Gotong-Royong Garden' })).toBeInTheDocument();
  const joinBtn = screen.getByRole('button', { name: /Join activity/i });
  joinBtn.click();
  expect(joined).toBe(true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/activitiesPage.test.js`
Expected: FAIL (missing `ActivityDetailModal.jsx`).

- [ ] **Step 3: Create `ActivityDetailModal.jsx` in `src/features/activities/components/`**

Create `ActivityDetailModal.jsx` supporting both direct `onJoin`/`onLeave` callbacks and command execution, with accessible dialog semantics, focus trap, and Escape key close.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/activitiesPage.test.js`
Expected: PASS.

---

### Task 3: Assemble Production `ActivitiesPage.jsx` & Stylesheet Integration

**Files:**
- Modify: `src/features/activities/ActivitiesPage.jsx`
- Create: `src/styles/activities-board.css`
- Modify: `src/main.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `data.activities`, `selectActivities`, `selectParticipation`, `store.dispatch('activities.join')`, `store.dispatch('activities.leave')`.
- Produces: Full resident Activities experience for route `#activities`.

- [ ] **Step 1: Write integration unit test for `ActivitiesPage` with sample store data**

Add test in `tests/unit/activitiesPage.test.js`:
```javascript
import { ActivitiesPage } from '../../src/features/activities/ActivitiesPage.jsx';
import { createSampleData, RESIDENT_ID } from '../../src/lib/demoSamples.js';

it('renders ActivitiesPage with sample activities on Notice Board', () => {
  const data = createSampleData();
  const actor = { id: RESIDENT_ID, role: 'resident' };
  const store = { dispatch: () => true };
  const filters = { activities: 'all' };
  render(<ActivitiesPage data={data} actor={actor} store={store} filters={filters} setFilter={() => {}} />);
  expect(screen.getByRole('heading', { name: 'GALLERY' })).toBeInTheDocument();
  expect(screen.getByText('2026')).toBeInTheDocument();
  expect(screen.getByText(/A greener Saturday/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/activitiesPage.test.js`
Expected: FAIL (old `ActivitiesPage` does not render Notice Board or Gallery).

- [ ] **Step 3: Implement `ActivitiesPage.jsx`, `activities-board.css`, and import in `main.jsx`**

1. Create `src/styles/activities-board.css` containing all approved sandbox styles (tokens only, single-row filter bar, Vanilla board interior with Gold rim, Bungee/Yanone fonts, Brick Red close button).
2. Import `./styles/activities-board.css` in `src/main.jsx`.
3. In `src/App.jsx`, add `activities-page-heading` and `activities-page-title-banner` handling when `route.name === 'activities'`.
4. Update `src/features/activities/ActivitiesPage.jsx` to render:
   - For resident view: The Notice Board displaying published activities (enriched with visual sticker metadata) + the Hanging Polaroid Gallery Carousel + pop-out modals.
   - For non-resident view: The prompt to switch to resident demo (matching `ReportList.jsx`).
   - Deep-link support for `route?.id` opening the pop-out modal immediately.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/activitiesPage.test.js`
Expected: PASS.

---

### Task 4: Full App Verification & E2E Test Suite

**Files:**
- Create: `tests/e2e/activities-integration.spec.js`
- Test: `tests/e2e/activities.spec.js`
- Test: `tests/e2e/activities-sandbox.spec.js`

**Interfaces:**
- Consumes: Main application running at `/#activities`.
- Produces: Automated E2E verification of notice board render, joining/leaving an activity, filter switching, and gallery preview modal.

- [ ] **Step 1: Create `tests/e2e/activities-integration.spec.js`**

```javascript
import { test, expect } from '@playwright/test';

test.describe('Activities Main App Integration', () => {
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

    // Join activity and check persistence
    await modal.getByRole('button', { name: /Join activity/i }).click();
    await expect(modal.getByText(/Joined/i).first()).toBeVisible();

    // Close modal with Escape
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();

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
});
```

- [ ] **Step 2: Run all checks to verify complete pass**

Run:
1. `npm run lint` (0 errors)
2. `npm test` (all 14 unit test files must pass)
3. `npm run build` (vite build succeeds)
4. `npx playwright test tests/e2e/activities-integration.spec.js --reporter=list` (passes)
5. `npx playwright test tests/e2e/activities.spec.js --reporter=list` (existing app tests pass)
6. `npx playwright test tests/e2e/activities-sandbox.spec.js --reporter=list` (sandbox tests pass)

---

## Self-Review Checklist

- [x] **Spec coverage:** Replaces old raw activities list with the approved Set 3 Notice Board and Set 1 Gallery Modal.
- [x] **Step scan:** Each task has an explicit failing test, command to verify, minimal implementation, and verification check.
- [x] **Type consistency:** Identical 5-colour tokens, Bungee/Yanone fonts, and component interfaces preserved.
- [x] **Review Focus:** Covered live store participation dispatch, deep-link routing `#activities/:id`, single-row filter bar, and no regression on existing tests.
- [x] **Proportion:** Plan is structured cleanly in 4 self-contained tasks.
