# Elmina Frekuensi Pixel Neighbourhood Map Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the validated **Classic 2D Grid** pixel neighbourhood map of Persiaran Elmina / Jalan Frekuensi (Seksyen U16 Shah Alam) directly into KoBi's main application (`features/world/TemporaryMap.jsx` & `FacilitySheet.jsx`), complete with lively green grass, roadside streetlights, dense housing, "★ MY HOUSE" tracking, drag-to-pan & hover navigation, and rich amenity inspection while maintaining 100% compatibility with the Staff SDP World Editor.

**Architecture:** 
1. Upgrade `demoSamples.js` and `worldSelectors.js` to model Elmina Seksyen U16 geography, resident home tracking, walking distance estimation, and safe public report history.
2. Upgrade `FacilitySheet.jsx` to render the walking distance estimate, "My House" badge, condition pill, historical report timeline, and scheduled activities.
3. Replace the placeholder SVG in `TemporaryMap.jsx` with the refined Classic 2D Grid map renderer: lively green grass, tile-aligned roads with paved sidewalks, roadside streetlights, 20+ houses with non-overlapping home pin, hover HUD, click-and-drag panning, and "Find my house" navigation.
4. Verify all unit tests, Playwright E2E tests, ESLint, and production build.

**Tech Stack:** React 19, JavaScript (ESM), SVG pixel styling, CSS custom properties, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-20-elmina-pixel-map-design.md`

## Global Constraints
- Only use the 5 approved tokens: `#6C1A21`, `#B92C2C`, `#CEA257`, `#D1BF9A`, and `#E5E0CD` for UI overlays/controls; pixel-world terrain and grass use the lively pixel greens validated in Worldbox.
- Typography: Bungee for headings, buttons, and wordmarks; Yanone Kaffeesatz for body, metadata, and detail text.
- 100% pixelated aesthetic matching KoBi's design tokens.
- Maintain existing test contracts so `worldLayout.test.js` and `temporary-map.spec.js` continue passing seamlessly.

## Review Focus
1. **Compatibility with SDP World Editor:** Adding, moving, and removing catalog components with ghost previews in `WorldEditorPage.jsx` functions seamlessly on the new map.
2. **"★ MY HOUSE" Pinpoint Clearance:** The "★ MY HOUSE" banner over Alex Tan's house (Lot 12) sits within its dedicated courtyard clearance and never overlaps neighbouring houses.
3. **Roadside Streetlight Placement:** All streetlights are positioned on sidewalk verges and never in the middle of road asphalt.
4. **Drag vs Click Discrimination:** Dragging the map does not trigger an accidental click to open the amenity sheet.
5. **Privacy in Public Amenity Sheet:** Public inspection never exposes private complainant names or raw report descriptions.

---

### Task 1: Seed Elmina Geography, Resident Home & Selectors in Main App Core

**Files:**
- Modify: `src/lib/demoSamples.js`
- Modify: `src/features/world/worldSelectors.js`
- Modify: `tests/unit/worldSelectors.test.js`
- Create: `tests/unit/elminaAppIntegration.test.js`

**Interfaces:**
- Consumes: `createSampleData()` from `src/lib/demoSamples.js`
- Produces:
  - `township.name`: `'Elmina West (Seksyen U16)'`
  - `profiles[0].home_facility_id`: `'house-01'`, `profiles[0].home_object_id`: `'object-house-01'`
  - Facilities maintaining test prefixes:
    - `lamp-01`: `'Walkway lamp #01 (Jalan Frekuensi)'`
    - `lamp-02`: `'Walkway lamp #02 (Jalan Frekuensi)'`
    - `lamp-03`: `'Streetlight #10 (Persiaran Elmina)'`
    - `bench-01`: `'Garden bench (Elmina Central Park)'`
    - `park-01`: `'Community garden & park (Elmina Central Park)'`
    - `hall-01`: `'Community hall (Dewan Komuniti Elmina)'`
    - `surau-01`: `'Surau Al-Falah (Elmina U16)'`
    - `recycling-01`: `'Recycling point (Elmina Station)'`
    - `house-01`: `'Neighbourhood house (Alex Tan Home - Lot 12)'`
  - 20+ residential houses in `layout` with non-overlapping clearance for `object-house-01`.
  - `calculateDistanceMeters(posA, posB)`
  - `formatWalkingDistance(meters)`
  - `selectFacilityReportHistory(data, facilityId)`
  - Extended `selectPublicObject(data, objectId, viewer)` with `distanceText`, `isUserHome`, `reportHistory`.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/elminaAppIntegration.test.js` and extend `tests/unit/worldSelectors.test.js`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/elminaAppIntegration.test.js tests/unit/worldSelectors.test.js`
