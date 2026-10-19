# UI Colour Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Apply the approved five-colour palette consistently to the existing resident and SDP interfaces without changing behavior, typography or Pixel Stickers geometry.

**Architecture:** Replace the primitive palette in the shared CSS tokens and retain the existing semantic-token interface. Most components inherit the change automatically. Correct the few hard-coded and translucent treatments separately, then verify actual rendered states across representative workflows.

**Tech Stack:** Existing JavaScript/JSX, React, plain CSS, Vite and Playwright; no new dependencies.

**Spec:** [product.md, Sections 3 and 5–10](../../product/product.md). The palette and contrast decisions are already approved; this plan does not select another design direction.

**Status:** Executed after user approval on 19 October 2026. See [verification](../../verification/UI_COLOUR_MIGRATION.md) for actual results and limitations. No Git repository is initialized in this folder; no branch/commit work was performed.

## Global constraints

- Only `#6C1A21`, `#B92C2C`, `#CEA257`, `#D1BF9A` and `#E5E0CD` may be authored as UI colours. No extra tints, shades, gradients, white/black/grey additions or disabled-opacity treatments.
- Keep Bungee for headings/buttons/branding and Yanone Kaffeesatz for body/supporting/form text. Do not reacquire fonts or change their metrics.
- Preserve semantic HTML, inline SVG frames/icons, stepped geometry, hard shadows, focus behavior, 44 px touch targets, responsive layout and English copy.
- Include forms, resident pages, SDP pages, navigation, account views, feedback, dialogs, notifications, the temporary schematic and editor controls/previews.
- Future pixel-world artwork and photo content are exempt; UI controls and overlays over that world are included. Do not implement or recolour future world artwork.
- Keep the local demo store, report transitions, participation, persistence and reset behavior unchanged. No backend, deployment or new package work.
- Transparent cutouts and absent paint are geometry, not extra colours. Browser font antialiasing and photo pixels are not authored palette additions.
- Retain historical verification evidence. Save new captures under `artifacts/colour-migration/`, separately from previous captures.

## Intended colour roles

| Colour | Use |
|---|---|
| Wine `#6C1A21` | All normal/supporting/disabled text, borders, hard shadows, focus outlines and strong buttons |
| Cherry `#B92C2C` | Destructive buttons, error indicators and decorative folds |
| Gold `#CEA257` | Primary actions, selected controls and active navigation |
| Sand `#D1BF9A` | Quiet actions, context panels, read-only and disabled surfaces |
| Vanilla `#E5E0CD` | Page/panel/input surfaces, inner rims, inverse text and error-text surfaces |

Copy the exact primitive and semantic mappings from product.md Section 3. Replace the eight old primitive names entirely; do not keep aliases that conceal obsolete values. Keep existing semantic names so features continue consuming the same interface.

## Review focus

1. Error text inside sand or gold containers must remain readable: cherry text goes on vanilla; wine text plus an explicit warning is used where vanilla is inappropriate. Covered in Task 2.
2. Focus on dark/selected controls must remain visible, including in a modal against its solid backdrop. Covered in Task 2.
3. Disabled, loading and selected states must remain distinguishable through interaction, labels, icons and geometry despite sharing fewer colours. Covered in Task 2.
4. Schematic grid and placement previews must use solid palette colours while retaining clear valid/invalid placement and object selection. Covered in Task 2.
5. Short landscape, 200% text, reduced motion and mobile/desktop workflows must remain usable with the existing fonts. Covered in Task 3.

### Task 1: Migrate the shared palette

**Files:** Modify `src/styles/tokens.css`, `index.html`, `tests/e2e/fonts.spec.js` and `src/dev/DesignSystemPage.jsx`; create `tests/e2e/palette.spec.js`.

**Interfaces:** Consume the approved primitive/semantic mapping. Preserve all existing `--surface-*`, `--text-*`, `--border-*`, `--shadow-*` and `--action-*` meanings, plus the established `--accent-decorative` token. Introduce only the five new primitive names from product.md. No component props or data contracts change.

- [x] Add a browser test named `shared controls resolve to the approved palette`. Wait for the lazy specimen to render and frames to measure. Assert computed page/panel/input colours, button text/fills and SVG ink/rim/shadow/fold colours against the intended roles above, rather than only checking the declared token strings.
- [x] Update the existing font-role test to read `--color-wine` and expect `#6C1A21`; retain its real font-loading and family assertions. Run `npx playwright test tests/e2e/palette.spec.js tests/e2e/fonts.spec.js --reporter=list`; confirm failure is due to the current old palette.
- [x] Replace the primitive palette and semantic mappings in `tokens.css`. Leave font, spacing, geometry, motion and layer values untouched. Set the browser `theme-color` in `index.html` to vanilla `#E5E0CD`.
- [x] Update the development specimen's reference to “cream rims” to “vanilla rims”. Verify `PixelFrame.jsx`, `PixelFrame.css`, `Button.css`, `Icon.jsx` and `public/assets/ui/icons.svg` inherit tokens/currentColor; change them only if a concrete bypass is found. Do not regenerate assets.
- [x] Rerun the targeted tests. Expected: computed primary gold/wine, neutral vanilla/wine, quiet sand/wine, strong wine/vanilla and danger cherry/vanilla all pass; fonts remain unchanged. Remaining state-specific corrections belong to Task 2.

