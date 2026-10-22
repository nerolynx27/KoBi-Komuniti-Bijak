# Neighbourhood Bulletin — Phase 2 evidence

22 October 2026. The user approved Phase 1 and authorized Phase 2 against **picture 4**. Home and the Bulletin dashboard are implemented for review. The later request to remove the top Demo mode ticket is included. Phase 3 has not begun. Broader repository verification still has the unrelated failures listed below; this is not a claim that all existing checks pass.

## Delivered behavior

- Empty resident URLs, `#` and `#home` resolve Home. Remembered SDP still opens SDP. Brand/home recovery, resident sign-in, resident workspace selection and SDP exit lead Home. Presentation routes and their explicit map exit remain intact.
- Enter World opens `#map`; Back to dashboard returns Home. Explicit `#map?facility=<id>` URLs remain direct. Home is selected while on the map. The specimen passes an explicit frozen Map/Reports/Activities/Profile list so its original layout stays intact.
- One focused h1: “The neighbourhood bulletin”. The masthead date uses Asia/Kuala_Lumpur, updates at midnight and refreshes on focus/visibility. Published activities disappear from the lead story when they start.
- Lead story uses the earliest future published township activity, with stable ID ties. It never promotes drafts, cancellations or started events. Real title, description, time and location remain live text. Missing locations use “Location unavailable”; absence uses “No upcoming activities” and Browse activities.
- Latest update ranks only `selectMyComplaints(data, actor.id)` reports. A maintenance action is an `in_progress`/`resolved` entry in that report's existing `complaint_updates`; newest timestamp wins, with stable action/report ID ties. No action falls back to report creation time and the specified receipt message. No reports produces View reports. Another resident's notes/evidence never enter the dashboard result.
- Compact shortcuts count the resident's visible reports and unique joined published/cancelled township activities; drafts are excluded. Status counts remain in the selector contract but the obsolete large Gateway summary/Next block is not rendered.
- Separate wine world panel, narrow panorama and gold Enter World link; no floating Gateway ticket or entrance-gate hero. Both illustrations have independent bounded failure/retry UI. Broken images do not disable View activity or Enter World; shared storage-recovery UI remains visible above the dashboard.
- Bulletin styling is scoped to Home and the already approved specimen. Other feature layouts retain `current`. No records/schema/sample source were rewritten to imitate screenshot values.

The menu now displays the actual selected profile rather than the old hardcoded Aina/Ravi names. Switch account opens the existing simulated sign-in flow; workspace/persona persistence waits until the navigation guard accepts the change. Keep editing therefore cannot silently switch the active workspace. This remains labeled demo navigation, not authentication.

## Artwork and provenance

Source: `art/dashboard-bulletin/selected-reference.png`, Higgsfield job `4be45171-bcb4-439d-8cd8-4e27fc61a0d8`, 1536×2752, SHA-256 `58cd2c97667c4b817de55ce52c4cd3787c32656fdef7c755d42d88e3e82e9da2`. Requested Nano Banana Pro; recorded returned model Nano Banana 2. No additional licensing verification is claimed and no new generation was commissioned.

| Runtime image | Integer source crop, left/top/right/bottom | Dimensions | SHA-256 |
|---|---|---|---|
| `bulletin-cleanup.png` | 82 / 588 / 716 / 1192 | 634×604 | `cdb03dd036b01ee226148910c44747aa294dc303723fb13d0dc9289235c85b4f` |
| `bulletin-neighbourhood-panorama.png` | 128 / 1880 / 1408 / 2032 | 1280×152 | `bfe301e6f5d8df7848225ec33138adee00bea2945388a116071e384fbd98f0a2` |

`scripts/prepare-bulletin-art.py` performs lossless crops without resampling, text or control extraction. Native aspect ratios and pixelated rendering are preserved. The decorative lamp/tools motif is code-authored SVG using existing semantic colours. The two PNGs and provenance are registered in the runtime manifest/asset ledger. Repeated `node scripts/asset-manifest.mjs` runs verify hashes and retain one row per crop, with the existing fonts/licenses and 30 icon symbols intact. Old Gateway source artwork remains historical.

## Visual comparison

Captures and region measurements are under `artifacts/bulletin-dashboard/phase-2/`: **360×800, 390×844, 768×1024, 1280×800**, short landscape **800×360**, and **390×699** matching the source aspect ratio. Fonts and full `image.decode()` complete first; image height is also checked. This avoids the partial image paint observed in one earlier screenshot. The fixture clock is 22 October 2026. Fixture-only records produce the picture's title/date/repair note and 3/2 counts; `validateDemoData` checks that fixture against the unchanged store contract. Normal browser records remain unchanged.

Compare the [selected picture](../../art/dashboard-bulletin/selected-reference.png) with the [390px flow comparison](../../artifacts/bulletin-dashboard/phase-2/390x844-flow-comparison.png) and [native viewport](../../artifacts/bulletin-dashboard/phase-2/390x844-viewport.png). Native full-page/viewport captures retain real fixed navigation and the development footer. **Only the separately named flow-comparison captures** temporarily place navigation after content and omit the development footer to expose every section; that is screenshot styling, not runtime layout or a claim that the whole screen fits the source height.

