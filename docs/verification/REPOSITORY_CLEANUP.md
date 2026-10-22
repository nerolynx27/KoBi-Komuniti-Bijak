# Repository cleanup — 22 October 2026

Prepared the existing Desktop hackathon repository for a reviewed GitHub commit. No stage, commit, push, reset, deployment or deletion of unique work was performed.

## Organization

| Before | After | Action |
|---|---|---|
| output/report/ | docs/reports/kobi-report/ | Complete copy, every file SHA-256 verified; original is an ignored local backup because Windows refused folder rename |
| app-map-fixed.png | references/maps/app-map-fixed.png | Moved archived map reference; no source/document references found |
| presentation.pdf | docs/presentations/presentation.pdf | Moved presentation export |
| art/exports/kobi-colour-palette.png | references/palette/kobi-colour-palette.png | Moved palette reference |
| debug.log | artifacts/logs/pre-cleanup-debug.log | Moved ignored diagnostic log |

Report authoring scripts use their own directory for inputs, so their original.docx/source PDFs/evidence files remain together and paths remain valid. Original artwork, generation records, licenses, source/runtime font copies, standalone video assets and retained historical verification evidence are preserved. Existing identical assets with separate app/video/provenance roles were deliberately retained. Empty source directories, if any, do not enter Git.

Root Vite HTML entries and configuration files stay in place. README/docs indexes now describe current Home/map/staff functionality and point to docs/REPOSITORY_LAYOUT.md for the complete folder guide and Git policy.

## Git/tool hygiene

- Ignore local output/, video renders/snapshots/tool caches, document render folders, Python bytecode, OS clutter and private-key file types. Existing .env exclusions remain.
- Exclude generated output and video cache folders from ESLint. Source checks remain enabled. This fixes the earlier 16 lint errors caused by linting compiled bundles.
- Keep generated exports out of Graphify indexing; graph updated after organization.
- Candidate scan before cleanup:1486 files /262440786 bytes. After cleanup before this report:1214 files /209231285 bytes — approximately53.2 MB fewer in the candidate snapshot. These totals include already tracked files, not merely the new commit's upload size.
- No candidate file reaches GitHub's100 MiB per-file limit.
- No common credential-pattern matches found in scanned text candidates (private-key headers, GitHub tokens, AWS access-key IDs and sk-style tokens); no sensitive-named files were found in the inventory. This is a heuristic check, not proof that all possible secrets are absent.
- Existing historical trace bundles under docs/verification/ are already tracked. They were retained rather than rewriting history or silently discarding evidence.
- The deleted-looking root map entry in git status is a move to references/maps/; Git can detect the rename when both paths are staged.

## Verification

| Check | Result |
|---|---|
| npm run lint | Passed across repository |
| npm test |24 files;198 passed |
| npm run build | Passed |
| Resident-shell + Home browser suites |17 passed |
| git diff --check | Passed; Windows LF/CRLF conversion warnings are informational |
| Report copy integrity | All copied files matched SHA-256 |
| Ignore checks | Generated output, original local report backup and video render are ignored |
| graphify update . | Completed |

The complete browser suite was not rerun for these non-runtime moves. A previously recorded palette.spec.js:70 assertion still targets .schematic-grid, absent from the approved-map editor; that existing legacy failure remains a full-CI caveat. No cleanup change masks that browser test.

## Next commit review

Review git status and git diff before staging the accumulated feature work plus this cleanup. Source and unique artwork/report files remain versioned candidates. Generated folders stay local. Cleanup config/docs originals and the move inventory are backed up under this Codex chat's work/repo-cleanup-before/ directory; the project report backup remains at output/report/ locally.
