import type { DeliveryClient, DeliveryClientConfig, DeliveryClientSchema } from "../models/core.models.js";
import { type FetchContentItemQueryRequest, fetchContentItemQuery } from "../queries/content-items/fetch-content-item-query.js";
import { type ItemsFeedQueryRequest, itemsFeedQuery } from "../queries/content-items/items-feed-query.js";
import {
	type ItemsReferencingAssetQueryRequest,
	itemsReferencingAssetQuery,
} from "../queries/content-items/items-referencing-asset-query.js";
import { type ItemsReferencingItemQueryRequest, itemsReferencingItemQuery } from "../queries/content-items/items-referencing-item-query.js";
import { type ListContentItemsQueryRequest, listContentItemsQuery } from "../queries/content-items/list-content-items-query.js";
import type { ContentItemPayloadExtended } from "../queries/content-items/models/content-item.models.js";
import {
	type FetchContentTypeElementQueryRequest,
	fetchContentTypeElementQuery,
} from "../queries/content-types/fetch-content-type-element-query.js";
import { type FetchContentTypeQueryRequest, fetchContentTypeQuery } from "../queries/content-types/fetch-content-type-query.js";
import { type ListContentTypesQueryRequest, listContentTypesQuery } from "../queries/content-types/list-content-types-query.js";
import type { ContentTypeCodenameOf, ElementCodenamesOf } from "../queries/content-types/models/content-type.models.js";
import { type ListLanguagesQueryRequest, listLanguagesQuery } from "../queries/languages/list-languages-query.js";
import { type FetchTaxonomyQueryRequest, fetchTaxonomyQuery } from "../queries/taxonomies/fetch-taxonomy-query.js";
import { type ListTaxonomiesQueryRequest, listTaxonomiesQuery } from "../queries/taxonomies/list-taxonomies-query.js";
import type { TaxonomyCodenameOf } from "../queries/taxonomies/models/taxonomy.models.js";

/**
 * Creates a delivery client. When you supply a `TSchema` type argument, codenames are narrowed for type safety.
 * When you also supply `TItem` (the union of your content item models), content item responses are typed as that union.
 * Without type arguments, codenames fall back to generic strings.
 *
 * We highly recommend generating both types using the `@kontent-ai/model-generator` npm package
 * for full compile-time safety.
 *
 * @example
 * ```ts
 * const client = createDeliveryClient<CoreClientSchema, CoreItem>({ environmentId, apiMode: "public" });
 * ```
 */
export function createDeliveryClient<
	TSchema extends DeliveryClientSchema = DeliveryClientSchema,
	TItem extends ContentItemPayloadExtended<TSchema> = ContentItemPayloadExtended<TSchema>,
>(config: DeliveryClientConfig): DeliveryClient<TSchema, TItem> {
	return {
		config,
		listTaxonomies: (request?: ListTaxonomiesQueryRequest<TSchema>) => listTaxonomiesQuery(config, request),
		listLanguages: (request?: ListLanguagesQueryRequest<TSchema>) => listLanguagesQuery(config, request),
		listContentTypes: (request?: ListContentTypesQueryRequest<TSchema>) => listContentTypesQuery(config, request),
		fetchTaxonomy: <const TCodename extends TaxonomyCodenameOf<TSchema>>(request: FetchTaxonomyQueryRequest<TSchema, TCodename>) =>
			fetchTaxonomyQuery(config, request),
		fetchContentType: <const TCodename extends ContentTypeCodenameOf<TSchema>>(
			request: FetchContentTypeQueryRequest<TSchema, TCodename>,
		) => fetchContentTypeQuery(config, request),
		fetchContentTypeElement: <
			const TCodename extends ContentTypeCodenameOf<TSchema>,
			const TElement extends ElementCodenamesOf<TSchema, TCodename>,
		>(
			request: FetchContentTypeElementQueryRequest<TSchema, TCodename, TElement>,
		) => fetchContentTypeElementQuery(config, request),
		fetchContentItem: (request: FetchContentItemQueryRequest<TSchema, TItem>) => fetchContentItemQuery(config, request),
		listContentItems: <const TTypeCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>>(
			request?: ListContentItemsQueryRequest<TSchema, TTypeCodename, TItem>,
		) => listContentItemsQuery<TSchema, TItem, TTypeCodename>(config, request),
		itemsFeed: <const TTypeCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>>(
			request?: ItemsFeedQueryRequest<TSchema, TTypeCodename, TItem>,
		) => itemsFeedQuery<TSchema, TItem, TTypeCodename>(config, request),
		itemsReferencingAsset: (request: ItemsReferencingAssetQueryRequest<TSchema>) => itemsReferencingAssetQuery(config, request),
		itemsReferencingItem: (request: ItemsReferencingItemQueryRequest<TSchema>) => itemsReferencingItemQuery(config, request),
	};
}
