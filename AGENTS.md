# AGENTS.md — Multi-tool AI development entry point

> All AI tools (Claude Code, Cursor, others) **share one rule set**. Don't keep
> parallel copies — point every tool at the canonical docs below.
>
> harness-kit: v0.1.0

## Read first, in this order (every new session)

1. `.specify/session-state.md` — current progress + next step
2. `CLAUDE.md` — project orientation + structure + **model-routing table + rules**
3. `.specify/constitution.md` — P0 constraints (release safety, secrets, China proxy, gates)
4. `.agent/instructions.md` — response language (简体中文) + design baseline + collaboration modes

## Model self-routing (run once per session, after grasping intent)

Evaluate "is the current model a fit?" against the routing table in `CLAUDE.md`:

- **Match** (preferred/backup slot) → continue silently.
- **Clear mismatch** → pause; offer (a) switch / (b) continue; **never switch
  unilaterally.** Full rules + task boundaries: routing section of `CLAUDE.md`.

## Ending a session

Update `.specify/session-state.md` before switching tools or closing:

- **Claude Code:** `/checkpoint` skill (`.claude/skills/checkpoint/`)
- **Cursor:** run the same checkpoint steps (mirror in `.cursor/rules/`)

## Tool config map (paths only — rule *text* lives in the canonical docs)

| Capability | Claude Code | Cursor |
| :--- | :--- | :--- |
| Project rules | `CLAUDE.md` (**canonical**) | `.cursor/rules/*.mdc` → points here |
| Session memory | `.specify/session-state.md` | (same) |
| Constraints | `.specify/constitution.md` | (same) |
| Skills | `.claude/skills/` (**canonical**) | mirror manually if needed |

Skill/rule sync is **manual** (small repo, solo dev) — when `CLAUDE.md` changes,
the `.cursor/rules/` pointer rarely needs updating since it just redirects here.

Full harness description (what's enforced + how to bypass): `HARNESS.md`.
