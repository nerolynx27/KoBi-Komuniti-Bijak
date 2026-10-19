# Part 1 verification — 16 October 2026

Scope: project setup and the shared UI foundation only. The full UI shell, account/report/participation/editor workflows, Phaser world, backend, APK and deployment are not implemented.

## Environment and dependency verification

- Windows; Node 24.15.0, npm 11.12.1. Minimum supported project engine: Node 22.13 in the 22.x line, or 24+. ESLint's requirement raises the original planned 22.12 minimum to 22.13.
- Registry engines and peer dependencies checked before install. Exact pins: React/React DOM 19.3.1; Vite 8.3.4; React plugin 6.1.2; ESLint 10.12.0; React hooks plugin 7.1.1; Vitest 5.0.5; Playwright 1.64.1. The initially selected ESLint 9 was flagged unsupported and replaced before completion.
- Installation audited 157 packages with zero reported vulnerabilities. `package-lock.json` is present. This is the package manager's result at setup, not a permanent security guarantee.
- Vite's [official compatibility guidance](https://vite.dev/guide/) and actual registry package metadata support the installed Node version. Optional compiler peers were not enabled. Runtime dependencies are React and React DOM only.
- Browser: Playwright Chromium 156.0.8078.4, desktop headless browser emulation. No physical Android device, Android keyboard, screen-reader session or nonzero device safe-area inset was tested.

## Executed checks

| Command | Result |
|---|---|
| `npm install` / supported ESLint update | Successful; pinned dependencies and lockfile; zero reported vulnerabilities |
| `npm install --package-lock-only --ignore-scripts --offline` | Successful; lock metadata synchronized |
| `npm run lint` | Passed, zero lint errors/warnings |
| `npm test` | 8 tests passed |
| `npm run test:e2e -- --timeout 20000` | 17 tests passed |
| `npm run build` | Passed; 32 modules transformed |
| `npm run test:production` | 1 test passed against Vite production preview |
| `node scripts/asset-manifest.mjs` | 6 shipped font/license/sprite files verified, 30 unique 20×20 symbols |
| `npm run test:e2e -- --grep 'rendered shell and specimen' --timeout 20000` | 4 viewport checks passed again after capture isolation adjustment |

Production output at verification: JS 246.86 kB (76.77 kB gzip), CSS 17.90 kB (4.24 kB gzip), plus local fonts/licenses/icon sprite/manifest. The preview test confirms no specimen entry, no specimen action code, no concept PNGs and no external runtime requests. No Phaser or Supabase is installed.

The initial sandbox blocked network/socket access; authorized setup and local browser checks were run with the required process permissions. Initial browser/lint failures were investigated and corrected; the final reported suites are green. Playwright emits a harmless host `NO_COLOR` / `FORCE_COLOR` environment warning, unrelated to app console output.

## Behavioral evidence

Tests exercise actual app components and the real store, with browser storage failures injected at the browser API boundary. Unit tests use a minimal storage adapter to verify committed data and persisted bytes.

- All four resident destinations, headings and active navigation; SDP entry/exit and reload; explicit Map URLs take precedence over remembered workspace.
- Deterministic, independent sample factories; saved preferences and changed valid sample records survive reload.
- Invalid data, malformed JSON, unsupported versions and unavailable reads show recovery. Original unreadable bytes remain unchanged before explicit reset.
- Failed preference writes preserve the committed checkbox value. Retry saves the pending value. Failed reset retains committed records, shows the error inside the open dialog, and emits no success.
- Cancel and Escape preserve stored data. Confirmed reset restores sample records and preferences. Focus returns to the opener.
- Repeated click/Enter during simulated loading produces one save, retains focus and preserves control width.
- One open native dialog; initial Cancel focus; Tab wrapping, Escape and return focus; a sheet note remains intact after cancelling its confirmation.
- Sheet heading and Close remain visible while its body scrolls in short landscape. Actions remain within the sheet's scroll region.
- Rendered frame dimensions replace fallback borders, preserve fixed CSS-pixel geometry and grow with a wrapping label.
- Browser-computed text/background colors meet 4.5:1 for enabled action variants. The source palette contrast table is implemented without rose text surfaces.
- Local fonts load with the correct families/weights. Forced font failure still gives usable fallback text. Local SVG icon requests are exercised in production.

