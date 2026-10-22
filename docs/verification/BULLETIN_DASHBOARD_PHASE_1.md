# Neighbourhood Bulletin — corrected Phase 1

22 October 2026. The user authorized rerunning Phase 1 against **picture 4**, replacing the earlier picture-1 visual target. Revised specimen implementation is ready for review. Phase 2 is stopped; the bulletin dashboard and app-wide rollout are not implemented.

## Reference and scope

The selected reference was inspected at `art/dashboard-bulletin/selected-reference.png`, saved from the plan's Higgsfield URL for job `4be45171-bcb4-439d-8cd8-4e27fc61a0d8`. Its dimensions are 1536×2752; SHA-256 is `58cd2c97667c4b817de55ce52c4cd3787c32656fdef7c755d42d88e3e82e9da2`. No generation was commissioned. The recorded returned model is Nano Banana 2, not verified Pro provenance. This is a design reference, not a runtime asset or new licensing claim.

The existing provider, size observer, button behavior, card section semantics and direct content children were reused. Only `gateway`-scoped rendering changed; `current` remains the default. Specimen sections, labels, ordering, fields, icons, photos and spacing remain intact. The existing “Sign in” strong action now demonstrates a wine ticket; the existing record card demonstrates the optional folded corner. No new specimen block was added. A test-only Vite-response substitution renders that same record card in the strong tone for a separate capture, without a production theme switch or additional content.

## Final construction

| Part | Measured recipe |
|---|---|
| Action frame | 2px wine outer band; 2px rim; 1px inset wine keyline; semantic fill at inset 5px; 4px corner depth in 2px steps |
| Primary ticket | Gold face/wine text; vanilla rim; centered 6px-deep × 12px-high outer bites; inner contours follow their inset; small cherry top-right fold |
| Strong ticket | Wine face/vanilla text; gold rim; same ticket geometry and fold |
| Standard panel | 2px wine outline, vanilla face starting at inset 2px; no heavy internal border or automatic sand fold |
| Folded panel | Optional cherry stepped corner and wine divider, contained within the top-right 16px reservation |
| Strong panel | Optional wine face, gold 2px rim, vanilla 1px inset keyline, vanilla text; no fold by default |
| Shadow/paint | +4px/+4px actions; +2px/+2px panels. SVG W/H use rounded measured boxes plus the relevant paint allowance, with at most 0.5px difference from fractional layout dimensions |

`frameShape`, `folded` and `tone` are consumed in React and never forwarded as invalid native attributes. Unknown shape/tone values fall back to the semantic/default appearance. Text actions stay unframed. Native hit boxes and focus outlines are not clipped. SVG remains `aria-hidden`, non-focusable and pointer-transparent. CSS border/fill fallback is tested by removing a frame. Strong-panel status badges retain readable wine text on their own light surfaces.

## Comparison evidence

Historical `artifacts/gateway-dashboard/phase-1/before/` and the earlier Gateway captures were preserved. The inherited picture-1 build was captured separately in `artifacts/bulletin-dashboard/phase-1/before/` **before** revision. Corrected results are under `artifacts/bulletin-dashboard/phase-1/after/`. Before-capture JSON uses exclusive creation to prevent accidental replacement; the test's normal mode writes only the new after folder.

At **360×800, 390×844, 768×1024 and 1280×800**, full-page PNGs and JSON cover the unchanged specimen, open sheet, nested confirmation and selected-photo state. Manifests compare corresponding boxes, fonts, spacing, text and image dimensions against the original pre-restyle composition baseline. **2,780 boxes compared; maximum difference 0 CSS px.** Decorative paint is measured independently, so smaller panel shadows do not masquerade as layout changes.

