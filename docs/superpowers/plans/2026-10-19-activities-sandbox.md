# Activities Design Sandbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an isolated Activities Design Sandbox (`activities-sandbox.html` and `src/dev/activities-sandbox/`) implementing the selected **Set 3 Default Activities Landing Page** (ticket-notched `ACTIVITIES` banner, `2026` Notice Board with binder clips and colour-classified illustrated mini-poster notes, and bottom `GALLERY` hanging Polaroid line carousel) combined with the **Set 1 Gallery Polaroid Tapped Modal** (`CLOSE PREVIEW` lightbox modal) and an interactive **Activity Detail Pop-Out Modal** for joining/leaving activities.

**Architecture:** Mirror the isolated sandbox pattern established in `reports-sandbox.html` and `src/dev/reports-sandbox/` so the new Activities UI can be developed, previewed, and tested without altering production routes until approved. Reuse shared CSS tokens (`src/styles/tokens.css`), typography (`Bungee` and `Yanone Kaffeesatz`), and stepped SVG frame geometry (`PixelFrame` / `CarouselCard` patterns), while implementing the hanging Polaroid catenary-string carousel (`@kedhareswer/polaroid-line-carousel` mechanics) and pixel-art SVG illustrations in zero-dependency React 19 + plain CSS.

**Tech Stack:** React 19.3.1, Vite 8.3.4, plain CSS, inline SVG (`shapeRendering="crispEdges"`), Vitest 5.0.5, and Playwright 1.64.1. No external npm packages or Tailwind dependencies added.

**Spec:**
- Authoritative design & token rules: [`docs/product/product.md`](../../product/product.md)
- Selected default landing visual reference (Set 3): [`art/activities-explorations/03-illustrated-flyers-default.jpg`](../../../art/activities-explorations/03-illustrated-flyers-default.jpg)
- Selected gallery tapped modal reference (Set 1): [`art/activities-explorations/01-classic-bulletin-gallery-tapped.jpg`](../../../art/activities-explorations/01-classic-bulletin-gallery-tapped.jpg)

## Global Constraints

- **Strict 5-Colour Palette Only**: All authored UI surfaces, borders, text, shadows, pins, clips, string lines, badges, and SVG illustrations in the sandbox must use only:
  - `--color-wine`: `#6C1A21` (Ink outlines, text, hard shadows, catenary string, modal backdrop)
  - `--color-cherry`: `#B92C2C` (Pushpin heads, Recycling category header bands/badges, `CLOSE PREVIEW` button fill, folded corner accents)
  - `--color-gold`: `#CEA257` (`ACTIVITIES` plaque fill, Community note fill, Community category badge, selected Polaroid rim, primary `JOIN ACTIVITY` button)
  - `--color-sand`: `#D1BF9A` (`2026` Notice Board surface, quiet controls, secondary card fills)
  - `--color-vanilla`: `#E5E0CD` (Page background, Recycling/Workshop note fills, Polaroid external frames, modal surfaces, inverse text on Cherry/Wine)
- **Contrast Rules**: Never place Cherry (`#B92C2C`) normal text directly on Sand (`#D1BF9A`, 3.36:1) or Gold (`#CEA257`, 2.58:1). Use Wine (`#6C1A21`) text on Vanilla/Sand/Gold, and Vanilla (`#E5E0CD`) text on Cherry/Wine.
- **Typography**: Only **Bungee** (`--font-heading`, `--font-action`, `--font-brand`, weight 400) for headers (`ACTIVITIES`, `2026`, `GALLERY`), modal titles, badges, and all buttons; only **Yanone Kaffeesatz** (`--font-body`, `--font-ui`, weights 400/700) for activity dates, descriptions, participant counts, and Polaroid captions.
- **Language**: All code, UI copy, labels, ARIA attributes, and sample records must be in English.
- **Verification Gate**: Every task must leave `npm run lint` (0 errors), `npm test` (137+ unit tests passing), and `npm run build` passing from the project root.

## Review Focus

