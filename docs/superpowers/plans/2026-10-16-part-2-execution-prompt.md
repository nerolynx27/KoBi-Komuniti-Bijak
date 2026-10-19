Implement KoBi Part 2 completely in `C:\Users\user\Desktop\hackathon`, following `docs/superpowers/plans/2026-10-16-part-2.md`.

> Design supersession — 19 October 2026: this plan records work for the earlier build. Its palette/font instructions are historical. The current authority is [product.md](../../product/product.md): only #6C1A21, #B92C2C, #CEA257, #D1BF9A and #E5E0CD for UI (future pixel-world artwork exempt; UI overlays included), Bungee for titles/headers/wordmark/all buttons, and Yanone Kaffeesatz for body/supporting/form text throughout the project, including future world text. The revision is documentation only; do not execute a palette/font migration until separately requested. Existing completion/test records do not validate that migration.


This is an execution request. I approve the plan's seven recommended decisions and choose subagent-driven implementation. The plan's earlier planning-only status describes its creation session; it does not prohibit implementation under this request. Complete all 14 tasks and all UI-01–UI-20 shell workflows, including integration, visual polish, meaningful verification and documentation. Do not stop after scaffolding, a subset of screens, a plan, or a capability statement.

## 1. Read the project, then execute

Read in this order:

1. `AGENTS.md`.
2. `docs/product/product.md`.
3. `docs/product/TECHNICAL_DOCUMENTATION.md`.
4. `docs/product/MVP_UI_ASSETS.md`.
5. The Part 2 implementation plan.
6. Part 2 and Part 3 in `docs/product/PROJECT_TIMELINE.md`.
7. `docs/verification/PART_1.md`, `README.md`, current source, package scripts and tests relevant to the first task.

Inspect the actual Part 1 components and `art/ui-button-explorations/03-pixel-stickers.png` before composing screens. The image is visual reference only. Existing code and dependencies may have changed since planning; verify before relying on them. Follow applicable implementation, UI, testing and review skills without restarting discovery or requesting approval already supplied here.

Preserve the existing foundation and unrelated work. Work in the requested folder. If it still has no Git repository, do not initialize one or invent a branch/worktree/commit requirement. Record progress in `docs/verification/PART_2_PROGRESS.md`: completed tasks, active ownership, settled interfaces, rulings, real command outcomes and remaining work. Consult it after compaction rather than restarting completed tasks. Mark tasks complete only after their checks pass.

## 2. Lead and implementation subagents

The lead is the architectural brain and integrator. Use **GPT-6.1-sol with `xhigh` reasoning** for the lead architect and **GPT-6.1-sol with `medium` reasoning** for supporting implementation agents. Use explicit model/effort values on isolated spawns, within the available tool/model allowlist.

The current root session cannot change its own model through a prompt. If it is already configured appropriately, act as the lead. Otherwise keep the root as controller and assign a GPT-6.1-sol `xhigh` subagent as lead architect/reviewer. Be truthful about actual routing; do not silently substitute models or change machine configuration. Supporting agents should implement and verify bounded tasks, not merely write more plans.

Respect actual concurrency limits, including the root. Give each worker a focused brief: task text, exact file ownership, dependencies/interfaces, design constraints, acceptance cases and verification commands. Use clean context (`fork_turns: "none"`) with sufficient supplied context. Agents share the filesystem: do not let them simultaneously edit shared files. No separate user-visible chats or messages to unrelated chats are authorized.

Follow the plan's dependency waves:

- **A:** Tasks 1–2, schema/migration and atomic persistence/retry; review before domain writes.
- **B:** Tasks 3–4, navigation/session/modal/dirty guards and shared photo/form primitives.
- **C:** Tasks 5, 6 and 9, account, report-domain and activity-domain work in separate owned files.
- **D:** Tasks 7–8 and 10–11, complete resident/SDP reports and activities.
- **E:** Task 12, then Task 13, temporary map and simulated editor.
- **F:** Task 14, integrated regression checks, production verification and visual polish.

Parallelize only genuinely independent work. The lead/integrator owns shared store/schema/dispatcher, App/main, navigation/modal contracts, central copy and shared styles. Workers request shared changes through the integrator. Keep resident and SDP implementations of a domain on the same rules and data.