### Task 2: Finish modal, state and editor treatments

**Files:** Modify `src/styles/components.css`, `src/features/world/world.css` and, only where computed-state checks expose a bypass, the relevant existing shared stylesheet. Extend `tests/e2e/palette.spec.js`; retain `tests/e2e/layout.spec.js` contrast coverage.

**Interfaces:** Use Task 1's semantic tokens. Preserve selectors, component props and existing editor commands. No new palette or component family.

- [x] Add focused rendered-state tests before changing these treatments: `error text stays readable on context and selected surfaces`, `focus and disabled states remain visible`, `modal backdrop uses solid wine`, and `placement previews distinguish valid and invalid positions without blended colours`.
- [x] Cover helper/errors in vanilla, sand and gold contexts using actual shared controls. Check computed text/effective background pairs: wine/vanilla 8.78:1, wine/sand 6.43:1, wine/gold 4.94:1, cherry/vanilla 4.59:1. Require at least 4.5:1 for normal text; do not allow cherry/sand (3.36:1) or cherry/gold (2.58:1) for normal text.
- [x] Replace `.modal::backdrop`'s hard-coded plum at 48% alpha with solid wine via a token. Remove opacity fading from `modal-in`; retain the existing short translate transition and reduced-motion behavior. Verify the active dialog, title, Close and Cancel remain reachable against the opaque backdrop.
- [x] Keep the wine focus outline with a vanilla separation ring and check at least 3:1 against adjacent surfaces. Test keyboard focus on primary, strong and danger actions, including inside the modal. Ensure disabled controls still cannot activate; loading retains its label/progress indicator and selection retains its check/ARIA state. No lowered-opacity state styling.
- [x] Replace `.schematic-grid`'s 0.12 opacity with solid token paint and preserve its 1 px geometry. Remove `.schematic-ghost`'s 0.7 fill-opacity. Use solid gold/wine for valid preview; vanilla fill with cherry outline plus existing warning/reason for invalid preview. Do not invent green/red success states or change placement validation.
- [x] Audit error badges, inline errors, toast messages, native checkbox/radio accent colours, selected navigation, read-only fields and photo/file controls. Keep cherry error text on vanilla, or use wine with an explicit icon/message on sand/gold. Verify native/control styles do not intentionally introduce another authored colour; preserve native accessibility and semantic controls.
- [x] Rerun `npx playwright test tests/e2e/palette.spec.js tests/e2e/fonts.spec.js tests/e2e/layout.spec.js --reporter=list`, setting `KOBI_EVIDENCE_DIR=artifacts/colour-migration/captures` for layout screenshots. Expected: all state, contrast, loading, focus and responsive checks pass. If a failure reveals a real regression, fix the shared treatment before proceeding.

### Task 3: Verify whole-app coverage and record the result

**Files:** Review existing resident/SDP pages and `tests/production/production.spec.js`; update `README.md`, `AGENTS.md`, current `docs/product/` status statements and `docs/product/PROJECT_TIMELINE.md` only after results are known. New evidence belongs under `artifacts/colour-migration/`.

**Interfaces:** Existing app routes, demo commands and acceptance checks remain unchanged. Current documentation must distinguish the new implemented palette from historical builds.

- [x] Inspect resident sign-in/create-account, map/facility sheets, reports/form/detail, activities/detail/join/leave, profile/settings and reset confirmation. Inspect SDP report actions, activity forms/preview, catalog and placement/move/remove flows. Include empty/error/loading/disabled/selected examples and representative long content; use the development specimen for explicitly simulated states.
- [x] Check 360×800, 390×844, 768×1024 and 1280×800, plus 800×360 and 200% text. Review fresh screenshots of buttons, forms, lists, navigation, dialogs and editor valid/invalid previews; do not infer visual quality solely from passing assertions. Reuse the existing layout suite's font-fallback/reduced-motion coverage.
- [x] Run `npm run lint`, `npm test`, `node scripts/asset-manifest.mjs` and `npm run build`. Then run the targeted palette/font/layout checks and all three production checks against the fresh build. Use distinct output directories for browser and production results. Broaden testing only if a failure, unexpected change or uncovered behavior justifies it.
- [x] Search app styles/JSX, `index.html` and built CSS for old primitive names, the eight old hex values and the old backdrop RGB. Expected: no active old palette values. Inspect all remaining authored colour/opacity declarations; do not mistake transparent frame cutouts or photos for palette violations. Historical documentation/captures are not rewritten to hide the earlier design.
- [x] Record actual commands, passed/failed counts, reviewed captures and any unresolved limitations. Mark the palette migration complete only after the implementation and checks pass. Do not claim physical Android verification from Chromium viewport tests.
- [x] Run `graphify update .` after the final code changes and confirm success. Update the README/product/timeline/agent guidance from “palette deferred” to the actual verified state; preserve source-image provenance and the existing font records.

## Completion boundary

The existing UI uses the five approved authored colours consistently, fonts/behavior/layout geometry remain intact, and fresh browser/build evidence supports the result. No new world artwork, backend work, deployment or broader redesign is included. Execution is complete within the recorded verification scope.
