# Cyber Neuro OS — Constitution

> Single source of truth for any AI agent or human contributor.
> Every PR must satisfy these constraints.
>
> If a request conflicts with this document, **ask the user** before proceeding.

> harness-kit: v0.1.0

---

## Identity

- **Project**: Cyber Neuro OS (`cyber-neuro-os`)
- **Type**: Immersive cyberpunk "Neural OS" interactive portfolio — a single-page
  React app with Three.js/WebGL scenes, an AI chat agent, retro emulator, audio
  synthesis, and a Sanity-CMS-backed project showcase.
- **Audience**: Public visitors (recruiters, peers); author is the sole maintainer.
- **Cadence**: Solo, part-time. **Already live in production** at boyangjiao.xyz.
- **Stack baseline**: React 19 + TypeScript + Vite 6 + Tailwind v4 + Three.js
  (@react-three/fiber) + Zustand + framer-motion/gsap + Tone.js + Sanity CMS,
  deployed on Vercel with three Edge serverless functions (`api/`). See `CLAUDE.md`.

---

## Core Principles

> Value tradeoffs that resolve ambiguity when rules don't. Phrased as
> "<this> > <that>" so they're decisive.

1. **Production stability > velocity** — the site is live. A change that risks a
   visible regression waits for the staging path; it does not go straight to `main`.
2. **Verify in the real flow > trust the diff** — local build/typecheck, then
   preview (预发) deploy, then production. No "should work" merges.
3. **Accessibility of the deployed site in China > architectural purity** — the
   no-VPN proxy path is load-bearing; never trade it away for a "cleaner" design.
4. **Secrets stay server-side > convenience** — anything sensitive lives in
   Vercel env / serverless, never in the client bundle or git.
5. **Subtract before adding** — a smaller, comprehensible change beats a clever one;
   dead code and duplicate data paths are bugs waiting to happen.

---

## Code Constraints (P0 — violation blocks merge)

> Every P0 is **checkable**. The enforcing layer is noted after each rule.

### Release safety

- Changes reach production only via **local verify → preview/staging → `main`**;
  `main` must always be deployable. — _enforced by: human + CI gate (build must be green)_
- No DEV-only mock or short-circuit may alter production behavior. The AI chat
  mock (`agentService`) only activates when the real endpoint is genuinely
  unavailable. — _enforced by: review + `import.meta.env.DEV` guards_

### Secrets / boundaries

- No secret (`DASHSCOPE_API_KEY`, `SANITY_AUTH_TOKEN`, any token/key) appears in
  client code, the built bundle, or git. Server secrets live only in Vercel env /
  `.env.local`. — _enforced by: `.gitignore` (`.env*`) + review + CI secret scan_
- Only `VITE_`-prefixed env vars may be referenced from `src/` (these ship to the
  client and must be non-secret). — _enforced by: review_
- Public proxies (`api/sanity.ts`, `api/emulator.ts`) must not forward
  credential-bearing headers or leak upstream debug info. — _enforced by: review_

### China-access proxy integrity

- The Sanity + Emulator proxy chain (Vercel serverless `api/*` + the global
  fetch/XHR interceptor in `src/main.tsx`) is **load-bearing for no-VPN access**.
  Any change touching `main.tsx` interceptors, `api/sanity.ts`, `api/emulator.ts`,
  `vite.config.ts` proxy, or `vercel.json` rewrites must be verified to still load
  Sanity data and the emulator from within China (or via the documented test).
  — _enforced by: human verification on staging_

### Correctness gates

- `tsc -b` reports **zero** errors. — _enforced by: pre-push hook + CI_
- ESLint reports **no new** errors on changed files (legacy baseline tracked
  separately — see `HARNESS.md`). — _enforced by: pre-commit (advisory) + CI (advisory) until baseline zero_
- Untrusted/CMS HTML rendered via `dangerouslySetInnerHTML` must pass through
  `sanitizeEmbed` (or equivalent allowlist sanitizer). — _enforced by: review (+ unit test, deferred)_

---

## Architectural Constraints (P1 — should be honored)

- ADR-0001: Projects data uses a **dual path** — `fetchProjects()` is primary for
  the public site (`useQuery` only fires in live/Presentation mode). Do NOT
  "consolidate" onto `useQuery` alone; it breaks the public site. See the ADR.
- Heavy vendor libs (three / sanity / motion / tone) stay in their own build
  chunks (`vite.config.ts` `manualChunks`).

---

## Process Constraints (P1)

- Non-trivial features get a short spec in `.specify/` before code.
- Major/irreversible decisions get an ADR in `docs/adr/`.
- Update `.specify/session-state.md` at session end (`/checkpoint`).

---

## Deliberately deferred (tracked, not forgotten)

- **Re-enable React StrictMode** — currently disabled in `main.tsx` ("legacy
  reasons"). Flip + test dev-mode Three.js/Tone.js double-init deliberately, not
  as a side effect of unrelated work.
- **Burn down the ~102 legacy ESLint errors** (mostly `studio/`, `any` usage).
- **Add a test runner** (e.g. vitest + happy-dom) with a `sanitizeEmbed` unit test.

---

## When in doubt

1. Ask the user.
2. Default to the safer / more conservative interpretation.
3. If proposing a deviation, record it as an ADR.

---

## See also

- `CLAUDE.md` — project orientation + model-routing table + handoff rules
- `.specify/session-state.md` — current progress (read first each session)
- `docs/adr/` — architectural decision records
- `HARNESS.md` — what's enforced and how to bypass when justified
