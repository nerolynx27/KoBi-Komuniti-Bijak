# Paper Texture Rollout Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task after the user approves implementation. No delegation is required. Steps use checkbox syntax for tracking.

**Goal:** Apply selected paper designs 01, 04 and 05 consistently across resident and SDP sections, including cards and buttons, using the current SDP workspace as the first review target.

**Architecture:** Export the three selected procedural recipes into small, cached, transparent texture masks. Use shared CSS for ordinary surfaces and a shared SVG pattern helper for SVG faces. Add a face-only overlay to the existing PNG-backed SDP cards; preserve their backing images and border-image recipes.

**Tech Stack:** Existing JavaScript/JSX, React 19.3.1, Vite 8.3.4, plain CSS, SVG and PNG. No new dependency or runtime canvas loop.

**Spec:** User selection on 22 October 2026: preview designs 1, 4 and 5, used across all sections including cards and buttons. Visual constraints remain in `docs/product/product.md`. Source recipes are the increased-intensity version of `public/paper-textures.html`. This plan proposes the role mapping below; selection of the three designs does not imply implementation is already authorized.

**User scope revision during implementation:** no texture on buttons, headers/navigation, resident map or world editor. This supersedes the original woven-control and navigation mapping below; woven is retained only as a frozen reference.

## Design and scope

| Surface | Selected texture | Treatment |
|---|---|---|
| Page body, shell, header, footer and navigation surfaces | 01 Fine grain | Continuous, quiet paper field; no change to existing base colours |
| Cards, report sheets, activity notes, board surfaces, modal panels and form input surfaces | 04 Laid paper | Horizontal paper fibres clipped to each face |
| Filled buttons, icon buttons, tabs, chips and selected navigation items | 05 Woven paper | Fine cross-grain inside the control face; unfilled text links inherit their parent surface |

- Apply to the current `/sdp-workspace.html#home` entry and its resident and staff destinations, then the main `/` entry using the same primitives. The current workspace home is the resident Bulletin dashboard, despite its filename.
- Coverage: Home, Reports and report detail/form/status folders, Activities and gallery frames/detail/forms, Profile/account screens, SDP dashboard/report management/activity management/world editor, menus, modals and storage recovery surfaces.
- Keep full-screen map artwork, editor world canvas, photographs, illustrations, logos and gallery images intact. Texture their DOM control faces and paper surrounds. Preserve the existing full-screen map layout.
- Keep fonts, dimensions, spacing, borders, shadows, stepped silhouettes, fold colours, navigation, copy and demo records intact. No texture selector or user preference is introduced.
- Keep the existing texture comparison page as the reference. Unrelated slide/video projects and archived standalone experiments are outside this rollout.

## Global constraints

- Approved colours only: `#6C1A21`, `#B92C2C`, `#CEA257`, `#D1BF9A`, `#E5E0CD`. Bungee for titles/actions; Yanone Kaffeesatz for body/form text.
- Keep `#E5E0CD` as the cream base. Use transparent marks, never an opaque cream image over a coloured control.
- Preserve current, gateway and sdp frame treatments; this changes surface finish, not frame design.
- Texture is decorative, static, pointer-transparent and absent from the accessibility tree.
- Existing local changes belong to the user; do not reset, replace or commit unrelated work.

## Texture scale, intensity and colour

- Freeze designs 01, 04 and 05 from the current stronger preview, including their seeded randomness. Preserve original indexes/seeds: grain index 0, laid index 3, woven index 4.
- Reference resolution: 640 × 640 source pixels rendered at 320 × 320 CSS pixels. Use the same physical grain scale on pages, cards and buttons; do not stretch a tile to each component's dimensions. Crop/repeat it.
- Use the stronger preview density as the starting point for all three roles. Review the assembled page once for cumulative noise; any reduction should be a shared recipe decision, documented before rollout rather than arbitrary per-screen adjustments.
- CSS/SVG masks recolour only the marks. Proposed mark pigments by base surface:

| Base | Mark pigment | Text retained |
|---|---|---|
| Vanilla | Sand | Wine |
| Sand | Gold | Wine |
| Gold | Sand | Wine |
| Wine | Cherry | Vanilla |
| Cherry | Wine | Vanilla |

