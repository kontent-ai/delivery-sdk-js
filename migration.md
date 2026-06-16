# Migration Guide: v16 → v17

This guide covers the breaking changes when upgrading from `@kontent-ai/delivery-sdk` v16 to v17, with
side-by-side v16/v17 examples for every part of the API.

v17 is a ground-up rewrite. The biggest conceptual shifts:

- The fluent query builder (`.items().type().limitParameter()...toPromise()`) is replaced by **request
  objects** passed to renamed methods (`client.listContentItems({ query, filters })`).
- Queries no longer throw by default — they expose **safe** execution methods that return
  `{ success, response, error }` alongside throwing ones.
- Responses are the **raw API payload** (snake_case), wrapped as `{ payload, meta }`. Linked items are
  still resolved for you, but onto each element's `items` array rather than a separate `linkedItems` bag.
- Strong typing moves from the `ClientTypes` generic + `IContentItem` to a `DeliveryClientSchema` +
  `ContentItemOf`, and responses can be validated at runtime with Zod schemas.

## At a glance

| Concept | v16 | v17 |
|---|---|---|
| Create client | `createDeliveryClient({ environmentId, previewApiKey })` | `createDeliveryClient({ apiMode, environmentId, deliveryApiKey })` |
| List items | `client.items().type("movie").toPromise()` | `client.listContentItems({ filters: [...] }).fetchPageSafe()` |
| Single item | `client.item("x").toPromise()` | `client.fetchContentItem({ codename: "x" }).fetchSafe()` |
| Strong typing | `ClientTypes` generic + `IContentItem<{...Elements.*}>` | `DeliveryClientSchema` + `ContentItemOf<S,"type",{...ElementType.*}>` |
| Response data | `response.data.items` | `response.payload.items` |
| Linked items | `element.linkedItems` | `element.items` (resolved) |
| Errors | `try/catch` (`DeliveryError`) | `{ success, error }` (`DeliverySdkError`) |

---

## Installation

v17 requires Node.js ≥ 22 and has three peer dependencies that were previously bundled:
`@kontent-ai/core-sdk`, `zod`, and `ts-pattern`.

**npm** installs peer dependencies automatically:

```bash
npm install @kontent-ai/delivery-sdk
```

**pnpm** does not, so install them explicitly alongside the package:

```bash
pnpm add @kontent-ai/delivery-sdk @kontent-ai/core-sdk zod ts-pattern
```

---

## Client creation

API access mode is now an explicit `apiMode` discriminant instead of optional API-key fields.

**v16**
```typescript
import { createDeliveryClient } from "@kontent-ai/delivery-sdk";

const client = createDeliveryClient({
    environmentId: "<environment-id>",
    previewApiKey: "<preview-key>",   // preview mode
    // secureApiKey: "<secure-key>",  // OR secure mode
    defaultQueryConfig: { usePreviewMode: true },
});
```

**v17**
```typescript
import { createDeliveryClient } from "@kontent-ai/delivery-sdk";

// Public
const client = createDeliveryClient({ apiMode: "public", environmentId: "<environment-id>" });

// Preview
const client = createDeliveryClient({
    apiMode: "preview",
    environmentId: "<environment-id>",
    deliveryApiKey: "<preview-key>",
});

// Secure
const client = createDeliveryClient({
    apiMode: "secure",
    environmentId: "<environment-id>",
    deliveryApiKey: "<secure-key>",
});
```

`usePreviewMode`/`useSecuredMode` query config is gone — the mode is fixed when the client is created.

### Removed / relocated config options

