# Part 2 verification — 16 October 2026

**Result: Part 2 complete for the authorized local frontend scope.** All 14 implementation tasks and UI-01–UI-20 are implemented and verified against one browser demo store. Part 3 remains a separate, unchecked device and whole-shell gate. No pixel world, backend, APK or deployment is claimed.

## Final executed checks

| Command | Actual result on final source |
|---|---|
| `npm run lint` | Passed; no errors or warnings |
| `npm test` | **136 passed**, 12 files |
| `npm run test:e2e` | **63 passed**, 2 workers, approximately 1.5 minutes |
| `npm run build` | Passed; 76 modules transformed |
| `npm run test:production` | **1 passed** against the fresh build |
| `node scripts/asset-manifest.mjs` | 6 shipped asset/license files and 30 pixel symbols verified |
| `python scripts/part2-contact-sheets.py` | 20 review contact sheets generated from unchanged original captures |

Environment: Windows, Node 24.15.0, npm 11.12.1, installed Playwright Chromium with desktop viewport emulation. Existing package pins and lockfile were reused; no package installation or dependency change was required. Runtime dependencies remain React/React DOM only.

Final build output: `index-B4gEMKLx.js` **326.76 kB / 98.35 kB gzip**, CSS **25.70 kB / 5.55 kB gzip**, plus the existing self-hosted fonts/licenses/icon sprite. The production test creates an actual local report, starts SDP work, returns to resident history, verifies local font/icon delivery and no external runtime requests, and checks that DEV specimen code, controls and reference artwork are absent.

Browser runs required elevated local process/socket access. An initially sandboxed Vite listener was unreachable to the browser harness; allowing Playwright to own its reachable server resolved it. No environment check remains blocked. Host `NO_COLOR`/`FORCE_COLOR` warnings are test-runner environment warnings, not app console errors.

## Task and screen coverage

| Task | Implemented result | Verification |
|---|---|---|
| 1 | v1 → v2 migration, exact shape/reference checks, original-key preservation | Migration and store unit suites; original edits/overlap retained; corruption/future versions remain untouched |
| 2 | Atomic commands, one prepared pending operation, baseline conflicts, retry/discard/reset lifecycle | Command/store units and actual browser storage faults; modal/global retry and cancelled reset regressions |
| 3 | Nested hash routes, one transient persona source, return context, one app modal, dirty/history/unload guards | Routes/session units; clean Back/Forward, dirty Keep editing/Discard, workspace restoration, focus and sign-out browser checks |
| 4 | Password/photo controls, validated session Files, metadata-only records, previews and timeline/detail primitives | Photo unit suite; real Chromium JPEG/PNG/WebP decoding; corruption/MIME rejection; picker replace/remove/reselect/enlarge and focus |
| 5 | Demo sign-in/registration, profile/settings/help and confirmed sign-out | Account units and account/profile browser suite; no credential storage; fixed resident identity; persisted names/preferences |
| 6 | Report commands, legal transitions, idempotency, versions and public facility state | Complaint domain tests, including atomic store writes, required evidence, actor rules and multiple active reports |
| 7 | Resident report form/list/detail/history, filters and location return | Reports browser suite; real new record ID, photo handling, local/global retry, filtering, dirty departure and reload |
| 8 | SDP reports/actions sharing the same history | Resident → SDP work → resolution evidence → resident/reload; stale actions, failed resolution, note/evidence validation |
| 9 | Complete activity drafts, UTC storage/Malaysia conversion, versions and membership rules | Activity/date-time units: boundaries, impossible dates, timezone independence, action-time eligibility, idempotency/counts and cancellation retention |
| 10 | Resident activity categories, Joined, details, join/leave and map focus | Activities browser suite, including an activity starting while open and failed participation writes |
| 11 | SDP draft/edit/unsaved preview/publish/cancel | Complete draft → unsaved preview → publish → join → edit → cancel → permitted leave; stale/failed-save and dirty-form protection |
| 12 | Temporary schematic, six seeded place buttons, public sheets and multiple activity choice | World selectors/map browser tests; current ID-based focus after moves; meaningful bounded zoom/reset/internal scrolling |
| 13 | Seven-item catalog, placement/move/cancel/removal, references and persistence | Layout units and editor browser suite; corners/overlap/touching, actor/revision/ID rules, atomic failures, focus and picker consistency |
| 14 | Integrated regression, Pixel Stickers polish, captures, production and documentation | All final commands above, visual inspection below, cross-domain reset and final controller review |

