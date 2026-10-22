# Paper texture rollout — 22 October 2026

Implemented for review in the existing Desktop hackathon checkout. No commit, push or deployment. Unrelated user work was preserved.

## Final scope

The user's later instructions supersede the original woven-control rollout:

- Fine grain on ordinary page/shell fields outside world views.
- Laid paper on cards, panels, forms, report sheets and activity paper surrounds.
- **No applied texture on buttons, headers/navigation, resident map or world editor.** Native/custom control faces and selected navigation are smooth. Entire map/editor routes suppress paper layers, including their page, panels and modal surfaces. Pixel-world artwork remains intact.
- The selected woven recipe remains as a frozen reference asset; it is not requested by application pages.

Both application entries use the same rules. Original silhouette geometry, PNG backings/slices, folds, spacing, fonts, text, demo data, storage and routes remain. Native field wrappers use grid layout to preserve control height without a baseline gap.

## Assets and provenance

The no-argument script scripts/export-paper-textures.mjs executes the unchanged six-option stronger preview in public/paper-textures.html, retaining original recipe indexes/seeds, and removes only cream pixels. It adds no dependency or runtime generation.

| Asset | Seed | Coverage | Bytes | Runtime use |
|---|---|---|---|---|
| fine-grain | 20261022 | 16.94% | 116900 | Pages |
| laid-paper | 20261025 | 17.22% | 86307 | Panels |
| woven-paper | 20261026 | 20.95% | 99374 | Reference only |

All are 640×640 with binary alpha and transparent zero-RGBA areas. Marks repeat at 320 CSS pixels. Exact pixel comparison against preview 01/04/05 passed, and repeated export produced identical SHA-256 hashes:

- fine-grain: 8a336e5904a6c5bfbbafbe7a17aab48ca0247fbed7f90cdecd2cd2cdccc6f9f1
- laid-paper: 19b12c89d6088fcf8f73ee8e02e5a4b38d7a8e51a0ed173c0a4a94af229708f5
- woven-paper: 31e5f0b2ef855a93083a31c1bce9c44af9e0a5bdb00944edcbdac3901701cb93

Only two masks are requested by an application specimen after the scope revision: fine grain and laid paper, 203207 bytes combined. The cache test observes exactly two requests despite many instances. SVG images and CSS masks share anonymous fetch mode. No per-component images, runtime canvas, animation loop or new preference was added.

## Rendering and contrast

The shared SVG helper uses collision-free React IDs and user-space alpha masks, after face fills and before folds/keylines. Control role returns no texture. Rendering is enabled only by the application stylesheet, leaving standalone experiments visually unchanged.

Named CSS texture layers sit beneath live content, have empty decorative content and ignore pointers. Low-specificity defaults preserve tone overrides. Page/panel mark pigments are Sand on Vanilla/Gold, Gold on Sand, Cherry on Wine and Wine on Cherry. Wine text on light base/mark colours is at least 4.94:1; Vanilla on Wine/Cherry is at least 4.59:1. Cherry validation labels and tiny critical indicators remain smooth. Buttons/navigation now use their original solid paints.

The ten SDP PNG-backed recipes retain their backing files and nine-slice recipes. Most textures occupy clipped centres. Priority-report bounds stop above the original divider within its stretched centre and exclude the bookmark. The short secondary report reaches into safe cream bands while clearing its x=60 divider, bookmark and bottom keyline. Its texture no longer collapses to zero height. The gold report action strip is smooth under the latest instruction.

Blocking all mask requests leaves original readable solid surfaces, live text, focus/click behavior and disabled states intact. Textures do not cover photos, logos, motifs, gallery imagery or world artwork.

## Final verification

| Command/check | Actual result |
|---|---|
| npm test | 24 files; 198 passed |
| npm run build | Passed |
| Source lint: npx eslint src scripts/export-paper-textures.mjs tests/e2e/paper-textures.spec.js tests/e2e/palette.spec.js | Passed |
| Required six-file Playwright batch | **58 passed; 1 inherited failure** |
| Paper-texture browser checks | **11 passed** within that batch |
| npm run lint | 16 inherited errors in existing generated output bundles |
| graphify update . | Completed after final code changes |
| Repeat export | Identical hashes for all three masks |
| Responsive capture audit | 42 entries; no page-width overflow |