1. **Keyboard & Screen Reader Accessibility on Tilted Pinned Notes and Hanging Polaroids**: CSS rotations (`transform: rotate(...)`) on pinned notes and hanging Polaroids must not clip focus outlines (`outline: 2px solid var(--color-wine); box-shadow: 0 0 0 6px var(--color-vanilla)`), and every pinned note and Polaroid frame must be a real `<button type="button">` with descriptive `aria-label`. Covered in Tasks 2, 3, and 4.
2. **Reduced Motion Compliance (`prefers-reduced-motion: reduce`)**: Drag/arrow velocity swing animations on the hanging Polaroid string and modal pop-in transitions must settle instantaneously when `prefers-reduced-motion: reduce` is active. Covered in Task 3.
3. **Modal Focus Trap & Escape Handling**: Opening either the **Activity Detail Modal** (from a pinned note) or the **Set 1 Gallery Preview Modal** (from a hanging Polaroid) must move focus into the modal, close on `Escape` or backdrop click, and restore focus to the triggering note/Polaroid on close. Only one modal may be open at a time. Covered in Tasks 2 and 3.
4. **Idempotent Join / Confirmed Leave Persistence**: Clicking `Join Activity` in the Activity Detail Modal must prevent duplicate joins, increment `participantCount` by 1, mark `joined: true`, and persist to `localStorage` (`kobi.activities.sandbox.v1`). Leaving an already-joined activity requires an inline or modal confirmation step before decrementing. Covered in Task 1 and Task 2.
5. **No Horizontal Overflow at 360×800 and 390×844**: Tilted notes inside the `2026` Notice Board and edge Polaroids (`G1`, `G3`) on the sagging string must stay within the `min(100%, 480px)` shell without causing `document.documentElement.scrollWidth > window.innerWidth`. Covered in Task 4.

---

## File Structure

- Create: `activities-sandbox.html` — Isolated HTML entry point at project root (mirrors `reports-sandbox.html`).
- Create: `src/dev/activities-sandbox/main.jsx` — React root mount importing shared token/component styles and `activities-sandbox.css`.
- Create: `src/dev/activities-sandbox/activitiesSandboxData.js` — Sample activities (Community & Recycling), gallery event items (`G1`–`G4`), storage helpers (`loadActivitiesSandboxState`, `saveActivitiesSandboxState`, `resetActivitiesSandboxState`), and pure state-transition helpers (`toggleJoinActivity`).
- Create: `src/dev/activities-sandbox/components/ActivityIllustrations.jsx` — 5-colour 16-bit pixel-art inline SVG illustrations for the mini-poster notes (`garden-harvest`, `ewaste-bins`, `upcycling-craft`, `tai-chi`) and gallery event snapshots (`cleanup-event`, `recycling-drive`, `harvest-day`, `tree-planting`).
- Create: `src/dev/activities-sandbox/components/NoticeBoard.jsx` — Set 3 `2026` Notice Board with top binder clips, category filter chips, colour-coded tilted mini-poster pinned notes, pushpins, and folded pixel corners.
- Create: `src/dev/activities-sandbox/components/ActivityDetailModal.jsx` — Pop-out activity poster modal displaying full details, date/time, venue, participant count, and `Join Activity` / confirmed `Leave Activity` actions.
- Create: `src/dev/activities-sandbox/components/PolaroidGalleryCarousel.jsx` — Hanging Polaroid Line Carousel with catenary SVG string, binder clips, drag/arrow/keyboard slide & swing physics, and active gold highlight rim.
- Create: `src/dev/activities-sandbox/components/GalleryPreviewModal.jsx` — Set 1 Gallery Polaroid Tapped Modal with category pill, event date, Bungee title, large pixel-art photo, event summary caption, and full-width Cherry `CLOSE PREVIEW` button.
- Create: `src/dev/activities-sandbox/ActivitiesSandboxApp.jsx` — Main sandbox shell assembling the Set 3 Header (`X` button, `STATUS` / persona pill, ticket-notched `ACTIVITIES` banner), Body (`NoticeBoard`), Footer (`PolaroidGalleryCarousel`), bottom navigation (`SandboxBottomNav`), and modals.
- Create: `src/dev/activities-sandbox/activities-sandbox.css` — Contained stylesheet using strictly the 5 semantic/primitive colour tokens and Bungee/Yanone Kaffeesatz font tokens.
- Create: `tests/unit/activitiesSandbox.test.js` — Unit tests for sandbox data initialization, category classification, and join/leave state transitions.
- Create: `tests/e2e/activities-sandbox.spec.js` — Playwright E2E verification for Set 3 landing layout, pinned note modal + join/leave flow, Set 1 gallery Polaroid tap + `CLOSE PREVIEW` modal, 5-colour palette compliance, and zero horizontal overflow.

