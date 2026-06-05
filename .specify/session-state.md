# Cyber Neuro OS — Session State (Live)

> **READ THIS FIRST in every new AI session** (Cursor, Claude Code, etc.).
>
> Update mechanism: `/checkpoint` (skill / command).
>
> **Never write here:** API keys, tokens, connection strings, `.env` contents,
> or any other secret.

> **Last updated**: 2026-06-04 by Claude Code (Opus 4.8) — Borvis avatar Phases
> 0–3 complete on `feat/spatial-avatar` (halftone face + emotion + Kai voice +
> push-to-talk). Boot head swapped to Boyang's Avaturn face. Next: MetaHuman GLB
> head for detail. Not yet integrated into the main site, not pushed.

<!--
Reverse-chronological one-liners of what changed + what's next. Trim when stale.
- 2026-06-03: refactor/arch-security-perf branch — security (api guards, sanitizer,
  .env ignore), arch (single projects source, streamChat fallback, persist), perf
  (manualChunks, drop unused `motion`, particle color cache, video prefetch cap).
  Harness installed (specs + CLAUDE.md routing + husky/CI + checkpoint skill).
-->

---

## You are here

| Field | Value |
| :--- | :--- |
| **Active milestone/stage** | Avatar **Phases 0–3 done** in the dev lab (`/avatar-lab`). Next: better face model (MetaHuman) + main-site integration. |
| **Active branch** | `feat/spatial-avatar` (off `refactor/arch-security-perf` HEAD @ 0147cf0); ~31 commits, **unpushed** |
| **Last commits captured** | through `c8c6dad` (boot head + shoulders) |
| **In flight** | Borvis works end-to-end in the lab; awaiting a MetaHuman GLB head to upgrade the face |
| **Context bundle** | none |

---

## Immediate next actions

1. **Export a MetaHuman GLB head with ARKit blendshapes** → drop in `public/models/`
   → tell the agent the filename → it inspects morph names (must be ARKit) and
   adapts `NeuralHalftoneFace` (the model loads via `/avatar-lab?model=<file>.glb`).
   What to look for in a candidate: ~52 morph targets named ARKit-style
   (`jawOpen`, `mouthSmileLeft`…), glTF/GLB format, head isolatable.
2. **Integrate Borvis into the main site** — Deep-Dive / 精神链接 mode: fade the
   dashboard UI, center-stage the halftone head, replace/augment the text chat window.
3. (Parallel) deploy `refactor/arch-security-perf` to Vercel preview → verify → merge.

---

## Recent decisions

- **Avatar = "Borvis"**, rendered as a Lusion-style **screen-space halftone** of an
  off-screen 3D head (`NeuralHalftoneFace`): bloom/scanline/glitch post, entrance
  ramp, cursor-follow head turn, emotion blendshapes, amplitude lip-sync.
- **Face model = `facecap-clean.glb`** (three.js facecap, full ARKit-52 blendshapes
  with `_L/_R` names). **Ready Player Me is shut down (Netflix, 2026-01-31)** and
  **Avaturn web exports have NO morph targets** (T1; T2 face-anim needs their SDK) —
  so neither gives an animatable personal face. MetaHuman GLB is the next try.
  NOTE: when swapping models, expression code keys off `_L/_R` names; ARKit
  camelCase (`mouthSmileLeft`) will need a name-compat shim in `expressions.ts`.
