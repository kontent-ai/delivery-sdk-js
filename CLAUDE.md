# Code Style

## Functional Programming

- Prefer functional style: pure functions, immutable data, expressions over statements
- Small, single-purpose functions — if a function does more than one thing, split it
- `const` everywhere; never use `let` unless mutation is genuinely unavoidable, never use `var`
- `readonly` on all type properties, function parameters, and array types (`readonly T[]`)
- Avoid side effects — functions should return values, not mutate external state
- Prefer `map`, `filter`, `reduce`, and other higher-order functions over imperative loops
- Prefer early returns over nested conditionals

## Libraries

- Use **ts-pattern** for non-trivial `switch`/`if-else` chains — anything beyond a simple 2-branch condition should use `match()` from `ts-pattern`
- Use **Zod** to define schemas for all API response payloads and API endpoint inputs — the Zod schema is the source of truth; TypeScript types are always derived via `z.infer<>`, never written by hand alongside a schema

## Exports

- All API queries and API-related models must be exported from `lib/public_api.ts` — nothing is part of the public API unless it appears there
