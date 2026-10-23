# SDP main-app integration - 23 October 2026

## Scope and behavior

The normal production entry now renders the reviewed dashboard at `/#sdp`. `SdpDashboardPage.jsx`, `sdpDashboardSelectors.js` and `sdp-dashboard.css` were moved to `src/features/sdp/`; the main App and isolated preview consume the same implementation. Main-app startup, store adapters, keys and session initialization in `src/main.jsx` are unchanged. No preview records are copied or reset.

Staff routes use the reviewed inverted resident header and four-destination SDP navigation. The menu retains reset and workspace exit, and preserves Presentation Studio access previously exposed by the retired destination card. Only the dashboard suppresses the generic page heading. Resident shell styling stays scoped independently; the existing world-editor texture exemption remains in force.

Text-zoom checks found the formerly absolute upcoming-event heading overlapping its body by three pixels at 200%. Its normal-flow layout now expands with text size. The priority action stays at the card's lower edge.

## Evidence

- Red before implementation: new main-entry test failed because `.sdp-dashboard` did not exist at `/#sdp`.
- All 198 unit tests passed, including the three selector tests with updated imports.
- Lint and fresh production build passed after the final source edits.
- All 49 focused browser checks passed: preview workflows, main-entry persistence/report writes/navigation guards/reset cancellation, accounts, both entries at 320/360/390/402/768/1440px, and 100%/200% text.
- Final fresh-build production run: both main-entry tests passed. They verify stored bytes survive reload, the preview key is not created, report changes persist and update counts, all four staff destinations reload, reset cancellation preserves data, unsaved text requires a decision, and Presentation Studio remains accessible. Page/console errors, request failures and HTTP error responses are asserted empty in the main smoke test.
- Inspected the final production screenshot at `artifacts/sdp-production-final/sdp-main-entry-main-entry--155d1-and-preserves-saved-records/sdp-main.png`.
- Required ten card backings and Elmina artwork are already tracked under `public/assets/dashboard/sdp/` and copied into dist. No preview HTML was added to the production inputs.
- Independent code review found no actionable integration bugs. The reviewer did not independently execute tests.
- Code graph refreshed with `graphify update .`.

## Verification limits

This is not a claim that the whole historical browser suite passes. The broader audit encounters legacy controls such as 'Enter SDP demo workspace' and default-Map assumptions. The existing three production tests also fail on those assumptions, while both new production main-entry tests pass. No unrelated map/report workflow redesign was attempted. Final bounded legacy-audit and resident-shell results are appended below.

Physical Android testing, deployment and hosted-cache behavior were not tested. The local main app remains a labeled browser demo, not backend authentication.

## Release

Implementation is prepared on `codex/sdp-production-integration`. A GitHub update must be confirmed against the remote before claiming that downloading main includes it. The earlier push to origin/main was rejected by automatic approval review because that destination had not been specifically authorized. Do not bypass that rejection; explicit approval of that destination is still required.
Final evidence: five additional resident-shell/workspace-switching checks passed. The isolated full-suite audit stopped at three legacy activities failures (nine passed, 202 not run); each failure waits for the retired 'Enter SDP demo workspace' control. These are not a clean full-suite result. The final two-test production run uses a separate output directory and passes without resource or console errors.
