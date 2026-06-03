# HARNESS.md — what's enforced, and how to bypass when justified

> The layered safety net for Cyber Neuro OS. Each layer catches a class of mistake
> earlier than the last. The methodology (constitution P0s, model routing, handoff)
> from `headless-harness-kit` v0.1.0 layers on top of the off-the-shelf tools below.
>
> harness-kit: v0.1.0

## Layers

| Layer | Tool (adopted) | What it enforces | Bypass |
| :--- | :--- | :--- | :--- |
| **1. Spec / memory** | markdown in `.specify/` | Read constitution + session-state before coding | — (read-time contract) |
| **2. pre-commit** | **husky** | Secret-leak guard (hard); ESLint on changed `.ts/.tsx` (**advisory** — baseline) | `git commit --no-verify` |
| **3. pre-push** | **husky** | `tsc -b` zero errors (full typecheck) | `git push --no-verify` |
| **4. CI gate** | **GitHub Actions** (`.github/workflows/ci.yml`) | Hard: typecheck + `vite build`. Advisory: lint | n/a (authoritative wall) |
| **5. Tests** | _deferred_ | (none yet — see below) | — |

## Frameworks adopted (borrow-first record)

- **Git hooks → husky v9.** The de-facto standard for JS/TS repos; well-maintained.
  Chosen over hand-rolled `.git/hooks` and over `simple-git-hooks`. (lint-staged was
  evaluated but dropped: its stash/restore on a failing lint reverted the tree, which
  is undesirable for an *advisory* lint over a legacy baseline — the hook runs
  `eslint` directly on the staged paths instead, side-effect-free.)
- **CI → GitHub Actions.** Platform-native (repo is on GitHub), Vercel deploys
  independently from `main`. No third-party CI needed.
- **Tests → none yet (deferred).** No runner exists. The highest-value first test
  is a `sanitizeEmbed` unit test (security-critical pure fn). Recommended:
  `vitest` + `happy-dom`. Tracked in the constitution's "Deliberately deferred".

## The ESLint baseline reality (important)

`npm run lint` currently reports **~102 pre-existing errors** (mostly `studio/`,
`vite.config.ts`, and `: any` usage in older `src/` files). This predates the
harness. Therefore:

- **Advisory at pre-commit:** the hook runs `eslint` on staged `.ts/.tsx` and
  reports, but does not block (touched legacy files still carry baseline errors).
  The hard pre-commit gate is the **secret-leak scan**.
- **Advisory in CI:** the full-repo `npm run lint` runs but does not block.
- **Hard gates that DO block:** secret-scan (pre-commit), `tsc -b` (pre-push + CI),
  `vite build` (CI).
- **Goal:** burn the baseline down incrementally; once `npm run lint` is clean,
  flip BOTH layers to hard (drop the `|| true` in `.husky/pre-commit` and
  `continue-on-error` in CI).

## Session start

No automated session-start hook is wired (kept minimal for a solo repo). The
read-order contract lives in `AGENTS.md` / `CLAUDE.md`; agents self-route per the
table in `CLAUDE.md`.

## How to extend

- Add a test runner → wire `npm test` into pre-push and the CI `gate` job, then
  remove the "deferred" note above.
- Burn down lint → when `npm run lint` is clean, drop `continue-on-error` in CI.
- Re-enable StrictMode → separate focused PR (see constitution "Deliberately deferred").