UI mapping: UI-01/02 account forms; UI-03/04 map/sheets; UI-05/06/07 reports; UI-08/09 activities; UI-10/11 profile/settings; UI-12/13 navigation/feedback; UI-14/15 SDP reports; UI-16/17 activity management/forms; UI-18/19/20 editor/catalog/selection. Every normal visible primary action is connected. Auth/access/artwork examples that cannot occur in this frontend are explicitly simulated in DEV.

The proposed `ModalController.jsx` was unnecessary: App owns the single descriptor/host directly. Proposed photo/accessibility checks live in `part2-visual.spec.js`, `layout.spec.js`, account/recovery and report tests rather than an empty additional test file. No placeholder module was added solely to match a proposed filename.

## Integrated behavior verified

- Map/facility prefill or picker → validated report → actual saved detail → SDP Start work → required resolution evidence → shared resident history → reload. Facility state derives across all active reports and public sheets expose no report details.
- Complete SDP draft → unsaved preview without a write → publication → resident join/Joined → edit with preserved identity/membership → cancellation with retained participants → permitted confirmed leave. UTC dates persist unchanged; inputs/display explicitly use Malaysia time.
- Catalog → valid/invalid preview → persist/reload → move with stable IDs → cancel without a write → referenced removal blocked → confirmed unreferenced object/facility removal. Added facilities reach both pickers and location focus resolves moved coordinates.
- Failed saves preserve committed records and local inputs/photos/previews. Unrelated writes are blocked. Local/global/inside-dialog retries finish their originating operation once. Discarding/cancelling a failed reset prevents a later global Retry from resetting data.
- Reset after actual changes to profile, report/history, a newly published activity/membership and layout restores all domains coherently, clears an active move preview and survives reload. Existing unrelated browser data is not cleared.
- Dirty internal navigation, browser Back/Forward, account/workspace changes and sign-out use guards. Browser-controlled reload/unload prompting is registered only while dirty/pending; its display/text remain browser-controlled.

## Visual inspection

Actual rendered screens were captured at **360×800, 390×844, 768×1024, 1280×800 and 800×360**. Sixteen actual routes at each size include forms, lists, details, account/settings and staff/editor pages. Long forms/details/editor were also captured with **200% text at 360×800 and 800×360**. The directory contains **127 original PNG captures and 20 derived review contact sheets**. Part 1 captures remain intact in their original directory.

Controller inspection used the original screenshots and contact sheets, including phone forms/details, tablet forms, desktop staff report/actions, activity form, short landscape, enlarged text, long report/photo/error states, resolved timelines, catalog/invalid previews, blockers and destructive/dirty confirmations. Layout tests found no horizontal page overflow or undersized visible app targets in the checked surfaces; fonts loaded locally. Existing keyboard/focus, modal wrapping/return, nav clearance, fallback-font, reduced-motion and computed action-contrast checks also passed.

Representative evidence:

| Surface | Captures |
|---|---|
| Resident shell | [360×800 overview](part-2/contact-resident-360x800.png), [390×844 Map](part-2/map-390x844.png) |
| Long forms | [Phone report with photo](part-2/report-long-photo-390x844.png), [reachable actions](part-2/report-actions-390x844.png), [tablet forms](part-2/contact-forms-768x1024.png), [desktop activity form](part-2/activity-form-1280x800.png) |
| Staff reports | [Desktop action column](part-2/sdp-report-detail-1280x800.png), [resolved phone history/evidence](part-2/report-resolved-evidence-390x844.png), [resolved desktop](part-2/report-resolved-evidence-1280x800.png) |
| Photos and recovery | [Photo dialog](part-2/photo-preview-dialog-390x844.png), [invalid replacement](part-2/photo-invalid-replacement-390x844.png), [failed save](part-2/report-save-failure-390x844.png), [unavailable after reload](part-2/report-photo-unavailable-1280x800.png) |
| Activities | [Complete unsaved form](part-2/activity-complete-unsaved-390x844.png), [unsaved preview](part-2/activity-unsaved-preview-390x844.png), [dirty confirmation](part-2/activity-dirty-confirmation-390x844.png) |
| Editor | [Catalog](part-2/editor-catalog-390x844.png), [valid preview](part-2/editor-valid-preview-390x844.png), [invalid preview](part-2/editor-invalid-preview-390x844.png), [reference blocker](part-2/editor-reference-blocker-1280x800.png), [remove confirmation](part-2/editor-remove-confirmation-1280x800.png) |
| Landscape and enlarged text | [800×360 staff overview](part-2/contact-staff-800x360.png), [200% report form](part-2/report-form-text-200-360x800.png), [200% landscape editor](part-2/editor-text-200-800x360.png) |