- These pairs keep ordinary wine text over vanilla/sand/gold at at least 4.94:1 and vanilla text over wine/cherry at at least 4.59:1 using the documented palette ratios. Validate actual text/background pairs, including contextual overrides.
- Cherry validation text needs a smooth vanilla backing: do not place sand grain directly beneath cherry text. Keep error-label backgrounds and tiny critical status indicators clean where needed for contrast.
- Do not add opacity, blend modes, shadows or noise filters that invent new palette colours. Raster masks use binary alpha; browser edge antialiasing is not a new design token.

## Implementation risks found in the current code

1. `PixelFrame.css` makes framed HTML backgrounds transparent when the SVG exists. A CSS background on `.button` alone will disappear behind its SVG face.
2. `PixelFrame.jsx` supports current/gateway frames and delegates SDP to `SdpFrame.jsx`. Every face path must get the same role-based pattern while its outline/rim/fold stays solid.
3. `SdpFrame.jsx` returns a `<div>` for `sdp-*` cards. `sdp-components.css` uses ten PNG `border-image` backings with filled centres. These need a separate clipped interior texture layer, not SVG-only changes or replacement generated art.
4. Reports use bespoke `FolderCard.jsx` paper geometry and Activities have custom notes/board/polaroid surfaces. Shared `.card` changes alone will miss these.
5. Existing SVG IDs, press transforms, nested cards and native input focus must remain correct when many textured components coexist.

## Review focus

- Long and wrapping button labels: the face texture cannot cover glyphs, alter sizing or intercept clicks.
- Nested paper panels: each opaque face owns one texture; inherited overlays must not double the grain.
- Wine/cherry and disabled controls: preserve text contrast and semantic state colours.
- Responsive and zoomed views: no new overflow, enlarged grain, seams or texture movement during press/resize.
- Asset/mask failure: the existing solid surface must remain readable and functional.

### Task 1: Freeze the three selected texture assets and surface tokens

**Files:** Create `scripts/export-paper-textures.mjs`, `public/assets/ui/paper/fine-grain-mask.png`, `laid-paper-mask.png`, `woven-paper-mask.png` and `src/styles/paper-textures.css`. Modify `src/styles/tokens.css`. Reference `public/paper-textures.html` without changing its six options.

**Interface:** `--paper-page-mask`, `--paper-panel-mask`, `--paper-control-mask`, `--paper-tile-size: 320px`, and inherited `--paper-ink`. The exporter takes no arguments and emits the three deterministic binary-alpha masks at 640 × 640 using the selected preview recipes. Use the installed Playwright browser for one-time canvas export; no browser generation in the app.

- [x] Extract the selected recipes without changing seeds, counts or grain geometry; export transparent grain-only PNGs. Keep dependencies unchanged.
- [x] Verify dimensions, nonempty coverage, binary alpha, deterministic output and cream-free transparent areas. Expected approximate coverage: 17% fine grain, 17% laid, 21% woven at source resolution.
- [x] Define semantic texture tokens and tone pigments. Shared CSS layering must not claim global `::before`/`::after` on every element or alter existing decoration.
- [x] Open all three assets against cream and coloured surfaces beside the source preview at the same CSS scale. Accept only a visual match to 01/04/05.

### Task 2: Make shared cards and buttons render the texture correctly

**Files:** Create `src/components/ui/PaperTexture.jsx`. Modify `src/components/ui/PixelFrame.jsx`, `PixelFrame.css`, `Button.css`, `Feedback.jsx` only if metadata is needed, `src/components/sdp/SdpFrame.jsx`, `sdp-components.css`, `src/styles/components.css`, and `src/dev/sdp-workspace/SdpComponentsSpecimen.jsx`.

**Interface:** `PaperTexture({ facePath, role })`, with `role` equal to `panel` or `control`, supplies SVG definitions plus a decorative path. Use `useId()` for collision-free IDs, user-space tiling at 320 CSS pixels, binary-alpha masks and inherited pigment. The renderer adds it immediately after the existing face fill and before folds/keylines that must remain solid. Keep geometry functions unchanged.

