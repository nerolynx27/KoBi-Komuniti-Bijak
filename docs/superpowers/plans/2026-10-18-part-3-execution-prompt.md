Implement KoBi Part Three in `C:\Users\user\Desktop\hackathon` using the approved plan at `docs/superpowers/plans/2026-10-18-part-3.md`.

> Design supersession — 19 October 2026: this plan records work for the earlier build. Its palette/font instructions are historical. The current authority is [product.md](../../product/product.md): only #6C1A21, #B92C2C, #CEA257, #D1BF9A and #E5E0CD for UI (future pixel-world artwork exempt; UI overlays included), Bungee for titles/headers/wordmark/all buttons, and Yanone Kaffeesatz for body/supporting/form text throughout the project, including future world text. The revision is documentation only; do not execute a palette/font migration until separately requested. Existing completion/test records do not validate that migration.


This is an execution request. I approve the written Part Three plan and choose direct execution in this chat. Complete its seven tasks, fix demonstrated shell defects, verify the result and produce the evidence package. The plan's “planning only” status describes the session in which it was written; it does not prevent execution under this request. Start the work after reading the required context. Do not stop at another plan, a test checklist, or an offer to continue.

## 1. Read the governing context and inspect current reality

Read in this order:

1. `AGENTS.md`.
2. `docs/product/product.md`.
3. Relevant scope, behavior and acceptance sections of `docs/product/TECHNICAL_DOCUMENTATION.md`.
4. UI-01–UI-20 and the flow inventory in `docs/product/MVP_UI_ASSETS.md`.
5. `docs/superpowers/plans/2026-10-18-part-3.md` in full.
6. Part Three and its dependencies in `docs/product/PROJECT_TIMELINE.md`.
7. `docs/verification/PART_2.md`, `docs/verification/PART_2_REVIEW.md`, `README.md`, package/config files and the existing tests/source relevant to the first task.

Check for existing Part Three work before creating or replacing anything. Preserve unrelated edits and earlier evidence. Earlier execution prompts are historical context, not authorization to import their different scope, model choices or delegation rules into this task.

Use applicable execution, debugging, testing and verification skills. Design and routine implementation decisions already settled by this prompt and the plan do not require another approval round. If the plan contains a technical mistake, make the smallest correction consistent with the governing specifications, synchronize affected tests/interfaces and record the ruling. Do not enlarge product scope.

## 2. Execute directly and persist through the whole scope

Work directly in the requested folder. Do not spawn subagents, create another chat, initialize Git, create a worktree or make commits. Do not change model settings. Recheck the folder's actual state; absence of Git is not a reason to stop.

Use `superpowers:executing-plans` for task-by-task execution. Record progress, settled decisions, actual command results and remaining work in `docs/verification/PART_3.md`, and update the implementation plan's task checkboxes only when their checks justify it. After interruption or context compaction, read that progress and resume from the first incomplete task instead of restarting completed work.

Give concise progress updates describing findings, fixes and remaining uncertainty. Do not pause for approval between tasks or for routine decisions already specified. Continue every independent task if one environment or physical-device dependency is unavailable.

## 3. Preserve the current product and data contracts

This phase verifies and repairs the existing local shell, including the temporary schematic/editor. Preserve the selected Pixel Stickers system, existing React primitives, semantic HTML, plain CSS, local fonts/icons and live text. All new documentation, UI copy, validation and accessibility labels use English. Keep KoBi — Komuniti Bijak as the proper name.

Retain installed dependencies and the lockfile. No new package, framework, UI kit, backend, authentication system, paid generation, final world artwork, Phaser installation, deployment or APK work is authorized. Later world integration and backend security are not Part Three acceptance requirements.

Keep these invariants:

- One durable demo source: `kobi.demo.v1` with the existing version-2 envelope. No silent schema/key replacement or automatic reset of unreadable data.
- Validate and persist before publishing success. Failed writes preserve committed records and retain the relevant draft/photo/preview.
- Retry preserves the original operation IDs, actor, timestamp and baseline. Block unrelated writes while recovery is pending. Never overwrite newer external data or replay a cancelled destructive operation.
- Resident/SDP switching is labeled open demo navigation. Do not claim actual identity verification, protected staff access, real submissions or enforced backend privacy.
- Reports follow Received → In progress → Resolved, with required notes/evidence and consistent shared history/facility state.
- Activities store UTC, display Malaysia time and recheck participation eligibility when an action or retry executes. Membership/counts must remain consistent without duplicates.
- Photos are decodable JPEG/PNG/WebP, 1–5,000,000 bytes inclusive, and session previews only. Persist metadata, never passwords, File objects, blob URLs or base64 image bytes. Explain preview unavailability after reload.
- Editor placement uses integer coordinates within 32×24 tiles and the existing provisional footprints. Preserve IDs when moving and block removal of referenced facilities. Final art footprints, worker routes and canvas interactions remain later work.
- Guard unsaved navigation, maintain one active modal and preserve meaningful focus. A successful Reset demo restores all related domains coherently.

Run tests in isolated disposable browser contexts. Never clear the user's normal browser data or unrelated storage. Use only dedicated disposable demo data for physical reset tests.

## 4. Complete the plan in its specified order

**Task 1 — Fresh baseline and evidence setup.** Inspect existing coverage before adding tests. Record current environment/source hashes and run the baseline checks. Preserve actual outputs and failure artifacts. Treat the reported Part Two counts as historical, not a current pass. Implement the plan's fixed-clock, one-time-seed helper so reloads cannot silently restore fixtures and falsely prove persistence.

**Task 2 — Connected workflows.** Implement the exact new-facility/editor/report/activity/location journey and cross-domain reset-isolation journey from the plan. Derive created IDs from committed records. Assert both UI results and saved envelopes, including stable IDs, current coordinates, references, revision changes and unchanged bytes on cancellation.

