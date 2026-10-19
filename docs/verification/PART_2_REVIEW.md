# Part 2 independent review

This record is maintained by the controller, separately from the earlier feature implementation ownership. Final verdict: accepted for the authorized Part 2 local frontend scope after the fixes and checks below. Device and later-world/backend limits remain separate.

## Core review — wave A

Reviewed `demoStore.js`, `demoCommands.js`, `demoSchema.js`, `demoSamples.js` and the focused core tests.

- Version 1 migration retains stable lowercase facility IDs, edited records/preferences and structurally valid provisional/overlapping layout entries. Version 2 retains metadata-only attachment references and exact-key checks.
- Important finding: a failed reset retried after an external write bypassed the baseline check and replaced newer data. Independently reproduced: retry returned no error and replaced the external display name with `Alex Tan`. Sent to the architect for a regression test and correction.
- Important finding: a failure reading the stored baseline returned a storage error without retaining the prepared operation. Independently reproduced `pendingOperation: null`. Sent to the architect for a regression test and correction.
- Related correction requested: seed a prepared reset from its captured operation timestamp; keep external conflicts in recovery after discarding a pending operation.
- Fresh core run after the architect added reproductions: `npm test -- tests/unit/demoCommands.test.js tests/unit/demoMigration.test.js tests/unit/demoStore.test.js` reported **34 passed, 2 failed**. This is expected failing evidence, not a completed gate.
- Both defects were corrected. The reset retry now compares the prepared storage baseline, baseline-read failure retains the command, detected external changes keep the store blocked, and reset samples use the captured operation time. Independent rerun including routes/session: **38/38 passed across five files**. Wave A gate approved. Integration follow-up: keep recovery discoverable after discarding a pending operation while an external conflict still blocks writes.

## Visual harness baseline

`tests/e2e/part2-visual.spec.js` covers 16 actual routes at 360×800, 390×844, 768×1024, 1280×800 and 800×360, plus 200% text on long forms/details/editor. It records new captures under `docs/verification/part-2/`.

The first app-reaching run failed at the expected absent report form on `#reports/new`. Earlier attempts could not probe a Vite process started inside the sandbox. Stopping that process and allowing elevated Playwright to own its server resolved the environment issue. Subsequent browser checks must be serialized and use a reachable local server.

The controller independently reviewed photo primitives and ran `npm test -- tests/unit/photos.test.js`: **5/5 passed**. An actual Chromium test generates JPEG/PNG/WebP image fixtures, decodes and stages each through the real `validatePhoto`, and rejects corrupt PNG bytes and unsupported SVG MIME. `npm run test:e2e -- tests/e2e/part2-visual.spec.js --grep 'real browser decodes'`: **1/1 passed**. This proves browser decoding; picker/form integration checks remain separate.

## Final integrated review

Completed directly by the controller after the user instructed no further subagents. A fresh independent reviewer supplied the history-traversal finding before its run was interrupted by a usage limit; the controller completed source review, reproduction, fixes, visual review and final verification.

- Clean and dirty Back/Forward were independently reproduced as failures and fixed with actual history-entry traversal. A remembered bare-URL workspace also received a failing regression, canonical hash initialization and matching transient demo persona on SDP URL/history entry.
- A missing captured revision on placement creation was independently reproduced (135 passed / 1 failed); UI dispatch and domain validation were synchronized. The full unit suite then passed 136/136.
- Actual inside-dialog failed Leave, Cancel activity and Reset retries pass, including preserving the original reset timestamp and not replaying a cancelled reset. Global/local form completion and whole-domain reset pass.
- Reset focus is restored to the stable heading after draft screens remount. Field validation feedback clears on edit. Result counts, disabled pending refresh controls and selected-state contrast were checked.
- Final checks: lint clean; 136 unit tests; 63 development browser tests; fresh build (76 modules); 1 production smoke test passed. Production exercises report creation and shared staff/resident history, with local fonts/icons and no DEV/reference imports or external runtime requests.
- No unresolved important Part 2 finding remains from this review. This does not certify physical Android, TalkBack, final pixel art/worker routes or real backend security.

## Account and navigation review — wave B / task 5

- Read App composition, session/main, route/dirty guard hook, command-form hook, modal host and account command/pages/profile/settings code.
- Flagged a modal transition in which a discard confirmation could pop the follow-up sign-out confirmation. The integrator added an identity check before closing a confirmation; the controller verified the final behavior through an independent browser regression.
- Flagged first-invalid-field focus in shared command forms and the distinction between discarding a failed prepared command while editing and discarding the entire draft on departure. Both shared contracts were corrected by the integrator.
- `npm run test:e2e -- tests/e2e/part2-visual.spec.js --grep 'dirty profile|profile input' --workers=1`: **2/2 passed**, covering sign-out after dirty discard and repeated browser Back/Keep editing.
- `npm run test:e2e -- tests/e2e/accounts-profile.spec.js tests/e2e/recovery-navigation.spec.js --workers=1`: **7/7 passed**, covering registration/trim/mismatch/fixed identity/no credentials, show password, profile persistence, selected persona, preference failure/retry, dirty navigation, failed reset cancellation and originating-form completion after global retry.
- One account assertion initially expected resident persona after hash-only navigation from SDP. The test was corrected to the approved contract: common routes retain the selected transient persona, while explicit SDP exit selects resident. No source change was made for that test error.

## Capture inspection

Completed using original screenshots and derived contact sheets across 360×800, 390×844, 768×1024, 1280×800, 800×360 and 200% text. Long reports/photos/errors, history/evidence/reload unavailability, activity forms/unsaved preview, filters, staff action columns, catalog/ghosts/blockers and confirmations were inspected. Existing Part 1 evidence is preserved.

Corrected the oversized empty staff-form area, full-width/centered record treatment, tiny schematic labels, low-contrast secondary text on lime, and decorative part-tag pressure on enlarged headings. Recaptured affected surfaces and confirmed no page overflow or undersized app targets through the browser suite. Full-page fixed chrome artifacts are explained in PART_2.md; an actual bottom viewport verifies form-action reachability.

Impeccable detector warnings were reviewed once. Pixel brand-fold and specified notice/error/placement side borders are intentional exceptions under the authoritative design. No unrelated redesign or dependency was introduced.
