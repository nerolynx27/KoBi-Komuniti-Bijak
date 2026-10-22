# Full-screen approved map — 22 October 2026

The resident `#map` route now fills `100dvh`, without the shared header, narrow column, page heading, card, caption, footer or navigation. Back uses existing app navigation to Home, including direct map URLs. The four bottom controls stay in one row at 320px and 390px, with at least 44px touch targets and safe-area offsets. The visible top-right zoom/sample-neighbourhood readout was removed at the user's request; zoom changes remain available to assistive technology.

The camera fits the complete 640 × 480 assembly without stretching, reserving room for the controls. The catalog's grass pattern continues around the map. Zoom, pointer/touch pan and keyboard focus stay within the viewport, with hidden scrollbar tracks. Reset clears pan and restores the fitted view. Find my house uses the resident's saved home binding and the rendered object's actual bounds, including editor movements. Native modal facility sheets retain focus trapping, Escape/Close and focus restoration above controls.

## Missing artwork investigation

The browser displayed the original six-object pilot mixed with the new scenery and newly introduced assets, instead of the expanded Elmina layout assumed by the previous migration. Its original amenities used provisional 1 × 1 footprints and its lone home used a 3 × 3 footprint. That mismatch translated approved artwork to inappropriate positions, while the missing house IDs prevented their artwork from rendering. The generated catalog data itself contains 54 placements, including 23 houses and twelve independent streetlights; Home already linked to `#map`.

`upgradeApprovedMap` now compares exact placement fingerprints for the untouched original pilot and its known partial-upgrade output. It accepts either historical marker only when no home binding exists. Only those recognized layouts receive the complete approved placements and a home binding. Existing reports, maintenance updates, activities, participants, attachments, preferences, profile text, facility records and envelope revisions survive. The resulting existing map marker and home binding make the repair idempotent. No localStorage clearing or demo reset is used.

A move, addition, removal or custom placement label breaks the original-pilot fingerprint; these ambiguous saves remain untouched. Existing expanded-layout migration still preserves removed original components and edited placements. Approved saves with deliberate removals are never reseeded. This conservative behavior intentionally leaves ambiguous old layouts as saved.

The approved artwork, draw order, clipped light cones, twelve curb lights without labels, Frekuensi signs, mosque label, removed boulevard banners and absent standalone bench are unchanged. Historical bench reports keep their facility reference. Houses and trees remain inspectable without public reporting.

## Verification and evidence

- `npx vitest run`: 195 tests passed across 23 files, including original-pilot repair, exact partial-upgrade repair, idempotence, record/revision preservation and rejection of ambiguous edited layouts.
- `npx eslint src tests/e2e/approved-map.spec.js tests/e2e/dashboard.spec.js tests/e2e/temporary-map.spec.js tests/unit/approvedMapIntegration.test.js tests/unit/temporaryMap.test.js`: passed.
- `npm run build`: passed.
- `graphify update .`: completed with AST-only graph refresh.
- `npx playwright test tests/e2e/approved-map.spec.js tests/e2e/dashboard.spec.js tests/e2e/temporary-map.spec.js --output artifacts/fullscreen-map-complete/results --reporter=list`: all 30 browser tests passed in 1.6 minutes. This run followed the drag-to-keyboard fix and the updated legacy artwork-position assertion.

Fresh captures:

- [320px map](../../artifacts/fullscreen-map-complete/results/approved-map-full-screen-route-fit-controls-and-Back-at-320/fullscreen-320.png)
- [390px map](../../artifacts/fullscreen-map-complete/results/approved-map-full-screen-route-fit-controls-and-Back-at-390/fullscreen-390.png)
- [1280px map](../../artifacts/fullscreen-map-complete/results/approved-map-full-screen-route-fit-controls-and-Back-at-1280/fullscreen-1280.png)

Browser coverage includes Home entry/Back, full viewport bounds and initial map aspect/fit, horizontal controls, all 17 reportable facilities at 320px/390px/1280px, facility-specific report preselection, report submission/reload/condition/dashboard counts, actual touch pan, zoom limits/reset/home, keyboard sheets/focus/Escape, direct facility focus, saved-layout migration, deliberate removals, and editor movement/addition persistence. Dashboard behavior and responsive checks retain their previous coverage. Screenshots and traces use isolated run directories; dashboard captures now use Playwright's per-test output directory too.

The integrated in-app browser was reloaded on the resident map and kept open, with the existing browser save migrated without a reset. Verification uses Chromium emulation, not a physical Android device. No real authentication, server submission or backend was added.
