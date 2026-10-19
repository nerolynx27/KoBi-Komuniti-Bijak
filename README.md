# KoBi — Komuniti Bijak

KoBi Part 2 is a complete local demo shell for the selected Pixel Stickers system, covering UI-01–UI-20. Residents can report facility problems, follow repairs and join activities. The open SDP demo workspace manages those same reports, activities and a temporary neighbourhood schematic/editor.

Part 3 desktop and phone-size verification is complete (18 October 2026): 137 unit tests, 92 browser tests, 3 production tests and 24 selected repeat checks passed, along with lint, assets and a fresh build. One shared focus/scroll-clearance defect was repaired. Physical testing was explicitly excluded by the user's later instruction; the original physical Android gate remains unverified.

## Folder guide

- `src/` — React app, shared controls, styles and browser demo data.
- `public/` — runtime assets served by the app.
- `art/` — artwork sources, font originals, licenses and asset provenance.
- `references/` — visual reference material.
- [docs/](docs/README.md) — product specifications, competition guidance, plans and verification evidence.
- `scripts/` — asset preparation and evidence utilities.
- `tests/` — unit, browser and production checks.
- `artifacts/` — generated browser reports, test results and logs; ignored by version control.
- `graphify-out/` — generated local code knowledge graph; ignored by version control.
- `dist/` — generated production build; `node_modules/` — installed dependencies.
- `tmp/` — scratch work and the folder-organization recovery record.

Keep app entry points, package files and tool configuration at the project root. Root files include `index.html` (main app entry), `reports-sandbox.html` (isolated reports UI preview), package manifests (`package.json`, `package-lock.json`), and tool configs (`vite.config.js`, `eslint.config.js`, `playwright*.config.js`). Run all commands from this folder. Browser reports are written to `artifacts/playwright-report/` and `artifacts/playwright-production-report/`; transient browser results go to `artifacts/test-results/`. Saved verification evidence stays under `docs/verification/`.

## Graphify

Graphify 0.9.90 is registered for this project in `.codex/skills/graphify/`, with query guidance in `AGENTS.md`. In Codex, invoke `$graphify .` after the skill becomes available on the next turn. The development tool is installed separately from the app's npm dependencies; on another machine, install the official `graphifyy` Python package and run `graphify install --project --platform codex` from this folder.

The initial graph covers code only and runs locally without an API key. Rebuild it with `graphify extract . --code-only --max-workers 2`, then use `graphify query "How does demoStore work?"` to retrieve related code. Open `graphify-out/graph.html` for the interactive map. `.graphifyignore` excludes generated files, retained verification assets and assistant tooling. Document/media semantic indexing is not configured.

Run `graphify cluster-only . --no-label` after extraction to refresh the report and interactive map without model calls. CSS is not part of this AST index; Graphify also flags `tokens.css` as potentially sensitive because of its filename. The design specification remains authoritative for styling.

## Run locally

Use Node **22.13+ in the 22.x line, or 24+**, and npm. Verified runtime: Node 24.15.0 / npm 11.12.1. Dependencies remain pinned in the existing lockfile; Part 2 added no packages.

```sh
npm ci
npm run dev
```

