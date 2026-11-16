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

```bash
npm install @kontent-ai/delivery-sdk
# or
pnpm add @kontent-ai/delivery-sdk
```

Requires Node.js ≥ 24.

## Quick start

```typescript
import { createDeliveryClient } from "@kontent-ai/delivery-sdk";

const client = createDeliveryClient({
	apiMode: "public",
	environmentId: "<your-environment-id>",
});

// Fetch a single content item
const { success, response } = await client.fetchContentItem({ codename: "my_article" }).fetchSafe();

if (success) {
	console.log(response.payload.item.elements);
}
```

Every successful response has the shape `{ payload, meta }`. The `payload` is the API response (content
lives in `payload.items` / `payload.item`); `meta` holds response metadata such as the continuation token.

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

| Option           | Required           | Description                                                                                                                            |
| ---------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `apiMode`        | yes                | `"public"`, `"preview"`, or `"secure"`                                                                                                 |
| `environmentId`  | yes                | Your Kontent.ai environment ID                                                                                                         |
| `deliveryApiKey` | for preview/secure | The preview or secure access API key                                                                                                   |
| `baseUrl`        | no                 | Custom host as `{ protocol, host }`, overrides the default Delivery API URL                                                            |
| `httpService`    | no                 | Custom HTTP service from [`@kontent-ai/core-sdk`](https://github.com/kontent-ai/core-sdk-js) (retry strategy, global headers, adapter) |

### Custom host (proxy)

To route requests through your own proxy, omit `apiMode` and provide `baseUrl`. `deliveryApiKey` is
optional in this mode.

```typescript
createDeliveryClient({
	environmentId: "<id>",
	baseUrl: { protocol: "https", host: "delivery-proxy.example.com" },
});
```

### Retry strategy and global headers

Retries and headers sent with every request are configured on the HTTP service:

```typescript
import { getDefaultHttpService } from "@kontent-ai/core-sdk";

createDeliveryClient({
	apiMode: "public",
	environmentId: "<id>",
	httpService: getDefaultHttpService({
		retryStrategy: { maxRetries: 5 },
		requestHeaders: [{ name: "X-Custom-Header", value: "value" }],
	}),
});
```

## Safe vs. throwing queries

Every query offers two execution styles:

- **Safe** (`fetchSafe` / `fetchPageSafe` / `fetchAllPagesSafe` / `pagesSafe`): never throws; returns
  `{ success, response, error }` (`{ success, responses, error }` for `fetchAllPagesSafe`).
- **Throwing** (`fetch` / `fetchPage` / `fetchAllPages` / `pages`): returns the response directly and
  throws a `DeliverySdkError` on failure.

```typescript
import { isDeliverySdkError } from "@kontent-ai/delivery-sdk";

// Safe: handle the result object
const { success, response, error } = await client.listContentItems().fetchPageSafe();
if (success) {
	console.log(response.payload.items);
}

// Throwing: use try/catch
try {
	const response = await client.listContentItems().fetchPage();
	console.log(response.payload.items);
} catch (error) {
	if (isDeliverySdkError(error)) {
		console.error(error.details.reason);
	}
}
```

Use single-item queries with `fetch` / `fetchSafe`; paged queries (`listContentItems`, `listContentTypes`,
`listTaxonomies`, `listLanguages`, `itemsFeed`, `itemsReferencingAsset`, `itemsReferencingItem`) with
`fetchPage` / `fetchPageSafe` / `fetchAllPages` / `fetchAllPagesSafe` / `pages` / `pagesSafe`.

## Error handling

Failures are reported as a `DeliverySdkError`. With safe queries, inspect `error` on the result; with
throwing queries, catch it and check it with `isDeliverySdkError(error)`. Prefer the type guard over
`instanceof`, which fails when the error comes from a different copy of the package.

```typescript
const { success, error } = await client.fetchContentItem({ codename: "missing" }).fetchSafe();

if (!success) {
	console.error(error.message);
	console.error(error.details.reason); // "notFound"
}
```

`error.details.reason` tells you what went wrong, for example `notFound`, `unauthorized`,
`invalidResponse`, `schemaMismatch` (with [runtime validation](#runtime-validation)) or `aborted`.

## Request options

Every query accepts per-request options alongside its `query` and `filters`:

```typescript
const controller = new AbortController();

await client
	.listContentItems({
		headers: { "X-KC-Wait-For-Loading-New-Content": true },
		config: {
			customHeaders: [{ name: "X-Custom-Header", value: "value" }],
			abortSignal: controller.signal,
		},
	})
	.fetchPageSafe();
```

## Paging

```typescript
// One page
const { response } = await client.listContentItems({ query: { limit: 10, skip: 0 } }).fetchPageSafe();

console.log(response?.payload.items);

// All pages at once (optionally capped with `maxPagesCount`)
const { success, responses } = await client.listContentItems().fetchAllPagesSafe({ maxPagesCount: 5 });
if (success) {
	const allItems = responses.flatMap((r) => r.payload.items);
}

// Or iterate page-by-page
for await (const page of client.listContentItems().pages()) {
	console.log(page.payload.items.length);
}
```

The `itemsFeed`, `itemsReferencingAsset` and `itemsReferencingItem` queries page with a continuation
token instead of skip/limit. Pass it via the request headers and read the next token from
`response.meta.continuationToken`:

```typescript
const { response } = await client.itemsFeed({ headers: { "X-Continuation": "<token>" } }).fetchPageSafe();

console.log(response?.meta.continuationToken);
```

## Strong typing

Two type arguments to `createDeliveryClient` make the client strongly typed:

- `TSchema` (a `DeliveryClientSchema`) lists the codenames of your environment: languages, collections,
  taxonomies with their terms, workflows with their steps, and content types with their elements. Each element
  declares its `type`, multiple choice elements list their `options` and taxonomy elements name their `taxonomyGroup`.
- `TItem` is the union of your content item models, described with `ContentItemOf` and the `Elements` namespace.
  Content item responses (`items`, `item`, `modular_content`) are typed as this union.

We recommend generating both with [`@kontent-ai/model-generator`](https://github.com/kontent-ai/model-generator-js)
rather than writing them by hand.

```typescript
import { createDeliveryClient, type ContentItemOf, type DeliveryClientSchema, type Elements } from "@kontent-ai/delivery-sdk";

type MySchema = DeliveryClientSchema<{
	readonly languageCodenames: readonly ["en-US"];
	readonly collectionCodenames: readonly ["default"];
	readonly workflows: { readonly default: readonly ["draft", "published"] };
	readonly taxonomies: { readonly genre: readonly ["action", "comedy"] };
	readonly contentTypes: {
		readonly movie: {
			readonly title: { readonly type: "text" };
			readonly rating: { readonly type: "number" };
			readonly stars: { readonly type: "modular_content" };
			readonly genre: { readonly type: "taxonomy"; readonly taxonomyGroup: "genre" };
		};
		readonly actor: {
			readonly first_name: { readonly type: "text" };
		};
	};
}>;

type Actor = ContentItemOf<MySchema, "actor", { readonly first_name: Elements.Text }>;

type Movie = ContentItemOf<
	MySchema,
	"movie",
	{
		readonly title: Elements.Text;
		readonly rating: Elements.Number;
		readonly stars: Elements.LinkedItems<Actor>;
		readonly genre: Elements.Taxonomy<"action" | "comedy", "genre">;
	}
>;

type MyItem = Movie | Actor;

const client = createDeliveryClient<MySchema, MyItem>({ apiMode: "public", environmentId: "<id>" });
```

Codenames are checked at compile time. `ContentItemOf` also checks the element models against the schema: an unknown
element codename, a wrong element type (e.g. `Elements.Number` for a text element), an undeclared multiple choice option
or a term of another taxonomy is a compile error. Linked items are resolved onto each element's `items` array
(e.g. `movie.elements.stars.items` is `Actor[]`).

Other responses are narrowed too: `fetchTaxonomy` and `listTaxonomies` type term codenames per taxonomy,
`fetchContentType` keeps the codename of the requested type and keys `elements` by its element codenames,
`fetchContentTypeElement` narrows the element `type`, and `system.workflow_step` narrows once `system.workflow` is checked.

## Filters

Pass content filters to `listContentItems` and `itemsFeed` through the `filters` array. Each filter has a
`property` (`system.*` or `elements.*`), an `operator` and, for most operators, a `value`:

```typescript
const { response } = await client
	.listContentItems({
		filters: [
			{ property: "system.type", operator: "eq", value: "movie" },
			{ property: "elements.genre", operator: "contains", value: "action" },
			{ property: "elements.rating", operator: "range", value: [7, 10] },
			{ property: "system.collection", operator: "in", value: ["default"] },
			{ property: "elements.title", operator: "nempty" },
		],
	})
	.fetchPageSafe();
```

Operators that take a `value`: `eq` (or `=`), `neq` (or `!=`), `lt`, `lte`, `gt`, `gte`, `range`, `in`, `nin`
for single value properties, and `contains`, `any`, `all` for array properties (linked items, multiple choice,
taxonomy and custom elements storing a JSON array). Operators that take no `value`: `empty`, `nempty`, plus
`isEmptyRichText` and `isNotEmptyRichText` for rich text elements (the API does not support `empty` on rich text).

With a schema, filters are fully checked: `system.type` accepts content type codenames, `system.language`,
`system.collection`, `system.workflow` and `system.workflow_step` accept their codenames, number elements accept
numbers, multiple choice and taxonomy elements accept their option and term codenames with the array operators,
and asset elements accept only `empty` / `nempty`. To declare a filter array outside the query call, type it with
`ContentItemFilter`:

```typescript
import type { ContentItemFilter } from "@kontent-ai/delivery-sdk";

const filters: readonly ContentItemFilter<MySchema>[] = [
	{ property: "system.type", operator: "eq", value: "movie" },
	{ property: "elements.genre", operator: "contains", value: "action" },
];

await client.listContentItems({ filters }).fetchPageSafe();
```

A filter may also be a raw query string, e.g. `"system.type[eq]=movie"` or `"elements.title[empty]"`. Only the
property of a raw string filter is checked, so prefer filter objects.

Other list queries (`listContentTypes`, `listTaxonomies`, `listLanguages`) accept filters on system
properties only. Pass those inline.

## Narrowing items by content type

Use the `contentTypes` parameter of `listContentItems` and `itemsFeed` to get items of specific content types. It is
sent as a `system.type[in]` filter and narrows the returned items to the matching models:

```typescript
const { response } = await client.listContentItems({ contentTypes: ["movie"] }).fetchPageSafe();

const movies = response?.payload.items; // readonly Movie[]
```

When a response holds items of several types, narrow each item with `isContentItemOfType`. (TypeScript can't narrow
an item by the nested `item.system.type === "movie"` check, so use the guard instead.)

```typescript
import { isContentItemOfType } from "@kontent-ai/delivery-sdk";

const { response } = await client.listContentItems().fetchPageSafe();

for (const item of response?.payload.items ?? []) {
	if (isContentItemOfType(item, "movie")) {
		console.log(item.elements.title.value); // typed as string
		const stars = item.elements.stars.items; // resolved Actor[]
	}
}
```

The types are a compile-time contract: the SDK trusts that your schema and item models match your environment.
Regenerate them with `@kontent-ai/model-generator` whenever your content model changes.

## Runtime validation

Responses are not validated by default. To validate a response, pass a schema in the query's
`config.schema`. Any [Standard Schema](https://standardschema.dev) works, and the SDK's own Zod schemas
are exported from the `@kontent-ai/delivery-sdk/schemas` subpath:

```typescript
import { listContentItemsSchema, listContentItemsSchemaExtended, listLanguagesSchema } from "@kontent-ai/delivery-sdk/schemas";

const languages = await client.listLanguages({ config: { schema: listLanguagesSchema<MySchema>() } }).fetchPage();

// content-item queries return the extended payload, so they take the extended schema
const items = await client.listContentItems({ config: { schema: listContentItemsSchemaExtended<MySchema>() } }).fetchPage();

// raw() takes the schema of the raw API payload
const rawItems = await client.listContentItems().raw({ schema: listContentItemsSchema<MySchema>() }).fetchPage();
```

Zod is only loaded when you import the `schemas` subpath, so it is not part of your bundle unless you
validate with it. A failed validation returns a `schemaMismatch` error with the validation `issues`.

The schemas can also be used on their own, e.g. to parse stored JSON:

```typescript
const result = await listContentItemsSchema<MySchema>().safeParseAsync(storedJson);
```

## Resolved linked items & serialization

By default, content-item queries (`fetchContentItem`, `listContentItems`, `itemsFeed`) return an
**extended** response: every rich-text and linked-items (modular content) element is augmented with a
mapped `items` property holding the fully-resolved referenced items. This lets you traverse the content
tree directly instead of looking codenames up in `modular_content` yourself — `element.value` still holds
the referenced codenames, while `element.items` holds the resolved items.

```typescript
const { response } = await client.fetchContentItem({ codename: "my_movie" }).fetchSafe();
const item = response?.payload.item;

if (item && isMovie(item)) {
	const starCodenames = item.elements.stars.value; // codenames
	const stars = item.elements.stars.items; // resolved Actor[]
}
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
