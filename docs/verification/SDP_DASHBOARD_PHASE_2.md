# SDP Dispatch Desk — Phase 2 verification

22 October 2026. The user authorized Phase 2, then rejected the first assembly's appearance and requested a 1:1 copy of the selected picture. The final correction uses measured portrait geometry, rather than the earlier enlarged card arrangement.

**Subsequent authorized illustration pilot:** the user approved trying Higgsfield and source extraction for the Elmina motif. That motif now uses the selected original-art extraction with a live caption. This narrowly supersedes the code-only illustration description below; see [pilot evidence](SDP_ELMINA_ASSET_PILOT.md).

## Review

- [Live SDP sandbox](http://127.0.0.1:5177/sdp-workspace.html#sdp).
- [SDP component specimen](http://127.0.0.1:5177/sdp-workspace.html?specimen=cards-buttons).
- Selected visual authority: [Dispatch Desk revision 01](https://d8j0ntlcm91z4.cloudfront.net/user_3EbIKJiq93OP4D7Jnqcrk4yIGeR/hf_20261022_025238_cf2f2407-8d7f-41b3-9622-052b49ec2ba0.png), 1536×2752, inspected in the browser and captured at 390px width.
- `tests/fixtures/sdp-dashboard-reference.html` is a labeled, rendering-only visual fixture for 12 / 4 / 3 and the picture's short copy. It never initializes a store or changes application seeds. Production build inputs do not include it.

## Visual correction

The first assembly was too tall. It also had oversized title links, a separate-looking report button, undersized motifs and an overly tall navigation bar. The user's correction replaces that arrangement with the picture's composition. Report and event title links now cover their content row through a transparent pseudo-element, retaining generous hit areas without imposing blank 44px title rows. Long live titles/notes use one-line visual previews; their full text remains accessible, and report links open complete details.

The shared SDP family now supplies stepped ticket rims, cherry report borders, bookmark accents, event notches, clipped folds, and more detailed code-authored Elmina/streetlight/calendar/community/world motifs. The primary report action is integrated into the ticket. Navigation uses cream inactive destinations and a raised gold Workspace tab with a sand folded corner. The visible final destination is `World`, matching the picture; its accessible name remains `World editor`.

`Today's desk` opens workspace options containing exit, confirmed reset and development access. This keeps utility controls outside the reference composition. Management page bodies retain their existing controls, recovery messages and forms.

At the 390×699 reference scale, the source's visual bounds were read from its scaled screenshot. These are manual bounds, not automated segmentation. Implementation numbers are actual DOM measurements; SVG frames extend 2px above/left of their element boxes, plus hard shadows.

| Area | Source visual y / height, approximately | Final DOM y / height |
| --- | --- | --- |
| Masthead | 0 / 40 | 0 / 40 |
| Welcome | 56 / 90 | 58 / 88 |
| Metrics | 162 / 60 | 164 / 58 |
| Attention panel | 237 / 220 | 239 / 218 |
| Upcoming event | 466 / 72 | 468 / 68.8 |
| Shortcuts | 542 / 90 | 544.8 / 88 |
| Navigation wine bar | 651 / 48 | 651 / 48 |

The active navigation tab rises 5px above the bar. Content frames begin at x≈22px; measured card elements begin at x=24px and span 344px. The dashboard remains a centered portrait column capped at 480px on wider screens. At enlarged text, metric/shortcut rows can stack and card heights grow.

![Selected image and rebuilt visual fixture](../../artifacts/sdp-dashboard/phase-2/reference-side-by-side.png)

The geometry is regression-tested to within 4px of the measured targets. This is not a claim of zero image-difference pixels: generated shading and irregular lettering are normalized to the approved five flat colors and real Bungee/Yanone Kaffeesatz fonts. Motifs are authored SVG interpretations. Live record names, counts and dates differ from the artwork; the visual fixture isolates those differences for comparison. No screenshot background, raster text, cropped control artwork or new generation was used.

## Data and interaction

- `selectSdpDashboard` scopes complaints by facility township across all residents. Received and in-progress reports count as open; only in-progress counts in that subset. Queue order is received first, oldest first, then ID, capped at two original records.
- Activities require the current township, published status and a start strictly after now. Earliest start then ID selects the next event. The existing activity boundary clock removes an event when its exact start passes, and refreshes on focus/visibility changes.
- Priority means first in this local queue, explained through `aria-describedby`; there is no new stored urgency field.
- Existing report records have no title field. Their real facility name supplies the linked heading, with the original description as the note. Orphan facility references cannot establish township scope and are excluded; rendered missing names fall back to `Location unavailable`.
- Event dates use Malaysia time; compact picture-style dates retain full formatted date/time and timezone in the `<time>` title.
- Existing hash interception handles all staff links and unsaved-change guards. Staff navigation has one row; direct URLs, refresh and browser Back remain functional. Measured navigation height reserves bottom space for content and focus targets.
- Only `kobi.sdp-workspace.v1` is read/written by sandbox bootstrap. Browser tests preserve a sentinel in the main app key through navigation and reset. Store recovery cannot become a successful save; failed reset remains open with its error and can retry.

## Commands and evidence

Browser checks used the installed Chromium at `C:\Users\user\AppData\Local\ms-playwright`. A temporary configuration reused the running local preview on port 5177; the normal Playwright configuration's automatic server startup stalled/encountered occupied ports. No test server configuration or deployed navigation was changed.

- Selector tests were written before implementation and initially failed on the absent selector module. Final `npx vitest run tests/unit/sdpDashboardSelectors.test.js tests/unit/routes.test.js`: **5 passed**. Includes cross-resident/township filtering, status subsets, queue order, date/ID tie-breaks, exact boundary, empty input, references and no input mutation.
- A new geometry regression initially failed on the enlarged welcome panel. It now checks every reference-scale section against the target bounds.
- `npx playwright test --config tmp/sdp.phase2.config.js tests/e2e/sdp-dashboard.spec.js tests/e2e/sdp-components.spec.js tests/e2e/gateway-specimen.spec.js --reporter=list`: **29 passed**. Includes 12 dashboard checks, eight SDP component checks and nine existing current/gateway checks.
- Coverage includes real report transitions, activity publication/cancellation, counts after return and reload, direct staff route refresh, Back, unsaved-change cancellation/discard, empty queue/events, failed reset/retry, storage isolation, full accessible long names, keyboard focus, decoration semantics and reflow. Captures cover 360×800, 390×844, 768×1024, 1280×800, and 390×699 at normal and 200% root text size.
- Targeted ESLint on all Phase 2 JS/JSX and touched tests: **passed**. `npm run lint` reports **11 errors in the older generated `output/sdp-workspace-build/assets/sdp-workspace-DE3aIQ3d.js`**. That bundle was not edited.
- `npm run build` and a targeted Vite build of `sdp-workspace.html` to `tmp/sdp-phase2-build`: **passed**. Targeted build retains Vite's >500kB chunk warning; no dependency or bundle-policy change was added for this visual task.
- Production-preview browser verification checks the real dashboard, staff navigation, direct refresh, no page errors and exclusion of the development component specimen even with its query string.
- `graphify update .` refreshes the local AST graph. Impeccable's mechanical detector returned `[]`; the selected picture remains the visual authority.

The broader `recovery-navigation.spec.js` run produced six main-app failures concerning old resident activity markup/controls and header/map navigation expectations, plus one artifact-file collision from overlapping output directories. Those unrelated tests were not rewritten. An isolated rerun of repeated activation, failed join after start, external-write conflict, malformed links, and confirmed reset passed **5/5**, including the reset case affected by the artifact collision. See `broader-recovery-run.log` and `recovery-focused.log`; a clean whole-repository browser suite is not claimed.

Logs and images are under `artifacts/sdp-dashboard/phase-2/`: `browser-checks.log`, `unit.log`, `lint.log`, `targeted-lint.log`, `build.log`, `sandbox-build.log`, `production.log`, `graphify.log`, `measurements.json`, `reference-fixture.png`, `selected-reference-390.png`, `reference-side-by-side.png`, `reference-overlay.png`, responsive captures and `long-content-keyboard-200.png`.

## Scope and review limits

The existing dirty checkout was preserved, as requested by the plan; no commit, branch change, deployment or main-app dashboard rollout was performed. Review was an author review, not an independent subagent review. Physical Android Chrome, TalkBack and device font scaling were not observed; automated root text scaling does not claim those results. Visual acceptance remains with the user.
