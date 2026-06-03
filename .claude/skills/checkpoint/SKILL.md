---
name: checkpoint
description: Update .specify/session-state.md with current project progress so the next AI session (any tool/model) can resume cold without losing context. Trigger at the end of major work blocks ("commit-equivalent moments"), before the context window fills, or on user request ("checkpoint", "save state", "/checkpoint", "before I close, save").
---

# checkpoint

Snapshot the live project state into `.specify/session-state.md` so any future AI
session can resume from cold with zero context loss.

## When to invoke

- User asks: "checkpoint", "save state", "before I close, save", "/checkpoint"
- Context window approaching capacity (~80%) at a natural pause
- After a milestone step, an ADR, a major feature spec, or 5+ commits
- Before deliberately switching to a new model / new session

## When NOT to invoke

- Mid-implementation of a single function (not a natural pause)
- Trivial commits (typos, single-line changes)
- If `session-state.md` was updated within the last hour and nothing material changed

## Workflow

### Step 1 — Gather current state

```bash
git status --short
git log --oneline -10
git rev-parse --abbrev-ref HEAD
gh run list -L 3 2>/dev/null   # CI status, if gh is configured
```

Also scan the conversation for active TODOs and any background tasks still running.

### Step 2 — Diff against existing session-state.md

Read `.specify/session-state.md` and identify what changed:

- **Always update**: the "Last updated" line, the "You are here" table, the milestone/status.
- **Update if changed**: "Recent decisions", "Active blockers", "Immediate next actions".
- **Append-only (don't rewrite)**: "Critical mental model" — only *add* new gotchas.
- **Refresh if stale**: "Active env / config snapshot" (NO secrets).

### Step 3 — Write the updated file

Use targeted edits (not a full rewrite) so the section structure stays intact.
Then set the "Last updated" line:

```md
> **Last updated**: YYYY-MM-DD by <model/tool> — <one-line summary>
```

### Step 4 — Stage + commit (do not push)

```bash
git add .specify/session-state.md
git commit -m "chore(state): checkpoint — <one-line summary>"
```

**Don't push** — let the next real commit / the user's cadence carry it forward
(avoids noisy deploys, since `main` auto-deploys to production).

### Step 5 — Report to user

```
Checkpoint saved → .specify/session-state.md (commit <sha>)
- Milestone/step: <X → Y>
- Last commits captured: N
- Open blockers: M
- Updated sections: A, B, C
```

## Anti-patterns (do NOT)

- ❌ Push the checkpoint commit (production auto-deploys from `main`).
- ❌ Rewrite `session-state.md` from scratch — edit sections; preserve structure.
- ❌ Add transient state ("currently typing X") — only durable handoff info.
- ❌ Write any secret into the file.
- ❌ Duplicate the constitution / ADRs / specs — link to them.

## Resume protocol (for the NEXT session)

1. Read `.specify/session-state.md` first.
2. Cross-check the last commit hash in `git log -1` to confirm freshness.
3. If the state file is >24h old AND there are new commits since: re-derive state
   from `git log` and flag the stale checkpoint to the user.
4. Begin on the "Immediate next actions" section.
