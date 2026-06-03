# Cyber Neuro OS — Session State (Live)

> **READ THIS FIRST in every new AI session** (Cursor, Claude Code, etc.).
>
> Update mechanism: `/checkpoint` (skill / command).
>
> **Never write here:** API keys, tokens, connection strings, `.env` contents,
> or any other secret.

> **Last updated**: 2026-06-03 by Claude Code (Opus 4.8) — Created refactor branch,
> landed security+architecture+performance fixes, installed the harness. Build &
> typecheck green; awaiting staging (预发) verification before merge to `main`.

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
| **Active milestone/stage** | Refactor landed locally → **next: deploy branch to Vercel preview (预发) and verify** |
| **Active branch** | `refactor/arch-security-perf` (off `main` @ 78a7fd6) |
| **Last commits captured** | main @ 78a7fd6; branch changes not yet committed |
| **In flight** | Harness files being generated; nothing committed yet |
| **Context bundle** | none |

---

## Immediate next actions

1. **Commit** the refactor + harness (user reviews first; do not push without ask).
2. **Deploy the branch to a Vercel preview** and run the staging verification
   checklist (see "Critical mental model" → staging checks).
3. Only after staging is clean: merge to `main` → production.

---

## Recent decisions

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
- Required server env: `DASHSCOPE_API_KEY`, optionally `ALLOWED_ORIGINS`,
  `SANITY_AUTH_TOKEN` (scripts only), `PROXY_URL` (local dev).
- Client env (`VITE_`): `VITE_SANITY_PROJECT_ID` (default `argneoi8`),
  `VITE_SANITY_DATASET` (`production`), `VITE_SANITY_API_VERSION`.
- Sanity Studio lives in `studio/` (separate package). CMS dataset: `production`.
