# Green Accent (`#4ea64b`) Visual Touch-Ups Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the user-selected green accent colour (`#4ea64b`) across KoBi as `--color-leaf`, applying it to the Activities notice board surface, the Reports section backdrop/folder structure, and semantic high-value touchpoints (Resolved status badges, Recycling category accents, and Joined confirmation stamps).

**Architecture:** Define `--color-leaf: #4ea64b;` in `src/styles/tokens.css` with semantic aliases. Update `src/styles/activities-board.css` to transform the notice board interior into a classic community green-felt bulletin board. Update `src/styles/reports-folders.css` to tint the reports section backdrop and folder accents. Apply green accents to recycling flyers, resolved status pills, and joined badges across components.

**Tech Stack:** React 19.3.1, Plain CSS, Inline SVG with `shapeRendering="crispEdges"`, Vitest, Playwright.

**Spec:** User directive 19 October 2026 expanding the 5-colour palette to incorporate `#4ea64b` as a 6th accent colour for township sustainability and community notice board feel.

---

## Global Constraints

- **Expanded Palette Tokens:** `#6C1A21` (`--color-wine`), `#B92C2C` (`--color-cherry`), `#CEA257` (`--color-gold`), `#D1BF9A` (`--color-sand`), `#E5E0CD` (`--color-vanilla`), and `#4ea64b` (`--color-leaf`).
- **Contrast Rule:** `#4ea64b` has a relative luminance of ~0.285.
  - Wine `#6C1A21` text/borders on Leaf `#4ea64b` has a 4.35:1 contrast ratio (exceeds WCAG 3:1 UI component / large text requirements).
  - Vanilla `#E5E0CD` on Leaf `#4ea64b` has a ~2.36:1 contrast ratio (insufficient for body text). Any text placed directly on `#4ea64b` must use Wine `#6C1A21`.
  - Content cards placed over green surfaces (flyer notes, paper sheets) must retain Vanilla `#E5E0CD` / Sand `#D1BF9A` paper fills with 2px/3px Wine borders to guarantee high-contrast legibility.
- **Typography:** Bungee (`--font-heading`, `--font-action`) for headers/badges/buttons; Yanone Kaffeesatz (`--font-body`, `--font-ui`) for body/meta.
- **Zero New Dependencies:** Plain CSS and native React/SVG only.
- **Zero Regressions:** All 14 unit test suites and 3 Playwright E2E suites must remain green.

---

## Review Focus

1. **Activities Notice Board Legibility:** Pinned notes must remain readable when the notice board surface switches from Vanilla to Green Felt. Pins, binder clips, and note cards must pop cleanly.
2. **Folder Assembly Seams in Reports:** The Reports 4-folder assembly (`Report`, `Received`, `In progress`, `Resolved`) uses dynamic SVG jackets and tabs. Changes to backgrounds must not create visual seam artifacts or misaligned tab borders.
3. **Resolved vs In-Progress Distinction:** In Reports, `RESOLVED` pills using `#4ea64b` must stand out distinctly from `IN PROGRESS` (Gold `#CEA257`) and `RECEIVED` (Sand/Wine).
4. **Recycling vs Community Category Distinction:** In Activities, `RECYCLING` flyers and filter chips using `#4ea64b` must be clearly distinct from `COMMUNITY` (Gold `#CEA257`) and `ALL` (Wine/Vanilla).
5. **E2E & Unit Test Assertions:** Existing test locators (e.g. `getByRole('button')`, `getByText('JOINED')`, `getByText('RESOLVED')`) must continue to match without strict-mode or DOM-structure breakages.

---

## Proposed Touch-Up Scope & Recommendations

### 1. Activities Section: Green Felt Community Notice Board
- **Interior Surface (`.act-notice-board-surface`):**
  Transform the plain vanilla interior into a community green felt pinboard (`background-color: var(--color-leaf);`).
  - Warm Gold (`--color-gold`) stepped outer frame rim remains as the wooden/golden border.
  - Pinned flyer notes (Vanilla, Sand, and Gold paper cards with 3px/2px Wine borders) stand out with contrast against the green felt.
  - Top context strip (`.act-board-header-row`): Keep Warm Sand or tint with a subtle green-felt inset border.
- **Filter Chips (`.act-filter-chip`):**
  When `RECYCLING` is selected, or on hover, highlight with green `--color-leaf` accent.

### 2. Reports Section: Desk Mat / Environmental Backdrop & Resolved Accents
- **Section Backdrop / Mat (`.reports-page-bleed` / `.sandbox-folder-assembly`):**
  Add a green felt desk mat backdrop (`background-color: var(--color-leaf)` or top carousel backdrop strip) that grounds the facility carousel and the manila folder assembly.
