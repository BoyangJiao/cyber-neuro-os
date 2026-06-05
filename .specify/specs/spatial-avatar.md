# Feature Spec — Holographic Particle Avatar ("Neural Entity")

> The embodied AI agent: a futuristic holographic point-cloud face that lives in
> Deep-Dive mode. You talk to it (voice or text); it replies in your language with
> synthesized speech, and its facial features (eyes, brows, jaw, mouth) animate in
> real time to match what it says — so it reads as a living digital being, not a chatbox.
>
> **Status:** Accepted (decisions locked) → Implementing (Phase 0)
> **Branch:** `feat/spatial-avatar` (off the refactor branch HEAD)
> **Owner:** Boyang Jiao (with Claude Code)

---

## Problem / user value

Today the AI agent ("Neural Uplink") is a text chat window. The goal is a far more
visceral interaction: entering 精神链接 / Deep-Dive mode dims the rest of the UI and
puts a glowing particle avatar center-stage. Talking to it should feel like talking
to a real, embodied entity — it speaks aloud in the user's language and its face
moves with every word. This is the centerpiece "wow" of the portfolio.

## Decisions

> Locked unless noted. Open items need sign-off before the phase that needs them.

1. **No spatial photo / depth extraction.** _(Decided)_ The requirement is dynamic
   facial animation, which needs **blendshapes**, not static depth. Apple-photo path dropped.
2. **Geometry = a head model with ARKit + Oculus-Viseme morph targets.** _(Decided)_
   Source: **Ready Player Me** GLB via REST API with
   `?morphTargets=ARKit,Oculus%20Visemes&pose=T`. ARKit → expression (blink, brow,
   jawOpen…); Oculus Visemes → mouth shapes (aa/ee/oh…). Stored in `public/models/`.
3. **Render = point cloud, not the mesh.** _(Decided)_ `THREE.Points` with a custom
   ShaderMaterial reusing the existing holographic aesthetic
   (`src/components/three/shaders/fresnelShader.ts`, additive glow). **THREE.Points
   supports morph targets natively** → the same blendshape weights that would deform
   the (hidden) mesh deform the point cloud directly on GPU. Reuse patterns from
   `ParticleMorphField` / `NeuralParticleField`.
4. **All model APIs unify on Alibaba DashScope.** _(Decided)_ LLM (existing
   `api/chat`), **TTS = Fun-Realtime-TTS**, **ASR = Fun-Realtime-ASR**. Rationale:
   ASR is #1 global WER (1.8%); TTS is the best China-accessible option (30+ langs,
   Chinese dialects); same key + same proxy chain as `api/chat`; realtime/low-latency.
5. **Lip-sync in two steps.** _(Decided)_ ① Phase 2: **audio-amplitude → jawOpen**
   (Web Audio `AnalyserNode` RMS; language-agnostic, robust). ② Phase 3: **viseme
   timeline** if Fun-Realtime-TTS returns phoneme/timing marks (else lightweight
   client estimation). Amplitude alone already reads as "talking".
6. **No new engine.** _(Decided)_ Three.js is the engine. We add one orchestration
   module — the **Avatar Driver** (a Zustand store + a `useFrame` loop) that maps
   {agent state, audio analyser, idle generators} → {blendshape weights, particle params}.
7. **Avatar identity / style** — _(Open — needs sign-off before Phase 1 polish)_:
   which specific RPM avatar (gender/face). Phase 0 uses a default; swap later.
8. **Voice input UX** — _(Open — Phase 3)_: push-to-talk button vs. continuous
   listening / wake behavior.

## Non-goals / explicitly deferred

- No photoreal mesh rendering (we render points only).
- No full-body avatar, no hands/gestures — head/face only.
- No multi-avatar / avatar customization UI for visitors.
- No offline/on-device models — all inference via DashScope proxy.
- Mobile is out of scope initially (Deep-Dive is desktop-gated already via MobileGate).

## Constraints honored (from constitution)

- **China-access proxy integrity (P0)** — TTS/ASR calls go through new serverless
  proxies in the same pattern as `api/sanity`/`api/chat`; no direct cross-border calls.
- **Secrets server-side (P0)** — DashScope key stays in serverless env; never in the bundle.
- **Production stability (P0)** — feature is gated behind Deep-Dive mode; the default
  site is unaffected until shipped. Lands via staging before `main`.
- **tsc clean (P0)** — every commit typechecks.

## Architecture (the Avatar Driver)

