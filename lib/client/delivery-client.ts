import type { DeliveryClient, DeliveryClientConfig, PartialDeliveryClientShema } from "../models/core.models.js";
import {
	fetchContentTypeElementQuery,
	type FetchContentTypeElementQueryRequest,
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
export function createDeliveryClient<const TSchema extends PartialDeliveryClientShema = PartialDeliveryClientShema>(
	config: DeliveryClientConfig<TSchema>,
): DeliveryClient<TSchema> {
	return {
		config,
		listTaxonomies: (request?: ListTaxonomiesQueryRequest) => listTaxonomiesQuery(config, request),
		listLanguages: (request?: ListLanguagesQueryRequest) => listLanguagesQuery(config, request),
		listContentTypes: (request?: ListContentTypesQueryRequest<TSchema>) => listContentTypes(config, request),
		fetchTaxonomy: (request: FetchTaxonomyQueryRequest<TSchema>) => fetchTaxonomyQuery(config, request),
		fetchContentType: (request: FetchContentTypeQueryRequest<TSchema>) => fetchContentTypeQuery(config, request),
		fetchContentTypeElement: (request: FetchContentTypeElementQueryRequest<TSchema>) => fetchContentTypeElementQuery(config, request),
	};
}