Open [KoBi](http://127.0.0.1:5173/#map). Explicit demo account forms are at [Sign in](http://127.0.0.1:5173/#sign-in) and [Create account](http://127.0.0.1:5173/#create-account). The bare home URL opens resident mode or the remembered SDP workspace. The [development specimen](http://127.0.0.1:5173/#design-system) includes shared controls and explicitly simulated loading, session/access and artwork-failure states; it is excluded from production. The isolated reports design sandbox is at [Reports Sandbox](http://127.0.0.1:5173/reports-sandbox.html).

```sh
npm run lint
npm test
npm run test:e2e
npm run build
npm run test:production
npm run preview
```

Playwright manages localhost servers on ports 5173 and 4173. Build before the production check. Browser checks require local socket/process access; in a restricted Codex sandbox they were run with approved process permissions. Do not leave an inaccessible sandbox server occupying those ports. Use `npm run dev -- --host 0.0.0.0` for later LAN/device testing when the host firewall allows it.

## Workflows

- Demo sign-in with Resident/SDP selection and show/hide password; registration prepares the existing resident profile. Profile name editing, read-only email/township/role, remember-workspace settings, help and confirmed sign-out.
- Accessible facility buttons and a zoomable 32×24 schematic. Public sheets show facility condition and activity choices. Location links resolve current object IDs and keyboard focus.
- Reports with a prefilled facility or picker, validated description, optional session photo, filters and shared action history. SDP follows Received → In progress → Resolved, with a required action note and resolution evidence.
- Community/Recycling/Joined activity lists, Malaysia date/time display, idempotent membership and confirmed leave. SDP creates complete drafts, previews unsaved values, publishes, edits before start and cancels while retaining participants.
- Seven-component catalog, integer placement preview, bounds/overlap validation, stable IDs on moves and confirmed removal. Historical report/activity references block facility removal. New facilities appear in report/activity pickers.
- Dirty navigation and browser history guards, one app modal host, local storage failures with retry/discard, conflict recovery and a coherent confirmed Reset demo.

## One durable browser demo

`src/lib/demoStore.js` owns the source of truth. The existing **`kobi.demo.v1`** key now stores **`{ version: 2, revision, data }`**. The key name remains stable; its envelope version identifies the schema. Supported Part 1 saves migrate in place, preserving edited records, IDs, dates, preferences and provisional layout. Malformed or future versions remain untouched until explicit reset.

Commands validate the transient demo actor, current records, expected versions and relationships. They persist the entire candidate before publishing success. A failed prepared command retains its original IDs, actor, timestamp and baseline; unrelated writes are blocked until retry/discard. Retry detects external changes and rechecks time eligibility. A cancelled failed reset cannot execute through a later Retry. This is a one-editing-tab demo, with conservative external-change detection rather than multi-tab collaboration.

Sign-in does not verify credentials. Registration prepares one fixed resident persona; it creates no real account. Passwords and confirmation fields are never persisted. Persona switching is open demo navigation, not authentication, privacy enforcement or protected staff access. Sign-out clears transient inputs/media while retaining saved records.

Photos accept decodable JPEG/PNG/WebP up to **5,000,000 bytes**. Validated Files and object URLs remain in memory; localStorage contains only attachment metadata and `demo-attachment:` references. Photos are labeled **Preview only**. Reload preserves records/history but shows that their image previews are unavailable. No upload or durable evidence storage is claimed.

Reset replaces only KoBi's storage key and restores profiles, reports/history, activities/memberships, facilities, layout and preferences. It clears transient drafts, selections and photo previews only after persistence succeeds. It does not clear other browser data.

## Design, assets and evidence

The **current build** uses semantic HTML, plain CSS and measured SVG PixelFrame geometry, with the approved wine/cherry/gold/sand/vanilla palette and locally hosted Bungee 400 and Yanone Kaffeesatz variable fonts. Bungee supplies headings/buttons/branding; Yanone Kaffeesatz supplies body and supporting text. The selected reference sheet is not a runtime import. No UI PNGs, paid artwork or backend infrastructure were added.

The **approved specification, revised 19 October 2026**, limits all UI to `#6C1A21`, `#B92C2C`, `#CEA257`, `#D1BF9A` and `#E5E0CD` from the [user's palette reference](https://i.pinimg.com/736x/78/71/af/7871af2062e7b91f2a7d4672865e71fa.jpg). Future pixel-world artwork is exempt; UI/editor overlays are included. Only Bungee is selected for titles, headers, wordmark and all buttons, and Yanone Kaffeesatz for descriptions, long text, supporting copy and form text across the whole project, including future world text. See [the authoritative design system](docs/product/product.md). The user subsequently authorized both font replacement and execution of the colour plan; both are now implemented. See [colour-migration verification](docs/verification/UI_COLOUR_MIGRATION.md) for current evidence. Old Play/Press Start 2P source/runtime fonts and their licenses have been removed from active asset directories. Existing Part 1–3 verification reports describe the earlier build.

Font originals/provenance remain under `art/source/fonts/`; runtime copies/licenses and the local SVG icon sprite remain under `public/assets/ui/`. `node scripts/asset-manifest.mjs` verifies their hashes. The schematic/editor uses provisional footprints: house 3×3 tiles, other catalog components 1×1. Final art dimensions/pivots, hit areas and worker routes remain deferred. Phaser **3.90.0** remains the later world-phase baseline and is not installed.

See [Part 2 verification](docs/verification/PART_2.md), [execution progress](docs/verification/PART_2_PROGRESS.md), [review findings and resolutions](docs/verification/PART_2_REVIEW.md), and [captures](docs/verification/part-2). [Part 1 evidence](docs/verification/PART_1.md) is retained.

See [Part 3 report](docs/verification/PART_3.md), [S01–S17 coverage](docs/verification/PART_3_MATRIX.md), [defects and retests](docs/verification/PART_3_ISSUES.md), [physical scope record/future checklist](docs/verification/PART_3_ANDROID.md), and [fresh captures](docs/verification/part-3/automated/captures). The report discloses that legacy capture paths were refreshed by their existing suites; original historical image bytes were not frozen before the baseline.

Physical Android keyboard/gallery/camera, TalkBack, hardware Back, nonzero safe areas and background/resume remain unobserved by explicit user choice. Phone-size Chromium inspection and touch emulation do not prove them. The original overall Part 3 physical gate remains unchecked; no phone access is currently requested. The pixel world, final artwork, backend, APK and deployment remain later work, and Part 4 was not started.
