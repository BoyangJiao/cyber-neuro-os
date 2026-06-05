# ADR 0001 — Projects data: dual path (public fetch + live subscription)

- **Status**: Accepted
- **Date**: 2026-06-03
- **Deciders**: Boyang Jiao (with Claude Code)

---

## Context

Projects data appears to be fetched in three places: (1) a `useQuery(PROJECTS_QUERY,
{ language })` subscription in `App.tsx`, (2) a `fetchProjects()` mount effect, and
(3) a `fetchProjects()` call inside `setLanguage`. An initial refactor assumed these
were redundant and collapsed everything onto the `useQuery` subscription.

**That broke the public site** (core view stuck on "loading"). Root cause:
`@sanity/react-loader`'s `useQuery` only actively fetches when **live mode is
enabled** (`useLiveMode`, active only inside the Sanity Studio Presentation iframe).
On the normal public site, `useQuery` stays dormant, so the real data path is
`fetchProjects()` → `client.fetch` → the global fetch interceptor → the `/api/sanity`
proxy (which is also what makes no-VPN access work).

## Decision

Keep **two intentional data paths**:

- **`fetchProjects()`** (mount effect + `setLanguage`) is the **primary path for the
  public site**. It works without live mode and routes through the proxy.
- **`useQuery` subscription** is a **live-mode supplement**: it only fires inside
  Presentation mode, where it keeps the store synced with draft edits.

The apparent "triple fetch" is really: one working public path (mount + language
refetch) plus a dormant subscription that only activates in the Studio iframe. The
minor double-fetch that occurs *inside Presentation mode* is harmless and not worth
removing at the cost of breaking the public site.

## Alternatives considered

- **Collapse onto `useQuery` only** — **rejected**: dormant on the public site →
  no data loads. (This was the reverted regression.)
- **Collapse onto `fetchProjects` only, drop `useQuery`** — rejected: would lose
  live draft sync in Presentation mode.
- **Add SSR `loadQuery` so `useQuery` hydrates from a server snapshot** — deferred:
  larger change; the app is a client-only SPA today.

## Consequences

**Positive**
- Public site loads reliably; Presentation mode keeps live sync. Matches the
  proven production behavior.

**Negative / cost**
- The dual path looks redundant at a glance; this ADR + code comments document
  *why* it is not. Do not "consolidate" it without re-reading this.

**Follow-ups**
- The "don't persist the projects array" optimization was also reverted to match
  prod first-paint (cached-instant) behavior; revisit only with the data-path
  understanding above.
