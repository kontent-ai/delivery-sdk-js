import type { DeliveryClient, DeliveryClientConfig, FullDeliveryClientSchema } from "../models/core.models.js";
import { type FetchContentItemQueryRequest, fetchContentItemQuery } from "../queries/content-items/fetch-content-item-query.js";
import { type ItemsFeedQueryRequest, itemsFeedQuery } from "../queries/content-items/items-feed-query.js";
import { type ListContentItemsQueryRequest, listContentItemsQuery } from "../queries/content-items/list-content-items-query.js";
import {
	type FetchContentTypeElementQueryRequest,
	fetchContentTypeElementQuery,
} from "../queries/content-types/fetch-content-type-element-query.js";
import { type FetchContentTypeQueryRequest, fetchContentTypeQuery } from "../queries/content-types/fetch-content-type-query.js";
import { type ListContentTypesQueryRequest, listContentTypes } from "../queries/content-types/list-content-types-query.js";
import { type ListLanguagesQueryRequest, listLanguagesQuery } from "../queries/languages/list-languages-query.js";
import { type FetchTaxonomyQueryRequest, fetchTaxonomyQuery } from "../queries/taxonomies/fetch-taxonomy-query.js";
import { type ListTaxonomiesQueryRequest, listTaxonomiesQuery } from "../queries/taxonomies/list-taxonomies-query.js";

/**
 * Creates a delivery client. When you provide a schema, codenames are inferred for type safety.
 * When schema is omitted or undefined, codenames are generic strings.
 *
 * We highly recommend generating the schema using the `@kontent-ai/model-generator` npm package.
 * and passing it here for full compile-time safety.
 *
 * By enabling the response validation, you can also achieve a run-time type safety.
 *
 * @example
 * With schema – narrow codename types
 *
 * const client = createDeliveryClient({
 *   apiMode: "public",
 *   environmentId: "x",
 *   schema: { languageCodenames: ["en-us", "es-es"] },
 * });
 *
 * @example
 * Without schema – schema optional, codenames are string
 *
 * const client = createDeliveryClient({
 *   apiMode: "public",
 *   environmentId: "x",
 * });
 */
export function createDeliveryClient<const TSchema extends FullDeliveryClientSchema = FullDeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
): DeliveryClient<TSchema> {
	return {
		config,
		listTaxonomies: (request?: ListTaxonomiesQueryRequest<TSchema>) => listTaxonomiesQuery(config, request),
		listLanguages: (request?: ListLanguagesQueryRequest<TSchema>) => listLanguagesQuery(config, request),
		listContentTypes: (request?: ListContentTypesQueryRequest<TSchema>) => listContentTypes(config, request),
		fetchTaxonomy: (request: FetchTaxonomyQueryRequest<TSchema>) => fetchTaxonomyQuery(config, request),
		fetchContentType: (request: FetchContentTypeQueryRequest<TSchema>) => fetchContentTypeQuery(config, request),
		fetchContentTypeElement: (request: FetchContentTypeElementQueryRequest<TSchema>) => fetchContentTypeElementQuery(config, request),
		fetchContentItem: (request: FetchContentItemQueryRequest<TSchema>) => fetchContentItemQuery(config, request),
		listContentItems: (request?: ListContentItemsQueryRequest<TSchema>) => listContentItemsQuery(config, request),
		itemsFeed: (request?: ItemsFeedQueryRequest<TSchema>) => itemsFeedQuery(config, request),
	};
}
