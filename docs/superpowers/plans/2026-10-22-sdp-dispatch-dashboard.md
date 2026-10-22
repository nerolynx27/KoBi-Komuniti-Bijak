# SDP Dispatch Desk Dashboard Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task by task in the current sandbox. Subagents require a separate user choice. Steps use checkboxes for tracking; unchecked items are planned work, not completion evidence.

**22 October 2026 review extension:** The user authorized creating backing candidates for all ten cards using the Elmina comparison process. Ten Higgsfield generations are complete; a separate review page compares originals, current cards, source-border studies and generated candidates with live HTML. This does not replace default dashboard frames. See [evidence](../../verification/SDP_CARD_SET_01.md).

**Goal:** Recreate the selected Dispatch Desk revision as a working SDP dashboard, building and reviewing its reusable cards and buttons first in a dedicated development specimen.

**Architecture:** Keep the dashboard in the existing SDP sandbox at port 5177. Add an opt-in SDP treatment to the existing semantic button/card/frame primitives, exposed through a small SDP component family. Compose the dashboard from exactly those specimen components and the sandbox's existing demo store; preserve other visual contexts.

**Tech stack:** Installed React 19.3.1, JavaScript/JSX, plain CSS, inline SVG, Vite 8.3.4, Vitest and Playwright. No additional dependency, backend, paid generation or deployment is required.

**Spec:** This document's design contract below, the user-selected reference, and `docs/product/product.md`. The user requested a plan; implementation starts in a subsequent execution step.

## Design contract and visual authority

