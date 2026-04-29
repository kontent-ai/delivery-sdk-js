# Migration Guide: v16 → v17

This guide covers all breaking changes when upgrading from `@kontent-ai/delivery-sdk` v16 to v17.

---

## Installation

v17 requires Node.js ≥ 22 and three peer dependencies that were previously bundled:

```bash
npm install @kontent-ai/delivery-sdk @kontent-ai/core-sdk zod ts-pattern
```

---

## Client creation

The config object has been redesigned. API access mode is now an explicit `apiMode` discriminant instead of optional API key fields, and several options have been removed.

**v16**
```typescript
import { createDeliveryClient } from "@kontent-ai/delivery-sdk";

const client = createDeliveryClient({
    environmentId: "your-environment-id",
    previewApiKey: "your-preview-key",   // preview mode
    // secureApiKey: "your-secure-key",  // OR secure mode
});
```

**v17**
```typescript
import { createDeliveryClient } from "@kontent-ai/delivery-sdk";

// Public
const client = createDeliveryClient({
    apiMode: "public",
    environmentId: "your-environment-id",
});

// Preview
const client = createDeliveryClient({
    apiMode: "preview",
    environmentId: "your-environment-id",
    deliveryApiKey: "your-preview-key",
});

// Secure
const client = createDeliveryClient({
    apiMode: "secure",
    environmentId: "your-environment-id",
    deliveryApiKey: "your-secure-key",
});
```

### Removed config options

The following v16 config properties have no v17 equivalent and should be removed:

| Removed property | Notes |
|---|---|
| `previewApiKey` / `secureApiKey` | Replaced by `apiMode` + `deliveryApiKey` |
| `elementResolver` | Elements are no longer auto-mapped |
| `linkedItemsReferenceHandler` | `modular_content` is now a plain record |
| `proxy` / `basePreviewUrl` | Use `baseUrl` from `@kontent-ai/core-sdk` config |
| `globalHeaders` | Pass headers per-request via `config.customHeaders` |
| `defaultLanguage` | Pass `query.language` per-request |
| `defaultQueryConfig` | No equivalent |
| `retryStrategy` | Configured in `@kontent-ai/core-sdk` |
| `assetsDomain` / `defaultRenditionPreset` | No equivalent |
| `excludeArchivedItems` | No equivalent |

---

## TypeScript schema (replaces `ClientTypes` generic)

v16 used a generic type parameter to narrow codenames. v17 passes a `schema` object in the config instead.

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
    readonly contentTypeCodenames: readonly ["article", "movie"];
    readonly collectionCodenames: readonly ["default"];
    readonly workflowCodenames: readonly ["default"];
    readonly workflowStepCodenames: readonly ["published", "draft"];
    readonly taxonomyCodenames: readonly ["genre"];
    readonly elementCodenames: readonly ["title", "summary"];
}>;

const client = createDeliveryClient({
    apiMode: "public",
    environmentId: "...",
    schema: {
        languageCodenames: ["en-US", "cs-CZ"],
        contentTypeCodenames: ["article", "movie"],
        collectionCodenames: ["default"],
        workflowCodenames: ["default"],
        workflowStepCodenames: ["published", "draft"],
        taxonomyCodenames: ["genre"],
        elementCodenames: ["title", "summary"],
    },
});
```

---

## Query API

### Method names

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

### Method chaining → request objects

v16 built queries with a fluent builder. v17 passes a single request object when constructing the query.

**v16**
```typescript
const response = await client
    .items()
    .type("movie")
    .languageParameter("en-US")
    .limitParameter(10)
    .skipParameter(20)
    .orderByAscending("system.name")
    .toPromise();

console.log(response.items);
```

**v17**
```typescript
const { response } = await client
    .listContentItems({
        query: {
            language: "en-US",
            limit: 10,
            skip: 20,
            order: "system.name[asc]",
        },
        filters: [{ property: "system.type", operator: "eq", value: "movie" }],
    })
    .fetchPageSafe();

console.log(response?.payload.items);
```

### Execution methods

| v16 | v17 | Behaviour |
|---|---|---|
| `.toPromise()` | `.fetchSafe()` (fetch query) or `.fetchPageSafe()` (paged query) | Returns `{ success, response, error }`, never throws |
| `.toPromise()` | `.fetch()` / `.fetchPage()` | Throws on error |
| `.toAllPromise()` | `.fetchAllPagesSafe()` | Fetches all pages, returns `{ success, responses, error }` |
| `.toAllPromise()` | `.fetchAllPages()` | Throws on error |

---

## Error handling

v16 queries always throw. v17 provides safe variants that return a result object instead.

**v16**
```typescript
try {
    const response = await client.items().toPromise();
    console.log(response.items);
} catch (error) {
    console.error(error); // DeliveryError
}
```

**v17**
```typescript
const { success, response, error } = await client.listContentItems().fetchPageSafe();

if (!success) {
    console.error(error.details.reason); // DeliverySdkError
    return;
}

console.log(response.payload.items);
```

---

## Response shape

v16 resolved linked items automatically and exposed them alongside the main payload. v17 returns the raw API payload — `modular_content` is a plain record keyed by codename.

**v16**
```typescript
const response = await client.items().toPromise();

for (const item of response.items) {
    console.log(item.system.name);
    console.log(item.elements.title.value);
}

// Automatically resolved linked items
for (const linked of response.linkedItems) { ... }
```

**v17**
```typescript
const { response } = await client.listContentItems().fetchPageSafe();
const { items, modular_content, pagination } = response!.payload;

for (const item of items) {
    console.log(item.system.name);

    const title = item.elements?.["title"];
    if (title?.type === "text") {
        console.log(title.value);
    }
}