---

### Task 1: Sandbox Data Contract, Pure State Helpers & Entry Point

**Files:**
- Create: `src/dev/activities-sandbox/activitiesSandboxData.js`
- Create: `tests/unit/activitiesSandbox.test.js`
- Create: `activities-sandbox.html`

**Interfaces:**
- Consumes: Browser `localStorage` (optional, falls back gracefully in Node unit tests).
- Produces:
  - `ACTIVITIES_SANDBOX_STORAGE_KEY = 'kobi.activities.sandbox.v1'`
  - `INITIAL_SANDBOX_ACTIVITIES`: Array of 4 pinned board activities:
    1. `act-garden-101` (`category: 'community'`, `noteTheme: 'gold'`, `title: 'Gotong-Royong Garden'`, `dateLabel: '15 NOV 2026'`, `timeLabel: '8:00 AM – 11:00 AM · Malaysia time'`, `location: 'Community Garden'`, `artworkKey: 'garden-harvest'`, `participantCount: 18`, `joined: false`, `tiltDeg: -3`)
    2. `act-ewaste-102` (`category: 'recycling'`, `noteTheme: 'sand-cherry'`, `title: 'E-Waste & Plastic Drive'`, `dateLabel: '22 NOV 2026'`, `timeLabel: '9:00 AM – 1:00 PM · Malaysia time'`, `location: 'Recycling Point'`, `artworkKey: 'ewaste-bins'`, `participantCount: 32`, `joined: true`, `tiltDeg: 1.5`)
    3. `act-upcycle-103` (`category: 'recycling'`, `noteTheme: 'vanilla-cherry'`, `title: 'Upcycling Craft Workshop'`, `dateLabel: '29 NOV 2026'`, `timeLabel: '2:30 PM – 5:00 PM · Malaysia time'`, `location: 'Community Hall'`, `artworkKey: 'upcycling-craft'`, `participantCount: 14`, `joined: false`, `tiltDeg: -2`)
    4. `act-taichi-104` (`category: 'community'`, `noteTheme: 'gold'`, `title: 'Morning Tai Chi Session'`, `dateLabel: '05 DEC 2026'`, `timeLabel: '7:30 AM – 9:00 AM · Malaysia time'`, `location: 'Central Park Pavilion'`, `artworkKey: 'tai-chi'`, `participantCount: 21`, `joined: false`, `tiltDeg: 2`)
  - `INITIAL_GALLERY_ITEMS`: Array of 4 completed event Polaroids (`G1`, `G2`, `G3`, `G4`):
    1. `gal-1` (`code: 'G1'`, `shortCaption: 'past clean-up'`, `category: 'community'`, `dateLabel: '04 Oct 2026'`, `title: 'Township Clean & Green Day'`, `summary: 'Collected 145 kg of recyclables and cleared walkway planters with 28 resident volunteers.'`, `participants: 28`, `artworkKey: 'cleanup-event'`)
    2. `gal-2` (`code: 'G2'`, `shortCaption: 'in green events'`, `category: 'community'`, `dateLabel: '12 Oct 2026'`, `title: 'Community Garden Harvest Day'`, `summary: 'Successful neighbourhood harvest gathering with 35 resident participants.'`, `participants: 35`, `artworkKey: 'harvest-day'`)
    3. `gal-3` (`code: 'G3'`, `shortCaption: 'green events'`, `category: 'recycling'`, `dateLabel: '18 Oct 2026'`, `title: 'Weekend E-Waste Sorting Drive'`, `summary: 'Sorted 180 kg of household electronics, batteries and recyclable plastics at the Recycling Point.'`, `participants: 42`, `artworkKey: 'recycling-drive'`)
    4. `gal-4` (`code: 'G4'`, `shortCaption: 'sapling drive'`, `category: 'community'`, `dateLabel: '19 Oct 2026'`, `title: 'Neighbourhood Tree Planting'`, `summary: 'Planted 20 shade saplings along the north playground walkway with families and youth.'`, `participants: 30`, `artworkKey: 'tree-planting'`)
  - `joinSandboxActivity(activities, activityId)` -> returns updated array with `joined: true` and `participantCount + 1` (idempotent if already joined).
  - `leaveSandboxActivity(activities, activityId)` -> returns updated array with `joined: false` and `Math.max(0, participantCount - 1)` (idempotent if not joined).
  - `filterSandboxActivities(activities, filter)` -> filters by `'all' | 'community' | 'recycling' | 'joined'`.