- [x] Apply the panel/control masks to current/gateway/SDP SVG face paths and CSS fallback surfaces. Put texture inside the existing moving face group so press movement remains unified.
- [x] For each of the ten PNG-backed SDP card recipes, add a pointer-transparent interior overlay below content. Use explicit per-recipe face insets/clipping that reserve borders, internal keylines, stepped bites and folds; do not texture the full PNG rectangle. Keep the original files and border-image slices unchanged.
- [x] Extend the existing component specimen with all three frame contexts, card tones, small/large/icon buttons, folded and ticket forms, selected/disabled/loading/error states, and long labels. This is development-only coverage.
- [x] Check no ID collisions, texture escape, invisible control texture, state regressions or lost focus/click targets. With mask requests deliberately blocked, solid fills must remain intact.

### Task 3: Roll out to the current workspace and all application sections

**Files:** Modify `src/dev/sdp-workspace/main.jsx`, `src/main.jsx`, `src/styles/app.css`, `src/styles/reports-folders.css`, `src/styles/activities-board.css`, `src/features/dashboard/dashboard.css`, `src/components/navigation/AppHeader.jsx` / `BottomNav.jsx` only where explicit surface metadata is required, `src/components/sdp/SdpBottomNav.jsx`, `src/dev/sdp-workspace/sdp-dashboard.css`, and `src/features/complaints/components/FolderCard.jsx`. Inspect custom report carousel/field SVG faces and use the shared helper where they are paper surfaces. Touch world-control styles only where shared button coverage is insufficient.

- [x] Import the shared texture stylesheet in both application entries after the base surface styles; feature styles must retain the semantic texture contract rather than overwrite it via `background` shorthands.
- [x] Apply fine grain to page/header/footer/navigation backgrounds and laid paper to panels/forms without adding nested duplicate overlays.
- [x] Apply laid paper through the existing report paper path and activity board/note/polaroid surrounds; preserve all photos, poster images, icons and red folds.
- [x] Apply woven paper to bespoke filled controls, filters and selected navigation faces. Keep transparent text links transparent, and preserve smooth validation backings.
- [x] Review `/sdp-workspace.html#home` first, then resident and SDP routes, then the main entry. Confirm storage, route selection and data are unaffected.

### Task 4: Verify, document and hand over the rollout

**Files:** Create `tests/e2e/paper-textures.spec.js` and `docs/verification/PAPER_TEXTURE_ROLLOUT.md`. Modify `docs/product/product.md` and `art/ASSET_LEDGER.csv` to record approved role mapping, provenance and assets only when implemented.

- [x] Add focused browser checks: each semantic role resolves its correct mask; masks load; SVG instances have distinct IDs; coloured controls retain their fills; keyboard/click interaction still works; blocked-mask fallback remains legible. Exercise the existing ten-card specimen, not just ordinary `.card` elements.
- [x] Capture mobile (360/390px) and desktop (1280px) views in one batch covering Home, report folders/form, Activities/gallery, Profile, SDP dashboard/management, world-editor controls and one modal. Check 200% text zoom on the component specimen. Inspect seams, contrast, clipping and page width.
- [x] Run `npm run lint`, `npm test`, `npm run build` and `npx playwright test tests/e2e/paper-textures.spec.js tests/e2e/sdp-components.spec.js tests/e2e/sdp-card-set.spec.js tests/e2e/palette.spec.js tests/e2e/dashboard.spec.js tests/e2e/sdp-dashboard.spec.js` with the repository's configured server. Report actual results and pre-existing failures separately.
- [x] Check caching: only the three shared masks, no per-button texture files, no texture fetch per component, no animation/frame-loop work. Record asset sizes and static fallback behaviour.
- [x] Run `graphify update .`, record implementation evidence and leave unrelated changes intact. Do not deploy or commit unless requested.

## Completion conditions

The three textures have distinct, consistent roles across both app entries; actual cards/buttons visibly render them inside their original silhouettes; cream and coloured surface identities remain intact; text, state, focus, data and navigation are preserved; validation and browser checks have recorded evidence.

**Current status:** Implemented for review. Later user instructions remove texture from buttons/navigation and the entire pixel world; page/panel textures remain elsewhere. No commit or deployment. Actual results: 198 unit tests and build pass; 58 required browser checks pass with one inherited schematic-grid timeout; source lint passes while full lint retains 16 existing generated-bundle errors. See docs/verification/PAPER_TEXTURE_ROLLOUT.md.
