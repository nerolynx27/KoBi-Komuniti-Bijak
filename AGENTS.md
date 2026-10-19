# Codex Guide for KoBi — Komuniti Bijak

## Read first

1. `docs/product/product.md` — selected Pixel Stickers system, exact tokens, fonts, component/asset recipes, English UI inventory and acceptance rules. This owns design and language decisions.
2. `docs/product/TECHNICAL_DOCUMENTATION.md` — product, stack, scope and data contracts.
3. `docs/product/MVP_UI_ASSETS.md` — UI-01–UI-20, AS-01–AS-19 and world asset specifications.
4. `docs/product/PROJECT_TIMELINE.md` — development order and completion requirements.
5. `docs/competition/SIMEHACK_GUIDELINE.md` when competition context is needed.

## Current decisions

- Mobile web on Android Chrome first; APK later.
- JavaScript/JSX, React, plain CSS, Vite and Phaser **3.90.0**; Supabase JS only for the optional backend phase.
- Angled top-down 2D pixel-art world, not 3D.
- Complete and test the shell first, then the pixel world. Backend is optional after frontend completion.
- Prototype covers reports/actions/evidence, activities/participation, and an SDP world editor limited to a catalog of available components, adding, moving and removing.
- Demo data/accounts are labeled. Records/layout persist in this browser with a confirmed Reset demo. View switching is not authentication.
- **Pixel Stickers (concept 03) is selected.** Build controls from SVG/CSS and live text per `docs/product/product.md`. The generated PNG is reference only; no per-button PNG cropping or additional UI generation.
- **19 October 2026 design decision:** all UI uses only `#6C1A21`, `#B92C2C`, `#CEA257`, `#D1BF9A` and `#E5E0CD` from the user-supplied palette. Future pixel-world artwork is exempt; interface controls/overlays are included. Only Bungee (titles, section headers, wordmark and all buttons) and Yanone Kaffeesatz (body, descriptions, supporting text and form text) are selected across the whole project, including future world text.
- **Implementation status — 19 October 2026:** the user authorized both the font replacement and the saved colour-migration plan. The current UI implements the approved five-colour palette and Bungee/Yanone Kaffeesatz typography. Preserve these shared tokens and font roles. See `docs/verification/UI_COLOUR_MIGRATION.md` for current verification; historical Part 1–3 captures/results describe the earlier build.
- **Conversation, new documentation, and app UI are English.** Malay user input does not request Malay output. Use Malay output only when explicitly requested. Keep KoBi — Komuniti Bijak as the proper name.
- Higgsfield produces artwork; Codex manages code, file preparation and checks. No product AI, coins or shop in MVP.
- `docs/archive/3D_WORLD_REFERENCES.md` is historical research, not an instruction to build a 3D stack.

## Working rules

- The latest user instruction overrides these documents; synchronize affected decisions. For visual/language conflicts, `docs/product/product.md` supersedes historical wording.
- Deliver one verifiable result at a time; read only relevant context/files. Do not assume a planned file, feature or asset already exists.
- Use one labeled local demo source. Do not claim real Auth, protected staff access or real submissions. If backend is selected, Supabase becomes the source of truth and failures cannot turn into successful sample-data UI.
- Real report privacy, staff roles, status transitions, participation and world changes must be enforced by the backend in the real application; they are not prerequisites for the labeled frontend prototype.
- UI copy, validation, accessibility labels and sample content use English. Code/data names remain English. Historical Malay examples are not final UI copy.
- Verify dependency versions before installing; current Phaser/React templates may use another major.
- Verify alpha, dimensions, pivots and frames before integrating generated assets. A reference image is not automatically licensed for redistribution.
- Do not commit secrets or add backend runtimes, large libraries or roadmap features without an actual scope need.
- Documentation does not authorize paid generation, deployment, destructive operations or implementation of the entire app. Follow the user's requested action.
- Report actual results and evidence. Never mark implementation/tests complete without running the relevant checks.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
