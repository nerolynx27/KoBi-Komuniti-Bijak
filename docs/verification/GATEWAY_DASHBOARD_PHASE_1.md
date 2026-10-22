# Gateway dashboard — Phase 1 evidence

22 October 2026. Phase 1 is implemented for visual review. Phase 2 is not started. Repository-wide lint is not clean; see the existing issues below.

## Delivered

- `FrameStyleProvider` / `useFrameStyle`, defaulting to `current`, with `gateway` selected only around the unchanged Development specimen and its modal examples.
- Measured SVG ticket/sticker/panel frames: 2px wine outer band, 2px vanilla rim, 1px wine inset keyline, semantic fill at inset 5px; 4px stepped corner depth. Primary ticket bites are 6px deep and 16px tall at the outer contour, stepped by 2px; inner contours follow their inset.
- Hard +4px right/down wine shadow; small sand panel fold and existing cherry filter folds. SVG size is rounded measured W+4 by H+4, aligned to the native border-box origin. Paint can differ by up to 0.5px from fractional browser box dimensions; content/hit areas are unchanged.
- Semantic sections and direct content children retained. Cards keep their CSS border/padding/fill fallback; controls retain their existing fallback, keyboard semantics, loading locks and focus styles. Decoration ignores pointer events and is hidden from assistive technology.

## Evidence

`artifacts/gateway-dashboard/phase-1/before/` and `after/` contain matching full-page PNGs and JSON manifests at **360×800, 390×844, 768×1024, 1280×800**. Each viewport covers the original specimen, open sheet, nested confirmation and selected-photo state. JSON records section order, button/card/field/icon/photo border boxes, labels, font metrics, padding, margins and gaps. The photo is a deterministic test PNG uploaded only into the isolated test browser.

**2,780 corresponding boxes compared; maximum layout difference: 0 CSS px.** Long-label wrapping, section order, font metrics and recorded spacing also match. SVG paint overflow is tested separately: +4px nominal, with the 0.5px rounding tolerance above.

Focused comparison at 390px:

| Before | After |
|---|---|
| [Actions](../../artifacts/gateway-dashboard/phase-1/before/390-actions.png) | [Actions](../../artifacts/gateway-dashboard/phase-1/after/390-actions.png) |
| [Card](../../artifacts/gateway-dashboard/phase-1/before/390-card.png) | [Card](../../artifacts/gateway-dashboard/phase-1/after/390-card.png) |

The selected concept was inspected directly. The new frames reproduce its layered stepped outlines, wine keyline, ticket-end bites and hard shadows within the existing control boxes. This is a component-family comparison, not a claim of pixel-perfect dashboard reproduction. Existing fonts, labels and specimen composition remain authoritative; no artwork generation or PNG control cropping was used. Action crops hide the sticky page header during screenshot capture so it cannot obscure the section title; application code is unaffected.

## Verification

| Check | Actual result |
|---|---|
| Required Playwright command: `npx playwright test tests/e2e/gateway-specimen.spec.js tests/e2e/palette.spec.js tests/e2e/fonts.spec.js` | **14/14 passed** |
| Four baseline-capture tests | **4/4 passed** |
| `npm test` | **183/183 passed**, 21 files |
| ESLint on changed JS/JSX and both affected e2e files | **Passed** |
| `npm run build` | **Passed**, Vite 8.3.4 |
| `npm run lint` | **Failed: two existing errors**, listed below |
| `git diff --check` | **Passed**; existing CRLF conversion warnings only |
| `graphify update .` | **Passed**, AST-only, no API generation |

The seven Gateway tests cover baseline dimensions and wrapping, decorative accessibility and paint, default styles on map/reports/activities/profile/SDP routes, native disabled state, pending single activation by keyboard/click, visible keyboard focus, confirmation focus/return, reduced motion, short landscape (800×360) and 200% specimen text (360×800). Existing palette tests cover 17 ordinary routes and editor placement states; font checks confirm local Bungee/Yanone Kaffeesatz roles.

The new Gateway assertion was run before implementation and failed because `.pixel-frame-gateway` was absent, then passed after implementation. Modal measurements initially caught the entrance animation; captures now wait for modal animations to finish. Baseline capture is repeatable without editing application files: in PowerShell run `$env:GATEWAY_CAPTURE='before'; npx playwright test tests/e2e/gateway-specimen.spec.js --grep 'preserves baseline'`, then `Remove-Item Env:GATEWAY_CAPTURE` before the normal suite. This test-only capture mode substitutes the preserved `current` provider value in the Vite response. Baseline artifacts are local/ignored; regenerate them before running these comparisons in a fresh checkout.

## Rulings and limits

- **Reuse existing button wiring:** no edits to `Button.jsx`, `Button.css` or `specimen.css` were needed. Existing `PixelFrame` children inherit the provider, preserving their APIs and size rules. Cost if wrong: a future consumer would need an explicit frame hook; current specimen and route checks pass.
- **Maintain the required palette test:** its old helper timed out waiting for the removed map-level “Enter SDP demo workspace” action. The test now enters the existing `#sdp/world` URL and clicks “Enter editor”; every placement/colour assertion remains. No production editor or account behavior changed. Cost if wrong: this palette test does not exercise workspace-entry navigation, which is outside its purpose.
- **Preserve the shared footer:** at 200% text, its required single-line “Development specimen” label overflows outside the provider. The new enlarged-text test checks the specimen itself, not a false whole-page pass. Cost if wrong: the existing footer still causes horizontal page scrolling at 200%; resolving that requires revisiting the single-line footer rule.
- **Keep unrelated source intact:** full lint reports unused `enterStaff` in `src/features/account/ProfilePage.jsx:6` and unused `pan` in `src/features/world/TemporaryMap.jsx:40`. Both are present in HEAD and unchanged by this phase. Repository lint acceptance remains blocked by those errors.
- Review was performed inline because the approved plan explicitly prohibits delegation without a subsequent request. No independent reviewer was dispatched. Existing uncommitted source/presentation work was preserved; nothing was staged or committed.
- Physical Android Chrome, screen-reader output and real device safe areas were not observed. Browser checks use desktop Chromium. No later phase, backend, demo reset, dependency installation, generation purchase or deployment was performed.

Review the specimen at `/#design-system` in development. Phase 2 requires separate user approval under the plan's delivery contract.
