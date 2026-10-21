# Code Style

## Functional Programming

- Prefer functional style: pure functions, immutable data, expressions over statements
- Small, single-purpose functions — if a function does more than one thing, split it
- `const` everywhere; never use `let` unless mutation is genuinely unavoidable, never use `var`
- `readonly` on all type properties, function parameters, and array types (`readonly T[]`); exception: a mutable array used as a local accumulator within a single function body (built with `.push()`, never returned or exposed as mutable) is acceptable when the immutable alternative would cause repeated full-array copies — e.g. `[...acc, item]` inside a loop or recursion allocates a new array on every iteration (O(n) per step), whereas `.push()` is O(1) amortised
- Avoid side effects — functions should return values, not mutate external state
- Prefer `map`, `filter`, `reduce`, and other higher-order functions over imperative loops
- Prefer early returns over nested conditionals

## Libraries

- Use **ts-pattern** for non-trivial `switch`/`if-else` chains — anything beyond a simple 2-branch condition should use `match()` from `ts-pattern`
- Use **Zod** to define schemas for all API response payloads and API endpoint inputs — the Zod schema is the source of truth; TypeScript types are always derived via `z.infer<>`, never written by hand alongside a schema

## Exports

- All API queries and API-related models must be exported from `lib/public_api.ts` — nothing is part of the public API unless it appears there

# Tooling

- After making code changes, run `pnpm run biome:fix` to auto-format and fix lint issues
