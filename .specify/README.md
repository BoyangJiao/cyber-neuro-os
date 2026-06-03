# `.specify/` — Spec-Driven Development layer

Read-time contracts every AI agent and human contributor honors before writing code.

| File | What it is | When to update |
| :--- | :--- | :--- |
| `constitution.md` | P0/P1 constraints, identity, principles. The law. | Rarely; major edits need an ADR. |
| `session-state.md` | Live cross-session memory: where we are, next steps, gotchas. | Every session end, via `/checkpoint`. |
| `feature-spec.tmpl.md` | Blank template for a per-feature spec. | Copy per non-trivial feature. |
| `../docs/adr/` | Architectural Decision Records. | One per major/irreversible decision. |

**Read order each new session:** `session-state.md` → `../CLAUDE.md` → `constitution.md`.

See `../HARNESS.md` for what's automatically enforced (hooks/CI) and how to bypass when justified.
