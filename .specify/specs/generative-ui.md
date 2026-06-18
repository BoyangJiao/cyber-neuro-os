# Spec — Generative UI for Borvis ("作品实时渲染")

> Status: **Phase 0 (foundation) in progress** on `claude/vercel-json-render-borvis-scrw9q`.
> Owner: Boyang. Routing: high-capability (architecture + agent + design-system).

## Goal

When a visitor asks Borvis about Boyang's work, the agent can **show, not just
tell** — assembling a small UI from our own components/design system and rendering
it live, alongside its spoken reply. Inspired by Vercel's `json-render` mental
model (closed catalog → constrained spec → validate-before-render), but built on
our existing `switch(_type)` dispatch (`ContentSlotRenderer`) with **zero new
dependencies**.

## Non-negotiable design decisions

1. **No hallucinated portfolio data.** For data-bound blocks the model emits only
   *references* (a `projectId`) and *intent* (which fields to emphasize). The
   renderer resolves the real values from `useProjectStore`. The model never
   supplies titles, links, tech stacks, or metrics as free text.
   - The single exception is `prose` — the agent's own framing words — rendered as
     markdown **without raw HTML** (react-markdown default).
2. **Validate before render.** Every spec (untrusted model output) passes through
   `parseUISpec`, which whitelists block types, type-checks fields, caps array
   sizes, and drops anything malformed. Unknown blocks are discarded, not trusted.
3. **Reuse the design system.** Blocks render through our existing tokens and
   components (`CyberButton`, the StatsRenderer card visual language, etc.).
4. **Don't touch the China-access proxy.** No changes to `main.tsx` interceptors,
   `api/sanity.ts`/`api/emulator.ts`, or vite proxy. The render channel rides the
   existing `/api/chat` path only (Phase 1).

## The contract (v1 catalog)

`UISpec = { version: 1, blocks: UIBlock[] }`

| Block | Shape | Renders |
| :-- | :-- | :-- |
| `prose` | `{ type, text }` | Agent framing (markdown, no HTML) |
| `workCard` | `{ type, projectId, emphasis? }` | One real project as a card |
| `workGrid` | `{ type, projectIds[], columns? }` | Several real projects as a grid |

`emphasis ∈ ['techStack','timeline','status','liveUrl']`. `columns ∈ [2,3]`.

Source of truth: `src/agent/generativeUI/spec.ts`. The LLM-facing description lives
in `catalog.ts` (`describeCatalog()`) so prompt and validator can't drift far.

## Phases

- **Phase 0 — foundation (this work).** Spec types, `parseUISpec` validator,
  catalog description + `render_works` tool descriptor, `WorkCard`, the
  `GenerativeUI` dispatch renderer, and a dev-only `/genui-lab` proving ground.
  Adds **no** dependency; touches **no** production path. Gate: `tsc -b` + build green.
- **Phase 1 — agent wiring.** Add the `render_works` function-call tool to
  `/api/chat`, inject `describeCatalog()` + the live project-id list into the
  system prompt, return the spec on a side channel alongside the spoken reply.
- **Phase 2 — Borvis surface.** Render the spec inside `BorvisOverlay` as a
  materializing data panel (two-channel UX: Borvis keeps speaking tersely; the
  card surfaces in/under the transcript). Loading via `ShimmerLoader`.
- **Phase 3 — polish.** Progressive/streamed rendering, i18n, persist rendered
  blocks in the agent store for replay.

## Open questions (defer until Phase 1/2)

- Tool-calling vs. `response_format: json_object` on DashScope (Qwen needs the word
  "json" in messages; thinking-mode can't do structured output). Leaning tool-call.
- Exact placement/animation of the panel in the immersive Borvis layout.
- Whether to later adopt `@json-render/core` if the catalog grows complex enough to
  justify the dependency (currently NOT justified).
