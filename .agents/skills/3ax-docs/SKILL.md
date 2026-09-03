---
name: 3ax-docs
description: Guides systematic, in-depth technical documentation of the 3AX-UI repository top-down across all dependency layers (Level 0 to Level 4) ensuring 100% code coverage.
---

# 3AX-UI Documentation Architect Skill

Use this skill whenever working on documenting the 3AX-UI codebase, updating existing architecture docs, or checking off components in the coverage checklist.

## Workflow

1. **Check Coverage Status:**
   Read [`.agents/CODE_COVERAGE_CHECKLIST.md`](../../CODE_COVERAGE_CHECKLIST.md) to identify the next component requiring documentation.

2. **Source Code & Test Inspection:**
   - Read the target `.go` file and corresponding `*_test.go` files using `view_file`.
   - Identify dependencies, callers, structs, functions, error paths, and edge cases.
   - Reference functions and structs by their exact symbol names (e.g. `package.TypeName.MethodName`) rather than line numbers.

3. **Follow Architectural Layering:**
   - **Level 0 (Bootstrap & Runtime):** `main.go`, `config/`, `logger/`, `util/`, install scripts.
   - **Level 1 (Storage & Primitives):** `database/`, `database/model/`, `shared/` (ipam, portfwd, ndppd, keygen).
   - **Level 2 (Protocol Engines):** `tunnel/` (AmneziaWG/WG), `xray/`, `mtproto/`, `sub/`.
   - **Level 3 (Business Services & Jobs):** `web/service/`, `web/job/`.
   - **Level 4 (Presentation & Consumers):** `web/controller/`, `web/service/tgbot.go`, `web/html/`.

4. **Document Creation / Update in `docs/`:**
   - Write structured, deep technical documentation using GitHub/VitePress-compatible Markdown.
   - Use strictly relative paths (`[file.go](path/to/file.go)`) and Unix forward slashes (`/`).
   - Embed Mermaid diagrams for processes, state transitions, and call chains.

5. **Update Checklist:**
   - Mark the item as `[x]` in [`.agents/CODE_COVERAGE_CHECKLIST.md`](../../CODE_COVERAGE_CHECKLIST.md) with a relative link to the doc.
   - Update the total percentage metric in the summary table.
