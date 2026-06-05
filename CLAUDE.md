# CLAUDE.md — Cyber Neuro OS

> Canonical project orientation + dev practices + model-routing for all AI tools.
> This is the single rule source; Cursor and others point here (`.cursor/rules/`).
>
> harness-kit: v0.1.0

## Read first, every new session

1. `.specify/session-state.md` — where we are + next step
2. **this file** — orientation, structure, routing
3. `.specify/constitution.md` — P0 constraints (release safety, secrets, China proxy, gates)
4. `.agent/instructions.md` — response language (简体中文), 1440px design baseline,
   collaboration modes (precision vs. creative), component priorities

---

## What this is

An immersive cyberpunk "Neural OS" portfolio: a React 19 SPA with a shared
Three.js canvas, an AI chat agent ("Neural Uplink"), a retro game emulator, audio
synthesis, and a Sanity-CMS-backed project showcase. **Live in production** on
Vercel. Solo, part-time.

## Stack & layout

- **App**: React 19 + TypeScript + Vite 6 + Tailwind v4. State: Zustand
  (`src/store/`). Animation: framer-motion + gsap. 3D: `@react-three/fiber` +
  three. Audio: Tone.js. i18n: custom (`src/i18n/`, EN/ZH).
- **Content**: Sanity CMS. Client in `src/sanity/`; Studio is a **separate
  package** in `studio/`.
- **Serverless** (`api/`, Vercel Edge): `chat.ts` (DashScope/Qwen LLM proxy),
  `sanity.ts` (read relay), `emulator.ts` (EmulatorJS CDN relay).
- **China no-VPN access** is achieved by a global `fetch`/`XHR` interceptor in
  `src/main.tsx` that rewrites Sanity/emulator calls to the `api/*` proxies.
  ⚠️ Load-bearing — see constitution "China-access proxy integrity".

## Dev commands

```bash
npm run dev        # vite dev server (:5173) — also runs the local api proxy plugin
npm run build      # tsc -b && vite build  (the production gate)
npm run lint       # eslint .   (NOTE: ~102 pre-existing baseline errors; see HARNESS.md)
npm run typecheck  # tsc -b --noEmit-equivalent (alias added by harness)
npm run preview    # preview the production build locally
```

Local LLM/Sanity proxying needs `.env.local` (see `.env.example`); without
`DASHSCOPE_API_KEY` the chat agent falls back to a local mock.

## Release flow (non-negotiable)

**local verify (build+typecheck) → Vercel preview / 预发 → merge to `main` → prod.**
`main` auto-deploys to production. Never push experimental work straight to `main`.

---

## Model self-routing (run once per session, after grasping intent)

Match the task to the cheapest model that does it well. **Match → stay silent.
Mismatch → suggest a switch with evidence; never switch unilaterally.** Tiers are
generic (high-capability / mid / fast) so they survive model renames.

| Task type (this project) | Preferred | Backup |
| :--- | :---: | :---: |
| Architecture / data-flow / state / serverless proxy design | high-capability | mid |
| Security / secrets / proxy review (China-access integrity) | high-capability | mid |
| 3D / WebGL / GLSL shader / react-three-fiber work | high-capability | mid |
| Hard bug diagnosis (race, render-loop, audio/3D lifecycle) | high-capability | mid |
| UI component / layout / Tailwind / framer-motion animation | mid | fast |
| Sanity schema / GROQ query / CMS content rendering | mid | fast |
| Routine feature glue / store action / wiring | mid | fast |
| i18n strings / copy / a11y label | fast | mid |
| Dependency bump / lint fix / config / mechanical refactor | fast | mid |

**The two governing rules (verbatim):**

1. **Match → stay silent.** If the current model is in the preferred or backup
   slot, just do the work.
2. **Mismatch → suggest, don't switch.** Name the task type + evidence, cite the
   recommended tier, offer (a) switch / (b) continue. On (a) emit a clean handoff
   and end; on (b) continue and don't raise it again until the task boundary changes.

Re-evaluate only at task boundaries (new goal, block cleared, same failure twice) —
not per tool call.

## Handoff (between sessions/tools/models)

Describe the **task, not the worker** — never pin a model. A handoff carries:
goal · relevant paths/spec · acceptance criteria · progress · next step · routing
hint. The durable carrier is `.specify/session-state.md`; refresh it via
`/checkpoint` before switching. Don't restate the constitution — link it.

---

## See also

- `.specify/constitution.md` · `.specify/session-state.md` · `docs/adr/` · `HARNESS.md`