| Region | Match and necessary differences |
|---|---|
| Header | Compact KoBi/township/profile row and existing drawer. **Gold Demo mode ticket intentionally removed by the user's later instruction.** Real township is longer than the picture's “Elmina”. |
| Masthead/date | Correct single masthead, thin double rule, Malaysia date and township. Bungee/Yanone Kaffeesatz replace generated lettering. |
| Lead story | Same left illustration/right story composition, wine live View activity ticket; source crop is near-square and kept at its native aspect ratio. Approved 18px heading/16px action text and real copy can require more height than the image. |
| Latest update | Thin-divided vanilla panel, lamp/tools motif, real facility/status/note and Sample data. Text wraps and grows rather than clipping. |
| World entry | Wine/gold/vanilla frame, narrow source panorama, separate full-width gold ticket inside the panel. Scoped CSS cancels the shared card rule's extra button margin. |
| Shortcuts | Two cherry-folded cards, icons and real counts. Bungee labels/long English words can wrap, so cards grow beyond the picture's approximate 44px minimum. |
| Navigation | Four 26px icons, Home selection rule, safe-area-aware reserve. Content scrolls; the original specimen retains Map examples. |

Flat approved colours replace generated gradients/textures. No pixel-perfect claim or whole-page similarity score is made. At 200% text the story/header wrap and content grows; the inherited one-line development footer can still overflow outside the dashboard. The enlarged-text assertion covers Bulletin/header/nav, not a false whole-page pass. Physical Android Chrome, real device insets and screen-reader output were not observed.

## Actual verification

| Check | Result |
|---|---|
| `npx vitest run tests/unit/dashboardSelectors.test.js tests/unit/routes.test.js` | **8/8 passed** |
| `npm test` | **192/192 passed**, 23 files, at the recorded run |
| Required dashboard/recovery/account integration suite | **33/36 passed**; three existing activity-page checks fail, below |
| Final dashboard + account rerun after removing the header ticket | **19/19 passed**: 15 dashboard checks, 4 account checks |
| Final decoded-image capture pass at all six sizes | **6/6 passed** |
| Dashboard/specimen/font/palette regression run before that cosmetic removal | **29/30 passed**; existing editor grid-selector failure, below; all specimen/font/dashboard checks passed |
| `npm run build` | **Passed**, 130 modules |
| ESLint on changed source/tests/manifest script | **Passed** |
| `npm run lint` | **Failed** on 11 errors in unrelated generated `output/sdp-workspace-build/assets/sdp-workspace-DE3aIQ3d.js` |
| Asset manifest/hash check, repeated | **Passed**, 7 asset/license records and 30 symbols |
| `git diff --check` | **Passed**, CRLF conversion warnings only |
| `graphify update .` | **Passed**, AST-only |

The new selector/route tests first failed on the old interface/default landing; the dashboard browser test first failed on the old Map landing, then passed after implementation. Browser coverage includes live report creation/maintenance, join/leave/cancellation/reset, private records, event-start clock updates, dirty Home/Back/Forward, resident sign-in, guarded workspace switching, remembered SDP, real activity/report destinations, artwork retry, malformed storage, short landscape, 200% text, reduced motion and responsive captures.

### Inherited/current-workspace failures retained

`recovery-navigation.spec.js`:

1. “empty collections and empty filters retain recovery actions” expects the former resident Activities message “No activities here yet”.
2. “empty status and Joined filters recover without a write” expects resident activity `.record-row` nodes from the former list.
3. “pending writes explain and disable refresh until recovery completes” expects the former “Refresh activities” control.

The current Activities noticeboard has fallback posters and different controls. Its production source was not changed by this phase (`git diff HEAD -- src/features/activities/ActivitiesPage.jsx` was empty). These expectations were not weakened or skipped. Current Home/guard/storage tests pass independently. Navigation assertions intentionally changed by Home, and setup calls for the current existing menu, were updated; explicit map/history workflows remain explicit.

The extra palette run times out locating `.schematic-grid` in the independently changing world-editor work; placement-colour assertions passed before that missing grid assertion. Those editor sources/output were preserved. Repository lint also currently scans an unrelated generated build in `output/`; it was not edited or excluded to manufacture a clean result. These are broader acceptance limits, not successful checks.

## Scope decisions

- Reused the activity clock for live rollover and kept all existing storage/navigation guards; no new state library, backend or schema.
- Used stable timestamp/ID selection, not fake screenshot counts or another resident's feed. Maintenance actions exclude the initial `received` receipt; no-action wording is explicit.
- Preserved current report/activity/editor compositions and all unrelated in-progress map/presentation/report work. Workspace tests were aligned with the existing drawer rather than restoring removed map-level controls.
- Updated home targets and the 26px Home icon; specimen navigation is frozen explicitly. No text-only nav from picture 1 was carried forward.
- Kept the later user-requested removal of the top Demo mode ticket; remaining Sample data/demo language still identifies the simulation.
- No staging, commits, deployment, reset of the user's active browser, paid generation, package installation or delegation. All test mutations/reset operations use isolated Playwright storage.

Review `/#home` (or the bare app URL). Stop before Phase 3 for user approval; the broader failed checks above remain visible.