Selected image: [Dispatch Desk revision 01](https://d8j0ntlcm91z4.cloudfront.net/user_3EbIKJiq93OP4D7Jnqcrk4yIGeR/hf_20261022_025238_cf2f2407-8d7f-41b3-9622-052b49ec2ba0.png).

Provenance: `art/sdp-dashboard-explorations/dispatch-desk-revision-01.json`. Image 1 supplies the dashboard body; image 4 supplies its bottom navigation. The Demo mode card is removed. Pro at 2K was requested, but Higgsfield reports Nano Banana 2. Preserve that record.

The selected image is the layout and geometry authority for this sandbox. Reconstruct the artwork's arrangement, borders, spacing, cut corners, folds, typography hierarchy, icons and proportions; do not substitute the previous generic destination grid. Generated gold/shading and font irregularities must be normalized to the approved exact tokens and real fonts. Responsive text and accessibility can increase height; do not shrink the entire screenshot to fit a viewport.

Top-to-bottom composition observed in the image:

| Area | Required construction |
| --- | --- |
| Masthead | Full-width wine bar, gold KoBi wordmark on left, small gold `TODAY'S DESK` ticket on right. |
| Welcome | Vanilla panel with wine title band `SDP WORKSPACE — ELMINA`, Elmina streetlight/building motif on left, staff welcome on right, clipped lower-right corner. |
| Metrics | Three equal-width stepped tickets: cherry Open reports, gold In progress, vanilla Upcoming activities. Large value, compact stacked label, Sample data footer and small icon. |
| Needs attention | Folded-corner vanilla outer panel; heading above two stacked report tickets. |
| First report | Cherry framed ticket, bookmark accent, lamp motif, title/location/short note, small Priority ribbon as pictured, integrated gold Review reports action strip with arrow. |
| Second report | Quieter vanilla ticket, wine keylines and cherry bookmark accents; title, location and short note. |
| Upcoming event | Full-width ticket with side notches, narrow gold header, calendar/building motif at left and event/date/sample description at right. |
| Shortcuts | Two adjacent folded action cards, approximately 60:40 widths: Manage activities and World editor, each with supporting copy and its motif. |
| Navigation | Wine bottom bar, four icon-and-label destinations; selected Workspace uses a raised gold tab with folded top-right corner, matching the revised image. |

Reference proportions to measure at implementation start: image is a portrait screen, approximately 1.79 times as tall as wide. At a 390px-wide comparison scale, masthead is about 40px high, main horizontal insets about 23px, welcome about 90px, metrics about 60px, attention group about 220px, event about 70px, shortcut row about 90px, and navigation about 52px. These are initial estimates from visual inspection, not final measured CSS values. Record actual source bounds and the chosen CSS mapping before claiming a match.

## Subsequent authorized artwork pilot — 22 October 2026

The user approved trying a Higgsfield/reference-extraction workflow for the Elmina illustration. This is a narrow exception to the code-authored-motifs-only constraint below: decorative raster illustration is permitted for this pilot, with exact palette/alpha QA and its caption kept as live text. Full controls, card frames and navigation remain HTML/CSS/SVG. No other illustration generation or main-app rollout is included. Compare the original, previous SVG, one Higgsfield result and direct extraction before extending this method. See [pilot verification](../../verification/SDP_ELMINA_ASSET_PILOT.md).

## Global constraints

- UI colors only `#6C1A21`, `#B92C2C`, `#CEA257`, `#D1BF9A`, `#E5E0CD`, using existing tokens. No gradients, opacity-derived tints or new colors.
- Bungee for titles, headings, wordmark and all buttons; Yanone Kaffeesatz for supporting, body and form text. All visible copy and accessible names are English.
- Code controls in semantic HTML, CSS and inline SVG. No screenshot backgrounds containing controls, cropped PNG buttons, raster text or whole-card image assets.
- Reproduce small decorative motifs as code-authored pixel SVGs in the five colors. Do not start another generation workflow. Artwork must not become a focus target or intercept clicks.
- Preserve the removed Demo mode card decision on the new dashboard. Retain Sample data beside sample content and truthful demo language on existing management screens; do not imply real staff authorization or submissions.
- Use the existing sandbox storage key `kobi.sdp-workspace.v1`. Do not modify the main app's saved records, seeds or schema to reproduce the picture's numbers.
- Preserve the main app, resident Bulletin design, existing Development specimen examples and staff management flows. The new visual treatment is opt-in.
- Android Chrome first. Required responsive widths: 360, 390, 768 and 1280px, plus 200% text and keyboard use. No new Phaser installation.
- Current checkout contains unrelated work. Stage only owned files if a commit is explicitly requested; never reset or overwrite unrelated changes.

## Approach and component boundaries

Recommended: shared semantic primitives with an opt-in SDP frame style, plus a dedicated SDP component family. This preserves the existing button/link behavior while giving the selected picture its distinct frame recipes. A global restyle would affect resident screens; a second independent button implementation would duplicate focus/loading/disabled behavior.

Component interfaces:

- `SdpButton(props)` and `SdpActionLink(props)`: pass through the existing Button/ActionLink contract, including `variant`, `size`, `loading`, `disabled`, `href` and event props; default the dashboard's main action to primary ticket treatment. Add only SDP classes and frame selection.
- `SdpCard({ kind, tone, folded, children, className, ...props })`: uses shared Card with an explicit SDP frame shape; kinds `welcome`, `metric`, `panel`, `report`, `event`, `shortcut`. It owns geometry and surface treatment, not business logic. Do not make a section into a fake button; shortcut cards contain a real anchor.
- `SdpMotif({ name })`: decorative inline SVG for `elmina`, `streetlight`, `calendar`, `community`, `world`; use the existing Icon for functional navigation icons when it matches.
- `SdpBottomNav({ active })`: four actual links to `#sdp`, `#sdp/reports`, `#sdp/activities`, `#sdp/world`; `aria-current="page"` on the active link. Owns the revised gold tab geometry.
- `SdpDashboardPage({ data, actor, headingRef, nowIso })`: assembles the reviewed components. No store writes during render, and no second store or duplicated record list.
- `selectSdpDashboard(data, nowIso)`: returns `{ openCount, inProgressCount, upcomingCount, attentionReports, nextActivity }`, with original record references for navigation. See data rules below.

The new frame context is `sdp`; `current` and `gateway` retain their existing behavior. Keep geometry helpers local to the SDP family. Extend `Card` with optional `frameShape` defaulting to `panel`, and let its SVG frame render in the explicit `sdp` context as well as `gateway`. Only `PixelFrame` delegates the new context to the SDP frame renderer. Reuse its existing measured-size observer. Small-size and no-SVG fallbacks remain readable.

## File map

| File | Responsibility |
| --- | --- |
| `src/components/sdp/SdpPrimitives.jsx` | Thin button/link/card wrappers used by specimen and dashboard. |
| `src/components/sdp/SdpFrame.jsx` | Scoped SVG silhouettes, layered rims, ticket notches, folds and hard shadows. |
| `src/components/sdp/sdp-components.css` | Namespaced component styles and interaction states; imported by SDP consumers only. |
| `src/components/sdp/SdpMotif.jsx` | Small reusable decorative pixel motifs. |
| `src/components/sdp/SdpBottomNav.jsx` | Revised four-item SDP navigation. |
| `src/components/ui/PixelFrame.jsx` | Opt-in delegation for the `sdp` context. |
| `src/components/ui/Feedback.jsx` | Optional Card frame shape and explicit SDP frame support. |
| `src/dev/sdp-workspace/SdpComponentsSpecimen.jsx` | Separate development page for SDP cards and buttons only. |
| `src/dev/sdp-workspace/main.jsx` | Development-only specimen entry selection; preserve the existing isolated store bootstrap for normal sandbox use. |
| `src/dev/DesignSystemPage.jsx` | Add a clearly labeled link to the separate specimen; leave current examples intact. |
| `src/dev/sdp-workspace/SdpDashboardPage.jsx` | Dashboard composition. |
| `src/dev/sdp-workspace/sdp-dashboard.css` | Page arrangement, header and bottom-nav spacing. |
| `src/dev/sdp-workspace/sdpDashboardSelectors.js` | Township-scoped staff counts and deterministic record selection. |
| `src/dev/sdp-workspace/SdpWorkspaceApp.jsx` | Replace its SDP landing grid and redundant landing shell with the new dashboard; keep existing management routes, modal host and recovery behavior. |
| `tests/unit/sdpDashboardSelectors.test.js` | Data aggregation and date-boundary checks. |
| `tests/e2e/sdp-components.spec.js` | Specimen states, isolation, reflow and accessibility checks. |
| `tests/e2e/sdp-dashboard.spec.js` | Dashboard navigation, data updates, failure states and responsive evidence. |
| `docs/verification/SDP_DASHBOARD_PHASE_1.md`, `SDP_DASHBOARD_PHASE_2.md` | Actual commands, screenshots, comparison notes and limitations. |

## Phase 1 — Reusable cards/buttons and their own specimen

**Deliverable:** `http://127.0.0.1:5177/sdp-workspace.html?specimen=cards-buttons`, linked as `SDP cards & buttons` from the existing Development specimen. The separate page contains this SDP family only, rather than mixing it into resident examples. It is available only in development.

- [x] Inspect the full-resolution reference and write the measured frame/spacing recipe in Phase 1 evidence. Establish a 390px reference-width composition alongside intrinsic-width stress examples.
- [x] Implement the opt-in `sdp` frame context and wrappers above. Match the image's rim counts, step positions, bookmark accents, clipped corners and integrated action strip. Decorations use `aria-hidden`, `focusable="false"` and `pointer-events: none`.
- [x] Display real working button/link examples: primary ticket, secondary/quiet action, text link, icon plus label, full width, normal, hover, focus, active, disabled, loading and long English labels. Simulated callbacks must be labeled and must not write demo records.
- [x] Display one specimen of each of the six card kinds, plus the highlighted report ticket with its integrated action, all three metric tones, normal and long content, zero values, and missing optional illustration. A visual comparison fixture can show 12 / 4 / 3 and the pictured report/event text; label it as a visual fixture rather than changing the application seeds.
- [x] Keep this specimen focused on cards and buttons. The bottom navigation is built with the dashboard in Phase 2; do not add unrelated forms, dialogs or a second full design system here.
- [x] Add development-only lazy entry selection in sandbox main. This specimen should mount without initializing/resetting the demo store. Provide a return link to the SDP workspace. Preserve existing hash routing.
- [x] Add only the link to the shared Development specimen; do not change the `gateway` provider or existing card/button recipes.
- [x] Add browser checks for disabled/loading blocking activation, real anchor semantics, keyboard focus, long-label reflow, SVG decorations excluded from focus, and no horizontal overflow at 360/390px and 200% text. Check current/gateway examples before and after the opt-in change.
- [x] Run `npm run lint` and `npx playwright test tests/e2e/sdp-components.spec.js tests/e2e/gateway-specimen.spec.js`. Record any inherited failures separately. Capture default states and a keyboard-focused example.
- [x] Run the existing build and a targeted Vite build for `sdp-workspace.html`, since that sandbox HTML is currently absent from the standard build inputs. Verify that the development-only specimen is excluded in production.
- [x] Run `graphify update .` after code changes. Write Phase 1 evidence and present the actual specimen for visual review before dashboard assembly.

**Phase 1 review gate:** user reviews the reusable components against the selected image. Resolve component mismatches once here so both the specimen and dashboard consume the corrected versions.

## Phase 2 — Assemble the selected dashboard

**Deliverable:** the selected design at `http://127.0.0.1:5177/sdp-workspace.html#sdp`, using the same reviewed components. Main app rollout is a separate scope decision.

### Data and interaction rules

- Select complaints for `data.township.id` across residents, not just the current staff actor. The existing resident `selectDashboardSummary` filters by actor and therefore must not supply staff counts.
- Open reports = `received` plus `in_progress`; In progress = `in_progress` subset. Upcoming activities = township `published` activities with `starts_at > nowIso`; exclude drafts, cancellations and events already started.
- Attention reports = unresolved reports, `received` first, then `in_progress`, oldest `created_at` first, with ID as deterministic tie-breaker; show at most two. The visible Priority ribbon means first in this local queue, not a new stored urgency field or backend priority system. Give it an accessible description explaining that meaning.
- Next activity = earliest eligible future activity, ID tie-breaker. Format dates/times in Asia/Kuala_Lumpur using existing helpers. Recompute when data changes and when the next start boundary passes; reuse the established activity clock rather than a high-frequency timer.
- Use actual report title, note and facility names. Short visual previews may clamp text, but preserve accessible full names and provide access to complete details. Do not rename records to match decorative generated text.
- Review reports goes to `#sdp/reports`; each record title goes to `#sdp/reports/<id>`. Manage activities goes to `#sdp/activities`; World editor goes to `#sdp/world`. Event ticket can open its existing activity detail; if that destination leaves staff mode, use the management page instead and retain clear link wording.
- Empty queue: a calm message in the same attention panel and the reports action. No future event: `No upcoming activities` plus Manage activities. Missing facility: `Location unavailable`. Preserve store recovery messages and failed-save behavior.

### Assembly steps

- [x] Test `selectSdpDashboard(data, nowIso)` before implementation: cross-resident same-township records included; other township excluded; resolved excluded from open/queue; in-progress subset correct; draft/cancelled/started events excluded; exact start boundary excluded; sort/ID tie-breaks stable; empty inputs return zero/null/empty array without mutation.
- [x] Run `npx vitest run tests/unit/sdpDashboardSelectors.test.js`, implement selector, and rerun until passing.
- [x] Implement `SdpDashboardPage` with the exact visual order in the design contract. Use a fixed visual fixture only in test setup for reference matching; normal dashboard uses its real selector result.
- [x] Build the masthead, welcome composition and small motifs; expose one accessible h1. Integrate with the sandbox so the existing generic AppHeader, repeated page heading, old destination grid, landing exit button and pitch-deck card do not appear above or inside the selected dashboard. Preserve exit/reset/development access in a small accessible utility area reached outside the reference composition, e.g. a header menu.
- [x] Build `SdpBottomNav` with the reference's wine bar, raised gold active tab and folded corner. Use it consistently on sandbox staff routes with correct active state; retain the original management page bodies. Prevent duplicate staff navigation rows. Preserve unsaved-change guards by using existing navigation interception, and retain direct URL, refresh and browser Back support.
- [x] Scope dashboard layout to its root; never override global `.card`, `.button`, `.app-shell` or resident navigation selectors. Do not nest anchors or put a button inside an anchor for clickable cards.
- [x] Match the narrow reference-width composition first, with a practical 390px baseline. On wider screens keep the portrait dashboard in a centered column capped around 480px, retaining its composition. At 360px allow wrapping; use min heights rather than fixed card heights. At 200% text allow the metric/shortcut rows to stack if needed.
- [x] Position bottom nav with safe-area padding and matching content bottom clearance so it never covers the final cards, focus target or management forms. At larger font sizes allow a taller nav rather than clipping labels.
- [x] Verify report status changes and created/cancelled activities update counts after returning to the dashboard and survive reload. Verify reset uses only the sandbox storage key. Test zero reports/events and a storage failure without presenting success.
- [x] Capture the dashboard at 360×800, 390×844, 768×1024 and 1280×800, plus a reference-ratio 390px-width capture. Compare the reference fixture to the selected image side by side and with an overlay; inspect masthead, welcome band, three metrics, report borders, event notches, shortcut ratio and nav tab individually. Record intentional differences for live data, approved palette/fonts and accessible reflow; do not promise a literal pixel match across every screen size.
- [x] Run `npm run lint`, `npx vitest run tests/unit/sdpDashboardSelectors.test.js`, and `npx playwright test tests/e2e/sdp-components.spec.js tests/e2e/sdp-dashboard.spec.js tests/e2e/gateway-specimen.spec.js`. Run relevant existing navigation/recovery checks and disclose baseline failures.
- [x] Run `npm run build` and the targeted sandbox build; inspect the built sandbox in preview. Do not add the sandbox/specimen to deployed main-app navigation or publish it as part of this task.
- [x] Run `graphify update .`, document actual results in Phase 2 evidence, and update README links and the scoped product decision if needed.

Phase 2 execution evidence: [actual results and visual limits](../../verification/SDP_DASHBOARD_PHASE_2.md). Checked steps record execution; visual acceptance and main-app rollout remain separate.

## Review focus

1. Shared-component changes accidentally restyle resident/current/gateway UI: compare existing specimen captures in Phase 1.
2. A staff dashboard counts only the staff actor's own reports: cover cross-resident aggregation in selector tests.
3. Time boundaries and cancellations leave an expired event/count displayed: test exact boundary and live updates in Phase 2.
4. Long real titles, font fallback and 200% text break the image's tight layout: exercise these in both specimen and dashboard captures.
5. Gold navigation covers controls or bypasses unsaved changes: test safe-area clearance, keyboard reachability and guarded route changes in Phase 2.

## Execution handoff

Recommended execution: native, in this chat, Phase 1 first. The component and dashboard tasks share one visual contract, so direct execution keeps their details consistent without extra agents. Review the concrete Phase 1 specimen before continuing to Phase 2. No implementation or verification checkbox is complete merely because this plan exists.