| v16 property | v17 |
|---|---|
| `previewApiKey` / `secureApiKey` | Replaced by `apiMode` + `deliveryApiKey` |
| `defaultQueryConfig` (`usePreviewMode` / `useSecuredMode`) | Decided by `apiMode` at client creation |
| `elementResolver` | Removed — elements are returned as typed discriminated-union values, not remapped |
| `linkedItemsReferenceHandler` | Removed — linked items are resolved onto `element.items` (see [Linked items](#linked-items--rich-text)) |
| `proxy` / `basePreviewUrl` | Use `baseUrl` from the `@kontent-ai/core-sdk` config |
| `globalHeaders` | Pass headers per request (`config.customHeaders`) |
| `defaultLanguage` | Pass `query.language` per request |
| `retryStrategy` | Configured in `@kontent-ai/core-sdk` |
| `httpService` | Still supported (from `@kontent-ai/core-sdk`) |
| `assetsDomain` / `defaultRenditionPreset` | Removed |
| `excludeArchivedItems` | Removed |

---

## TypeScript schema (replaces the `ClientTypes` generic)

v16 narrowed codenames with a `ClientTypes` generic. v17 uses `DeliveryClientSchema<...>`, where content
types and taxonomies are **maps** (so elements/terms are tied to their parent).

**v16**
```typescript
import type { ClientTypes } from "@kontent-ai/delivery-sdk";

type MyClientTypes = ClientTypes & {
    languageCodenames: "en-US" | "cs-CZ";
    contentTypeCodenames: "article" | "movie";
    collectionCodenames: "default";
    workflowCodenames: "default";
    workflowStepCodenames: "published" | "draft";
    taxonomyCodenames: "genre";
    elementCodenames: "title" | "summary";
};

const client = createDeliveryClient<MyClientTypes>({ environmentId: "..." });
```

**v17**
```typescript
import { createDeliveryClient, type DeliveryClientSchema } from "@kontent-ai/delivery-sdk";

type MySchema = DeliveryClientSchema<{
    readonly languageCodenames: readonly ["en-US", "cs-CZ"];
    readonly collectionCodenames: readonly ["default"];
    readonly workflowCodenames: readonly ["default"];
    readonly workflowStepCodenames: readonly ["published", "draft"];
    readonly taxonomies: {
        readonly genre: readonly ["action", "comedy", "drama"];
    };
    readonly contentTypes: {
        readonly article: readonly ["title", "summary"];
        readonly movie: readonly ["title", "release_date"];
    };
}>;

const client = createDeliveryClient<MySchema>({ apiMode: "public", environmentId: "..." });
```

The schema is type-only — it narrows codenames at compile time and is not passed as a runtime value.

> **`taxonomyCodenames` → `taxonomies` map.** Each key is a taxonomy codename; its value lists that
> taxonomy's term codenames. This lets `fetchTaxonomy` narrow the returned term codenames to the queried
> taxonomy — `client.fetchTaxonomy({ codename: "genre" })` types `terms[].codename` as
> `"action" | "comedy" | "drama"` at every nesting level. The taxonomy codenames are derived from the map's
> keys, so no separate `taxonomyCodenames` field is needed.

> **`contentTypeCodenames` + `elementCodenames` → `contentTypes` map.** Each key is a content type
> codename; its value lists that type's element codenames. Single-type queries narrow elements to the
> queried type — `client.fetchContentTypeElement({ typeCodename: "article", elementCodename: "title" })`
> accepts only `article`'s elements, and `client.fetchContentType({ codename: "article" })` narrows its
> `elements` selection the same way. Cross-type queries (`listContentItems`, `itemsFeed`,
> `fetchContentItem`, `listContentTypes`) accept any element codename across all types.

> Generated schemas from `@kontent-ai/model-generator` emit this shape, so you normally won't hand-write it.

---

## Typed content models

v16 modeled an item with `IContentItem<{...}>` and the `Elements.*` wrapper types. v17 uses
`ContentItemOf<TSchema, TTypeCodename, TElements>` with the `ElementType.*` namespace. The element shape's
keys are validated against the type's element codenames in your schema.

**v16**
```typescript
import type { IContentItem, Elements } from "@kontent-ai/delivery-sdk";

type Actor = IContentItem<{
    readonly first_name: Elements.TextElement;
    readonly last_name: Elements.TextElement;
}>;

type Movie = IContentItem<{
    readonly title: Elements.TextElement;
    readonly plot: Elements.RichTextElement;
    readonly released: Elements.DateTimeElement;
    readonly length: Elements.NumberElement;
    readonly poster: Elements.AssetsElement;
    readonly category: Elements.MultipleChoiceElement;
    readonly stars: Elements.LinkedItemsElement<Actor>;
    readonly seoname: Elements.UrlSlugElement;
    readonly releasecategory: Elements.TaxonomyElement;
}>;
```

**v17**
```typescript
import type { ContentItemOf, ElementType } from "@kontent-ai/delivery-sdk";

type Actor = ContentItemOf<MySchema, "actor", {
    readonly first_name: ElementType.Text;
    readonly last_name: ElementType.Text;
}>;

type Movie = ContentItemOf<MySchema, "movie", {
    readonly title: ElementType.Text;
    readonly plot: ElementType.RichText<Actor>;
    readonly released: ElementType.DateTime;
    readonly length: ElementType.Number;
    readonly poster: ElementType.Asset;
    readonly category: ElementType.MultipleChoice<"action" | "drama">;
    readonly stars: ElementType.LinkedItems<Actor>;
    readonly seoname: ElementType.UrlSlug;
    readonly releasecategory: ElementType.Taxonomy<"action" | "comedy" | "drama">;
}>;
```

### Element type mapping

| v16 | v17 |
|---|---|
| `Elements.TextElement` | `ElementType.Text` |
| `Elements.NumberElement` | `ElementType.Number` |
| `Elements.RichTextElement` | `ElementType.RichText<TLinkedItem>` |
| `Elements.MultipleChoiceElement` | `ElementType.MultipleChoice<TOptionCodename>` |
| `Elements.DateTimeElement` | `ElementType.DateTime` |
| `Elements.AssetsElement` | `ElementType.Asset` |
| `Elements.TaxonomyElement` | `ElementType.Taxonomy<TTermCodename>` |
| `Elements.UrlSlugElement` | `ElementType.UrlSlug` |
| `Elements.CustomElement` | `ElementType.Custom` |
| `Elements.LinkedItemsElement<T>` | `ElementType.LinkedItems<T>` |

The generic arguments (`<Actor>`, `<"action" | "drama">`, …) are compile-time hints that power
autocomplete and narrowing; at runtime the value is whatever the API returns.

---

## Query methods

| v16 | v17 |
|---|---|
| `client.items()` | `client.listContentItems()` |
| `client.item(codename)` | `client.fetchContentItem({ codename })` |
| `client.itemsFeed()` | `client.itemsFeed()` |
| `client.types()` | `client.listContentTypes()` |
| `client.type(codename)` | `client.fetchContentType({ codename })` |
| `client.taxonomies()` | `client.listTaxonomies()` |
| `client.taxonomy(codename)` | `client.fetchTaxonomy({ codename })` |
| `client.languages()` | `client.listLanguages()` |
| `client.element(type, element)` | `client.fetchContentTypeElement({ typeCodename, elementCodename })` |
| `client.assetUsedIn(codename)` | `client.itemsReferencingAsset({ codename })` |
| `client.itemUsedIn(codename)` | `client.itemsReferencingItem({ codename })` |
| `client.mappingService` | Removed (see [Removed APIs](#removed-apis)) |
| `client.initializeSync()` / `client.syncChanges()` | Removed (see [Removed APIs](#removed-apis)) |

### Fluent builder → request object

v16 chained builder methods; v17 passes a single request object. Query parameters live under `query`,
content filtering under `filters`.

**v16**
```typescript
const response = await client
    .items<Movie>()
    .type("movie")
    .languageParameter("en-US")
    .depthParameter(2)
    .limitParameter(10)
    .skipParameter(20)
    .elementsParameter(["title", "plot"])
    .orderByAscending("system.name")
    .toPromise();

console.log(response.data.items);
```

**v17**
```typescript
const { response } = await client
    .listContentItems({
        query: {
            language: "en-US",
            depth: 2,
            limit: 10,
            skip: 20,
            elements: ["title", "plot"],
            order: "system.name[asc]",
        },
        filters: [{ property: "system.type", operator: "eq", value: "movie" }],
    })
    .fetchPageSafe();

console.log(response?.payload.items);
```

| v16 builder method | v17 |
|---|---|
| `.type(c)` / `.types([...])` | `filters: [{ property: "system.type", operator: "eq" / "in", value }]` |
| `.collection(c)` / `.collections([...])` | `filters: [{ property: "system.collection", operator: "eq" / "in", value }]` |
| `.languageParameter(c)` | `query.language` |
| `.depthParameter(n)` | `query.depth` |
| `.limitParameter(n)` / `.skipParameter(n)` | `query.limit` / `query.skip` |
| `.elementsParameter([...])` / `.excludeElementsParameter([...])` | `query.elements` / `query.excludeElements` |
| `.includeTotalCountParameter()` | `query.includeTotalCount: true` |
| `.orderByAscending(x)` / `.orderByDescending(x)` / `.orderParameter(x, dir)` | `query.order: "<x>[asc|desc]"` |

### Execution methods

| v16 | v17 | Behaviour |
|---|---|---|
| `.toPromise()` | `.fetchSafe()` (single) / `.fetchPageSafe()` (paged) | Returns `{ success, response, error }`, never throws |
| `.toPromise()` | `.fetch()` / `.fetchPage()` | Throws on error |
| `.toAllPromise()` | `.fetchAllPagesSafe()` | All pages, returns `{ success, responses, error }` |
| `.toAllPromise()` | `.fetchAllPages()` | All pages, throws on error |
| — | `.pages()` / `.pagesSafe()` | Async iterators over pages |

---

## Error handling

v16 queries threw `DeliveryError`. v17 prefers the safe variants, which return a result object with a
`DeliverySdkError` instead of throwing (the throwing `fetch()`/`fetchPage()` variants still exist).

**v16**
```typescript
import { DeliveryError } from "@kontent-ai/delivery-sdk";

try {
    const response = await client.item("invalid").toPromise();
    console.log(response.data.item);
} catch (error) {
    if (error instanceof DeliveryError) {
        console.error(error.message, error.errorCode);
    }
}
```

**v17**
```typescript
const { success, response, error } = await client.fetchContentItem({ codename: "invalid" }).fetchSafe();

if (!success) {
    console.error(error.message);
    console.error(error.details.reason); // e.g. "parsingFailed"
    return;
}

console.log(response.payload.item);
```

Every query exports a matching response type for annotating results:
`FetchContentItemResponse`, `ListContentItemsResponse`, `ItemsFeedResponse`, `FetchContentTypeResponse`,
`ListContentTypesResponse`, `FetchContentTypeElementResponse`, `FetchTaxonomyResponse`,
`ListTaxonomiesResponse`, `ListLanguagesResponse`, `ItemsReferencingAssetResponse`,
`ItemsReferencingItemResponse`.

> `modular_content` is a record keyed by codename whose values are `item | undefined` — index access can
> return `undefined`, so guard before use.

### System property names

System properties are now snake_case to match the raw API:

| v16 | v17 |
|---|---|
| `system.lastModified` | `system.last_modified` |
| `system.workflowStep` | `system.workflow_step` |
| `system.sitemapLocations` | `system.sitemap_locations` |
| `system.id` / `name` / `codename` / `type` / `language` / `collection` / `workflow` | unchanged |

---

## Linked items & rich text

This is the biggest behavioural change to be aware of. v16 resolved linked items into a separate
`linkedItems` bag and onto `element.linkedItems`. **v17 still resolves them for you** — but onto each
element's **`items`** array, directly on the default (resolved) response. Call `.raw()` on the query if you
want the unresolved payload instead.

**v16**
```typescript
const movie = response.data.item;
const stars = movie.elements.stars.linkedItems;        // resolved Actor[]
const plotItems = movie.elements.plot.linkedItems;     // items referenced from rich text
```

**v17**
```typescript
// Linked-items element: `.value` holds codenames, `.items` holds the resolved items
const stars = movie.elements.stars.items;              // resolved Actor[]
const starCodenames = movie.elements.stars.value;      // string[]

// Rich-text element: `.value` is the HTML string, `.modular_content` is codenames, `.items` is resolved
const plotHtml = movie.elements.plot.value;            // string (HTML)
const plotItems = movie.elements.plot.items;           // resolved items
const plotItemCodenames = movie.elements.plot.modular_content;

// Need the raw, unresolved payload? Use .raw()
const raw = await client.fetchContentItem({ codename: "warrior" }).raw().fetch();
```

> v17 does **not** ship a rich-text-to-HTML resolver or portable-text transformer. `element.value` is the
> raw HTML the API returns; resolve embedded components/links yourself from `modular_content` / `links`.

---

## Filters

v16 exposed filters as builder methods; v17 uses an explicit `filters` array.

**v16**
```typescript
const response = await client
    .items<Movie>()
    .equalsFilter("system.type", "movie")
    .allFilter("elements.genre", ["action", "drama"])
    .greaterThanOrEqualFilter("elements.release_date", "2020-01-01")
    .toPromise();
```

**v17**
```typescript
const { response } = await client
    .listContentItems({
        filters: [
            { property: "system.type", operator: "eq", value: "movie" },
            { property: "elements.genre", operator: "all", value: ["action", "drama"] },
            { property: "elements.release_date", operator: "gte", value: "2020-01-01" },
        ],
    })
    .fetchPageSafe();
```

Filters may also be raw query strings: `filters: ["system.type[eq]=movie", "elements.genre[all]=action,drama"]`.

| v16 method | v17 operator |
|---|---|
| `equalsFilter` | `"eq"` |
| `notEqualsFilter` | `"neq"` |
| `emptyFilter` | `"empty"` |
| `notEmptyFilter` | `"nempty"` |
| `greaterThanFilter` | `"gt"` |
| `greaterThanOrEqualFilter` | `"gte"` |
| `lessThanFilter` | `"lt"` |
| `lessThanOrEqualFilter` | `"lte"` |
| `rangeFilter` | `"range"` |
| `anyFilter` | `"any"` |
| `allFilter` | `"all"` |
| `containsFilter` | `"contains"` |
| `inFilter` | `"in"` |
| `notInFilter` | `"nin"` |

---

## Ordering

**v16**
```typescript
client.items().orderByAscending("system.name").toPromise();
client.items().orderByDescending("elements.release_date").toPromise();
client.items().orderParameter("elements.title", "desc").toPromise();
```

**v17**
```typescript
client.listContentItems({ query: { order: "system.name[asc]" } }).fetchPageSafe();
client.listContentItems({ query: { order: "elements.release_date[desc]" } }).fetchPageSafe();
```

---

## Paging

### URL paging (skip / limit)

**v16**
```typescript
const response = await client
    .items()
    .limitParameter(10)
    .skipParameter(20)
    .includeTotalCountParameter()
    .toPromise();

console.log(response.data.pagination.skip, response.data.pagination.totalCount);
```

**v17**
```typescript
const { response } = await client
    .listContentItems({ query: { limit: 10, skip: 20, includeTotalCount: true } })
    .fetchPageSafe();

console.log(response?.payload.pagination.skip, response?.payload.pagination.total_count);
```

### Continuation-token paging (items feed)

**v16**
```typescript
const response = await client
    .itemsFeed()
    .withContinuationToken("token-from-previous-response")
    .toPromise();
```

**v17**
```typescript
const { response } = await client
    .itemsFeed({ headers: { "X-Continuation": "token-from-previous-response" } })
    .fetchPageSafe();

console.log(response?.meta.continuationToken); // next token
```

### Fetching all pages

**v16**
```typescript
const response = await client.items().limitParameter(5).toAllPromise({ pages: 3 });
console.log(response.data.items);
```

**v17**
```typescript
const { success, responses } = await client.listContentItems({ query: { limit: 5 } }).fetchAllPagesSafe();
if (success) {
    const allItems = responses.flatMap((r) => r.payload.items);
}

// or iterate page-by-page
for await (const page of client.itemsFeed().pages()) {
    console.log(page.payload.items.length);
}
```

---

## Runtime validation (new in v17)

v17 can validate API responses against the Zod schemas the types are derived from, catching unexpected
payload shapes immediately. It is opt-in:

```typescript
const client = createDeliveryClient({
    apiMode: "public",
    environmentId: "...",
    runtimeValidation: { validateResponses: true },
});
```

When validation fails, the safe result carries a `parsingFailed` error reason with the underlying
`ZodError`:

```typescript
const { success, error } = await client.listLanguages().fetchPageSafe();

if (!success && error.details.reason === "parsingFailed") {
    console.error(error.details.zodError);
}
```

---

## Removed APIs

### `mappingService`

The `client.mappingService` property for remapping stored JSON responses is removed. Parse responses with
the exported Zod schemas directly. The schemas live on the dedicated `@kontent-ai/delivery-sdk/schemas`
subpath — a separate entry point that is **not** part of the main bundle, so it's only pulled in when you
import from it:

```typescript
import { listContentItemsSchema } from "@kontent-ai/delivery-sdk/schemas";

const result = await listContentItemsSchema<MySchema>().safeParseAsync(storedJson);
```

### `transformImageUrl`

The image-transformation builder is removed. Use the
[Kontent.ai Image Transformation API](https://kontent.ai/learn/docs/apis/image-transformation) URL
parameters directly, or a third-party image URL builder.

### `.getUrl()` / `.withUrl()`

Query URL inspection/override builder methods are removed. Inspect a query's request via `query.inspect()`,
set a custom host through the `baseUrl` config, and express ad-hoc query strings via raw-string `filters`.

### Sync API

`client.initializeSync()` and `client.syncChanges()` are removed. Use the dedicated
[`@kontent-ai/sync-sdk`](https://github.com/kontent-ai/sync-sdk-js) package, which provides type-safe
synchronization with the Kontent.ai Sync API v2:

```bash
npm install @kontent-ai/sync-sdk
```