- **Resolved Folder & Pills:**
  Folder 3 (`Resolved`): Give the resolved folder tab or active jacket a green `--color-leaf` accent to signify completed maintenance.

### 3. Additional High-Value Recommendations Across the App
- **Recommendation A: "RESOLVED" Status Pill in Reports**
  In `ReportsPage.jsx` and `ReportDetail.jsx`, render the `RESOLVED` badge with a `--color-leaf` background and Wine border/text. Provides instant, universally recognized visual affirmation of resolved complaints.
- **Recommendation B: "RECYCLING" Activities Theme & Badges**
  In `NoticeBoard.jsx`, `ActivityIllustrations.jsx`, and `ActivityDetailModal.jsx`, style `RECYCLING` category header bands and category pills with `--color-leaf` instead of cherry red.
- **Recommendation C: "JOINED" Participation Stamp**
  On flyer notes and polaroid previews, render the confirmed "JOINED" sticker with a `--color-leaf` border and text/accent, giving residents positive green confirmation.
- **Recommendation D: Navigation Indicator for Sustainability / Activities**
  Sticker icon or active indicator in bottom navigation for Eco/Community features.

---

## Tasks

### Task 1: Token Definition & Global CSS Variables
**Files:**
- Modify: `src/styles/tokens.css:3-10`
- Test: `tests/unit/activitiesPage.test.js`

- [ ] In `src/styles/tokens.css`, define:
  ```css
  --color-leaf: #4ea64b;
  --surface-felt: var(--color-leaf);
  --badge-positive: var(--color-leaf);
  --category-recycling: var(--color-leaf);
  ```
- [ ] Verify that existing token references remain intact and no existing tokens are removed.
- [ ] Run `npm run lint` and `npm test` to confirm token validity.

---

### Task 2: Notice Board Green Felt Surface & Recycling Accents (Activities)
**Files:**
- Modify: `src/styles/activities-board.css:66-74, 95-120, 200-240`
- Modify: `src/features/activities/components/ActivityIllustrations.jsx` (Recycling badge & header bands)
- Modify: `src/features/activities/components/NoticeBoard.jsx`
- Test: `tests/unit/activitiesPage.test.js`
- Test: `tests/e2e/activities-integration.spec.js`

- [ ] Update `.act-notice-board-surface` in `src/styles/activities-board.css`:
  - Set `background-color: var(--color-leaf);`
  - Ensure 3px Wine outline and interior box shadow give a crisp framed felt appearance.
- [ ] Update recycling note header bands (`.act-note-header-band.is-recycling` and `.act-mini-header-band.is-recycling`) to use `var(--color-leaf)` with `var(--color-wine)` text.
- [ ] Update `.act-filter-chip[data-filter="recycling"].is-selected` and hover states to use `var(--color-leaf)`.
- [ ] Update `.act-note-joined-stamp` to use `var(--color-leaf)` border and highlight.
- [ ] Run `npm test` and `npx playwright test tests/e2e/activities-integration.spec.js` to ensure 100% pass.

---

### Task 3: Reports Section Background & Resolved Badges (Reports)
**Files:**
- Modify: `src/styles/reports-folders.css`
- Modify: `src/features/complaints/ReportsPage.jsx`
- Test: `tests/unit/complaints.test.js`
- Test: `tests/e2e/complaints.spec.js` (or relevant E2E suite)

- [ ] Update `.sandbox-status-pill.is-resolved` in `src/styles/reports-folders.css`:
  - Background: `var(--color-leaf);`
  - Color: `var(--color-wine);`
  - Border: `2px solid var(--color-wine);`
- [ ] Add a subtle green desk mat / framing backdrop for `.sandbox-carousel` or `.reports-page-bleed` top region to tie the facility viewer together.
- [ ] Add green accent to the Resolved Folder top tab / right tab indicator when active.
- [ ] Run `npm test` and `npm run lint`.

---

### Task 4: Full App Verification & Visual Smoke Test
**Files:**
- Test: All unit test suites (`npm test`)
- Test: All E2E suites (`npx playwright test`)
- Verification: Production build (`npm run build`)

- [ ] Run `npm run lint` (0 errors).
- [ ] Run `npm test` (all 14 test suites pass).
- [ ] Run `npm run build` (production build succeeds).
- [ ] Run `npx playwright test tests/e2e/activities-integration.spec.js` (passes).
- [ ] Run `npx playwright test tests/e2e/activities.spec.js` (passes).
- [ ] Verify both `#reports` and `#activities` in the browser at `http://127.0.0.1:5174/` to confirm aesthetic harmony, contrast, and crisp pixel borders.
