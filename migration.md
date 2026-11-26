# Migration Guide: v16 → v17

This guide covers the breaking changes when upgrading from `@kontent-ai/delivery-sdk` v16 to v17, with
side-by-side v16/v17 examples for every part of the API.

v17 is a ground-up rewrite. The biggest conceptual shifts:

- The fluent query builder (`.items().type().limitParameter()...toPromise()`) is replaced by **request
  objects** passed to renamed methods (`client.listContentItems({ query, filters })`).
- Queries no longer throw by default: they expose **safe** execution methods that return
  `{ success, response, error }` alongside throwing ones.
- Responses are the **raw API payload** (snake_case), wrapped as `{ payload, meta }`. Linked items are
  still resolved for you, but onto each element's `items` array rather than a separate `linkedItems` bag.
- Strong typing moves from the `ClientTypes` generic + `IContentItem` to a `DeliveryClientSchema` +
  `ContentItemOf`, and responses can be validated at runtime with Zod schemas.

## At a glance

| Concept       | v16                                                      | v17                                                                |
| ------------- | -------------------------------------------------------- | ------------------------------------------------------------------ |
| Create client | `createDeliveryClient({ environmentId, previewApiKey })` | `createDeliveryClient({ apiMode, environmentId, deliveryApiKey })` |
| List items    | `client.items().type("movie").toPromise()`               | `client.listContentItems({ filters: [...] }).fetchPageSafe()`      |
| Single item   | `client.item("x").toPromise()`                           | `client.fetchContentItem({ codename: "x" }).fetchSafe()`           |
| Strong typing | `ClientTypes` generic + `IContentItem<{...Elements.*}>`  | `DeliveryClientSchema` + `ContentItemOf<S,"type",{...Elements.*}>` |
| Response data | `response.data.items`                                    | `response.payload.items`                                           |
| Linked items  | `element.linkedItems`                                    | `element.items` (resolved)                                         |
| Errors        | `try/catch` (`DeliveryError`)                            | `{ success, error }` (`DeliverySdkError`)                          |

---

## Installation

v17 requires Node.js ≥ 24. Install as before:

```bash
npm install @kontent-ai/delivery-sdk
```

---

## Client creation

API access mode is now an explicit `apiMode` discriminant instead of optional API-key fields.

**v16**

```typescript
import { createDeliveryClient } from "@kontent-ai/delivery-sdk";

const client = createDeliveryClient({
	environmentId: "<environment-id>",
	previewApiKey: "<preview-key>", // preview mode
	// secureApiKey: "<secure-key>",  // OR secure mode
	defaultQueryConfig: { usePreviewMode: true },
});
```

**v17**

```typescript
import { createDeliveryClient } from "@kontent-ai/delivery-sdk";

// Public
const publicClient = createDeliveryClient({ apiMode: "public", environmentId: "<environment-id>" });

// Preview
const previewClient = createDeliveryClient({
	apiMode: "preview",
	environmentId: "<environment-id>",
	deliveryApiKey: "<preview-key>",
});

// Secure
const secureClient = createDeliveryClient({
	apiMode: "secure",
	environmentId: "<environment-id>",
	deliveryApiKey: "<secure-key>",
});
```

`usePreviewMode`/`useSecuredMode` query config is gone; the mode is fixed when the client is created.

### Removed / relocated config options

