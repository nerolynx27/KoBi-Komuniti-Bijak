# Neighbourhood Bulletin Dashboard — Three-Phase Implementation Plan

> **For agentic workers:** Use `superpowers:executing-plans` to implement only the phase the user approves. This document is a plan, not execution authorization. Do not delegate unless requested. Preserve existing work and historical verification.

**Status:** Corrected on 22 October 2026: the selected reference is **picture 4 — Neighbourhood Bulletin**. All earlier references to picture 1 in this request meant picture 4. Corrected Phase 1 was authorized and is implemented for review; see [fresh verification](../../verification/BULLETIN_DASHBOARD_PHASE_1.md). Phase 2 was authorized and is implemented for review; see [Phase 2 verification](../../verification/BULLETIN_DASHBOARD_PHASE_2.md) for passing dashboard checks and inherited broader failures. Phase 3 awaits approval.

**Goal:** Reproduce picture 4 using reusable folded-ticket buttons and editorial paper cards: first revise the Development specimen without changing its composition or asset sizes, then build the bulletin dashboard, then apply the approved component family across the app.

**Architecture:** Extend the existing Button/ActionLink/IconButton, Card, PixelFrame and FrameStyleProvider. Build the dashboard from live HTML text, CSS and measured SVG decoration, with separate static illustrations. Keep the current browser-demo store and hash routing.

**Tech stack:** Existing JavaScript/JSX, React 19.3.1, plain CSS, Vite 8.3.4, Vitest and Playwright. No new runtime library, backend or world engine.

**Spec:** The user's corrected three-phase brief and picture 4 below, subject to the existing palette, fonts, accessibility, privacy and demo contracts in `docs/product/product.md`, `TECHNICAL_DOCUMENTATION.md`, `MVP_UI_ASSETS.md` and `PROJECT_TIMELINE.md`.

## Correction and existing work

- This file remains at its existing `2026-10-22-gateway-dashboard-three-phase-plan.md` path to preserve links. Its title, selected reference and all future design requirements now refer to Neighbourhood Bulletin.
- Existing Phase 1 code and [Gateway verification](../../verification/GATEWAY_DASHBOARD_PHASE_1.md) record implementation against the earlier picture. Preserve that history; it is **not acceptance or proof of visual fidelity to picture 4**.
- Phase 1 must be revised and reviewed against picture 4 before Phase 2 begins. Reuse the existing frame infrastructure and behavior checks; do not discard functioning code or regenerate the same scaffolding.
- At correction time, `FrameStyle.jsx`, revised frame/card code, specimen checks and `src/features/dashboard/dashboardSelectors.js` exist. Inspect their current state before execution; an existing file is not evidence that this corrected phase is complete.
- Do not rename existing `gateway` context values, tests or evidence solely for terminology. The internal style value may remain `gateway` during this revision to avoid unnecessary churn; it no longer identifies the selected picture. New visual evidence and new artwork use Bulletin names.
- This correction changes documentation only. Do not undo, restyle, implement or purchase generation until the relevant phase is approved.

## Selected visual reference — picture 4

