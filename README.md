[![npm version](https://badge.fury.io/js//%40kontent-ai%2Fdelivery-sdk.svg)](https://www.npmjs.com/package/@kontent-ai/delivery-sdk)
[![Build](https://github.com/kontent-ai/delivery-sdk-js/actions/workflows/build.yml/badge.svg)](https://github.com/kontent-ai/delivery-sdk-js/actions/workflows/build.yml)
[![Integration Tests](https://github.com/kontent-ai/delivery-sdk-js/actions/workflows/integration-tests.yml/badge.svg)](https://github.com/kontent-ai/delivery-sdk-js/actions/workflows/integration-tests.yml)
[![Unit Tests](https://github.com/kontent-ai/delivery-sdk-js/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/kontent-ai/delivery-sdk-js/actions/workflows/unit-tests.yml)
[![npm](https://img.shields.io/npm/dt/@kontent-ai/delivery-sdk.svg)](https://www.npmjs.com/package/@kontent-ai/delivery-sdk)
[![Known Vulnerabilities](https://snyk.io/test/github/Kontent-ai/delivery-sdk-js/badge.svg)](https://snyk.io/test/github/kontent-ai/delivery-sdk-js)
[![GitHub license](https://img.shields.io/github/license/Kontent-ai/delivery-sdk-js.svg)](https://github.com/kontent-ai/delivery-sdk-js)

# Kontent.ai Delivery SDK for JavaScript

A TypeScript/JavaScript SDK for the [Kontent.ai Delivery API](https://kontent.ai/learn/docs/apis/openapi/delivery-api/).
It fetches content items, types, taxonomies, and languages, with first-class TypeScript typing and optional
runtime validation.

> **Upgrading from v16?** See the [migration guide](./migration.md).

## Installation

The SDK has three peer dependencies: `@kontent-ai/core-sdk`, `zod`, and `ts-pattern`.

```bash
# npm installs peer dependencies automatically
npm install @kontent-ai/delivery-sdk

# pnpm needs them listed explicitly
pnpm add @kontent-ai/delivery-sdk @kontent-ai/core-sdk zod ts-pattern
```

Requires Node.js ≥ 22.

## Quick start

```typescript
import { createDeliveryClient } from "@kontent-ai/delivery-sdk";

const client = createDeliveryClient({
    apiMode: "public",
    environmentId: "<your-environment-id>",
});

// Fetch a single content item
const { response } = await client.fetchContentItem({ codename: "my_article" }).fetchSafe();
```

Every query returns `{ payload, meta }`. The `payload` is the raw API response (content lives in
`payload.items` / `payload.item`); `meta` holds response metadata such as the continuation token.

## Configuration

The API mode is set once, when you create the client:

```typescript
// Public — published content
createDeliveryClient({ apiMode: "public", environmentId: "<id>" });

// Preview — unpublished content
createDeliveryClient({ apiMode: "preview", environmentId: "<id>", deliveryApiKey: "<preview-key>" });

// Secure — published content with Secured access enabled
createDeliveryClient({ apiMode: "secure", environmentId: "<id>", deliveryApiKey: "<secure-key>" });
```

| Option | Required | Description |
|---|---|---|
| `apiMode` | yes | `"public"`, `"preview"`, or `"secure"` |
| `environmentId` | yes | Your Kontent.ai environment ID |
| `deliveryApiKey` | for preview/secure | The preview or secure access API key |
| `baseUrl`, `httpService`, `retryStrategy` | no | Advanced options from [`@kontent-ai/core-sdk`](https://github.com/kontent-ai/core-sdk-js) |
| `runtimeValidation` | no | Opt-in Zod validation of responses (see [Runtime validation](#runtime-validation)) |

## Safe vs. throwing queries

Every query offers two execution styles:

- **Safe** (`fetchSafe` / `fetchPageSafe` / `fetchAllPagesSafe`) — never throws; returns
  `{ success, response, error }`.
- **Throwing** (`fetch` / `fetchPage` / `fetchAllPages`) — returns the response directly and throws on
  failure.

```typescript
// Safe — handle the result object
const { success, response, error } = await client.listContentItems().fetchPageSafe();
if (success) {
    console.log(response.payload.items);
}

// Throwing — use try/catch
try {
    const response = await client.listContentItems().fetchPage();
    console.log(response.payload.items);
} catch (error) {
    // error is a DeliverySdkError
}
```

Use single-item queries with `fetch` / `fetchSafe`; paged queries (`listContentItems`, `listContentTypes`,
`listTaxonomies`, `listLanguages`, `itemsFeed`, …) with `fetchPage` / `fetchPageSafe` /
`fetchAllPages` / `fetchAllPagesSafe`.

## Error handling

Failures are reported as a `DeliverySdkError`. With safe queries, inspect `error` on the result; with
throwing queries, catch it.

```typescript
const { success, error } = await client.fetchContentItem({ codename: "missing" }).fetchSafe();

if (!success) {
    console.error(error.message);
    console.error(error.details.reason); // e.g. "parsingFailed"
}
```

## Paging

```typescript
// One page
const { response } = await client
    .listContentItems({ query: { limit: 10, skip: 0 } })
    .fetchPageSafe();

console.log(response?.payload.items);

// All pages at once
const { success, responses } = await client.listContentItems().fetchAllPagesSafe();
if (success) {
    const allItems = responses.flatMap((r) => r.payload.items);
}

// Or iterate page-by-page
for await (const page of client.listContentItems().pages()) {
    console.log(page.payload.items.length);
}
```

The `itemsFeed` query pages with a continuation token instead of skip/limit — pass it via the request
headers and read the next token from `response.meta.continuationToken`:

```typescript
const { response } = await client
    .itemsFeed({ headers: { "X-Continuation": "<token>" } })
    .fetchPageSafe();

console.log(response?.meta.continuationToken);
```

## Strong typing

Pass a `DeliveryClientSchema` to `createDeliveryClient` to narrow every codename, then describe each
content type with `ContentItemOf` and the `Elements` namespace. (We recommend generating both with
[`@kontent-ai/model-generator`](https://github.com/kontent-ai/model-generator-js) rather than writing them
by hand.)

```typescript
import { createDeliveryClient, type ContentItemOf, type DeliveryClientSchema, type Elements } from "@kontent-ai/delivery-sdk";

type MySchema = DeliveryClientSchema<{
    readonly languageCodenames: readonly ["en-US"];
    readonly collectionCodenames: readonly ["default"];
    readonly workflowCodenames: readonly ["default"];
    readonly workflowStepCodenames: readonly ["published"];
    readonly taxonomies: { readonly genre: readonly ["action", "comedy"] };
    readonly contentTypes: {
        readonly movie: readonly ["title", "stars"];
        readonly actor: readonly ["first_name"];
    };
}>;

type Actor = ContentItemOf<MySchema, "actor", {
    readonly first_name: Elements.Text;
}>;

type Movie = ContentItemOf<MySchema, "movie", {
    readonly title: Elements.Text;
    readonly stars: Elements.LinkedItems<Actor>;
}>;

const client = createDeliveryClient<MySchema>({ apiMode: "public", environmentId: "<id>" });
```

Codenames are now checked at compile time, and linked items are resolved onto each element's `items`
array (e.g. `movie.elements.stars.items` is `Actor[]`).

## Type guards

When a query returns items of mixed types, narrow each one to its typed model with a guard on
`system.type`:

```typescript
import type { ContentItemPayload } from "@kontent-ai/delivery-sdk";

function isMovie(item: ContentItemPayload<MySchema>): item is Movie {
    return item.system.type === "movie";
}

const { response } = await client.listContentItems().fetchPageSafe();

for (const item of response?.payload.items ?? []) {
    if (isMovie(item)) {
        console.log(item.elements.title.value);     // typed as string
        const stars = item.elements.stars.items;     // resolved Actor[]
    }
}
```

`@kontent-ai/model-generator` generates one of these guards (`isMovie`, `isActor`, …) per content type.

## Runtime validation

Optionally validate responses against the SDK's Zod schemas at runtime — handy for catching unexpected
payload shapes early:

```typescript
const client = createDeliveryClient({
    apiMode: "public",
    environmentId: "<id>",
    runtimeValidation: { validateResponses: true },
});
```

The schemas are also exported on their own subpath for standalone use:

```typescript
import { listContentItemsSchema } from "@kontent-ai/delivery-sdk/schemas";

const result = await listContentItemsSchema<MySchema>().safeParseAsync(storedJson);
```

## Resolved linked items & serialization

By default, content-item queries (`fetchContentItem`, `listContentItems`, `itemsFeed`) return an
**extended** response: every rich-text and linked-items (modular content) element is augmented with a
mapped `items` property holding the fully-resolved referenced items. This lets you traverse the content
tree directly instead of looking codenames up in `modular_content` yourself — `element.value` still holds
the referenced codenames, while `element.items` holds the resolved items.

```typescript
const { response } = await client.listContentItems().fetchPageSafe();
const movie = response?.payload.items[0];

const starCodenames = movie?.elements.stars.value; // string[] of codenames
const stars = movie?.elements.stars.items;          // resolved items
```

Because resolved items can reference one another — possibly in a **circular** way — the extended response
is **not** safe to `JSON.stringify`. When you need to serialize the response (caching, SSR payloads,
sending it over the wire), use the query's `raw()` variant. It returns the plain API payload with **no**
resolved `items`; linked items remain referenced by codename in `modular_content`.

```typescript
// Raw payload — safe to serialize (no resolved `items`, so no circular references)
const { response } = await client.listContentItems().raw().fetchPageSafe();

const json = JSON.stringify(response?.payload); // safe

// In the raw payload, resolve linked items yourself from `payload.modular_content` when needed.
```

## License

MIT