| v16 property                                               | v17                                                                                                    |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `previewApiKey` / `secureApiKey`                           | Replaced by `apiMode` + `deliveryApiKey`                                                               |
| `defaultQueryConfig` (`usePreviewMode` / `useSecuredMode`) | Decided by `apiMode` at client creation                                                                |
| `elementResolver`                                          | Removed: elements are returned as typed discriminated-union values, not remapped                       |
| `linkedItemsReferenceHandler`                              | Removed: linked items are resolved onto `element.items` (see [Linked items](#linked-items--rich-text)) |
| `proxy` / `basePreviewUrl`                                 | `baseUrl: { protocol, host }`; for a proxy, omit `apiMode` (custom mode, `deliveryApiKey` optional)    |
| `globalHeaders`                                            | `httpService: getDefaultHttpService({ requestHeaders })`, or per request via `config.customHeaders`    |
| `defaultLanguage`                                          | Pass `query.language` per request                                                                      |
| `retryStrategy`                                            | `httpService: getDefaultHttpService({ retryStrategy })`                                                |
| `httpService`                                              | Still supported (`HttpService` from `@kontent-ai/core-sdk`)                                            |
| `defaultQueryConfig.waitForLoadingNewContent`              | Per request: `headers: { "X-KC-Wait-For-Loading-New-Content": true }`                                  |
| `assetsDomain` / `defaultRenditionPreset`                  | Removed                                                                                                |
| `excludeArchivedItems`                                     | Removed                                                                                                |

```typescript
import { getDefaultHttpService } from "@kontent-ai/core-sdk";

// Proxy / custom host
const proxiedClient = createDeliveryClient({
	environmentId: "<environment-id>",
	baseUrl: { protocol: "https", host: "delivery-proxy.example.com" },
});

// Retry strategy and global headers
const retryingClient = createDeliveryClient({
	apiMode: "public",
	environmentId: "<environment-id>",
	httpService: getDefaultHttpService({
		retryStrategy: { maxRetries: 5 },
		requestHeaders: [{ name: "X-Custom-Header", value: "value" }],
	}),
});
```

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
	readonly workflows: {
		readonly default: readonly ["draft", "published"];
	};
	readonly taxonomies: {
		readonly genre: readonly ["action", "comedy", "drama"];
	};
	readonly contentTypes: {
		readonly article: {
			readonly title: { readonly type: "text" };
			readonly summary: { readonly type: "rich_text" };
		};
		readonly movie: {
			readonly title: { readonly type: "text" };
			readonly plot: { readonly type: "rich_text" };
			readonly released: { readonly type: "date_time" };
			readonly length: { readonly type: "number" };
			readonly poster: { readonly type: "asset" };
			readonly category: { readonly type: "multiple_choice"; readonly options: readonly ["action", "drama"] };
			readonly stars: { readonly type: "modular_content"; readonly allowedContentTypes: readonly ["actor"] };
			readonly seoname: { readonly type: "url_slug" };
			readonly releasecategory: { readonly type: "taxonomy"; readonly taxonomyGroup: "genre" };
		};
		readonly actor: {
			readonly first_name: { readonly type: "text" };
			readonly last_name: { readonly type: "text" };
		};
	};
}>;

const client = createDeliveryClient<MySchema, Movie | Actor>({ apiMode: "public", environmentId: "..." });
```

The schema and the item union are type-only: they narrow codenames and responses at compile time and are not
passed as runtime values.

> **`taxonomyCodenames` → `taxonomies` map.** Each key is a taxonomy codename; its value lists that
> taxonomy's term codenames. `client.fetchTaxonomy({ codename: "genre" })` types `terms[].codename` as
> `"action" | "comedy" | "drama"` at every nesting level, and `listTaxonomies` returns a union of taxonomies,
> each with its own terms.

> **`contentTypeCodenames` + `elementCodenames` → `contentTypes` map.** Each key is a content type
> codename; its value maps the type's element codenames to their element `type` (as returned by the Delivery API).
> Multiple choice elements list their `options`, taxonomy elements name their `taxonomyGroup`, and linked items and
> rich text elements may list their `allowedContentTypes`. This lets the SDK check your item models (including the
> types of resolved linked items), type filter values per element, and narrow `fetchContentType` /
> `fetchContentTypeElement` responses. Cross-type queries (`listContentItems`, `itemsFeed`, `fetchContentItem`,
> `listContentTypes`) accept any element codename across all types. On `listContentItems` and `itemsFeed`,
> `ofContentTypes` scopes `filters`, `order`, `elements` and `excludeElements` to the elements of the selected types.
> `elements` / `excludeElements` also narrow the returned items (and resolved linked items) to the selected elements.

> **`workflowCodenames` + `workflowStepCodenames` → `workflows` map.** Each key is a workflow codename; its value
> lists that workflow's step codenames, so `system.workflow_step` narrows once `system.workflow` is checked.

> **Snippets (optional `snippets` map).** Each key is a content type snippet codename; its value maps the snippet's
> element codenames (as they appear on items, `<snippet>__<element>`) to their element definitions.

> **Item union (second type argument).** Pass the union of your item models as the second type argument. Content
> item responses (`items`, `item`, `modular_content`) are typed as this union, replacing v16's `items<Movie>()`.

> Generated schemas from [`@kontent-ai/model-generator`](https://github.com/kontent-ai/model-generator-js) emit this shape, so you normally won't hand-write it.

---

## Typed content models

v16 modeled an item with `IContentItem<{...}>` and the `Elements.*` wrapper types. v17 uses
`ContentItemOf<TSchema, TTypeCodename, TElements>` with the `Elements.*` namespace. The element shape is
validated against your schema: keys must be element codenames of the type, element models must match the element
`type`, and multiple choice options and taxonomy terms must be declared in the schema.

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
import type { ContentItemOf, Elements } from "@kontent-ai/delivery-sdk";

type Actor = ContentItemOf<
	MySchema,
	"actor",
	{
		readonly first_name: Elements.Text;
		readonly last_name: Elements.Text;
	}
>;

type Movie = ContentItemOf<
	MySchema,
	"movie",
	{
		readonly title: Elements.Text;
		readonly plot: Elements.RichText<Actor>;
		readonly released: Elements.DateTime;
		readonly length: Elements.Number;
		readonly poster: Elements.Asset;
		readonly category: Elements.MultipleChoice<"action" | "drama">;
		readonly stars: Elements.LinkedItems<Actor>;
		readonly seoname: Elements.UrlSlug;
		readonly releasecategory: Elements.Taxonomy<"action" | "comedy" | "drama", "genre">;
	}
>;
```

### Element type mapping

| v16                              | v17                                         |
| -------------------------------- | ------------------------------------------- |
| `Elements.TextElement`           | `Elements.Text`                             |
| `Elements.NumberElement`         | `Elements.Number`                           |
| `Elements.RichTextElement`       | `Elements.RichText<TLinkedItem, TLinkType>` |
| `Elements.MultipleChoiceElement` | `Elements.MultipleChoice<TOptionCodename>`  |
| `Elements.DateTimeElement`       | `Elements.DateTime`                         |
| `Elements.AssetsElement`         | `Elements.Asset`                            |
| `Elements.TaxonomyElement`       | `Elements.Taxonomy<TTermCodename, TGroup>`  |
| `Elements.UrlSlugElement`        | `Elements.UrlSlug`                          |
| `Elements.CustomElement`         | `Elements.Custom`                           |
| `Elements.LinkedItemsElement<T>` | `Elements.LinkedItems<T>`                   |

The generic arguments (`<Actor>`, `<"action" | "drama">`, …) are compile-time hints that power
autocomplete and narrowing; at runtime the value is whatever the API returns.

---

## Query methods

| v16                                                | v17                                                                 |
| -------------------------------------------------- | ------------------------------------------------------------------- |
| `client.items()`                                   | `client.listContentItems()`                                         |
| `client.item(codename)`                            | `client.fetchContentItem({ codename })`                             |
| `client.itemsFeed()`                               | `client.itemsFeed()`                                                |
| `client.types()`                                   | `client.listContentTypes()`                                         |
| `client.type(codename)`                            | `client.fetchContentType({ codename })`                             |
| `client.taxonomies()`                              | `client.listTaxonomies()`                                           |
| `client.taxonomy(codename)`                        | `client.fetchTaxonomy({ codename })`                                |
| `client.languages()`                               | `client.listLanguages()`                                            |
| `client.element(type, element)`                    | `client.fetchContentTypeElement({ typeCodename, elementCodename })` |
| `client.assetUsedIn(codename)`                     | `client.itemsReferencingAsset({ codename })`                        |
| `client.itemUsedIn(codename)`                      | `client.itemsReferencingItem({ codename })`                         |
| `client.mappingService`                            | Removed (see [Removed APIs](#removed-apis))                         |
| `client.initializeSync()` / `client.syncChanges()` | Removed (see [Removed APIs](#removed-apis))                         |

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

| v16 builder method                                                           | v17                                                                                                        |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `.type(c)` / `.types([...])`                                                 | `filters: [{ property: "system.type", operator: "eq" / "in", value }]`                                     |
| `.collection(c)` / `.collections([...])`                                     | `filters: [{ property: "system.collection", operator: "eq" / "in", value }]`                               |
| `.languageParameter(c)`                                                      | `query.language`                                                                                           |
| `.depthParameter(n)`                                                         | `query.depth`                                                                                              |
| `.limitParameter(n)` / `.skipParameter(n)`                                   | `query.limit` / `query.skip`                                                                               |
| `.elementsParameter([...])` / `.excludeElementsParameter([...])`             | `query.elements` / `query.excludeElements` (also narrow the item types)                                    |
| `.includeTotalCountParameter()`                                              | `query.includeTotalCount: true`                                                                            |
| `.orderByAscending(x)` / `.orderByDescending(x)` / `.orderParameter(x, dir)` | `query.order: "<x>[asc]"` / `query.order: "<x>[desc]"`                                                     |
| `.withHeaders([...])`                                                        | `config: { customHeaders: [...] }`                                                                         |
| `.queryConfig({ waitForLoadingNewContent: true })`                           | `headers: { "X-KC-Wait-For-Loading-New-Content": true }`                                                   |
| `.withParameter()` / `.withCustomParameter()`                                | No generic equivalent: use `query`, or a raw-string filter (`"system.*[op]=..."` / `"elements.*[op]=..."`) |

### Execution methods

| v16               | v17                                                  | Behaviour                                            |
| ----------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| `.toPromise()`    | `.fetchSafe()` (single) / `.fetchPageSafe()` (paged) | Returns `{ success, response, error }`, never throws |
| `.toPromise()`    | `.fetch()` / `.fetchPage()`                          | Throws on error                                      |
| `.toAllPromise()` | `.fetchAllPagesSafe()`                               | All pages, returns `{ success, responses, error }`   |
| `.toAllPromise()` | `.fetchAllPages()`                                   | All pages, throws on error                           |
| (none)            | `.pages()` / `.pagesSafe()`                          | Async iterators over pages                           |

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
import { isDeliverySdkError } from "@kontent-ai/delivery-sdk";

// Safe
const { success, response, error } = await client.fetchContentItem({ codename: "invalid" }).fetchSafe();

if (success) {
	console.log(response.payload.item);
} else {
	console.error(error.message);
	console.error(error.details.reason); // "notFound"
}

// Throwing
try {
	const thrownResponse = await client.fetchContentItem({ codename: "invalid" }).fetch();
	console.log(thrownResponse.payload.item);
} catch (thrownError) {
	if (isDeliverySdkError(thrownError)) {
		console.error(thrownError.message, thrownError.details.reason);
	}
}
```

`error.details.reason` replaces v16's `errorCode`; common values are `notFound`, `unauthorized`,
`invalidResponse`, `schemaMismatch` and `aborted`.

Every query exports a matching response type for annotating results:
`FetchContentItemResponse`, `ListContentItemsResponse`, `ItemsFeedResponse`, `FetchContentTypeResponse`,
`ListContentTypesResponse`, `FetchContentTypeElementResponse`, `FetchTaxonomyResponse`,
`ListTaxonomiesResponse`, `ListLanguagesResponse`, `ItemsReferencingAssetResponse`,
`ItemsReferencingItemResponse`.

> `modular_content` is a record keyed by codename whose values are `item | undefined`: index access can
> return `undefined`, so guard before use.

### System property names

System properties are now snake_case to match the raw API:

| v16                                                                                 | v17                        |
| ----------------------------------------------------------------------------------- | -------------------------- |
| `system.lastModified`                                                               | `system.last_modified`     |
| `system.workflowStep`                                                               | `system.workflow_step`     |
| `system.sitemapLocations`                                                           | `system.sitemap_locations` |
| `system.id` / `name` / `codename` / `type` / `language` / `collection` / `workflow` | unchanged                  |

---

## Linked items & rich text

This is the biggest behavioural change to be aware of. v16 resolved linked items into a separate
`linkedItems` bag and onto `element.linkedItems`. **v17 still resolves them for you**, but onto each
element's **`items`** array, directly on the default (resolved) response. Call `.raw()` on the query if you
want the unresolved payload instead.

**v16**

```typescript
const movie = response.data.item;
const stars = movie.elements.stars.linkedItems; // resolved Actor[]
const plotItems = movie.elements.plot.linkedItems; // items referenced from rich text
```

**v17**

```typescript
// Linked-items element: `.value` holds codenames, `.items` holds the resolved items
const stars = movie.elements.stars.items; // resolved Actor[]
const starCodenames = movie.elements.stars.value; // string[]

// Rich-text element: `.value` is the HTML string, `.modular_content` is codenames, `.items` is resolved
const plotHtml = movie.elements.plot.value; // string (HTML)
const plotItems = movie.elements.plot.items; // resolved items
const plotItemCodenames = movie.elements.plot.modular_content;

// Need the raw, unresolved payload? Use .raw()
const raw = await client.fetchContentItem({ codename: "warrior" }).raw().fetch();
```

> v17 does **not** ship a rich-text-to-HTML resolver or portable-text transformer. `element.value` is the
> raw HTML the API returns; resolve embedded components/links yourself from `modular_content` / `links`, or use
> [`@kontent-ai/rich-text-resolver`](https://github.com/kontent-ai/rich-text-resolver-js).

---

## Content item type guards

v16 cast responses with `items<Movie>()`. In v17, responses are typed as the item union passed to
`createDeliveryClient`. Narrow them by content type in one of two ways:

```typescript
import { isContentItemOfType } from "@kontent-ai/delivery-sdk";

// 1. Ask only for the types you need: items are typed as Movie[]
const { response: movies } = await client.listContentItems({ ofContentTypes: ["movie"] }).fetchPageSafe();

// 2. Narrow items of mixed types with a guard
const { response } = await client.listContentItems().fetchPageSafe();

for (const item of response?.payload.items ?? []) {
	if (isContentItemOfType(item, "movie")) {
		const title: string = item.elements.title.value;
		const stars = item.elements.stars.items; // resolved Actor[]
	} else if (isContentItemOfType(item, "actor")) {
		const name: string = item.elements.first_name.value;
	}
}
```

> TypeScript can't narrow an item by the nested `item.system.type === "movie"` check, so use `isContentItemOfType`.

The per-type guards generated by older model generator versions (`isMovieType`, later `isMovieItem`) are no longer
generated: use `isContentItemOfType(item, "movie")`. Snippet guards (`isSeoSnippet`) are replaced by
`isContentItemWithSnippet(item, "seo")`, which narrows to the item models that use the snippet. It recognizes
snippet elements by their `<snippet>__<element>` codenames, so it returns `false` when `elements` /
`excludeElements` removed every snippet element from the response.

---

## Filters

v16 exposed filters as builder methods; v17 uses an explicit `filters` array.

**v16**

```typescript
const response = await client
	.items<Movie>()
	.equalsFilter("system.type", "movie")
	.allFilter("elements.genre", ["action", "drama"])
	.greaterThanOrEqualFilter("elements.released", "2020-01-01")
	.toPromise();
```

**v17**

```typescript
const { response } = await client
	.listContentItems({
		filters: [
			{ property: "system.type", operator: "eq", value: "movie" },
			{ property: "elements.category", operator: "all", value: ["action", "drama"] },
			{ property: "elements.released", operator: "gte", value: "2020-01-01" },
		],
	})
	.fetchPageSafe();
```

With a schema, values and operators are checked per property: `system.type` accepts content type codenames, number
elements accept numbers, multiple choice and taxonomy elements accept their codenames with the array operators
(`contains`, `any`, `all`), and so on. With `ofContentTypes`, filters accept only the elements of the selected types
(see [Narrowing items by content type](./README.md#narrowing-items-by-content-type) in the README).

Filters may also be raw query strings: `filters: ["system.type[eq]=movie", "elements.category[all]=action,drama"]`.
Only the property of a raw string filter is checked.

| v16 method                 | v17 operator            |
| -------------------------- | ----------------------- |
| `equalsFilter`             | `"eq"`                  |
| `notEqualsFilter`          | `"neq"`                 |
| `emptyFilter`              | `"empty"` (no `value`)  |
| `notEmptyFilter`           | `"nempty"` (no `value`) |
| `greaterThanFilter`        | `"gt"`                  |
| `greaterThanOrEqualFilter` | `"gte"`                 |
| `lessThanFilter`           | `"lt"`                  |
| `lessThanOrEqualFilter`    | `"lte"`                 |
| `rangeFilter`              | `"range"`               |
| `anyFilter`                | `"any"`                 |
| `allFilter`                | `"all"`                 |
| `containsFilter`           | `"contains"`            |
| `inFilter`                 | `"in"`                  |
| `notInFilter`              | `"nin"`                 |

---

## Ordering

**v16**

```typescript
client.items().orderByAscending("system.name").toPromise();
client.items().orderByDescending("elements.released").toPromise();
client.items().orderParameter("elements.title", "desc").toPromise();
```

**v17**

```typescript
client.listContentItems({ query: { order: "system.name[asc]" } }).fetchPageSafe();
client.listContentItems({ query: { order: "elements.released[desc]" } }).fetchPageSafe();
```

---

## Paging

### URL paging (skip / limit)

**v16**

```typescript
const response = await client.items().limitParameter(10).skipParameter(20).includeTotalCountParameter().toPromise();

console.log(response.data.pagination.skip, response.data.pagination.totalCount);
```

**v17**

```typescript
const { response } = await client.listContentItems({ query: { limit: 10, skip: 20, includeTotalCount: true } }).fetchPageSafe();

console.log(response?.payload.pagination.skip, response?.payload.pagination.total_count);
```

### Continuation-token paging (items feed)

**v16**

```typescript
const response = await client.itemsFeed().withContinuationToken("token-from-previous-response").toPromise();
```

**v17**

```typescript
const { response } = await client.itemsFeed({ headers: { "X-Continuation": "token-from-previous-response" } }).fetchPageSafe();

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
const { success, responses } = await client.listContentItems({ query: { limit: 5 } }).fetchAllPagesSafe({ maxPagesCount: 3 });
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

v17 can validate API responses per query. Pass a schema in `config.schema` (or to `raw({ schema })` for
the raw payload). Any [Standard Schema](https://standardschema.dev) works, and the SDK's Zod schemas are
exported from `@kontent-ai/delivery-sdk/schemas`. Responses are not validated by default:

```typescript
import { listLanguagesSchema } from "@kontent-ai/delivery-sdk/schemas";

const { success, error } = await client.listLanguages({ config: { schema: listLanguagesSchema<MySchema>() } }).fetchPageSafe();

if (!success && error.details.reason === "schemaMismatch") {
	console.error(error.details.issues);
}
```

---

## Removed APIs

### `mappingService`

The `client.mappingService` property for remapping stored JSON responses is removed. Parse responses with
the exported Zod schemas directly. The schemas live on the dedicated `@kontent-ai/delivery-sdk/schemas`
subpath, a separate entry point that is **not** part of the main bundle, so it's only pulled in when you
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
set a custom host through the `baseUrl` config, and express ad-hoc filters via raw-string `filters`.

```typescript
const inspection = client.listContentItems({ query: { limit: 10 } }).inspect();

if (inspection.success) {
	console.log(inspection.data.url.toString()); // also: requestHeaders, method, body
}
```

### Sync API

`client.initializeSync()` and `client.syncChanges()` are removed. Use the dedicated
[`@kontent-ai/sync-sdk`](https://github.com/kontent-ai/sync-sdk-js) package, which provides type-safe
synchronization with the Kontent.ai Sync API v2:

```bash
npm install @kontent-ai/sync-sdk
```