- [ ] **Step 1: Write the failing unit test in `tests/unit/activitiesSandbox.test.js`**

```js
import { describe, expect, it } from 'vitest';
import {
  INITIAL_GALLERY_ITEMS,
  INITIAL_SANDBOX_ACTIVITIES,
  filterSandboxActivities,
  joinSandboxActivity,
  leaveSandboxActivity,
} from '../../src/dev/activities-sandbox/activitiesSandboxData.js';

describe('activitiesSandboxData', () => {
  it('provides colour-classified Community and Recycling activities and Gallery items', () => {
    expect(INITIAL_SANDBOX_ACTIVITIES.length).toBeGreaterThanOrEqual(3);
    expect(INITIAL_SANDBOX_ACTIVITIES.some(a => a.category === 'community' && a.noteTheme === 'gold')).toBe(true);
    expect(INITIAL_SANDBOX_ACTIVITIES.some(a => a.category === 'recycling')).toBe(true);
    expect(INITIAL_GALLERY_ITEMS.map(g => g.code)).toEqual(['G1', 'G2', 'G3', 'G4']);
  });

  it('joins and leaves an activity idempotently while updating participantCount', () => {
    const target = INITIAL_SANDBOX_ACTIVITIES.find(a => !a.joined);
    const afterJoin = joinSandboxActivity(INITIAL_SANDBOX_ACTIVITIES, target.id);
    const updated = afterJoin.find(a => a.id === target.id);
    expect(updated.joined).toBe(true);
    expect(updated.participantCount).toBe(target.participantCount + 1);

    // Idempotent second join
    const afterDuplicateJoin = joinSandboxActivity(afterJoin, target.id);
    expect(afterDuplicateJoin.find(a => a.id === target.id).participantCount).toBe(target.participantCount + 1);

    // Leave
    const afterLeave = leaveSandboxActivity(afterDuplicateJoin, target.id);
    const left = afterLeave.find(a => a.id === target.id);
    expect(left.joined).toBe(false);
    expect(left.participantCount).toBe(target.participantCount);
  });

  it('filters activities by all, community, recycling, and joined', () => {
    expect(filterSandboxActivities(INITIAL_SANDBOX_ACTIVITIES, 'all')).toHaveLength(INITIAL_SANDBOX_ACTIVITIES.length);
    expect(filterSandboxActivities(INITIAL_SANDBOX_ACTIVITIES, 'community').every(a => a.category === 'community')).toBe(true);
    expect(filterSandboxActivities(INITIAL_SANDBOX_ACTIVITIES, 'recycling').every(a => a.category === 'recycling')).toBe(true);
    expect(filterSandboxActivities(INITIAL_SANDBOX_ACTIVITIES, 'joined').every(a => a.joined)).toBe(true);
  });
});
```

- [ ] **Step 2: Run the unit test to verify it fails**

Run: `npm test -- tests/unit/activitiesSandbox.test.js`
Expected: FAIL with cannot find module `../../src/dev/activities-sandbox/activitiesSandboxData.js`.

- [ ] **Step 3: Implement `src/dev/activities-sandbox/activitiesSandboxData.js` and `activities-sandbox.html`**

Create `src/dev/activities-sandbox/activitiesSandboxData.js` with the exported constants, pure state functions (`joinSandboxActivity`, `leaveSandboxActivity`, `filterSandboxActivities`), and `localStorage` persistence helpers (`loadSandboxActivities`, `saveSandboxActivities`). Create `activities-sandbox.html` at the project root matching `reports-sandbox.html` (`theme-color="#E5E0CD"`, preloading `/assets/ui/bungee-regular.ttf` and `/assets/ui/yanone-kaffeesatz-variable.ttf`, mounting `/src/dev/activities-sandbox/main.jsx`).

