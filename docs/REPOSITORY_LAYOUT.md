# Repository layout and Git policy

Run commands from the project root. Keep Vite HTML entry points, package/lock files and tool configurations there; their paths are intentional.

| Folder | Contents | Git policy |
|---|---|---|
| src/ | App, shared controls, resident/staff features, dev specimens and slides | Versioned |
| public/ | Runtime artwork, fonts, icons and static review pages | Versioned |
| art/ | Original artwork, generation records, asset ledger and processing sources | Versioned; preserve provenance |
| references/ | Design references, palette and archived map snapshot | Versioned |
| docs/product/ | Authoritative product/technical specifications | Versioned |
| docs/reports/kobi-report/ | Report DOCX/PDF sources, final reports, evidence and authoring scripts | Versioned; generated render folders ignored |
| docs/presentations/ | Shareable presentation PDF | Versioned |
| docs/verification/ | Written verification records and retained historical evidence | Versioned; existing historical traces left intact |
| scripts/ | Asset preparation, exports and verification utilities | Versioned |
| tests/ | Unit/browser tests and fixtures | Versioned |
| videos/ | Video project source, assets, briefs and composition files | Versioned; renders, snapshots and caches ignored |
| output/ | Reproducible export builds and review captures | Local only, ignored |
| artifacts/, test-results/, dist/, node_modules/, tmp/ | Test/build/dependency/scratch output | Local only, ignored |
| graphify-out/, .superpowers/ | Local generated graph and execution scratch | Ignored |

## Cleanup on 22 October 2026

- Copied output/report/ intact to docs/reports/kobi-report/ and verified every file hash. Windows refused renaming the original folder, so it remains as an ignored local backup. The two Python authoring scripts resolve paths from their own folder, preserving internal relative inputs.
- Moved app-map-fixed.png to references/maps/, the palette export to references/palette/, and presentation.pdf to docs/presentations/.
- Moved the loose debug log to artifacts/logs/pre-cleanup-debug.log.
- Excluded generated output and video caches/renders from Git and lint. This resolves linting compiled output bundles rather than suppressing source errors.
- Kept original generation outputs, source/runtime font copies, standalone video assets, slide aliases and historical verification captures. Hash-identical files can serve distinct provenance/portable-project roles; they were not blindly deleted.
- No file contents or unique report/artwork work were deleted. No staging, commit, push or deployment was performed.

## Before a commit

Run npm run lint, npm test, npm run build and relevant Playwright tests. Review git diff and git status before staging; keep package-lock.json and original asset provenance. Never add .env files, credentials, private keys, installed dependencies or generated output. Common credential-pattern scans are useful but do not prove the absence of every possible secret.

The full browser suite still contains a known legacy palette assertion waiting for .schematic-grid, which the current approved-map editor no longer renders. Do not interpret historical verification claims as a fresh full-suite pass. Current cleanup evidence is recorded in verification/REPOSITORY_CLEANUP.md.