![Selected picture 4 — Neighbourhood Bulletin](https://d8j0ntlcm91z4.cloudfront.net/user_3EbIKJiq93OP4D7Jnqcrk4yIGeR/hf_20261022_011914_4be45171-bcb4-439d-8cd8-4e27fc61a0d8.png)

- Higgsfield job: `4be45171-bcb4-439d-8cd8-4e27fc61a0d8`.
- Requested: `nano_banana_pro`, `2k`, `9:16`. Returned model: `nano_banana_2`; image dimensions 1536 × 2752. Do not claim verified Pro provenance.
- **Actual composition:** compact horizontal KoBi/Elmina header; gold Demo mode ticket with cherry fold; profile icon; “The neighbourhood bulletin” masthead with thin double rule; date/township line; a two-column clean-up story; “Your latest update” repair card; wine “See your neighbourhood” panel with a narrow panoramic illustration and gold Enter World ticket; two compact folded summary cards; icon-led bottom navigation.
- **Button details:** stepped ticket-end bites, outlined inset edges, compact hard shadows. View activity is a wine ticket with vanilla lettering; Enter World is a gold ticket with wine lettering.
- **Card details:** latest-update card has a calm vanilla surface, clipped/stepped edges and a thin internal divider; world panel is wine with a gold/vanilla border; small report/activity summary cards have cherry folded top-right corners.
- Picture 4 replaces the entrance-gate hero, greeting-led layout, overlapping hero ticket and large summary row from the previous plan. None of those earlier composition requirements remain.
- Recreate controls, headings, metadata, report updates and counts as live elements. Raster artwork is never a full-page UI or a button/card sprite.

## Approval and delivery contract

1. **Phase 1 — revise reusable components and specimen to picture 4.** Preserve specimen composition and sizes; present comparison evidence; stop before Phase 2.
2. **Phase 2 — build the bulletin dashboard and Home → Enter World flow.** Present the functional screen and checks; stop before Phase 3.
3. **Phase 3 — migrate the approved components throughout the app.** Present regression results and final coverage.

Approval applies to the phase the user names. The previous picture's Phase 1 approval does not approve new work against this corrected reference. If the user later explicitly approves all phases together, follow that authorization. This plan includes no deployment, new paid generation, new packages, reset of the user's browser records or unrelated source changes.

## Global constraints

- Only wine `#6C1A21`, cherry `#B92C2C`, gold `#CEA257`, sand `#D1BF9A`, vanilla `#E5E0CD` for UI. Use semantic tokens; no extra tints, gradients or blurred shadows. Illustration content retains its artwork colours.
- Bungee normal 400 for headings, wordmark and all button labels; Yanone Kaffeesatz 400/700 for body, dates, counts, labels and form text. Do not imitate raster lettering errors or shrink fonts to force a screenshot match.
- English copy; KoBi — Komuniti Bijak remains the proper name. Dates/times use `Asia/Kuala_Lumpur`.
- Android Chrome first. Check 360 × 800, 390 × 844, 768 × 1024, 1280 × 800, short landscape and 200% text. Resident content stays within the existing 480px shell cap.
- Native hit areas at least 44 × 44px; visible focus; keyboard use; disabled/loading locks; modal focus management; reduced motion; no clipped labels.
- Preserve browser-demo records/schema/layout, ownership filtering, draft guards and confirmed Reset demo. Keep Demo mode and Sample data labeling; no claim of real authentication/submission.
- Preserve the existing footer decision: separator and one-line development-only specimen link; no restored saved-status/disclaimer/pitch-studio footer links.
- Preserve unrelated uncommitted work. Recheck working-tree state before execution; do not revert, stage or commit unrelated files.
- Use graphify before new codebase searches. Run `graphify update .` after each approved phase's code changes; document-only correction does not require a code graph rebuild.

## Visual and component specification

### Shared frames, independent of component layout

| Component | Picture 4 treatment |
|---|---|
| Primary action | Gold face, wine lettering, stepped ticket bites, wine outer edge and vanilla/gold inset outline, compact hard wine shadow |
| Strong action | Wine face and vanilla lettering; support the same ticket shape for View activity |
| Secondary/quiet/danger | Same restrained family, retaining vanilla/sand/cherry semantic fills and accessible text pairs |
| Text action | Live underlined text with a 44px hit area; no heavy frame |
| Icon action | Existing icon and dimensions; compact outlined panel frame; no specimen icon redraw/resizing |
| Standard card | Vanilla editorial paper panel, stepped/clipped corner detail, thin wine border and restrained hard shadow |
| Folded summary card | Standard panel plus decorative cherry top-right fold, clear wine divider and unchanged content box |
| World feature panel | Wine surface with vanilla headings and a gold/vanilla inner rim; gold entry ticket remains a separate live link |
| Demo/selection ticket | Compact gold ticket/tab with cherry fold where shown; labels remain live and readable |

Reuse existing measured frame rendering. Start from 2px wine outer band, 2px vanilla rim, 1px inset keyline and integer corner steps; compare them with picture 4 before finalizing. Prefer the picture's restrained 2px panel shadow and up to 4px action shadow over the previous all-panels +4px recipe. Fit all ornament inside the existing border/padding reservation or outside as paint; never change specimen content padding, intrinsic sizing or line wrapping to fit the frame.

Ticket-end bites and folded corners are separate details. Do not put a red fold on every card or add ticket bites to long form fields. For small summary cards, draw the fold within the existing reserved corner space, without covering title/count content.

**Proposed minimal API additions:**

- Keep `FrameStyleProvider({ value, children })` / `useFrameStyle()`; default `current`, existing specimen scope `gateway`. Refine that scoped appearance rather than adding a parallel library.
- Extend shared Button/ActionLink with optional `frameShape='ticket'|'sticker'`; default remains derived from semantic variant. This lets the wine View activity action use a ticket without changing its semantic colour or creating a page-specific button.
- Extend `Card({ children, className, folded=false, tone='panel', ...props })`; `tone` permits only `panel` and `strong`. Use `folded` on the two dashboard shortcuts; `strong` on the world panel. Do not expose arbitrary colours or padding overrides.
- Extend PixelFrame with the required panel/fold geometry. Consume `folded`, `tone` and `frameShape` in React rather than forwarding invalid props to native elements.
- Preserve direct card content children and native section/button/link semantics. Absolutely positioned SVG decoration is hidden from assistive technology, non-focusable and pointer-transparent. No clipping of real hit targets/focus rings; retain a CSS fallback.

### Dashboard order and initial dimensions

At 390px viewport width use 16px side gutters and a 358px content width. These are starting implementation dimensions, not claimed source measurements.

| Order | Region | Initial target |
|---|---|---|
| 1 | Header | Approximately 60–64px; KoBi, slim separator, Elmina, folded Demo mode ticket, framed profile/menu icon on one row |
| 2 | Bulletin masthead | Single h1 “The neighbourhood bulletin”, approximately 20px Bungee; thin double wine rule; live date left and township right |
| 3 | Lead activity story | Two columns, roughly 164px each with 12px gap: square park illustration left; title, description, date/time, location and wine View activity ticket right; natural height around 160–180px |
| 4 | Latest personal update | Full-width vanilla card, approximately 108px minimum; small “Your latest update” heading/divider; lamp/tools illustration left, report title/status/latest action right |
| 5 | World feature | Full-width wine panel, approximately 140px minimum; “See your neighbourhood”; narrow town panorama around 40–48px tall; gold Enter World ticket below, full inner width and at least 44px high |
| 6 | Compact shortcuts | Two equal folded cards with 12px gap, 44px minimum height; report/activity icons, labels, live counts and Sample data label |
| 7 | Bottom navigation | Icon-led Home, Reports, Activities, Profile; selected Home state; at least 64px plus safe area |

Keep the content in normal flow, with roughly 12–16px vertical section spacing and 8px local gaps. The world-entry ticket is **inside** its panel, below its panorama; no floating/overlapping entry ticket. There is no large entrance-gate illustration or separate second upcoming-event card.

On 360px and at 200% text, let story text/cards grow. Stack the lead story only when columns cannot remain readable; retain section order, image aspect ratios and accessible hit areas. On wider screens preserve the mobile editorial composition within the shell cap.

Use the exact image as the comparison target with a deterministic fixture. Palette/font rules, actual data, safe areas, accessibility and responsive text can cause necessary differences; record them rather than claiming literal pixel identity.

## Review focus

| Risk | Required behavior | Phase |
|---|---|---|
| Specimen size preservation | Same content/order, boxes, asset dimensions, metrics and wrapping; only decoration changes | 1 |
| Pending/disabled/focus states | New frames cannot activate disabled controls, duplicate saves or clip focus | 1 and 3 |
| Private latest update | Only the current resident's report/action is shown; no other resident's text or evidence | 2 |
| Draft/cancelled/past activities | Lead story is a visible published future activity; honest empty states | 2 |
| Home/map/history and custom feature styling | Deep links and draft guards work; page-specific layouts survive shared migration | 2 and 3 |

## Phase 1 — Revise reusable buttons/cards and the Development specimen

**Outcome:** Existing specimen content looks like picture 4 while keeping every composition, asset size and control behavior intact. Other app routes keep their current appearance.

### Files

- Modify existing `src/components/ui/FrameStyle.jsx` only if necessary; preserve its small scope.
- Modify `src/components/ui/PixelFrame.jsx` / `PixelFrame.css`, `Button.jsx` / `Button.css`, `Feedback.jsx` and scoped rules in `src/styles/components.css`.
- Modify `src/dev/DesignSystemPage.jsx` only to apply revised shared APIs/provider; inspect `src/dev/specimen.css` without rearranging its layout.
- Extend existing `tests/e2e/gateway-specimen.spec.js`; preserve existing baseline/evidence paths.
- Create `docs/verification/BULLETIN_DASHBOARD_PHASE_1.md`; synchronize current product design notes after approved implementation.

### Steps

- [x] Inspect the existing scoped implementation and old verification. Record inherited behavior that can be reused and visual differences from picture 4; do not recreate files that exist.
- [x] Preserve original pre-restyle manifests in `artifacts/gateway-dashboard/phase-1/before/`. Capture the current state separately under `artifacts/bulletin-dashboard/phase-1/before/`; never overwrite historical results.
- [x] Extend tests for the wine ticket shape, gold primary ticket, folded card, strong panel, invalid-prop forwarding, decorative accessibility, focus, disabled/loading behavior and pending single activation. Use existing specimen examples for visible coverage without inserting new blocks or changing labels/order.
- [x] Compare corresponding specimen content/button/card/field/icon/photo boxes to the original composition baseline within 1 CSS pixel. Check line wrapping, section gaps and font metrics; measure decorative paint overflow separately.
- [x] Refine shared SVG/CSS frame geometry to picture 4; add only the minimal APIs above. Keep all existing small/medium/large/icon sizes, padding and icons. No PNG control crops or generated UI sprites.
- [x] Apply only within the specimen provider, including sheets/confirmations. Ensure each existing card/action uses the correct restrained treatment; changing style must not add/remove child layout space.
- [x] Capture full pages and focused action/card crops after fonts load at all four baseline sizes. Compare to picture 4's wine/gold tickets and folded paper cards, not picture 1. Include open sheet, nested confirmation and photo state.
- [x] Verify map, reports, activities, profile and SDP remain visually outside the revised scope. Test 200% text, short landscape and reduced motion.
- [x] Run `npx playwright test tests/e2e/gateway-specimen.spec.js tests/e2e/palette.spec.js tests/e2e/fonts.spec.js`, `npm run lint`, `npm run build` and `graphify update .`. Record inherited failures separately; do not report old passing results as new verification.
- [x] Write new evidence and final frame measurements, present the revised specimen, and stop for Phase 2 approval.

**Acceptance:** The specimen matches picture 4's component family; original composition/asset sizes and all states remain intact. Existing checks against picture 1 do not satisfy this acceptance gate.

## Phase 2 — Build the Neighbourhood Bulletin dashboard

**Outcome:** A functioning editorial dashboard matching picture 4, with a real Home route and Enter World opening the existing map.

### Files and interfaces

| File | Responsibility |
|---|---|
| Create `src/features/dashboard/DashboardPage.jsx` and `dashboard.css` | Masthead, lead story, personal update, world panel and compact shortcuts using approved shared components |
| Create `src/features/dashboard/DashboardWorldEntry.jsx` | Wine panel, panorama and live gold entry link with independent artwork failure handling |
| Modify existing `src/features/dashboard/dashboardSelectors.js` | Export `selectDashboardSummary(data, actor, nowIso)` returning `{ reportTotal, reportCounts: { received, in_progress, resolved }, joinedActivityTotal, upcomingActivity, latestReportUpdate }`; inspect/reuse its current implementation |
| Modify `src/app/routes.js`, `useAppNavigation.js`, `src/App.jsx` | Home/default/heading integration, preserve map deep links and guards |
| Modify `src/components/navigation/AppHeader.jsx` | Bulletin header variant, retaining existing menu/demo controls |
| Modify `BottomNav.jsx` and `src/content/uiText.js` | Home replaces Map; retain icon-led navigation matching picture 4 |
| Modify `src/features/world/TemporaryMap.jsx` | Back to dashboard action; preserve map and facility behavior |
| Modify `src/styles/app.css` as needed | Home-specific shell/header spacing; no app-wide restyle yet |
| Create `art/dashboard-bulletin/generation-record.json` | Correct job/model/source/hash and crop provenance |
| Create `public/assets/dashboard/bulletin-cleanup.png` and `bulletin-neighbourhood-panorama.png` | Artwork-only extracts from picture 4 |
| Modify `src/components/ui/Icon.jsx` or add a dashboard-local decorative SVG | Lamp/tools update motif; do not resize existing specimen icons |
| Update asset ledger, manifest and `scripts/asset-manifest.mjs` as needed | Register artwork without losing it on manifest rebuild |
| Extend `tests/unit/dashboardSelectors.test.js`, `tests/unit/routes.test.js`; create `tests/e2e/dashboard.spec.js` | Ownership, event/update selection, navigation, responsive and artwork-error checks |

**latestReportUpdate interface:** `null` or `{ report, latestAction, updatedAt }`. `report` is the current resident's visible report; `latestAction` is its newest visible maintenance action or `null`; `updatedAt` is that action's timestamp, falling back to the report creation timestamp. Inspect existing action-history field names before implementation and use their existing schema, not a new store format.

### Artwork preparation

- [x] Save/verify picture 4 under `art/dashboard-bulletin/`; record its actual dimensions and SHA-256. Preserve existing Gateway assets as historical work.
- [x] Extract the square park/clean-up illustration and the separate narrow neighbourhood panorama. Exclude surrounding frames, story lettering, ticket controls and metadata. Preserve the exact visible crop and pixel character where the source permits.
- [x] Draw the small lamp/tools update motif as decorative SVG from the existing icon language, preserving the composition in picture 4; do not rasterize the repair card's text.
- [x] Use lossless artwork preparation and preserve aspect ratios/pixel edges; no nonuniform stretch. No new artwork generation is included. If a clean extract requires an artwork-only edit, report the specific limitation before commissioning paid work.
- [x] Images remain optional for navigation and data: a failed picture gets a bounded fallback/retry; it cannot hide View activity or Enter World. Decorative illustrations use empty alt text when adjacent live text provides their purpose.

### Exact content and data decisions

- **Header:** KoBi, township from the store and existing profile/menu control. The user subsequently requested removing the top Demo mode ticket; that latest instruction supersedes the pictured badge. Keep Sample data labels and reset/settings/workspace actions reachable through the current drawer.
- **Masthead:** “The neighbourhood bulletin” is the single h1. Show today's date in Asia/Kuala_Lumpur and township beneath its rule. Use a frozen 22 October 2026 clock only in reference comparisons; do not freeze the app's date.
- **Lead story:** Select the earliest future published activity visible to the resident in the current township; stable ID ordering for equal start times. Reuse `selectActivities`/`selectParticipation`. Show its actual title, short description, start date/time and facility; View activity links to `#activities/<id>`. Exclude drafts, cancelled and already-started activities.
- **Empty lead story:** Retain the editorial story region with “No upcoming activities” and Browse activities. Do not substitute a fake clean-up event. Missing facility label: “Location unavailable”.
- **Latest update:** Use `selectMyComplaints(data, actor.id)` and existing report-history visibility rules. Rank those reports by their newest visible maintenance-action timestamp, falling back to report creation time; stable report-ID tie-break. Show facility/report title, current status and newest action note. For no action show “Report received. No maintenance update yet.” No reports: “No report updates yet” and View reports. Link the card to the selected report details without nesting interactive controls.
- **Latest update privacy:** Never read another resident's action note, description or evidence into the dashboard. Do not create a public repair feed or introduce new backend claims.
- **World feature:** “See your neighbourhood”, narrow town panorama, gold Enter World link to `#map`. It sits below Latest update and above the compact shortcuts. No doorway illustration, floating ticket or full-sized map preview.
- **Shortcuts:** My reports shows the current resident's visible report total and links to `#reports`. My activities shows unique joined published/cancelled visible activity records, excludes drafts, and links to `#activities`. Counts sit in the small folded cards; the earlier large status summary/Next activity block is not rendered.
- **Demo values:** “Neighbourhood clean-up”, “24 Oct · 9:00 AM”, “Park lamp repair”, “Maintenance scheduled”, “3” and “2” are fixture content for visual comparisons. Use actual store values in normal operation without rewriting demo samples just to match the image. Display Sample data near example records.
- **Landing:** Empty URL, `#`, `#home` open Home for residents; remembered SDP workspace still opens SDP. Keep `#map` and facility URLs direct. Home is selected while viewing the map; Back to dashboard returns Home.
- **Home targets:** KoBi brand, resident sign-in/home recovery, resident workspace selection and Exit SDP go Home where their purpose is home. Explicit View on map and facility links continue to target the map; preserve presentation exit semantics unless explicitly an app-home action.
- **Navigation appearance:** Keep four icon-led destinations and existing 26px icon boxes; add a code-authored Home icon. Do not apply the previous plan's text-only dashboard navigation. Let `BottomNav` accept `items = navigation` so the specimen can retain its frozen Map/Reports/Activities/Profile examples and `active="map"` unchanged.
- **Failure/recovery:** Preserve the shared storage-recovery controls and draft guards. Never turn a storage failure into a successful sample dashboard. World entry remains usable even if either illustration fails.

### Steps

- [x] Extend selector tests for report ownership, private action filtering, newest-action selection, no-action fallback, equal timestamps, zero reports, unique joined counts, draft/cancelled/past/started events, tie ordering and missing facilities. Pass `nowIso` explicitly.
- [x] Extend route tests: empty hash/Home resolve Home, map/facility URLs are unchanged, malformed and presentation routes still parse.
- [x] Prepare/verify the two correct assets and implement the selector using existing data contracts, without changing stored records/schema.
- [x] Build the exact editorial section order and shared component variants. Use the wine View activity ticket, thin-divided latest-update card, wine panorama panel and compact cherry-folded shortcuts. Do not reuse the earlier Gateway page layout.
- [x] Integrate Home, bulletin header, icon navigation and Back to dashboard. Preserve a single heading-focus target and dirty-form/Back/Forward behavior.
- [x] Test Enter World → map → dashboard; View activity → details; latest-update card → own report details; summary links → reports/activities; reload/default landing and remembered SDP.
- [x] Test dashboard refresh after report/action changes, join/leave, event cancellation and Reset demo in isolated browser storage. Verify no cross-resident data is exposed and all empty/artwork-error/storage-recovery states are usable.
- [x] Use a fixed-clock fixture matching picture 4 for source-aspect-ratio comparison; capture the four responsive sizes too. Compare header, masthead/date, story columns, latest update, world panel/ticket, folded shortcuts and icon nav. Record accessibility/font/data deviations explicitly.
- [x] Run `npx vitest run tests/unit/dashboardSelectors.test.js tests/unit/routes.test.js`, `npx playwright test tests/e2e/dashboard.spec.js tests/e2e/recovery-navigation.spec.js tests/e2e/accounts-profile.spec.js`, `npm run lint`, `npm run build` and `graphify update .`. Update only assertions intentionally changed by Home replacing the map landing.
- [x] Write `docs/verification/BULLETIN_DASHBOARD_PHASE_2.md`, synchronize product landing/navigation documentation, present the working bulletin and stop for Phase 3 approval.

**Acceptance:** Visibly matches picture 4's full editorial structure, uses its two illustration crops, displays truthful private data, and preserves navigation/error handling. A static layout or a recoloured Gateway dashboard is insufficient.

## Phase 3 — Roll out the approved component family across the app

**Outcome:** Consistent picture 4 buttons/cards throughout resident and SDP flows; existing feature compositions, artwork scales and behavior remain intact.

### Coverage

| Surface | Migration scope |
|---|---|
| Reports | Shared forms/list/detail/actions plus custom folder/carousel/filter decorations; preserve their page arrangement and facility artwork |
| Activities | Noticeboard, gallery/polaroids, details/gallery modals, join/leave, forms and staff management; preserve images and composition |
| Account/profile/settings | Sign-in/create account, save/cancel, password/photo controls and reset confirmation |
| Map/facility sheets | Information frames and actions; preserve camera, world, facility selection and map artwork |
| SDP/editor | Destination cards, maintenance/evidence, activity management, catalog/placement/move/remove controls |
| Shared shell/overlays | Header/menu actions, selected nav, dialogs/sheets, feedback and toast frame language; retain semantics and focus |
| Development spaces | Preserve specimen composition; migrate shared controls in report/activity sandboxes and worldbox without resizing assets |
| Presentation Studio | Interactive app controls where relevant; preserve slide artwork, slide compositions and export content |

### Files and steps

- [ ] Audit shared consumers and custom raw buttons/card containers through graphify then scoped searches. Record exact files, existing overrides and behavior checks before editing.
- [ ] Expected integration points: `src/main.jsx`, relevant development entry roots, `src/components/ui/`, `src/components/navigation/`, `src/features/`, `src/styles/app.css`, `components.css`, `reports-folders.css`, `activities-board.css`, feature-local CSS and applicable studio controls.
- [ ] Capture pre-rollout layouts and image/icon boxes; retain the original specimen composition baseline and revised Phase 1 appearance.
- [ ] Promote the approved style provider to app roots and remove redundant local scopes. Keep the default `current` only for explicit historical previews; normal application controls use the approved picture 4 treatment.
- [ ] Convert custom frame decorations to shared Button/ActionLink/Card/PixelFrame where semantics fit. Preserve event handlers, loading/disabled guards, selection attributes and test hooks. Avoid wrapper/padding additions that resize folders, photos or carousel content.
- [ ] Apply folds selectively, keep primary gold/strong wine/danger cherry/quiet sand roles, and preserve calm form fields/text actions. Do not make every card a wine world panel or every action gold.
- [ ] Remove obsolete conflicting border/shadow overrides only after their consumers are migrated; no unrelated data refactors.
- [ ] Add `tests/e2e/bulletin-rollout.spec.js` for custom visual surfaces not exercised by existing journeys; reuse existing behavior tests instead of duplicating them.
- [ ] Verify report → staff action → evidence/resolution; activity create/edit/publish/join/leave/cancel; editor add/move/remove; profile/settings/photo and reset confirmation flows. Use isolated test records.
- [ ] Verify all four viewport sizes, 200% text, short landscape, keyboard/modal focus, reduced motion, pending actions and artwork failure. Keep folds/shadows out of text/focus and preserve the specimen's composition/asset sizes.
- [ ] Run `npm run lint`, `npm test`, `npm run test:e2e`, `npm run build`, `npm run test:production`, updated asset-manifest checks and `graphify update .`. Fix/retest affected regressions; distinguish inherited failures from new ones.
- [ ] Write `docs/verification/BULLETIN_DASHBOARD_PHASE_3.md`; update product/UI asset/timeline documentation to the final approved recipes and Home/map flow. Report physical Android as unobserved unless actually checked.
- [ ] Present coverage, captures and actual results. No automatic deployment or unrelated staging/committing.

**Acceptance:** Approved frame family covers normal app buttons/cards with documented semantic exceptions; all functional journeys and layout-preservation checks pass; the bulletin dashboard and specimen remain stable.

## Evidence and corrected completion tracking

New evidence goes under `artifacts/bulletin-dashboard/phase-1/`, `phase-2/`, `phase-3/`. Preserve `artifacts/gateway-dashboard/` and `GATEWAY_DASHBOARD_PHASE_1.md` as historical evidence. Record exact commands/results, working-tree context, approvals, source image and limitations in each new verification document.

| Milestone | State |
|---|---|
| Correct reference selection | Picture 4, Neighbourhood Bulletin |
| Plan correction | Prepared for review; documentation only |
| Prior Phase 1 against picture 1 | Implemented for review according to historical verification; not accepted against picture 4 |
| Revised Phase 1 approval | Awaiting approval |
| Revised Phase 1 implementation/verification | Not performed for picture 4 |
| Phase 2 approval and corrected dashboard delivery | Awaiting approval; no completion claim |
| Phase 3 approval and app-wide rollout | Awaiting approval; no completion claim |

Planning self-review: checked the actual picture 4, removed the previous greeting/gate/overlap composition, added both artwork regions and private latest-update logic, retained icon navigation, preserved specimen constraints and existing implementation history, and retained three approval-controlled phases. No application code or tests were changed/run as part of this correction.

