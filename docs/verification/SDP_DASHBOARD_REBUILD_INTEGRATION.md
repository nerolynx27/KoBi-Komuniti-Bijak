# SDP Dispatch Dashboard — Approved Card Set Integration & Rebuild

Date: 22 October 2026.
Target: [SDP Workspace Dashboard](http://127.0.0.1:5177/sdp-workspace.html#sdp) and [Reference Fixture](http://127.0.0.1:5177/tests/fixtures/sdp-dashboard-reference.html).

Following the approval of all ten card candidates on `http://127.0.0.1:5177/art/sdp-card-set-01/review.html` (including the corrected text alignments on cards 6, 7 and 8), the KoBi SDP dashboard has been rebuilt using the approved decorative raster card backings while maintaining the overall composition, hierarchy, and live semantic HTML behavior from the original reference picture (`art/sdp-asset-pilot/reference-dashboard.png`).

---

## 1. Asset Migration

The ten approved Higgsfield candidates were copied from `art/sdp-card-set-01/prepared/` into the production asset directory at `public/assets/dashboard/sdp/cards/`:

| Card Number | Asset Filename | Card Role | Backing Treatment |
| --- | --- | --- | --- |
| 01 | `01-welcome.png` | Welcome card | Wine heading band, Elmina motif left, staff greeting right |
| 02 | `02-open-reports.png` | Open reports metric ticket | Cherry metric ticket with perforated/stepped rim |
| 03 | `03-in-progress.png` | In progress metric ticket | Gold metric ticket with perforated/stepped rim |
| 04 | `04-upcoming-activities.png` | Upcoming activities ticket | Vanilla metric ticket with perforated/stepped rim |
| 05 | `05-attention-panel.png` | Needs attention outer panel | Vanilla outer container enclosing nested report tickets |
| 06 | `06-priority-report.png` | Priority report ticket | Bookmark, priority ribbon top right, integrated gold action strip bottom |
| 07 | `07-secondary-report.png` | Secondary report ticket | Two bookmarks (left wine, right cherry) |
| 08 | `08-upcoming-event.png` | Upcoming event ticket | Gold heading strip, side notches, calendar/building motif divider |
| 09 | `09-manage-activities.png` | Manage activities shortcut | Gold folded ticket card |
| 10 | `10-world-editor.png` | World editor shortcut | Vanilla folded ticket card |

In addition, the approved Elmina extraction (`public/assets/dashboard/sdp/elmina-extracted-v1.png`) is preserved with its live text caption.

---

## 2. Integration Architecture & Text Alignment

### Decorative Backing Mechanism
- **CSS Nine-Slice:** Each card uses `.sdp-card-backing` rendered with `border-image` slices positioned absolutely at `top: -2px`, `left: -2px`, `width: calc(100% + 4px)`, `height: calc(100% + 4px)` with `image-rendering: pixelated`.
- **Accessibility & Interaction:** All decorative raster backings are configured with `aria-hidden="true"`, `focusable="false"`, and `pointer-events: none`.
- **Semantic Live HTML:** All text, numbers, links, buttons, dates, and motifs remain live, focusable, screen-reader accessible HTML.

### Clean Layering & Duplicate Frame Elimination
- Removed older inline SVG card silhouette paths that duplicated borders or caused layout shift.
- Removed duplicate CSS bookmark pseudo-elements (`.sdp-card-report::before`, `.sdp-card-report::after`) so that the approved raster artwork displays cleanly without obstruction.
- Cleared background fills and borders on `.sdp-welcome-band`, `.sdp-card-event .sdp-card-label`, `.sdp-priority-label`, and `.sdp-report-action`.
- Hid redundant nested `.pixel-frame` layers inside the priority report action strip.

### Text Alignment Preservations
- **Card 06 (Priority Report):**
  - Content row padded with `padding-inline: 16px` to clear the motif divider.
  - Priority badge positioned within the top ribbon artwork (`top: 0`, `right: 20px`).
  - "Review reports" action centered vertically and horizontally within the gold strip (`min-height: 26px`, `height: 26px` in dashboard layout; `min-height: 44px` preserved in specimen view for touch accessibility).
- **Card 07 (Secondary Report):**
  - Text row inset with `padding-inline: 52px 38px` to clear the left bookmark and reserve breathing room for the right bookmark.
- **Card 08 (Upcoming Event):**
  - Inset with `gap: 16px` between the illustration motif divider and the text body.

---

## 3. Geometric Verification (390×699 Reference Viewport)

Measured DOM element bounding boxes on `tests/fixtures/sdp-dashboard-reference.html` at 390×699:

| Section | Reference Target y / height | Final DOM y / height | Tolerance Check |
| --- | --- | --- | --- |
| Masthead | 0 / 40 | 0.0 / 40.0 | Exact match |
| Welcome Card | 58 / 88 | 58.0 / 88.0 | Exact match |
| Metric Tickets | 164 / 58 | 164.0 / 58.0 | Exact match |
| Needs Attention Panel | 239 / 218 | 239.0 / 218.0 | Exact match |
| Upcoming Event Ticket | 468 / 68 | 468.0 / 68.8 | Within 1px |
| Shortcut Cards | 544 / 88 | 544.8 / 88.0 | Within 1px |
| Bottom Navigation | 651 / 48 | 651.0 / 48.0 | Exact match |

Content frames begin at `x = 24px` and span `344px` within the centered portrait column (capped at 480px on desktop screens).

### Native Viewport Geometry (402×874 — iPhone 16 Pro Baseline)

When rendered on modern devices (viewport height >= 750px and width >= 380px), the dashboard scales natively to fill the full height and width without dead space above the bottom navigation bar:

| Section | Native 402×874 Target y / height | Measured DOM y / height | Tolerance Check |
| --- | --- | --- | --- |
| Masthead | 0 / 44 | 0.0 / 44.0 | Exact match |
| Welcome Card | 62 / 110 | 62.0 / 110.0 | Exact match |
| Metric Tickets Row | 190 / 74 | 190.0 / 74.0 | Exact match |
| Needs Attention Panel | 282 / 284 | 282.0 / 284.0 | Exact match |
| Upcoming Event Ticket | 582 / 88 | 582.0 / 88.0 | Exact match |
| Shortcut Cards Row | 686 / 110 | 686.0 / 110.0 | Exact match |
| Bottom Navigation | 823 / 51 | 823.0 / 51.0 | Exact match |

Cards span `370px` (`width = 402px - 32px` padding), filling the phone screen naturally. The bottom navigation bar reaches `y = 874px` (the exact viewport bottom), with a comfortable 27px margin between the shortcut cards and the navigation tab.

---

### Final Detail Corrections

1. **Top Metric Tickets Double Line Elimination:**
   - Removed duplicate CSS `border-top: 1px solid currentColor` on `.sdp-card-metric .sdp-metric-foot`.
   - The raster backings (`02-open-reports.png`, `03-in-progress.png`, `04-upcoming-activities.png`) already contain the horizontal ticket divider line in the artwork. Removing the duplicate CSS border eliminates the double line.

2. **Garden Bench (Secondary Report) Spacing:**
   - Updated `padding-inline` on `.sdp-card-report:not(.sdp-report-priority) .sdp-report-row` to `80px 48px`.
   - The vertical bookmark/divider in `07-secondary-report.png` is at $x = 60\text{px}$. With $80\text{px}$ inset, the text starts with a comfortable $20\text{px}$ breathing space after the line, mirroring the rhythm and spacing of the Walkway Lamp ticket above it.

3. **Upcoming Event Title Alignment:**
   - Positioned `.sdp-card-event .sdp-card-label` with `position: absolute !important; top: 0; left: 0; right: 0; height: 16px; display: flex; align-items: center; justify-content: center;`.
   - The title sits vertically and horizontally centered inside the 16px gold ticket notch without cutting across the card border.

4. **World Editor Map Icon Interception:**
   - Tuned shortcut grid ratio to `1.15fr 1fr` (approx. 53% : 47%) with `gap: 10px`.
   - Set `.sdp-motif` to `flex-shrink: 0; width: 44px; height: 44px;` and constrained description text to `max-width: 98px;`.
   - "Update community assets." fits completely in its column without touching or being intercepted by the map icon.

---


## 4. Verification Evidence & Test Results

### Vitest Unit Tests
- `npm test`: **24 test files passed (198 tests)**.
- `tests/unit/sdpDashboardSelectors.test.js`: **3 passed**.
  - Cross-resident report aggregation by facility township.
  - Activity publication and boundary filtering.
  - Tie-breaking and determinism in local attention queue.

### Playwright E2E Suites
1. **SDP Dashboard (`tests/e2e/sdp-dashboard.spec.js`): 15 passed.**
   - Elmina extraction loading and live caption.
   - Reference fixture geometry adherence at 390×699 (all 6 sections <= 4px tolerance).
   - Native 402×874 portrait geometry adherence (all 7 sections <= 5px tolerance).
   - Live demo data records and status updates.
   - 4 semantic destinations in bottom nav.
   - Activity boundary clock update.
   - Long accessible names, 200% zoom reflow, and keyboard focus outlines.
   - Responsive reflow at 360×800, 390×844, 402×874, 768×1024, 1280×800, and 390×699 at 100% and 200% font sizes without horizontal overflow.

2. **SDP Component Specimens (`tests/e2e/sdp-components.spec.js`): 8 passed.**
   - Specimen rendering, button actions, decorative semantics, fallback backgrounds, reflow.
3. **SDP Card Set Review (`tests/e2e/sdp-card-set.spec.js`): 4 passed.**
   - All 10 review cards, asset loading, alignment assertions, 360/1280px reflow.
4. **Gateway Baseline Specimen (`tests/e2e/gateway-specimen.spec.js`): 9 passed.**
   - Preserves baseline without regression across viewports and interaction checks.

### Code Quality & Build Verification
- **Targeted ESLint:** `npx eslint src/components/sdp src/dev/sdp-workspace src/components/ui/PixelFrame.jsx` exited with code 0 (no errors).
- **Application Build:** `npm run build` completed successfully (131 modules transformed, 519ms).
- **Knowledge Graph:** `graphify update .` completed successfully (2,355 nodes, 7,251 edges, 108 communities synchronized).

---

## 5. Visual Artifacts

Generated artifacts in `artifacts/sdp-dashboard/phase-2/`:
- `reference-fixture.png`: 390×699 capture of the rebuilt visual fixture using approved artwork.
- `selected-reference-390.png`: 390×699 reference picture.
- `reference-side-by-side.png`: 780×699 side-by-side visual comparison.
- `reference-overlay.png`: 50% opacity blend between reference picture and rebuilt fixture.
- `card-crops/`: Individual section comparisons:
  - `welcome.png`
  - `metrics.png`
  - `attention.png`
  - `priority_report.png`
  - `secondary_report.png`
  - `event.png`
  - `shortcuts.png`
  - `navigation.png`
- Responsive captures: `360x800-100%.png`, `360x800-200%.png`, `390x844-100%.png`, `390x844-200%.png`, `768x1024-100%.png`, `768x1024-200%.png`, `1280x800-100%.png`, `1280x800-200%.png`.

---

## 6. Scope Boundaries & Live Data Notes

- **Store Key:** `kobi.sdp-workspace.v1` is strictly preserved.
- **Demo Data Fidelity:** Live dashboard displays actual local demo records (e.g. 1/1/2 or current demo seed values), rather than artificially forcing the static 12/4/3 values from the reference image. The reference fixture (`sdp-dashboard-reference.html`) provides the static comparison baseline.
- **Typography & Palette:** Real Bungee and Yanone Kaffeesatz web fonts render crisp, accessible vector text over flat 5-color palette tokens (`#6C1A21`, `#B92C2C`, `#CEA257`, `#D1BF9A`, `#E5E0CD`), replacing the irregular, non-accessible raster lettering of the reference image.

---

## 7. Workspace Section Touch-ups (October 22, 2026)

Following user review, three visual touch-ups were implemented and verified across all target viewports:

1. **Top 3 Metric Tickets Line Collision Fix:**
   - **Root Cause:** In the generated raster card backings (`02-open-reports.png`, `03-in-progress.png`, `04-upcoming-activities.png`), the generator left interior horizontal text-box outline artifacts (rows 35–55). When stretched to 74px card height, this artifact line cut directly across the "Sample data" text.
   - **Resolution:** Cleaned rows 35–55 of the interior backing fills in `public/assets/dashboard/sdp/cards/` using solid matching tone fills (`#B92C2C` Cherry for card 02, `#CEA257` Gold for card 03, `#E5E0CD` Vanilla for card 04) while leaving the outer stepped rims, notches, and borders completely intact. Set `.sdp-dashboard .sdp-metric-foot` to `margin-top: auto; padding-top: 2px; border-top: none; position: relative; z-index: 1;`.
   - **Result:** Text no longer collides with any raster line; tickets display clean, smooth interiors.

2. **Workspace Shortcuts Device Compatibility & Alignment:**
   - **Root Cause:** Asymmetrical grid columns (`1.15fr 1fr`) caused `h3` titles ("Manage activities" vs "World editor") to wrap differently, leading to misaligned baselines and potential collisions with the motif icon at narrower viewports. In addition, `sdp-components.css` had `p` set to `grid-column: 1 / -1`, which spanned under the motif icon.
   - **Resolution:**
     - Updated shortcut layout in `sdp-dashboard.css` to a balanced `grid-template-columns: 1fr 1fr; gap: 10px;`.
     - Styled `.sdp-dashboard .sdp-shortcut-link` as an explicit 2-column grid (`grid-template-columns: 1fr auto; gap: 6px;`) where text column takes `1fr` and the motif is fixed in column 2.
     - Fixed `sdp-components.css` line 138 to `grid-column: 1;` so description text cannot span under the motif.
     - Enforced aligned title heights (`min-height: 1.9rem;` base, `min-height: 2.1rem;` at 402px) and description heights (`min-height: 1.8rem;` base, `min-height: 2.2rem;` at 402px) across both cards.
   - **Result:** "MANAGE ACTIVITIES" and "WORLD EDITOR" titles and their respective subtitles sit on the exact same vertical baseline. The map and calendar motifs are placed cleanly on the right with zero overlap or interception across 360px, 390px, 402px, and desktop widths.

3. **KoBi Logo Masthead Cream Badge:**
   - **Root Cause:** The KoBi brand logo (`/brand/icon only.png`) features dark wine and gold elements on a transparent background, which blended into the dark `#6C1A21` Wine masthead bar.
   - **Resolution:** Added a dedicated badge style to `.sdp-dispatch-masthead > a img`: `background: var(--color-vanilla);` (`#E5E0CD`), `border: 1px solid var(--color-gold);`, `border-radius: 4px;`, `padding: 2px;`, `box-shadow: 1px 1px 0 var(--color-sand);`.
   - **Result:** The KoBi brand mark is crisply legible and stands out prominently against the masthead while strictly honoring the approved 5-color palette.

