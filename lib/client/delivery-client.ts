import type { DeliveryClient, DeliveryClientConfig, DeliveryClientSchema } from "../models/core.models.js";
import { type FetchContentItemQueryRequest, fetchContentItemQuery } from "../queries/content-items/fetch-content-item-query.js";
import { type ItemsFeedQueryRequest, itemsFeedQuery } from "../queries/content-items/items-feed-query.js";
import {
	type ItemsReferencingAssetQueryRequest,
	itemsReferencingAssetQuery,
} from "../queries/content-items/items-referencing-asset-query.js";
import { type ItemsReferencingItemQueryRequest, itemsReferencingItemQuery } from "../queries/content-items/items-referencing-item-query.js";
import { type ListContentItemsQueryRequest, listContentItemsQuery } from "../queries/content-items/list-content-items-query.js";
import {
	type FetchContentTypeElementQueryRequest,
	fetchContentTypeElementQuery,
} from "../queries/content-types/fetch-content-type-element-query.js";
import { type FetchContentTypeQueryRequest, fetchContentTypeQuery } from "../queries/content-types/fetch-content-type-query.js";
import { type ListContentTypesQueryRequest, listContentTypesQuery } from "../queries/content-types/list-content-types-query.js";
import { type ListLanguagesQueryRequest, listLanguagesQuery } from "../queries/languages/list-languages-query.js";
import { type FetchTaxonomyQueryRequest, fetchTaxonomyQuery } from "../queries/taxonomies/fetch-taxonomy-query.js";
import { type ListTaxonomiesQueryRequest, listTaxonomiesQuery } from "../queries/taxonomies/list-taxonomies-query.js";
import type { TaxonomyCodenameOf } from "../queries/taxonomies/models/taxonomy.models.js";

/**
 * Creates a delivery client. When you supply a `TSchema` type argument, codenames are narrowed for type safety.
 * Without a type argument, codenames fall back to generic strings.
 *
 * We highly recommend generating the schema type using the `@kontent-ai/model-generator` npm package
 * and passing it as the type argument for full compile-time safety.
 */
export function createDeliveryClient<const TSchema extends DeliveryClientSchema = DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
): DeliveryClient<TSchema> {
	return {
		config,
		listTaxonomies: (request?: ListTaxonomiesQueryRequest) => listTaxonomiesQuery(config, request),
		listLanguages: (request?: ListLanguagesQueryRequest) => listLanguagesQuery(config, request),
		listContentTypes: (request?: ListContentTypesQueryRequest<TSchema>) => listContentTypesQuery(config, request),
		fetchTaxonomy: <const TCodename extends TaxonomyCodenameOf<TSchema>>(request: FetchTaxonomyQueryRequest<TSchema, TCodename>) =>
			fetchTaxonomyQuery(config, request),
		fetchContentType: (request: FetchContentTypeQueryRequest<TSchema>) => fetchContentTypeQuery(config, request),
		fetchContentTypeElement: (request: FetchContentTypeElementQueryRequest<TSchema>) => fetchContentTypeElementQuery(config, request),
		fetchContentItem: (request: FetchContentItemQueryRequest<TSchema>) => fetchContentItemQuery(config, request),
		listContentItems: (request?: ListContentItemsQueryRequest<TSchema>) => listContentItemsQuery(config, request),
		itemsFeed: (request?: ItemsFeedQueryRequest<TSchema>) => itemsFeedQuery(config, request),
		itemsReferencingAsset: (request: ItemsReferencingAssetQueryRequest<TSchema>) => itemsReferencingAssetQuery(config, request),
		itemsReferencingItem: (request: ItemsReferencingItemQueryRequest<TSchema>) => itemsReferencingItemQuery(config, request),
	};
}