Required browser command:

    npx playwright test tests/e2e/paper-textures.spec.js tests/e2e/sdp-components.spec.js tests/e2e/sdp-card-set.spec.js tests/e2e/palette.spec.js tests/e2e/dashboard.spec.js tests/e2e/sdp-dashboard.spec.js

The final run additionally used --output artifacts/paper-textures/revised-final-tests --reporter=line to isolate artifacts. Its one failing test is palette.spec.js:70, "placement previews distinguish valid and invalid positions without blended colours": it times out waiting for .schematic-grid, which the existing approved-map editor no longer renders. The editor source/artwork migration predates this rollout. That legacy test remains unchanged.

Full lint errors are in output/sdp-workspace-build/assets/sdp-workspace-DE3aIQ3d.js (11) and output/storyboard-build/assets/components-0XmDQHFt.js (5). These existing generated bundles were not modified. Source lint passed separately.

Earlier overlapping Playwright invocations shared an output directory and caused trace-file ENOENT errors. Those runs were superseded by the final serial browser batch in its dedicated directory. Earlier intermediate texture failures were fixed, then rerun; they are not hidden as inherited failures.

## Visual evidence and review

artifacts/paper-textures/ contains final captures at 360, 390 and 1280px: Home, resident map, report folders/form, Activities/gallery, Profile/menu, SDP dashboard/reports/activities/form, entered world-editor controls, main-entry Home and component specimen. Doubled-text specimens are included at every width. capture-audit.json records width checks, face counts, mask names and backing interior sizes. Existing component/dashboard tests additionally cover 768px, 402px, short viewports and 200% text.

Reviewed final Home, map, report, activity/gallery, ten-card and editor captures. Buttons/navigation/world views are smooth; paper scale is consistent elsewhere. Original stronger recipes were kept, with no per-screen intensity adjustment. Physical Android hardware remains untested.

One independent review found two Important issues: menu texture escaped its button, and report-card masks crossed a divider/missed a short face. Both were fixed with observed RED→GREEN regressions. A separately found native textarea baseline gap was also fixed RED→GREEN. The subsequent user exclusions remove the menu texture entirely and are covered by new regression checks. No Critical or deferred Minor findings remain. No second review was needed; final tests cover fixes and scope revision.

## Rulings made, in order

- Ruling: Apply in the named checkout and leave all changes uncommitted, following the plan's explicit no-commit instruction and preserving required uncommitted SDP work. Cost if wrong: user must move the small rollout diff to another checkout. Baseline copies of touched files retained here.
- Ruling: Native input texture uses a wrapper behind its transparent native control, to recolour marks without painting over glyphs. Palette test now measures that actual opaque backing; visible vanilla and focus remain intact. Cost if wrong: wrappers may affect an untested custom layout.
- Ruling: Preserve smooth wine directly behind existing gold masthead lettering, with cherry grain elsewhere in its wine field; avoids gold-on-cherry contrast loss. Cost if wrong: the small brand face has less visible grain.
- Ruling: Texture rendering is enabled by the two application stylesheets; shared SVG helper paths default hidden in standalone experiment entries. Cost if wrong: a future app entry must import paper-textures.css.
- Ruling: The selected Bulletin navigation face owns the same visible vanilla base before woven marks, preventing page grain beneath it from doubling. Cost if wrong: transparent compositing on that selected item changes, although its base colour is preserved.
- Ruling: Inherited generated-output lint failures and the removed schematic-grid palette-test target remain outside this texture change — existing unrelated source/artifacts are preserved — cost if wrong: project-wide checks remain red until their owners update them.
- Ruling: Existing PNG artwork fidelity/proportions are preserved — this rollout owns surface finish, not the prior asset pilot — cost if wrong: existing visual discrepancies remain.
- Ruling: Retain user-selected stronger intensity — original recipes are the approved reference and matched exactly — cost if wrong: assembled pages may feel busy to the user.
- Ruling: Physical Android rendering remains unverified — desktop Chromium captures are the available evidence — cost if wrong: device-specific rendering issues may remain.
- Ruling: Reviewer did not independently verify wrapper gap or final suite — executor regression and final serial verification own those checks — cost if wrong: weaker independent coverage of those two items.
- Ruling: Selected Recycling filter receives explicit Sand matching its previously visible inherited board base, so the formerly unresolved legacy token cannot expose panel grain through a supposedly smooth control. Cost if wrong: selected control compositing is opaque rather than transparent.

The latest user instructions explicitly replace the original control/nav/world texture scope; no further approval was needed.