- [ ] **Step 4: Run the unit test to verify it passes**

Run: `npm test -- tests/unit/activitiesSandbox.test.js`
Expected: PASS (3 tests passing).

---

### Task 2: Set 3 Header, `2026` Notice Board, Pinned Notes & Activity Detail Pop-Out Modal

**Files:**
- Create: `src/dev/activities-sandbox/components/ActivityIllustrations.jsx`
- Create: `src/dev/activities-sandbox/components/NoticeBoard.jsx`
- Create: `src/dev/activities-sandbox/components/ActivityDetailModal.jsx`

**Interfaces:**
- Consumes: `INITIAL_SANDBOX_ACTIVITIES` item shape from Task 1.
- Produces:
  - `ActivityMiniPosterSvg({ artworkKey, title, large = false })` in `ActivityIllustrations.jsx` — renders crisp 5-colour 16-bit SVG artwork (`garden-harvest`, `ewaste-bins`, `upcycling-craft`, `tai-chi`, `cleanup-event`, `recycling-drive`, `harvest-day`, `tree-planting`).
  - `ActivitiesBannerPlaque({ title = 'ACTIVITIES' })` and `NoticeBoard({ activities, activeFilter, onFilterChange, onSelectActivity })` in `NoticeBoard.jsx`:
    - Renders the Set 3 ticket-notched `ACTIVITIES` plaque in Gold (`#CEA257`) with Wine (`#6C1A21`) stepped border and 4px hard shadow.
    - Renders the `2026` Notice Board container with top-left and top-right pixel binder clips, double-stepped Wine/Gold/Sand border, `2026` Bungee label, category filter chips (`All`, `Community`, `Recycling`, `Joined`), and the staggered grid of pinned mini-poster notes.
    - Each pinned note is a `<button type="button" className="act-pinned-note ...">` with a pixel pushpin SVG at the top, colour-classified surface (`note-theme-gold` for Community, `note-theme-sand-cherry` / `note-theme-vanilla-cherry` with Cherry header band for Recycling), mini pixel illustration (`ActivityMiniPosterSvg`), Bungee title, Yanone Kaffeesatz date & participant count, category sticker badge (`COMMUNITY` / `RECYCLING`), and a `JOINED` sticker stamp when `activity.joined === true`.
  - `ActivityDetailModal({ activity, onClose, onJoin, onLeave })` in `ActivityDetailModal.jsx`:
    - Renders a stepped Pixel Stickers modal dialog (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`) showing the enlarged activity poster illustration, category & status badges, date/time, facility location, participant count, description, and the primary `JOIN ACTIVITY` sticker button (or `JOINED · LEAVE ACTIVITY` with a two-step inline confirmation `Confirm Leave` / `Keep Spot`).

- [ ] **Step 1: Implement `src/dev/activities-sandbox/components/ActivityIllustrations.jsx`**

Author crisp `shapeRendering="crispEdges"` SVG illustrations using only `var(--color-wine)`, `var(--color-cherry)`, `var(--color-gold)`, `var(--color-sand)`, and `var(--color-vanilla)` for both the pinned mini-posters and the gallery event photos.

- [ ] **Step 2: Implement `src/dev/activities-sandbox/components/NoticeBoard.jsx`**

Implement `ActivitiesBannerPlaque`, `PixelBinderClip`, `PixelPushpin`, and `NoticeBoard`. Ensure every pinned note button exposes a complete `aria-label` (e.g., `"Gotong-Royong Garden, Community activity on 15 NOV 2026, 18 joined"`).

- [ ] **Step 3: Implement `src/dev/activities-sandbox/components/ActivityDetailModal.jsx`**

Implement the pop-out activity poster modal with `Escape` key handling, backdrop click close, initial focus on the primary action or close button, and confirmed leave workflow.

- [ ] **Step 4: Run `npm run lint` to verify zero ESLint errors in the new components**

Run: `npm run lint`
Expected: PASS with 0 errors.

---

### Task 3: Hanging Polaroid Line Carousel & Set 1 Gallery Preview Modal

**Files:**
- Create: `src/dev/activities-sandbox/components/PolaroidGalleryCarousel.jsx`
- Create: `src/dev/activities-sandbox/components/GalleryPreviewModal.jsx`

**Interfaces:**
- Consumes: `INITIAL_GALLERY_ITEMS` from Task 1 and `ActivityMiniPosterSvg` from Task 2.
- Produces:
  - `PolaroidGalleryCarousel({ items, selectedId, onSelectPolaroid })` in `PolaroidGalleryCarousel.jsx`:
    - Renders the `GALLERY` section header in Bungee with Prev/Next stepped pixel arrow buttons (`<` / `>`) and keyboard Left/Right support.
    - Renders the curved catenary SVG string (`<path d="M 0,14 Q 240,54 480,14" />` in `--color-wine`) across the gallery stage.
    - Renders visible hanging Polaroids (`G1`, `G2`, `G3`, and slides along the string for `G4`) with top pixel binder-clip pegs positioned along the quadratic Bezier curve $y(t) = (1-t)^2 y_0 + 2(1-t)t y_1 + t^2 y_2$ and tangent tilt angle, plus pointer/touch horizontal drag and velocity-based swing damping (`requestAnimationFrame` spring settle, bypassed when `prefers-reduced-motion: reduce` is active).
    - The selected Polaroid displays a Warm Gold (`#CEA257`) outer highlight rim (`is-selected`). Tapping any Polaroid calls `onSelectPolaroid(item)`, which centers/selects it on the string and opens the Set 1 preview modal.
  - `GalleryPreviewModal({ item, onClose, onSelectNeighbour })` in `GalleryPreviewModal.jsx`:
    - Implements the exact **Set 1 Gallery Polaroid Tapped Modal** layout:
      - Stepped Cream (`#E5E0CD`) + Wine (`#6C1A21`) modal frame with 4px hard shadow over a dimmed backdrop.
      - Top metadata row: Category badge (`COMMUNITY` in Gold `#CEA257` or `RECYCLING` in Cherry `#B92C2C`) on the left + Event date (`12 Oct 2026`) on the right.
      - Centered Bungee heading (`Community Garden Harvest Day`).
      - Framed large 16-bit pixel-art event illustration (`ActivityMiniPosterSvg large`).
      - Centered Yanone Kaffeesatz summary caption (`Successful neighbourhood harvest gathering with 35 resident participants.`).
      - Full-width Brick Red (`#B92C2C`) stepped Pixel Stickers button reading **`CLOSE PREVIEW`** with Vanilla (`#E5E0CD`) Bungee text.

- [ ] **Step 1: Implement `src/dev/activities-sandbox/components/PolaroidGalleryCarousel.jsx`**

Build the catenary string SVG, pixel binder-clip pegs, Polaroid frame buttons (`G1`, `G2`, `G3`, `G4`), pointer drag + arrow navigation, and damped swing physics.

- [ ] **Step 2: Implement `src/dev/activities-sandbox/components/GalleryPreviewModal.jsx`**

Build the Set 1 `CLOSE PREVIEW` lightbox modal with `Escape` key handling, backdrop click close, and accessible dialog semantics.

- [ ] **Step 3: Run `npm run lint` to verify zero lint errors**

Run: `npm run lint`
Expected: PASS with 0 errors.

---

### Task 4: Assemble `ActivitiesSandboxApp`, Stylesheet, Build Integration & E2E Verification

**Files:**
- Create: `src/dev/activities-sandbox/ActivitiesSandboxApp.jsx`
- Create: `src/dev/activities-sandbox/main.jsx`
- Create: `src/dev/activities-sandbox/activities-sandbox.css`
- Modify: `vite.config.js` (add multi-page build inputs or ensure dev/build works cleanly without breaking production bundle expectations)
- Create: `tests/e2e/activities-sandbox.spec.js`

**Interfaces:**
- Consumes: `NoticeBoard`, `ActivityDetailModal`, `PolaroidGalleryCarousel`, `GalleryPreviewModal`, `SandboxBottomNav`, `SandboxBurgerDrawer`, and `activitiesSandboxData`.
- Produces: Complete interactive sandbox at `http://127.0.0.1:5173/activities-sandbox.html` verified by Playwright E2E and unit tests.

- [ ] **Step 1: Implement `src/dev/activities-sandbox/ActivitiesSandboxApp.jsx`, `main.jsx`, and `activities-sandbox.css`**

Assemble the Set 3 top bar (left stepped `X` close/back button, top `STATUS` / persona pill, and burger drawer toggle), `ActivitiesBannerPlaque` (`ACTIVITIES`), `NoticeBoard` (`2026` board with colour-coded pinned notes), `PolaroidGalleryCarousel` (`GALLERY` with `G1`–`G4` on the sagging string), `SandboxBottomNav` (`active="activities"`), `ActivityDetailModal`, and `GalleryPreviewModal`. Style all components in `activities-sandbox.css` using only the 5 approved colour tokens and 2 font families.

- [ ] **Step 2: Write the Playwright E2E test in `tests/e2e/activities-sandbox.spec.js`**

```js
import { test, expect } from '@playwright/test';

const wine = 'rgb(108, 26, 33)',
  cherry = 'rgb(185, 44, 44)',
  gold = 'rgb(206, 162, 87)',
  sand = 'rgb(209, 191, 154)',
  vanilla = 'rgb(229, 224, 205)';

test.describe('Activities Design Sandbox (Set 3 Landing + Set 1 Gallery Modal)', () => {
  test('renders Set 3 ACTIVITIES header, 2026 notice board with colour-coded pinned notes, and hanging Polaroid gallery', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/activities-sandbox.html');
    await page.evaluate(() => document.fonts.ready);

    await expect(page.getByRole('heading', { name: 'ACTIVITIES', level: 1 })).toBeVisible();
    await expect(page.getByText('2026')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'GALLERY' })).toBeVisible();

    // Pinned notes for Community and Recycling
    await expect(page.getByRole('button', { name: /Gotong-Royong Garden/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /E-Waste & Plastic Drive/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Upcycling Craft Workshop/i })).toBeVisible();

    // No horizontal overflow
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    // Strictly uses the 5-colour palette
    const textColors = await page.locator(':is(h1,h2,h3,p,span,button)').evaluateAll(els =>
      els.filter(el => el.checkVisibility()).map(el => getComputedStyle(el).color)
    );
    for (const c of textColors) {
      expect([wine, cherry, gold, sand, vanilla]).toContain(c);
    }
  });

  test('pops out Activity Detail Modal when a pinned note is clicked and allows joining and leaving', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/activities-sandbox.html');

    await page.getByRole('button', { name: /Gotong-Royong Garden/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Gotong-Royong Garden' })).toBeVisible();
    await expect(dialog.getByText(/18 joined/i)).toBeVisible();

    await dialog.getByRole('button', { name: /Join activity/i }).click();
    await expect(dialog.getByText(/19 joined/i)).toBeVisible();
    await expect(dialog.getByText(/Joined/i).first()).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('selects Polaroid on string and opens Set 1 Gallery Preview Modal with CLOSE PREVIEW button when tapped', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/activities-sandbox.html');

    const polaroidG2 = page.getByRole('button', { name: /G2.*Community Garden Harvest Day/i });
    await polaroidG2.click();

    await expect(polaroidG2).toHaveClass(/is-selected/);
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(modal.getByRole('heading', { name: 'Community Garden Harvest Day' })).toBeVisible();
    await expect(modal.getByText('12 Oct 2026')).toBeVisible();
    await expect(modal.getByText(/Successful neighbourhood harvest gathering/i)).toBeVisible();

    const closeBtn = modal.getByRole('button', { name: 'CLOSE PREVIEW' });
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });
});
```

- [ ] **Step 3: Run unit tests, linter, build, and Playwright E2E tests**

Run:
- `npm run lint`
- `npm test`
- `npm run build`
- `npx playwright test tests/e2e/activities-sandbox.spec.js --reporter=list`
Expected: 0 lint errors, all unit tests pass, production build succeeds, and all 3 E2E tests pass.