| Evidence at 390px | Inherited Gateway | Corrected Bulletin |
|---|---|---|
| Actions | [Before](../../artifacts/bulletin-dashboard/phase-1/before/390-actions.png) | [After](../../artifacts/bulletin-dashboard/phase-1/after/390-actions.png) |
| Record card | [Before](../../artifacts/bulletin-dashboard/phase-1/before/390-card.png) | [After](../../artifacts/bulletin-dashboard/phase-1/after/390-card.png) |
| Alternate strong panel | — | [Same record example](../../artifacts/bulletin-dashboard/phase-1/after/390-strong-panel.png) |
| Open sheet | [Before](../../artifacts/bulletin-dashboard/phase-1/before/390x844-sheet-viewport.png) | [After](../../artifacts/bulletin-dashboard/phase-1/after/390x844-sheet-viewport.png) |
| Nested confirmation | [Before](../../artifacts/bulletin-dashboard/phase-1/before/390x844-confirmation-viewport.png) | [After](../../artifacts/bulletin-dashboard/phase-1/after/390x844-confirmation-viewport.png) |

Compared with picture 4, the revised family has the wine/gold ticket pair, cherry corner folds, calmer paper panels and compact panel shadows. Live Bungee/Yanone Kaffeesatz and approved flat palette replace the image's lettering/texture. Specimen labels and layouts intentionally remain their original examples. Dashboard-only editorial dividers, masthead, story layout and artwork are deferred to Phase 2 rather than inserted into specimen content. This is component fidelity, not a claim that the specimen reproduces a whole bulletin screenshot.

## Fresh verification

| Command/check | Result |
|---|---|
| Required Playwright: `npx playwright test tests/e2e/gateway-specimen.spec.js tests/e2e/palette.spec.js tests/e2e/fonts.spec.js` | **16/16 passed** |
| Inherited-state capture before revision | **4/4 passed** |
| `npm test` | **187/187 passed**, 22 files; includes four dormant selector-draft tests from interrupted Phase 2 |
| ESLint on changed Phase 1 JS/JSX and specimen tests | **Passed** |
| `npm run build` | **Passed** |
| `npm run lint` | **Two inherited errors**, below |
| `graphify update .` | **Passed**, AST-only |

The new Bulletin assertion failed against the inherited implementation (the ticket API/shape metadata was absent) before implementation, then passed. Coverage includes gold and wine tickets, folded card, strong panel without an automatic fold, native-prop filtering, accessibility of decoration, paint bounds, original layout, keyboard focus/return, disabled state, repeated pending-save activation, modal controls, short landscape, 200% specimen text, reduced motion, local fonts and palette. Map/reports/activities/profile/SDP routes remain outside the new scope; the existing palette suite also checks 17 ordinary routes and editor preview colours.

## Decisions and remaining limits

- **Retain infrastructure/names:** reused `gateway` scope and existing test filename; new evidence uses Bulletin names. Cost if wrong: names remain historical, but no second component library or global theme was introduced.
- **Preserve composition:** wine ticket and folded card use existing examples; strong tone is captured by test-only substitution of the same card's props. Cost if wrong: the main specimen does not simultaneously show a second strong card, which would require changing its composition.
- **Stop unfinished Phase 2:** withdrew only this session's incomplete Home-route and Home-route-test additions, preserving unrelated presentation routes. `dashboardSelectors.js`, its tests and the earlier downloaded Gateway reference remain dormant for inspection/reuse. No dashboard or landing change is claimed.
- **Keep inherited issues separate:** full lint still reports unused `enterStaff` at `src/features/account/ProfilePage.jsx:6` and unused `pan` at `src/features/world/TemporaryMap.jsx:40`. Both existed before this phase. The required single-line shared footer still overflows at 200% outside the provider; enlarged-text checks cover the specimen, not a false whole-page pass.
- Existing source/presentation/map work and historical verification were preserved. No files were staged or committed. Review was inline as the plan prohibits unrequested delegation. Physical Android Chrome and screen-reader output were not observed.

Review at `/#design-system` in development. Stop before Phase 2 until the user approves it against the corrected Bulletin plan.
