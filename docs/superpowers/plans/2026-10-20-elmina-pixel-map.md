# Elmina Frekuensi Pixel Neighbourhood Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dedicated, isolated developer sandbox (`worldbox.html`) featuring **4 distinct interactive pixel map approaches** for Persiaran Elmina / Jalan Frekuensi (Seksyen U16 Shah Alam). Each approach adheres strictly to KoBi's 5-colour palette and typography while presenting different visual styles (Classic 2D Grid, Isometric Diorama, Cartographic Blueprint, and Pixel Stickerboard) so stakeholders can compare and choose between them.

**Architecture:** 
1. Build shared Elmina geography models, distance calculation, and report history selectors.
2. Create standalone dev harness `worldbox.html` with persona toggle (Resident / Staff) and live Approach Switcher (A/B/C/D).
3. Implement 4 distinct SVG/canvas pixel map renderers with zoom/pan, street labels, and "Find my house" navigation.
4. Implement the interactive amenity inspection sheet showing distance, condition, report history, and activities.
5. Verify with automated unit tests and Vite build.

**Tech Stack:** React 19, JavaScript (ESM), SVG pixel styling, CSS custom properties, Vite, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-20-elmina-pixel-map-design.md`

## Global Constraints
- Only use the 5 approved tokens: `#6C1A21`, `#B92C2C`, `#CEA257`, `#D1BF9A`, and `#E5E0CD`.
- Typography: Bungee for headings, buttons, and wordmarks; Yanone Kaffeesatz for body, metadata, and detail text.
- 100% pixelated aesthetic matching KoBi's design tokens.
- All 4 approaches represent the real-world geography of Persiaran Elmina and Jalan Frekuensi (Seksyen U16, Shah Alam).
- Isolated in `worldbox.html` / `src/dev/worldbox/` without breaking existing app code.

## Review Focus
1. **Approach Switcher Smoothness:** Switching between the 4 approaches preserves zoom level, selected amenity, and viewport state.
2. **Staff vs Resident Persona:** When switched to Staff persona, "Find my house" is hidden and distance is not calculated from a resident plot.
3. **User Home Pin Visibility:** In all 4 approaches, Alex Tan's house (`Lot 12, Jalan Frekuensi`) is clearly distinguishable with a "My House" badge.
4. **Zoom & Pan Stability:** Pinch/wheel zoom and button zoom work reliably across all 4 map renderers between 100% and 300%.
5. **Amenity Sheet Richness:** Tapping any amenity across any of the 4 maps displays its condition, walking distance, past report history, and activities.

---

### Task 1: Elmina Seed Data, Distance & Report History Selectors

**Files:**
- Create: `src/dev/worldbox/worldboxData.js`
- Test: `tests/unit/worldboxData.test.js`

**Interfaces:**
- Produces:
  - `ELMINA_TOWNSHIP`: `{ id, name: 'Elmina West (Seksyen U16)', address: 'Persiaran Elmina / Jalan Frekuensi, Seksyen U16, 40160 Shah Alam, Selangor' }`
  - `ELMINA_FACILITIES`: Array of facilities (`house-frekuensi-12`, `hall-elmina`, `park-elmina`, `surau-elmina`, `recycling-elmina`, `lamp-frekuensi-01..03`, `lamp-persiaran-01..02`)
  - `ELMINA_LAYOUT`: Tile coordinates for all facilities, road paths, and residential lots
  - `ELMINA_PERSONAS`: Alex Tan (Resident, home at `house-frekuensi-12`) and SDP Team (Staff)
  - `calculateDistanceMeters(objA, objB): number`
  - `formatWalkingDistance(meters: number): string`
  - `getFacilityReportHistory(facilityId): Array<{ id, status, note, date }>`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/worldboxData.test.js`:
```javascript
import { describe, expect, it } from 'vitest';
import {
  ELMINA_TOWNSHIP,
  ELMINA_FACILITIES,
  ELMINA_LAYOUT,
  calculateDistanceMeters,
  formatWalkingDistance,
  getFacilityReportHistory,
} from '../../src/dev/worldbox/worldboxData.js';

