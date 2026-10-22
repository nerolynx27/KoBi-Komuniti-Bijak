# SDP card set 01 — review evidence

Created 22 October 2026 following the user's request to extend the approved Elmina process to all ten cards.

[Open all ten cards](http://127.0.0.1:5177/art/sdp-card-set-01/review.html). The page compares original crops, current implementation, cleaned source-border studies, prepared Higgsfield candidates and selectable live-content previews.

Ten generations completed using GPT Image 2.5, Flare, high quality, 1K and transparent output. Each was quoted at 1.5 credits; the total quote was 15 credits. No paid retries were submitted. Full parameters, upload IDs, result URLs and quotes are retained in `art/sdp-card-set-01/generation-record.json` and `results.json`.

| Card | Completed generation | Silhouette aspect difference |
| --- | --- | --- |
| Welcome card | `7339cb77-9f63-44b9-92ca-4ad494044533` | 2.4% |
| Open reports ticket | `499100ad-16a9-48b0-9de7-613f45b1b429` | 11.3% |
| In progress ticket | `f95f9d5a-0baf-47cf-88e5-ab323626a9bf` | 6.7% |
| Upcoming activities ticket | `c5160bf2-fa33-4cef-8231-08e1101f3267` | 14.6% |
| Needs attention outer panel | `de065736-b32e-4c36-964d-bdc087bbbfda` | 10.7% |
| Priority report ticket | `895fc751-db31-43a7-8e8a-5e4cf9214a9f` | 1.2% |
| Secondary report ticket | `d11e2fa4-5d20-495a-9729-ba73a5c1a47a` | 4.4% |
| Upcoming event ticket | `c8a092dd-4b8a-4866-98f3-3b682af3dff6` | 0.2% |
| Manage activities card | `68743824-df14-4cc8-8694-cc9d0dedfe26` | 19.7% |
| World editor card | `f8cff7dd-db86-45b9-b27b-99c844abebb2` | 6.4% |

## Preparation and limits

`references/` contains full-resolution source crops; `generated/` retains unmodified outputs. `prepared/` applies binary alpha at 128 and the five approved palette tokens. Cleanup removes text-removal blotches on cards 03, 09 and 10 and reconstructs the blank outer panel on 05; the other generated rims retain their geometry. The preparation script asserts palette and alpha properties and records dimensions and SHA-256 hashes in `qa.json`.

`source-studies/` contains reconstructed blank source-border studies, not untouched extractions. The raw originals remain available beside them. Generated silhouette aspect differences range from 0.2% to 19.7%; these candidates have not been accepted as exact matches. Cards 02, 04, 05 and 09 particularly need proportion review.

The review page uses frozen visual-fixture markup with live text, illustrations and links. A per-card selector switches the decorative nine-slice backing. It does not read or write demo records. Approved Elmina artwork is reused. These files are review artifacts; the default dashboard frames have not been replaced and nothing was deployed.

## Verification

- Playwright: 4 tests passed, including all ten cards and loaded images, candidate switching, links, decorative semantics, no KoBi storage access, and no document overflow at 360px/1280px with normal and 200% text size.
- Targeted ESLint on `tests/e2e/sdp-card-set.spec.js`: passed.
- `npm run build`: passed.
- Browser screenshots and command logs are retained in `artifacts/sdp-card-set/`.
- Reproducible catalog, capture, download, preparation and viewer scripts are retained with the artwork.

![All ten comparison rows](../../artifacts/sdp-card-set/1280-100%.png)

## Text alignment correction

## Text alignment correction

Cards 06, 07 and 08 now use review-scoped content insets to clear generated bookmarks and dividers. The priority label sits inside its ribbon. Preview widths fit their panels; hidden captured SVG frames are removed from layout to prevent fixed-width overflow. The shared dashboard components are unchanged. The regression check covers both candidate backings at 360px and 1280px; all four review tests and targeted ESLint passed. Detail captures and red/green logs are retained in `artifacts/sdp-card-set/`.

## Integration into SDP Dashboard

Following approval of the ten candidates, the artwork was migrated into production assets under `public/assets/dashboard/sdp/cards/`:
- `01-welcome.png`, `02-open-reports.png`, `03-in-progress.png`, `04-upcoming-activities.png`, `05-attention-panel.png`, `06-priority-report.png`, `07-secondary-report.png`, `08-upcoming-event.png`, `09-manage-activities.png`, `10-world-editor.png`.

The SDP workspace dashboard (`http://127.0.0.1:5177/sdp-workspace.html#sdp`) and visual fixture (`tests/fixtures/sdp-dashboard-reference.html`) have been rebuilt using these approved card backings via nine-slice border image decorations, while maintaining live semantic HTML text and controls, responsive reflow, and existing demo store data (`kobi.sdp-workspace.v1`). Full verification and side-by-side evidence are recorded in [SDP_DASHBOARD_REBUILD_INTEGRATION.md](SDP_DASHBOARD_REBUILD_INTEGRATION.md).

