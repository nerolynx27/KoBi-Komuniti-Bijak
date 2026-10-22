# SDP dashboard — Phase 1 component verification

22 October 2026. Scope: reusable SDP cards/buttons and a separate development specimen. Dashboard assembly and the revised bottom navigation remain Phase 2.

## Review URLs and implementation

- [SDP cards & buttons](http://127.0.0.1:5177/sdp-workspace.html?specimen=cards-buttons), started with `npm run dev:sdp`.
- Linked from the existing Development specimen, below its established examples so their positions remain unchanged.
- Production query requests open the regular SDP workspace; the development gallery is excluded.
- Source: `src/components/sdp/` and `src/dev/sdp-workspace/SdpComponentsSpecimen.jsx`.

The six reusable card kinds are welcome, metric, panel, report, event and shortcut. The wrappers reuse shared Card/Button/ActionLink semantics and opt into the `sdp` frame context. Existing `current`/`gateway` branches are preserved. The page demonstrates three metric tones, priority/quiet reports, an integrated report action, decorative motifs, long content, zero/empty states and missing illustrations. Buttons include native links, sizes, full width, icon labels, hover/focus/pressed simulations, disabled/loading and a guarded simulated action.

The specimen mounts without calling the demo-store bootstrap. Browser instrumentation confirms no `kobi.*` storage reads or writes. Links intentionally open the existing sandbox management screens; no records are submitted from the specimen.

## Reference and measurements

Visual source: [selected revision](https://d8j0ntlcm91z4.cloudfront.net/user_3EbIKJiq93OP4D7Jnqcrk4yIGeR/hf_20261022_025238_cf2f2407-8d7f-41b3-9622-052b49ec2ba0.png). Its generation record reports 1536×2752. Pro was requested but the returned model is Nano Banana 2; original provenance is retained.

Visual inspection of the approximately 400px-wide displayed reference located its card content between roughly x=23 and x=379: welcome y=59–151; metrics y=167–229; attention y=244–472; event y=480–551; shortcuts y=557–650. These are visual bounds, not an automated pixel segmentation of the source. The source's navigation/header are not built in this phase.

Implemented geometry: detailed frames use a 1px wine outer band, 2px rim, 1px wine inner keyline and semantic fill; restrained welcome/panel frames use a 2px combined outline/rim. Corner steps remain fixed pixels as content resizes, folds reserve 14px, event/button ticket bites reach 7px, and hard shadows extend 2px for simple panels or 3px for detailed tickets. Card text is real Bungee/Yanone Kaffeesatz; colors resolve to the existing five tokens. Pixel motifs are code-authored SVG interpretations, not cropped generated controls.

At a 390px viewport the specimen's board has 357px-wide full cards, 112.33px metrics and a 207px/138px shortcut split. Welcome is about 97px high, metrics 71px, attention group 276px, priority report 126px, quiet report 74px, event 93px and shortcuts 116px. Exact measurements: `artifacts/sdp-dashboard/phase-1/measurements.json`.

The specimen preserves the reference's composition and details, but is not a literal screenshot clone: real fonts, a 44px minimum action target and reflow make some cards taller. At 200% text a container query moves a shortcut motif below the text when its column cannot fit a single large glyph. The dashboard's final page spacing is reviewed in Phase 2.

## Commands and results

- Initial red check: the dedicated specimen heading was absent before implementation; the pre-change current/gateway baseline capture passed.
- `npx playwright test tests/e2e/sdp-components.spec.js tests/e2e/gateway-specimen.spec.js`: **17 passed** on the final run. Eight SDP checks and nine existing specimen checks. Four viewports (360×800, 390×844, 768×1024, 1280×800), each at 100%/200% text; reduced motion, decorative SVGs, resize, CSS fallback, focus/activation and duplicate-action blocking covered.
- Committed test fixture `tests/fixtures/sdp-shared-components.json` preserves pre-change representative current/gateway widths, heights, copy, fonts and paints. The regression test uses that file rather than depending on ignored capture artifacts.
- Targeted ESLint on all changed/new JavaScript/JSX: **passed**.
- `npm run lint`: **12 existing errors**: 11 in the earlier generated `output/sdp-workspace-build/assets/sdp-workspace-DE3aIQ3d.js`, plus a duplicate import in `tests/unit/approvedMapIntegration.test.js`. The Phase 1 files pass targeted lint. These unrelated paths were not edited to make the full command green. Full output: `artifacts/sdp-dashboard/phase-1/lint.log`.
- `npm run build`: **passed**. Standard build inputs remain unchanged.
- Targeted Vite build with input `sdp-workspace.html`, output `tmp/sdp-phase1-build`: **passed**. A production-browser check confirmed the query cannot mount `.sdp-specimen`, the gallery copy is absent from built JS, and no page errors occurred.
- `graphify update .`: completed after code changes; graph outputs are refreshed without LLM generation.

Browser runtime used the installed Chromium build via `PLAYWRIGHT_BROWSERS_PATH=C:\Users\user\AppData\Local\ms-playwright`. No browser installation or new package was required.

## Captures

![Reviewed card composition](../../artifacts/sdp-dashboard/phase-1/cards-390.png)

Full page captures: `artifacts/sdp-dashboard/phase-1/{width}x{height}-{100%,200%}.png`. Desktop composition: `specimen-desktop.png`. Focus/hover examples: `keyboard-focus.png`, `button-focus.png`, `button-hover.png`. Browser log: `browser-checks.log` in the same directory.

## Review decisions and limits

- The separate specimen contains only SDP cards/buttons and their fixtures; no forms, modal gallery or bottom-navigation implementation was added.
- Existing shared-example placement was preserved by putting the cross-link after the examples. Current/gateway geometry and existing behavior pass regression checks.
- Scope follows the approved plan: use this checkout and author review; no extra worktree, commit or subagent was created. Review is by the implementer, not an independent reviewer.
- Physical Android, TalkBack and device-level font scaling remain unobserved. Automated 200% root text checks do not claim those results.
- Phase 1 implementation is ready for visual review. This does not accept a pixel-perfect match or authorize Phase 2 automatically.