Review each meaningful deliverable for specification compliance and correctness. Return actionable findings to its implementer, fix them and verify before dependent work. Finish with a fresh review of the integrated result. Use extra-high judgment for storage, navigation and cross-domain invariants; medium workers for bounded changes. Do not create agents simply to fill slots.

## 3. Deliver a polished Pixel Stickers interface

Build complete, coherent screens from the existing React primitives, semantic HTML, plain CSS, live text and code-authored SVG. Reuse installed dependencies and local fonts/icons. No new UI kit, icon library, router/state/form package, generated UI images or paid generation is needed or authorized.

`docs/product/product.md` owns visual decisions: plum `#5E3543`, lime `#B6D53C`, cream `#FFF4E7`, supporting palette, Play 400/700, short decorative Press Start 2P, stepped SVG edges, fixed-width outlines, cream rims and hard shadows. Use semantic tokens. Maintain the existing frame geometry and consistent action variants.

Make the app look deliberately designed:

- Clear page hierarchy, useful section headings, disciplined spacing, readable forms and compact, well-aligned record rows.
- Strong lime primary actions, calm long forms, wrapping filters, visible selected states and helpful empty/error states.
- Shared treatment across resident and SDP screens, with sensible staff list/detail layouts at wider widths.
- Consistent photo areas, timeline alignment, labels, metadata and action placement. Real photos render normally, not pixelated.
- A presentable temporary schematic/editor with live labels and useful selection/placement feedback. Artwork placeholders belong only where world art is deliberately deferred.
- Keep demo/sample/local-save messages clear and well placed. Remove obsolete Part 1 foundation notices when their replacements work; avoid filling every screen with repetitive debug-style explanations.

Do not finish with disconnected cards, giant unused gaps, clipped labels, decorative dead buttons, generic dashboard filler or TODO screens. Beauty includes readable content, coherent states and working interactions, not only a styled landing page.

Keep every UI string, accessible label, error and new document in English. Preserve KoBi — Komuniti Bijak as the proper name. All visible actions must work or have a legitimate disabled reason.

## 4. Implement the full Part 2 scope

Use the plan's interfaces, file map and acceptance cases. Cover:

- **UI-01/02:** labeled demo sign-in/create-account forms, Resident/SDP selection, show/hide password, validation and pending protection. Registration prepares the fixed resident demo profile; no real account or password storage.
- **UI-03/04:** temporary neighborhood schematic, accessible object/facility buttons, meaningful zoom/reset, public facility sheets, multiple-activity choice and correct ID-based location focus.
- **UI-05/06/07:** facility-prefilled or picker-based reports, validated description, optional photo add/replace/remove/enlarge, confirmed save to actual detail, filters, history and map return.
- **UI-08/09:** activity categories/Joined filter, details, Malaysia times, participant count, idempotent join and confirmed leave, cancellation/start restrictions and location return.
- **UI-10/11:** editable name, read-only profile fields, functional settings/help, remember-workspace preference and confirmed demo sign-out.
- **UI-12/13:** complete navigation, return context, dirty guards, one modal host and inspectable loading/empty/not-found/unavailable/failure/pending/success states. Auth/network/asset examples that cannot occur here must be explicitly simulated in DEV.
- **UI-14/15:** SDP report list/details, legal status transitions, required action notes/evidence, conflict recovery and shared resident history.
- **UI-16/17:** SDP activity management, complete valid drafts, publish/edit/preview/cancel, preserved memberships and unsaved/version protection.
- **UI-18/19/20:** editor entry/exit, seven-item catalog, valid/invalid placement preview, add/move/cancel/confirmed remove, stable IDs, reference blockers, local persistence and confirmed Reset demo.

Implement full forms and recovery states rather than reducing required scope to fit a single pass. Do not add later-phase features.

## 5. Preserve the difficult contracts