- **Model APIs (all DashScope/Bailian)**: LLM via `/api/chat` (env `CHAT_API_URL`
  + `CHAT_MODEL=qwen-turbo` locally; prod default = coding-plan endpoint), TTS via
  `/api/tts` (Qwen-TTS `qwen3-tts-flash`, voice **Kai**), ASR via `/api/asr`
  (`qwen3-asr-flash`, compatible-mode). All three have **dev proxies in
  `vite.config.ts`** (dev server doesn't run Vercel functions).
- Emotion is **LLM-judged**: reply opens with `[[emo:X]]`, stripped by
  `agentService` (anywhere in stream) → `onEmotion`; heuristic fallback.
- Voice input = **push-to-talk** (hold mic / Space; 3s-pause auto-send; barge-in).
- **Boot head** (`HelmetReveal`) now uses Boyang's Avaturn face (`Borvis.glb`),
  head+shoulders extracted from the full body by Y-threshold.
- Projects data keeps a **dual path** (public `fetchProjects` + live-mode
  `useQuery`). An attempt to collapse onto `useQuery` alone **broke the public
  site** and was reverted — see `docs/adr/0001-single-projects-data-source.md`.
- StrictMode re-enable **deferred** (was disabled for "legacy reasons"; flip +
  test deliberately) — see constitution "Deliberately deferred".
- Global fetch/XHR interceptor in `main.tsx` **kept as-is** (load-bearing for
  China no-VPN access); only cleaned the proxy debug-header leak server-side.

---

## Active blockers

- None. (Staging deploy is the gating step before merge.)

---

## Critical mental model (append-only)

- **`useQuery` (@sanity/react-loader) does NOT fetch on the public site.** It only
  fetches when live mode is on (Studio Presentation iframe via `useLiveMode`). The
  public site's data comes from `fetchProjects()` (`client.fetch` → proxy). Never
  remove the `fetchProjects` mount/setLanguage calls thinking `useQuery` covers them.
- **Production is live.** Path is local verify → Vercel preview (预发) → `main`.
  `main` auto-deploys to production.
- **Staging verification checklist** for any change to the proxy chain:
  ① projects load on the landing page; ② language EN↔ZH switch refetches;
  ③ project detail pages render; ④ AI chat (Neural Uplink) streams; ⑤ retro
  emulator boots; ⑥ verify from a China network (or via the no-VPN test) that
  Sanity + emulator assets still load.
- The AI chat endpoint `/api/chat` spends real DashScope money — it now has
  origin + size guards. Set `ALLOWED_ORIGINS` env in Vercel to the prod domain(s).
- ESLint has ~102 **pre-existing** errors (baseline). Gate is "no NEW errors on
  changed files," not a clean full-repo run.
- `tsc -b` and `vite build` are both green as of this session.
- **Avatar lives only in dev so far**: `/avatar-lab` (dev-only route, top-level
  early-return in `App.tsx`; not registered in prod builds). Not yet in the main site.
- **Dev needs `npm run dev` restart** after any `.env.local` change OR after
  touching the `/api/*` dev proxies in `vite.config.ts` (they load at startup).
- **vite build does NOT compile GLSL** — a shader error (e.g. shadowing a built-in
  like `dot`) passes tsc/build but renders black at runtime. Only caught visually.
- **GLB binaries aren't auto-tracked**: `facecap-clean.glb` + `Borvis.glb` are the
  in-use models and ARE committed; `Facecap.glb`, `Borvist2.glb`, `Borvist2.1.glb`
  are unused (deletable).

---

## Deliberately deferred (not forgotten)

| Item | Why deferred | Target point |
| :--- | :--- | :--- |
| Re-enable StrictMode | Was disabled deliberately; needs dev-mode 3D/audio testing | A focused PR |
| Burn down 102 legacy ESLint errors | Out of scope for this refactor; mostly `studio/` + `any` | Incremental |
| Add vitest + `sanitizeEmbed` test | Security-critical pure fn deserves a test | Next harness step |

---

## Active env / config snapshot (refresh if stale)

- Hosting: **Vercel**. Production domain: boyangjiao.xyz.
- Required server env: `DASHSCOPE_API_KEY`. Optional: `ALLOWED_ORIGINS`,
  `SANITY_AUTH_TOKEN` (scripts only), `PROXY_URL` (local dev), and the avatar
  model/voice overrides `CHAT_API_URL` / `CHAT_MODEL` / `TTS_MODEL` / `TTS_VOICE`
  / `ASR_MODEL` (see `.env.example`). Local `.env.local` uses the standard
  compatible-mode endpoint + `qwen-turbo` + TTS voice `Kai`.
- Client env (`VITE_`): `VITE_SANITY_PROJECT_ID` (default `argneoi8`),
  `VITE_SANITY_DATASET` (`production`), `VITE_SANITY_API_VERSION`.
- Sanity Studio lives in `studio/` (separate package). CMS dataset: `production`.