Expected: FAIL

- [ ] **Step 3: Update `src/lib/demoSamples.js` and `src/features/world/worldSelectors.js`**

Implement Elmina data seeding, resident home binding, roadside streetlights, 20+ houses, distance calculation, and report history selector.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/elminaAppIntegration.test.js tests/unit/worldSelectors.test.js tests/unit/worldLayout.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/demoSamples.js src/features/world/worldSelectors.js tests/unit/elminaAppIntegration.test.js tests/unit/worldSelectors.test.js
git commit -m "feat(world): seed Elmina Seksyen U16 geography, home binding, distance and report history selectors"
```

---

### Task 2: Upgrade FacilitySheet with Distance, Condition, Report History & Activities

**Files:**
- Modify: `src/features/world/FacilitySheet.jsx`
- Modify: `src/features/world/world.css`
- Create: `tests/unit/facilitySheet.test.js`

**Interfaces:**
- Consumes: `object` from `selectPublicObject(data, objectId, viewer)`
- Produces:
  - Walking distance estimate badge
  - "My House" badge (for user's home)
  - Condition status pill (`Normal`, `Reported`, `Work in progress`)
  - Report history timeline feed
  - Upcoming activities list
  - "Report a problem" action button
  - Backdrop click & Escape key dismissal

- [ ] **Step 1: Write the failing test**

Create `tests/unit/facilitySheet.test.js`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/facilitySheet.test.js`
Expected: FAIL

- [ ] **Step 3: Update `FacilitySheet.jsx` and `world.css`**

Implement distance display, report history feed, "My House" badge, and palette-compliant styles.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/facilitySheet.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/world/FacilitySheet.jsx src/features/world/world.css tests/unit/facilitySheet.test.js
git commit -m "feat(world): upgrade FacilitySheet with walking distance, report history, and My House badge"
```

---

### Task 3: Integrate Classic 2D Grid Map into `TemporaryMap.jsx`

**Files:**
- Modify: `src/features/world/TemporaryMap.jsx`
- Modify: `src/features/world/world.css`
- Create: `tests/unit/temporaryMap.test.js`

**Interfaces:**
- Consumes: `data`, `route`, `openModal`, `closeModal`, `navigate`, `onSelect`, `ghost`, `compact`, `selectedObjectId`
- Produces:
  - Lively pixel-art meadow grass, park lake, trees, and sidewalks.
  - Tile-aligned roads for Persiaran Elmina and Jalan Frekuensi 1/2/3/4 with crosswalks.
  - Roadside streetlights on sidewalk verges.
  - 20+ houses with dedicated clearance for the "★ MY HOUSE" pinpoint over Lot 12.
  - Interactive hover HUD.
  - Click-and-drag panning (`isDragging`, `pan.x`, `pan.y`) + zoom controls (100% to 300% & Reset view).
  - "Find my house" quick centering button.
  - Preserved `.schematic-card`, `.schematic-viewport`, `.schematic-controls`, `.schematic-scale`, `.schematic-ghost`, and `.schematic-object` hooks for World Editor compatibility.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/temporaryMap.test.js`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/temporaryMap.test.js`
Expected: FAIL

- [ ] **Step 3: Update `TemporaryMap.jsx` and `world.css`**

Integrate the Classic 2D Grid map renderer, drag-to-pan, hover HUD, and "Find my house" button.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/temporaryMap.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/world/TemporaryMap.jsx src/features/world/world.css tests/unit/temporaryMap.test.js
git commit -m "feat(world): integrate Classic 2D Grid map with lively grass, drag-to-pan, and Find my house into main app"
```

---

### Task 4: Full Automated Verification & Production Build

**Files:**
- Modify: `tests/e2e/temporary-map.spec.js` (if needed for updated element text)
- Test: All unit, E2E, and build suites

**Interfaces:**
- Consumes: Full codebase
- Produces:
  - Green Vitest unit test suite (`npm run test`)
  - Green Playwright E2E suite (`npm run test:e2e`)
  - Clean ESLint check (`npm run lint`)
  - Clean production build (`npm run build`)

- [ ] **Step 1: Run full unit test suite**

Run: `npm run test`
Expected: 100% unit tests pass.

- [ ] **Step 2: Run Playwright E2E suite**

Run: `npm run test:e2e`
Expected: 100% Playwright tests pass.

- [ ] **Step 3: Run ESLint**

Run: `npm run lint`
Expected: 0 errors, 0 warnings.

- [ ] **Step 4: Run Vite build**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/temporary-map.spec.js
git commit -m "test(world): verify main app Elmina map integration across unit and E2E suites"
```
