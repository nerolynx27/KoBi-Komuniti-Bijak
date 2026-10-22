# KoBi developer guide

Run commands from the repository root. The [root README](../README.md) introduces the product, resident tour and basic setup; [AGENTS.md](../AGENTS.md) records contributor instructions. The [product specification](product/product.md) owns current design and language decisions.

## Local entry points

- `npm run dev`: main app, normally on port 5173. Start at `/#home` for the resident view. Explicit Home links override a remembered staff workspace.
- `npm run dev:sdp`: separate staff rework preview at `http://127.0.0.1:5177/sdp-workspace.html`. It has a Dispatch Desk dashboard and its own `kobi.sdp-workspace.v1` storage key. Shared components and CSS can affect both entries. This is a development preview; the current production build does not include this HTML entry.
- `/reports-sandbox.html` and `/activities-sandbox.html`: isolated design previews.
- `/#design-system`: development-only shared controls specimen and simulated feedback states.

The main app also exposes the original open staff demo through its app menu. Neither staff entry enforces real authorization. To inspect the separate cards/buttons specimen, use `/sdp-workspace.html?specimen=cards-buttons`; it reads and writes no demo records.

## Checks and preview

```sh
npm run lint
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm run test:production
npm run preview
```

Regular Playwright checks use port 5177 and reuse an available server. Ensure any existing server serves this checkout. Production checks require a fresh build and use their configured preview server. Browser reports and transient outputs are stored under `artifacts/` and ignored by Git.

The full browser suite has a known legacy `palette.spec.js` assertion waiting for `.schematic-grid`; the approved map no longer renders that markup. See [cleanup verification](verification/REPOSITORY_CLEANUP.md) for the recorded passing checks and this limitation. Earlier [Part 2](verification/PART_2.md) and [Part 3](verification/PART_3.md) results describe their historical builds; do not present their counts as current verification.

For later LAN/device inspection, `npm run dev -- --host 0.0.0.0` exposes Vite when the firewall allows it. Phone-size Chromium captures do not verify physical Android keyboard/gallery/camera, TalkBack, hardware Back, safe areas or background/resume behavior. See the [physical scope record](verification/PART_3_ANDROID.md).

## Browser demo storage and recovery

`src/lib/demoStore.js` owns the main app data source. The stable storage key `kobi.demo.v1` contains `{ version: 2, revision, data }`. Supported older saves migrate in place; malformed or future versions remain untouched until explicit reset.

Commands validate the current actor, record versions and relationships, and persist a complete candidate before publishing success. A failed command retains its original prepared operation. Retry checks external changes; discard clears that operation. This supports one editing tab with conservative external-change detection, not collaborative editing.

Sign-in does not verify credentials, and registration prepares a fixed resident persona. Passwords and confirmation fields are never persisted. Sign-out clears transient inputs/media while retaining saved records. Demo roles do not provide privacy enforcement or staff authorization.

Photos accept decodable JPEG/PNG/WebP files up to 5,000,000 bytes. Files and object URLs remain in memory. Browser storage keeps attachment metadata and `demo-attachment:` references; reload cannot restore the image previews. No upload or durable evidence storage is provided.

Reset restores sample profiles, reports/history, activities/memberships, facilities, layout and preferences for the active store. It replaces only that demo's storage key, and clears transient drafts and media after persistence succeeds. It does not clear unrelated browser data or the separate preview's store.

## Design and assets

The app uses semantic HTML, plain CSS and measured SVG PixelFrame geometry. The approved UI colours are wine `#6C1A21`, cherry `#B92C2C`, gold `#CEA257`, sand `#D1BF9A` and vanilla `#E5E0CD`. Bungee supplies headings, buttons and branding; Yanone Kaffeesatz supplies body and supporting text. Pixel-world artwork has a palette exemption; UI overlays retain the approved tokens.

Headers, navigation, buttons and world views have smooth surfaces. Paper masks remain on ordinary page/panel surfaces. Original artwork, generation records and font provenance live under `art/`; runtime copies live under `public/assets/`. The selected design reference sheet is not a runtime UI import.

Run `node scripts/asset-manifest.mjs` to verify asset hashes. Keep original asset provenance and supplied font licences when changing runtime assets. Phaser 3.90.0 remains a historical later-phase baseline and is not installed; Supabase is also not connected.

## Graphify

Graphify is separate development tooling, not an npm app dependency. Project guidance lives under `.codex/skills/graphify/` and in `AGENTS.md`. Install the official `graphifyy` Python package separately, then register it with `graphify install --project --platform codex`.

```sh
graphify extract . --code-only --max-workers 2
graphify query "How does demoStore work?"
graphify cluster-only . --no-label
```

Open the generated `graphify-out/graph.html` for navigation. The graph is local, code-only and ignored; semantic document/media indexing is not configured. CSS is outside this AST index, so use the product specification for design decisions. Follow `AGENTS.md` for query-before-source exploration and graph updates after code changes.

## Repository ownership

See [repository layout and Git policy](REPOSITORY_LAYOUT.md) for source/report ownership and ignored outputs. Keep Vite entry points and tool configuration at the root. Preserve package-lock.json, asset provenance, font notices and historical verification evidence. Do not commit local credentials, installed dependencies, builds or generated test output.