Full-page captures retain real fixed navigation and transient toasts at their viewport position, so those can appear partway down a tall image. Captures normalize scroll to the top; a separate actual bottom viewport proves form actions are reachable. Contact sheets crop/scale originals for overview only; they do not replace individual layout or focus checks.

Visual fixes: removed the obsolete decorative part tag that squeezed enlarged headings; left-aligned compact record titles/badges; centered the narrower staff activity form; added a 320 px staff report action column; improved schematic labels; retained normal photo rendering; used plum helper text on lime selections; kept pending refresh controls disabled with a recovery explanation.

The Impeccable mechanical scan ran once. Its four side-border warnings were reviewed: the pixel brand fold, specified notice/error rails and placement feedback belong to the pinned Pixel Stickers system. They are narrow intentional exceptions, not grounds to replace the approved visual style. No automatic aesthetic score or broad WCAG certification is claimed.

## Defects found and corrected

- Failed reset retry bypassed external baseline detection; baseline-read failure lost its command. Regression tests failed first, then passed after retaining the original prepared command/baseline and captured reset time.
- Confirmation completion could close a follow-up modal. Active-descriptor identity now protects transitions. Failed Leave/Cancel/Reset retries stay inside their owning dialog; Cancel/Escape discards that pending operation.
- Missing-file previews could dereference a null URL record. No-photo/reload handling was corrected and browser-verified.
- Dirty/pending photo decoding needed to participate in save/navigation guards. Draft discard and failed-command discard now have distinct media cleanup behavior.
- Browser history used replace-plus-push on traversal, causing loops and truncating Forward. Transient entry indices now restore the actual entry while prompting and accept clean/approved traversal without extra pushes.
- Remembered bare-URL workspace history needed a canonical initial hash and matching open demo persona on SDP entry. A failing Back → SDP action regression now passes.
- Placement creation omitted its captured revision. Both its input and command validation now enforce expectedRevision; a failing stale/missing-revision unit check now passes. Added facility labels are distinct.
- Reset remounts draft screens, so returning focus to the removed opener could lose focus. Reset now deliberately focuses the stable page heading; Cancel still returns to the opener.
- Report validation feedback remained stale after typing; editing clears the relevant local field error. Report filters now retain focus and announce result counts.

An initial full browser run reported 58 passed / 2 failed: reset focus and a 30-second multi-page desktop capture timeout. Reset focus was fixed. The desktop capture passed alone in 2.3 seconds and in subsequent complete runs without increasing timeouts or weakening assertions. Final runs passed 61, then 62, then **63/63** as additional review regressions were added.

## Rulings and remaining boundaries

1. Work stayed in the requested folder without Git initialization/worktrees/commits. The user explicitly authorized execution of the reviewed plan, then instructed continuation without more subagents; the controller completed all remaining work directly.
2. A newly confirmed reset may replace the known stored baseline, but every failed-reset retry must compare its original baseline/revision. A reset's future seed uses its captured operation time. This favors data preservation over silently overwriting newer data.
3. External conflict remains a recoverable blocked state after pending discard. Reload stays available once pending work is explicitly discarded.
4. Storage recovery inside a confirmation belongs to that same modal and operation. No reset is regenerated or later executed after cancellation.
5. `world.add` includes `expectedRevision`: the plan table omitted it while the preview-version contract required it. Plan, UI command, validation and tests were synchronized. The conservative whole-store revision can require re-review after an unrelated saved change.
6. Explicit SDP URLs/history select the fixed transient SDP demo persona. Common map/profile routes retain the selected persona until an explicit switch/exit. This is open demo navigation, never real staff authorization.

Photos remain session previews, not durable uploaded evidence. The schematic uses integer 32×24 tiles and provisional footprints, not validated final art/hit areas/worker routes. The client clock controls activity eligibility in this local demo.

**Not performed:** physical Android Chrome, Android keyboard/gallery/camera, TalkBack or a real screen-reader session, nonzero device safe-area insets, orientation hardware/background-resume behavior, real authentication/backend enforcement, final pixel-world performance, HTTPS deployment or APK packaging. Those remain Part 3/later work. No paid artwork was generated and nobody was contacted.