// Linked items are a plain record — resolve manually
const linked = modular_content["some_codename"];
```

### Fetch single item

**v16**
```typescript
const response = await client.item("my_article").toPromise();
console.log(response.item.elements.title.value);
```

**v17**
```typescript
const { response } = await client.fetchContentItem({ codename: "my_article" }).fetchSafe();
const item = response?.payload.item;

if (item?.elements?.["title"]?.type === "text") {
    console.log(item.elements["title"].value);
}
```

---

## System property names

Several system properties are now snake_case to match the raw API:

| v16 | v17 |
|---|---|
| `system.lastModified` | `system.last_modified` |
| `system.workflowStep` | `system.workflow_step` |
| `system.sitemapLocations` | `system.sitemap_locations` |
| `system.id` | `system.id` (unchanged) |
| `system.name` | `system.name` (unchanged) |
| `system.codename` | `system.codename` (unchanged) |
| `system.type` | `system.type` (unchanged) |
| `system.language` | `system.language` (unchanged) |
| `system.collection` | `system.collection` (unchanged) |
| `system.workflow` | `system.workflow` (unchanged) |

---

## Filters

v16 exposed filters as builder methods. v17 uses an explicit `filters` array on the request object.

**v16**
```typescript
const response = await client
    .items()
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

Filters can also be passed as raw query strings:
```typescript
filters: ["system.type[eq]=movie", "elements.genre[all]=action,drama"]
```

### Filter operator mapping

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
```

**v17**
```typescript
// System property
client.listContentItems({ query: { order: "system.name[asc]" } }).fetchPageSafe();

// Element property
client.listContentItems({ query: { order: "elements.release_date[desc]" } }).fetchPageSafe();
```

---

## Paging

### URL-based paging (skip/limit)

**v16**
```typescript
const response = await client
    .items()
    .limitParameter(10)
    .skipParameter(20)
    .includeTotalCountParameter()
    .toPromise();

console.log(response.pagination.skip);
console.log(response.pagination.total_count);
```

**v17**
```typescript
const { response } = await client
    .listContentItems({
        query: { limit: 10, skip: 20 },
    })
    .fetchPageSafe();

console.log(response?.payload.pagination.skip);
```

### Continuation token paging (items feed)

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
    .itemsFeed({
        headers: { "X-Continuation": "token-from-previous-response" },
    })
    .fetchPageSafe();

// The next token is available on the page response meta
console.log(response?.meta.continuationToken);
```

### Fetching all pages

**v16**
```typescript
const response = await client
    .items()
    .toAllPromise({
        responseFetched: (res, nextUrl, token) => {
            console.log(`Fetched page, next: ${nextUrl}`);
        },
    });

console.log(response.responses.flatMap((r) => r.data.items));
```

**v17**
```typescript
const { success, responses, nextContinuationToken } = await client
    .itemsFeed()
    .fetchAllPagesSafe();

if (success) {
    const allItems = responses.flatMap((r) => r.payload.items);
    // Resume later using nextContinuationToken
}
```

---

## Content item elements

v16 automatically mapped elements to typed wrappers (`Elements.TextElement`, etc.). v17 returns raw discriminated-union values — check `element.type` before accessing `element.value`.

**v16**
```typescript
import type { Elements } from "@kontent-ai/delivery-sdk";

interface ArticleElements {
    title: Elements.TextElement;
    body: Elements.RichTextElement;
    thumbnail: Elements.AssetsElement;
    tags: Elements.TaxonomyElement<"tag_1" | "tag_2", "tags">;
}

const article = response.item as IContentItem<ArticleElements>;

console.log(article.elements.title.value);
console.log(article.elements.body.linkedItems); // auto-resolved
console.log(article.elements.thumbnail.value[0].url);
console.log(article.elements.tags.value.map((t) => t.codename));
```

**v17**
```typescript
const item = response?.payload.item;
const elements = item?.elements ?? {};

const title = elements["title"];
if (title?.type === "text") console.log(title.value);

const body = elements["body"];
if (body?.type === "rich_text") {
    console.log(body.value);             // HTML string
    console.log(body.modular_content);   // string[] of linked item codenames
    // Resolve from modular_content record manually
}

const thumbnail = elements["thumbnail"];
if (thumbnail?.type === "asset") {
    console.log(thumbnail.value[0]?.url);
}

const tags = elements["tags"];
if (tags?.type === "taxonomy") {
    console.log(tags.value.map((t) => t.codename));
}
```

---

## Runtime validation (new in v17)

v17 can validate API responses against Zod schemas at runtime, catching unexpected payload shapes immediately.

```typescript
const client = createDeliveryClient({
    apiMode: "public",
    environmentId: "...",
    responseValidation: { enable: true },
});
```

When enabled, a failed validation returns a `validationFailed` error reason with the underlying `ZodError`:

```typescript
const { success, error } = await client.listLanguages().fetchPageSafe();

if (!success && error?.details.reason === "validationFailed") {
    console.error(error.details.zodError);
}
```

---

## Removed APIs

### `mappingService`

The `client.mappingService` property for remapping stored JSON responses has been removed. Parse responses using the exported Zod schemas directly:

```typescript
import { listContentItemsSchema } from "@kontent-ai/delivery-sdk";

const result = await listContentItemsSchema(schema).safeParseAsync(storedJson);
```

### `transformImageUrl`

The image transformation builder has been removed. Use the [Kontent.ai Image Transformation API](https://kontent.ai/learn/docs/apis/image-transformation) URL parameters directly or a third-party image URL builder.

### Sync API

`client.initializeSync()` and `client.syncChanges()` have been removed. Use the [Sync API](https://kontent.ai/learn/docs/apis/sync-api) directly via the REST API or a dedicated SDK.