describe('Worldbox Elmina data', () => {
  it('contains the complete Elmina Seksyen U16 layout and amenities', () => {
    expect(ELMINA_TOWNSHIP.address).toContain('Jalan Frekuensi');
    const ids = ELMINA_FACILITIES.map(f => f.id);
    expect(ids).toContain('hall-elmina');
    expect(ids).toContain('park-elmina');
    expect(ids).toContain('surau-elmina');
    expect(ids).toContain('house-frekuensi-12');
  });

  it('calculates walking distance and returns formatted text', () => {
    const dist = calculateDistanceMeters({ x: 0, y: 0 }, { x: 4, y: 3 }); // 5 tiles * 15m = 75m
    expect(dist).toBe(75);
    expect(formatWalkingDistance(dist)).toBe('75 m · ~1 min walk');
  });

  it('provides safe report history for facilities', () => {
    const history = getFacilityReportHistory('lamp-frekuensi-01');
    expect(Array.isArray(history)).toBe(true);
    if (history.length > 0) {
      expect(history[0]).toHaveProperty('status');
      expect(history[0]).not.toHaveProperty('resident_id');
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/worldboxData.test.js`
Expected: FAIL

- [ ] **Step 3: Implement `src/dev/worldbox/worldboxData.js`**

Implement complete Elmina township, facilities, coordinates, personas, distance calculation, and report history.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/worldboxData.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/dev/worldbox/worldboxData.js tests/unit/worldboxData.test.js
git commit -m "feat(worldbox): create Elmina seed data, distance calculator, and report history"
```

---

### Task 2: Worldbox Sandbox Shell & Amenity Detail Sheet

**Files:**
- Create: `worldbox.html`
- Create: `src/dev/worldbox/main.jsx`
- Create: `src/dev/worldbox/WorldboxApp.jsx`
- Create: `src/dev/worldbox/WorldboxFacilitySheet.jsx`
- Create: `src/dev/worldbox/worldbox.css`
- Test: `tests/unit/worldboxShell.test.js`

**Interfaces:**
- Produces:
  - `worldbox.html` accessible in browser
  - Header with title, approach selector (Tabs: Approach 1, 2, 3, 4), and Persona toggle (Resident / Staff)
  - Zoom controls (+, -, reset view) and "Find my house" button
  - `WorldboxFacilitySheet.jsx` displaying condition, walking distance, "My House" badge, report history feed, and activities
  - State management for active approach, active persona, zoom level, pan position, and selected facility

- [ ] **Step 1: Write the failing test**

Create `tests/unit/worldboxShell.test.js` verifying static render of `WorldboxApp` and `WorldboxFacilitySheet`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/worldboxShell.test.js`
Expected: FAIL

- [ ] **Step 3: Implement `worldbox.html`, `main.jsx`, `WorldboxApp.jsx`, `WorldboxFacilitySheet.jsx`, and `worldbox.css`**

Implement full sandbox shell, navigation controls, approach switcher bar, and detail sheet modal.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/worldboxShell.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add worldbox.html src/dev/worldbox/ tests/unit/worldboxShell.test.js
git commit -m "feat(worldbox): build sandbox shell, approach switcher, and amenity detail sheet"
```

---

### Task 3: Implement the 4 Distinct Pixel Map Approaches

**Files:**
- Create: `src/dev/worldbox/maps/ClassicGridMap.jsx` (Approach 1: Classic 2D Orthographic Grid)
- Create: `src/dev/worldbox/maps/IsometricDioramaMap.jsx` (Approach 2: Angled 2.5D Isometric Diorama)
- Create: `src/dev/worldbox/maps/CartographicBlueprintMap.jsx` (Approach 3: Pixel Cartographic Blueprint)
- Create: `src/dev/worldbox/maps/StickerboardPatchMap.jsx` (Approach 4: Pixel Stickerboard Patch)
- Test: `tests/unit/worldboxMaps.test.js`

**Interfaces:**
- Each map component accepts standard props:
  - `{ layout, facilities, selectedId, onSelect, userHomeId, zoom, viewportRef }`
- Produces:
  - Approach 1: Orthogonal retro RPG pixel grid with crisp tile boundaries and road textures.
  - Approach 2: 2.5D angled isometric view with building facades, roof slopes, and dimensional depth.
  - Approach 3: Bold civic blueprint transit map with chunky pixel strokes, high-contrast road corridors, and prominent landmark badges.
  - Approach 4: Tactile pixel-sticker board with die-cut badge amenities, dashed parcel outlines, and playful tactile hover/tap states.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/worldboxMaps.test.js` asserting that all 4 map components render SVG elements, handle click selections, and highlight the user's home.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/worldboxMaps.test.js`
Expected: FAIL

- [ ] **Step 3: Implement the 4 map components in `src/dev/worldbox/maps/`**

Build each map renderer according to its distinct artistic approach while keeping coordinates, amenities, labels, and interactions synchronized.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/worldboxMaps.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/dev/worldbox/maps/ tests/unit/worldboxMaps.test.js
git commit -m "feat(worldbox): implement 4 distinct pixel map approaches for Elmina"
```

---

### Task 4: Connect Maps to WorldboxApp & Full Interactive Verification

**Files:**
- Modify: `src/dev/worldbox/WorldboxApp.jsx`
- Modify: `src/dev/worldbox/worldbox.css`
- Test: `tests/unit/worldboxIntegration.test.js`

**Interfaces:**
- Integrates all 4 maps into `WorldboxApp.jsx`
- Verifies smooth switching, zoom bounds (100% to 300%), "Find my house" centering, and opening `WorldboxFacilitySheet`

- [ ] **Step 1: Write the failing integration test**

Create `tests/unit/worldboxIntegration.test.js`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/worldboxIntegration.test.js`
Expected: FAIL

- [ ] **Step 3: Wire map switcher in `WorldboxApp.jsx` and polish styling**

Connect active map selector, sync zoom/pan viewport, verify "Find my house" scrolls to resident's lot, and wire clicking amenities to open detail sheet.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/worldboxIntegration.test.js`
Expected: PASS

- [ ] **Step 5: Run full test suite and Vite production build**

Run: `npm run test` and `npm run build`
Expected: All tests pass and Vite builds `worldbox.html` cleanly.

- [ ] **Step 6: Commit**

```bash
git add src/dev/worldbox/ tests/unit/worldboxIntegration.test.js
git commit -m "feat(worldbox): complete interactive 4-map comparison sandbox"
```
