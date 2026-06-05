# Feature Spec — <<FEATURE_NAME>>

> Write this **before** the code for any non-trivial feature. Its job is to push
> the ambiguity out before implementation and give any model/session a precise
> target. Trivial changes don't need one.
>
> **Status:** Draft → Accepted → Implemented (update as it progresses)

---

## Problem / user value

<<What gap this closes, in the user's terms. One short paragraph. Avoid solution
language here — describe the need.>>

## Decisions

> The choices that shape the implementation. Mark each Decided or Open. Lock the
> Open ones with the human before handing off to implementation.

1. **<<DECISION>>** — <<chosen option>> _(Decided)_
2. **<<DECISION>>** — <<options A/B>> _(Open — needs human sign-off)_

## Non-goals / explicitly deferred

- <<what this feature deliberately does NOT do, so scope stays tight>>

## Constraints honored

> Which constitution P0s / invariant laws this feature must respect (cite them).

- <<Law N / P0 rule>> — <<how this feature complies>>

## Acceptance criteria

> Verifiable, ideally BDD-style. These become the handoff's "acceptance" field
> and the reviewer's checklist.

- **AC.1** — Given <<…>>, when <<…>>, then <<…>>.
- **AC.2** — <<…>>
- **AC.3 (round-trip / invariant check, if applicable)** — <<…>>

## Planned commit sequence

> A small ordered chain so implementation (possibly by another model) is legible.

1. `<<type(scope)>>` — <<…>>
2. `<<type(scope)>>` — <<…>>

## Handoff note

> Task-shaped, not model-pinned (see handoff-protocol). Fill when passing to
> implementation.

- **Done so far:** <<…>>
- **Next step:** <<…>>
- **Routing hint:** looks like <<task type>> work.