## Visual inspection

Actual browser renders were captured and inspected at **360×800, 390×844, 768×1024 and 1280×800**. Each viewport test visits Map, Reports, Activities, Profile, SDP workspace and the development specimen, checking page overflow, 44 px targets, local font loading and runtime exceptions. No horizontal page overflow, undersized visible targets or page errors were found.

Captures under `docs/verification/2026-10-16/` include Map, SDP, button specimens, fields and a sheet at all four sizes. Full-page captures retain the fixed bottom navigation at its viewport position. Isolated button/field crops temporarily hide only sticky page chrome so it cannot obscure long element captures; the actual component styles are unchanged. The complete shell captures retain normal chrome.

| Evidence | Phone | Tablet | Desktop |
|---|---|---|---|
| Shell | [360×800](2026-10-16/map-360x800.png), [390×844](2026-10-16/map-390x844.png) | [768×1024](2026-10-16/map-768x1024.png) | [1280×800](2026-10-16/map-1280x800.png) |
| SVG controls | [360×800](2026-10-16/buttons-360x800.png), [390×844](2026-10-16/buttons-390x844.png) | [768×1024](2026-10-16/buttons-768x1024.png) | [1280×800](2026-10-16/buttons-1280x800.png) |
| Fields | [360×800](2026-10-16/fields-360x800.png), [390×844](2026-10-16/fields-390x844.png) | [768×1024](2026-10-16/fields-768x1024.png) | [1280×800](2026-10-16/fields-1280x800.png) |
| Sheet | [360×800](2026-10-16/sheet-360x800.png), [390×844](2026-10-16/sheet-390x844.png) | [768×1024](2026-10-16/sheet-768x1024.png) | [1280×800](2026-10-16/sheet-1280x800.png) |

Additional captures: [200% text at 360×800](2026-10-16/text-200-360x800.png), [200% text in 800×360 landscape](2026-10-16/text-200-800x360.png), [font fallback and reduced motion](2026-10-16/fallback-reduced-motion.png).

The enlarged-text test checks wrapped navigation labels, measured nav clearance and enough unobscured vertical space for a complete heading line. The header scrolls normally below 500 px viewport height to preserve reading space. CSS safe-area handling is present; physical notch/keyboard behavior remains for the Android phase.

## Defects caught and resolved

- Child layout effects ran before parent control refs attached, leaving fallback borders visible. Moved frame measurement to a passive effect and added a rendered SVG regression check.
- Native dialog tabbing did not immediately wrap as required. Added explicit keyboard wrapping on top of native modal/inert behavior.
- Switching a sheet to confirmation remounted its note. Keep sheet content mounted and hidden while confirmation occupies the same host.
- A fixed negative skip-link offset exposed part of the link at 200% text. Use a size-relative offscreen transform.
- Enlarged navigation crowded labels and under-reserved its height. Wrap labels and observe the actual nav height.
- The independent read-only review found explicit `#map` startup could strand the SDP view, sticky chrome could obscure enlarged landscape content, and the sheet heading/Close scrolled out of view. Each was reproduced with a failing regression test, fixed, then passed in the complete suite.

## Rulings and boundaries

- Implement inline in the explicitly requested folder: it had no Git repository, so no worktree, branch, commit or PR was invented. No unrelated artwork/documents were removed.
- The existing specification and detailed request authorize design and implementation; no new design approval round was introduced.
- No Phaser dependency is needed until the world phase; its locked design decision remains **3.90.0**.
- Sample data is read-only outside the real foundation preference/reset controls. Full record writes, photo handling, account forms and world placement validation belong to Part 2 or later, with tests then.
- No unresolved implementation blocker remains for this Part 1 scope. Physical Android, device keyboard and assistive-technology validation remain unverified. Part 2 and the complete shell gate remain unchecked.