**Task 3 — Recovery and boundaries.** Reuse existing passing regressions and add only missing coverage for failed-save retries, external conflicts, retry after activity start, malformed/missing links, empty states, photo selection races, repeated activation, validation limits and placement boundaries. Preserve the existing reset, history, time-zone and persistence safety assertions.

**Task 4 — Layout, accessibility and visual evidence.** Test actual app routes at 360×800, 390×844, 768×1024, 1280×800 and 800×360; check 200% text at 360×800 and 800×360. Follow the plan's specified route/state captures, target-size checks, modal/focus checks, long-content tests, fallback-font and reduced-motion cases. Inspect screenshots visually, including actual bottom-of-form viewports; automated geometry assertions alone do not complete visual review. Add the supplementary touch-enabled browser runs.

**Task 5 — Physical Android.** Follow the plan's setup and A01–A08 runbook using the fresh production build on a physical phone when access is available. Record actual model/browser/keyboard/display settings and results. Check real keyboard, gallery, Back, rotation, background/resume, TalkBack, reload and reset. Keep desktop emulation and physical evidence explicitly separate.

**Task 6 — Production and final regression.** Retain the existing production checks and add the planned activity and editor journeys. Check actual saved data, console/resource failures and absence of development-only content. Run the full final checks against a fresh build. Repeat the selected retry/history/timing cases three times as specified. Tie device results to the same source; retest affected device cases after subsequent fixes.

**Task 7 — Defects and closeout.** Complete the matrix, issue ledger, Android record and final report; synchronize README/timeline status with actual evidence. Resolve every P0/P1 issue. Do not start Part Four automatically.

## 5. Apply evidence-based repair rules

For an automatable defect: reproduce it, add or strengthen a focused assertion that fails for the relevant reason, make the smallest correction in the owning source, then rerun that test and affected neighboring checks. For a physical-only defect, record device reproduction and before/after evidence, add any useful desktop regression and retest on the phone.

A new acceptance test may pass immediately because existing behavior is correct; do not manufacture a source change just to obtain a failing test. Reuse coverage that already proves the requirement instead of duplicating it.

Do not delete assertions, weaken acceptance, blindly approve snapshots, mark failures skipped or enlarge global timeouts to obtain a green report. Investigate intermittent failures; a later passing retry does not erase an unexplained failure.

Keep browser suites serialized against shared ports/capture directories. Preserve HTML reports, traces, screenshots and command logs before another run overwrites them. Distinguish intentionally injected faults and runner warnings from unexpected application failures.

Use scenario results `Not run`, `Passed`, `Failed`, `Blocked` and `Not applicable`, each with evidence or a precise reason. Never mark something passed because code exists or a previous phase reported success.

## 6. Handle device/tool dependencies without abandoning other work

Locate existing Android platform tools and inspect authorized devices as specified in the plan. Use the selected physical test phone, task-owned local preview/reverse mapping and a stable disposable origin. Confirm the origin provides required browser capabilities, including working `crypto.randomUUID`, before running workflows. Do not deploy publicly or add a product workaround to compensate for a convenient but unsuitable test URL.

If phone connection, USB authorization, platform tools, manual TalkBack/picker operation or environment permissions are missing, record the exact dependency and continue all unaffected automated tests, visual inspection, fixes, production verification and documentation. Prepare the complete device checklist with expected outcomes for a human tester. Request only the missing access/action when it is genuinely needed; do not reopen settled design questions.

Physical tests require observations from an actual device or an identified human tester. Emulation, synthetic visibility events and DOM labels cannot certify Android keyboard, hardware Back, picker, background lifecycle or TalkBack behavior.

Example of an honest partial gate: automated and visual checks pass, but no physical phone is accessible → report **Desktop shell verification complete; physical Android gate incomplete**, identify the blocked A rows and leave overall Part Three completion unchecked.

If an environment approval is rejected, report the rejected action and stated reason, use a supported alternative where available and complete unaffected work. Do not repeatedly retry the same rejected action unchanged.

## 7. Required checks, outputs and completion criteria

Run and record these final checks serially after repairs:

```text
npm run lint
npm test
npm run test:e2e
node scripts/asset-manifest.mjs
npm run build
npm run test:production
```

Expected: all exit successfully, with actual counts/results recorded. The production tests must use the fresh build. Also complete the plan's targeted repeated runs and affected Android retests. Do not install dependencies or replace lockfiles merely because a command fails; diagnose the cause first.

Produce:

- `docs/verification/PART_3.md` — execution progress, decisions, actual commands/results and final gate outcome.
- `docs/verification/PART_3_MATRIX.md` — S01–S17 coverage and A01–A08 results mapped to evidence.
- `docs/verification/PART_3_ISSUES.md` — confirmed defects, severity, corrections and retest evidence.
- `docs/verification/PART_3_ANDROID.md` — actual device evidence or exact outstanding prerequisites and executable checklist.
- `docs/verification/part-3/` — fresh inspected captures, source/evidence manifests, logs and preserved browser artifacts.
- Targeted test additions and demonstrated source fixes, plus accurate README/timeline links and status.

Full Part Three completion requires passing final checks, inspected required captures, zero open P0/P1 issues and all required physical-device cases passed. Conditional camera absence and unobserved nonzero safe-area insets must be documented according to the plan. Do not claim finished pixel-world integration, backend security, HTTPS release or full-prototype acceptance.

Finish with a concise, self-contained report: changes made; actual automated results; actual physical-device results; unresolved issues/dependencies; links to evidence; and the precise Part Three gate status. Begin execution now and continue until all authorized work is finished or the only remaining work depends on clearly identified external access.
