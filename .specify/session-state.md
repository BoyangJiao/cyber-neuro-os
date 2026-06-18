# Cyber Neuro OS — Session State (Live)

> **READ THIS FIRST in every new AI session** (Cursor, Claude Code, etc.).
>
> Update mechanism: `/checkpoint` (skill / command).
>
> **Never write here:** API keys, tokens, connection strings, `.env` contents,
> or any other secret.

> **Last updated**: 2026-06-18 by Claude Code — Generative UI for Borvis ("show
> your work") Phases 0–2 landed on `claude/vercel-json-render-borvis-scrw9q`
> (through c4a9942, pushed). Flag-gated off (`GENUI_ENABLED`); next: preview
> verification with a real DashScope key, then Phase 3 polish. (Mobile branch
> `claude/amazing-carson-xcfl21` unchanged, still awaiting its own staging verify.)

<!--
Reverse-chronological one-liners of what changed + what's next. Trim when stale.
- 2026-06-18: Generative UI for Borvis. Vercel json-render *mental model* (closed
  catalog → constrained spec → validate-before-render) reimplemented on our own
  switch(_type) dispatch with ZERO new deps. src/agent/generativeUI/ (spec, parse,
  catalog, WorkCard, GenerativeUI). render_works function-call tool wired into
  /api/chat + vite proxy, gated by GENUI_ENABLED; agentService accumulates tool
  deltas → onSpec; BorvisOverlay renders a "RENDER" panel under the transcript.
  Data is never fabricated: model emits projectId references, cards fill from the
  store. Dev proving ground at /genui-lab (dev-only, dead-stripped). Spec:
  .specify/specs/generative-ui.md.
- 2026-06-03: refactor/arch-security-perf branch — security (api guards, sanitizer,
  .env ignore), arch (single projects source, streamChat fallback, persist), perf
  (manualChunks, drop unused `motion`, particle color cache, video prefetch cap).
  Harness installed (specs + CLAUDE.md routing + husky/CI + checkpoint skill).
-->

---

## You are here

| Field | Value |
| :--- | :--- |
| **Active milestone/stage** | **Mobile responsive Phases 0–4 done** (foundation + layout shell + all pages + Borvis/WebGL tiers + MobileGate removed). Next: preview verification on real devices. |
| **Active branch** | `claude/amazing-carson-xcfl21` (off `dev` HEAD @ a16c804); **pushed** |
| **Last commits captured** | through `7a78ec6` (Borvis mobile + quality tiers + MobileGate removal) |
| **In flight** | Mobile work awaits Vercel preview / real-device testing; user merges only after full verification. Parallel track: avatar branch `feat/spatial-avatar` (~31 commits, unpushed) awaits MetaHuman GLB head. |
| **Context bundle** | none |

---

## Immediate next actions

1. **Deploy `claude/amazing-carson-xcfl21` to Vercel preview (预发)** and run the
   full verification pass (desktop regression + mobile real-device).
2. **Run the China-network checklist** (constitution) on the preview — mobile
   users are the most likely no-VPN cohort.
3. **High-effort code review** of the whole branch diff before merge.
4. Merge per release flow: preview verified → `main` → prod.
5. (Parallel track, unchanged) Avatar: MetaHuman GLB head with ARKit blendshapes
   → `/avatar-lab`; then integrate Borvis Deep-Dive mode into the main site.

---

## Recent decisions

- **Mobile strategy = desktop-first + <lg adaptation layer**, not a mobile-first
  rewrite. `lg` (1024px) is the single mobile/desktop split; `useDevice` hook
  (`src/hooks/useDevice.ts`) is the only JS source for it (matchMedia +
  useSyncExternalStore; `useIsCoarsePointer` is separate — iPad landscape is
  desktop layout + touch). Mobile = content-first: WebGL showcases (About
  avatar, stats HUD) are hidden/replaced on mobile, not shrunk.
- **MobileGate deleted** (component + i18n keys) — every page now has a mobile
  layout; the branch merges only after full preview verification.
- **CMS module padding is desktop-authored** (1440px baseline, up to 240px):
  clamped to 64px on mobile via shared `useModulePadding`.
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
- **Viewport height uses `dvh`, not `100vh`/`h-screen`** (MainLayout, App, body,
  #root) — iOS Safari's collapsing address bar otherwise pushes the footer below
  the fold. Don't reintroduce `h-screen` in layout shells.
- **`ComparisonSlider` already had full touch support** (and TacticalCursor
  already self-disables on touch) — old audit notes claiming otherwise are wrong.
- **Tailwind v4 `hover:` only fires on hover-capable devices** — touch UIs need
  explicit `active:` feedback; new mobile components set it, older ones may not.

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
