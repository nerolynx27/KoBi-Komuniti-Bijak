# UI colour migration — 19 October 2026

The user approved execution of the [colour migration plan](../superpowers/plans/2026-10-19-ui-colour-migration.md). The resident and SDP interfaces now use the five approved authored UI colours: wine `#6C1A21`, cherry `#B92C2C`, gold `#CEA257`, sand `#D1BF9A` and vanilla `#E5E0CD`.

The change covers shared tokens, browser theme colour, SVG frame paints, forms, feedback/status/error surfaces, navigation, dialogs, notifications, temporary schematic and editor previews. The modal backdrop is solid wine; its entrance retains translation without opacity blending. Error text has a vanilla background. The grid and placement previews use solid palette colours, with invalid placements retaining an explicit warning and disabled commit action.

A state check exposed an existing specificity issue: measured-frame fallback styling suppressed the light focus separation ring. A selector scoped to focused measured frames now restores the specified vanilla ring without changing frame geometry.

Bungee/Yanone Kaffeesatz files and roles, icon assets, domain/data logic, dependencies and other baseline files remain unchanged. A hash audit found only the seven intended existing source/test/entry files changed; 114 other baseline files were unchanged. The palette test file is new. Existing font/license and icon manifest hashes still verify.

## Verification

| Check | Result |
|---|---|
| `npm run lint` | Passed |
| `npm test` | 137 tests passed across 12 files |
| `node scripts/asset-manifest.mjs` | Five asset/license files and 30 icon symbols verified |
| `npm run build` | Passed after the focus-ring correction |
| Palette, fonts, layout and shell-journey browser checks | 20 passed |
| Production checks against the fresh build | Three passed; no failed/external resources |
| Additional modal/editor capture checks | Two passed; one additional refreshed editor overlap/bounds preview check passed |
| Source and built-style colour audit | Only approved authored hex colours; no obsolete primitives or old backdrop RGB |
| Independent read-only source review | No actionable findings |
| `graphify update .` | Passed; graph, report and interactive map refreshed |

The browser command selected `tests/e2e/palette.spec.js`, `fonts.spec.js`, `layout.spec.js` and `shell-journeys.spec.js`. Layout checks used `KOBI_EVIDENCE_DIR=artifacts/colour-migration/captures` to preserve historical evidence. Production used `playwright.production.config.js` and a separate result directory.

The initial rendered checks failed on the earlier palette as expected. The first editor fixture used “Bench” rather than the actual catalog name “Garden bench”; that selector was corrected. The focus-ring failure was an actual shared-style defect and was repaired before the final passing run. These initial failures are not represented as product regressions remaining open.

## Visual review and scope

Reviewed the 17 main resident/SDP route captures, the route contact sheet, action variants, field/error/read-only/disabled states, modal backdrop, map and editor previews. Existing layout captures cover 360×800, 390×844, 768×1024 and 1280×800, plus 200% text, 800×360, fallback fonts and reduced motion. Shell journeys exercise report/activity/editor relationships and reset in desktop and touch modes.

- [Route contact sheet](../../artifacts/colour-migration/route-contact-sheet.png)
- [Route captures](../../artifacts/colour-migration/routes/)
- [Component/state captures](../../artifacts/colour-migration/captures/)
- [Baseline and execution ledger](../../artifacts/colour-migration/)

Captures and detailed browser artifacts are local, generated files under the ignored `artifacts/` directory. Earlier Part 1–3 reports and captures remain historical evidence. Browser antialiasing, native browser/OS picker internals and user photo content are not additional authored UI palette colours. No custom replacement date/file picker was introduced.

The full browser suite was not rerun; the selected suites target the changed styling and important cross-domain workflows. Physical Android behavior remains unobserved, as in the previous scope. Future pixel-world artwork remains exempt from the UI palette restriction and was not implemented by this task. No deployment, backend, package or account changes were made.