- One durable demo store. Preserve supported Part 1 saves and stable lowercase facility IDs. Keep the existing storage key, migrate to the specified v2 envelope and never silently reset unreadable data.
- Validate, persist and only then publish success. Related records/history/attachments/facilities/layout commit atomically.
- Retain one failed prepared command and its base revision. Block unrelated writes until retry/discard; never replay an old snapshot over newer work. A cancelled failed reset must not execute through a later global Retry.
- Generate IDs once per operation and reuse on retry. Respect idempotency and expected versions. Direct and retried success complete the originating form once.
- Derive actor from the transient demo persona; do not trust role/creator IDs from fields. Persona switching is labeled demo navigation, not authentication or protected access.
- Passwords, Files, blob URLs and base64 image bytes never enter localStorage. Photos use validated session Files plus durable metadata, with visible Preview only and unavailable-after-reload states. Accept decodable JPEG/PNG/WebP up to 5,000,000 bytes; evidence is required at resolution commit.
- Keep failed forms, selected photos and editor previews intact. Guard Back/Close/Escape/nav/workspace/sign-out/history and browser-controlled unload behavior. Preserve focus and a single active modal.
- Reports follow received → in_progress → resolved with validated notes/evidence and append-only history. Derive public facility condition across all active reports; expose no report details on public map sheets.
- Activities use full draft validation, UTC storage, explicit Malaysia input/display and action-time eligibility checks. Repeated join/leave cannot duplicate membership or counts; cancellation retains participants. Saved dates never shift on reload.
- Editor coordinates are integer tiles on 32×24. Check bounds/overlap, preserve IDs on moves and block removal of facilities referenced by any report/activity, including historical records. State clearly that final art footprints and worker routes are deferred.

If implementation reveals a defect in the plan, choose the smallest correction consistent with the authoritative specifications, synchronize affected interfaces/tests and record the ruling. Do not preserve a broken contract merely because it appeared in the plan. Do not expand product scope.

## 6. Verify behavior and visually inspect the result

Use meaningful failing tests for new domain logic, then implement and confirm they pass. Preserve existing safety coverage while deliberately updating obsolete foundation/version expectations. Avoid tests that only restate static markup.

Verify real workflows:

1. Map/picker → report → SDP start work → resolution with evidence → resident history/facility state → reload.
2. SDP draft → unsaved preview → publish → resident join/Joined → cancellation → permitted leave.
3. Catalog → valid/invalid placement → confirm/reload → move/cancel → referenced/unreferenced removal → focus/picker consistency.
4. Account/profile/settings/sign-out, dirty navigation, failed writes/retry/discard, and coherent reset across all domains.

Render and inspect actual screens at **360×800, 390×844, 768×1024 and 1280×800**, plus **800×360** and **200% text**. Inspect screenshots, not only DOM assertions. Check long report/activity forms, timeline, photos, filters, errors, confirmations, staff pages and editor. Correct visual defects and recapture affected surfaces.

Verify no page overflow, 44 px targets, readable contrast, visible keyboard focus, modal focus/return, reachable form actions, correct nav clearance, wrapping labels, local font/icon delivery and reduced motion. Desktop emulation does not prove physical Android keyboard/gallery/TalkBack behavior; document those limits for Part 3 without treating them as a reason to leave Part 2 unfinished.

Run the available commands, repair relevant failures, then rerun affected checks:

```text
npm run lint
npm test
npm run test:e2e
npm run build
npm run test:production
```

Production checks must use the fresh build and cover real Part 2 interaction, no external runtime requests, no DEV specimen/fault controls and no reference-sheet imports. Do not weaken tests to hide failures. If an environment restriction blocks a check, make safe progress elsewhere and report the exact remaining limitation; never fabricate a pass.

Save inspected captures under `docs/verification/part-2/` and actual results in `docs/verification/PART_2.md`. Keep Part 1 evidence intact. Update README, the progress ledger and completion records to match actual outcomes. Part 3 and all later phases remain separate and unchecked.

## 7. Finish the authorized work

Continue through implementation, integration, review, fixes and verification without asking whether to proceed between tasks. Resolve routine reversible choices using the specifications and judgment. Ask only for a genuinely required decision or approval that cannot be resolved within this authorized local scope.

Do not deploy/publish, generate paid assets, contact anyone, add backend infrastructure or perform unrelated destructive operations. If continuation spans context compaction, resume from the progress ledger and existing files.

Finish with a concise, evidence-based report: implemented scope, actual passing/blocked checks, links to verification and representative captures, and material remaining limits. Leave the local app available for review when supported. Do not claim Part 2 complete until its required UI, interactions, visual inspection and relevant checks support that statement.
