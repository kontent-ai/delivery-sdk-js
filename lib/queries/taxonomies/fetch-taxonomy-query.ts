import type { FetchQuery } from "@kontent-ai/core-sdk";
import type { DeliveryClientConfig, DeliveryClientSchema } from "../../models/core.models.js";
import type { DeliveryRequest, QueryRequestWithCodename } from "../../models/request.models.js";
import { createDeliveryFetchQuery } from "../delivery-queries.js";
import { type TaxonomyPayload, taxonomyPayload } from "./taxonomy.models.js";

export type FetchTaxonomyQuery<TSchema extends DeliveryClientSchema> = FetchQuery<TaxonomyPayload<TSchema>, unknown>;

export type FetchTaxonomyQueryRequest<TSchema extends DeliveryClientSchema> = DeliveryRequest &
	QueryRequestWithCodename<NonNullable<TSchema["taxonomyCodenames"]>>;

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
