import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryFetchQuery, DeliveryMetadata } from "../../models/core.models.js";
import type { DeliveryRequestWithCodename } from "../../models/request.models.js";
import { createDeliveryFetchQuery } from "../delivery-queries.js";
import { type TaxonomyPayload, taxonomyPayload } from "./taxonomy.models.js";

export type FetchTaxonomyQuery<TSchema extends DeliveryClientSchema> = DeliveryFetchQuery<TaxonomyPayload<TSchema>, DeliveryMetadata>;

export type FetchTaxonomyQueryRequest<TSchema extends DeliveryClientSchema> = DeliveryRequestWithCodename<
	NonNullable<TSchema["taxonomyCodenames"]>,
	never,
	never
>;

export function fetchTaxonomyQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request: FetchTaxonomyQueryRequest<TSchema>,
): FetchTaxonomyQuery<TSchema> {
	return createDeliveryFetchQuery({
		config,
		request,
		schema: taxonomyPayload(config.schema),
		endpoint: `taxonomies/${request.codename}`,
	});
}