```
user input (mic / text)
  → [ASR proxy]  (voice only)            api/asr   → DashScope Fun-Realtime-ASR
  → existing agentService stream         api/chat  → DashScope LLM   (reply text)
  → [TTS proxy]  reply text → audio       api/tts   → DashScope Fun-Realtime-TTS
  → HTMLAudioElement + Web Audio AnalyserNode ──┐
  → agent state machine: idle│listening│thinking│speaking ──┤
                                                            ├→ blendshape weights
  → idle layer: breathing · blink · eye saccade · look-at-cursor ──┘   + particle uniforms
                                                            → THREE.Points (morph) + glow shader
```

New files (planned):
- `src/components/three/avatar/NeuralEntity.tsx` — the points avatar (loads GLB, morph shader)
- `src/components/three/avatar/avatarShader.ts` — points vertex/fragment (morph + glow)
- `src/store/useAvatarStore.ts` — agent state machine + blendshape target weights
- `src/hooks/useAudioVisemes.ts` — AnalyserNode → jawOpen / amplitude
- `src/services/speechService.ts` — TTS + ASR client wrappers (stream-friendly)
- `api/tts.ts`, `api/asr.ts` — DashScope serverless proxies
- (integration) Deep-Dive mode in `App.tsx` / `useAppStore` to mount the entity + fade UI

## Acceptance criteria

**Phase 0 — visual proof**
- **AC.0.1** A RPM GLB with ARKit+Viseme morphs loads and renders as a glowing point
  cloud in the shared canvas, using the existing holographic shader aesthetic.
- **AC.0.2** A debug slider for `jawOpen` (and one viseme) visibly deforms the point
  cloud (mouth opens) — proving morph-driven points work.

**Phase 1 — "alive" idle**
- **AC.1.1** Entering Deep-Dive mode fades the dashboard UI and centers the entity.
- **AC.1.2** Idle animation: periodic blink, subtle breathing scale, eye micro-saccades,
  and the gaze tracks the cursor. No audio yet. Sustains 60fps on desktop.

**Phase 2 — speaking**
- **AC.2.1** A typed message → agent reply (existing stream) → TTS audio plays.
- **AC.2.2** While audio plays, `jawOpen` follows amplitude so the mouth moves in time;
  goes still when audio ends.
- **AC.2.3** Distinct visuals for listening / thinking / speaking (e.g. particle
  agitation / color shift) driven by the state machine.

**Phase 3 — voice + precise mouth**
- **AC.3.1** Mic input → ASR transcript → same reply pipeline (voice round-trip).
- **AC.3.2** If TTS provides timing, mouth uses viseme shapes aligned to phonemes;
  otherwise amplitude fallback remains.

## Planned commit sequence

1. `chore(avatar)` — add RPM GLB to `public/models/` + a loader spike (Phase 0)
2. `feat(avatar)` — NeuralEntity points component + morph glow shader
3. `feat(avatar)` — debug morph sliders (GeometryTab/CyberDebugPanel) to validate
4. `feat(avatar)` — useAvatarStore state machine + idle animation layer (Phase 1)
5. `feat(deepdive)` — Deep-Dive UI fade + center-stage mount
6. `feat(api)` — api/tts proxy + speechService TTS client
7. `feat(avatar)` — useAudioVisemes amplitude lip-sync wired to jawOpen (Phase 2)
8. `feat(api)` — api/asr proxy + mic capture + voice round-trip (Phase 3)
9. `feat(avatar)` — viseme-timeline lip-sync if TTS timing available (Phase 3)

## Handoff note

- **Done so far:** branch created; decisions locked above.
- **Next step:** Phase 0 — fetch a default RPM GLB (ARKit+Viseme) into
  `public/models/`, render it as points with the glow shader, add a `jawOpen` debug
  slider, confirm the cloud deforms (AC.0.1/0.2).
- **Routing hint:** 3D/WebGL + shader work → high-capability tier (per CLAUDE.md routing).

## Open questions to resolve with the user (before the phases that need them)

- **Q1 (Phase 1):** Which RPM avatar identity/style? (Phase 0 just uses a default.)
- **Q2 (Phase 2):** Default TTS voice + does the agent always speak, or only in voice mode?
- **Q3 (Phase 3):** Push-to-talk vs. continuous listening?
- **Q4 (verify):** Confirm Fun-Realtime-TTS/ASR exact DashScope endpoint + whether
  TTS returns timing marks (decides Phase 3 approach).
