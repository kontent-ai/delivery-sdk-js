import type { FetchQuery } from "@kontent-ai/core-sdk";
import type { DeliveryClientConfig, DeliveryClientSchema } from "../../models/core.models.js";
import { createDeliveryFetchQuery } from "../delivery-queries.js";
import { type TaxonomyPayload, taxonomyPayload } from "./taxonomy.models.js";

export type FetchTaxonomyQuery<TSchema extends DeliveryClientSchema> = FetchQuery<TaxonomyPayload<TSchema>, unknown>;

export function fetchTaxonomyQuery<TSchema extends DeliveryClientSchema>(
	codename: string,
	config: DeliveryClientConfig<TSchema>,
): FetchTaxonomyQuery<TSchema> {
	return createDeliveryFetchQuery({
		config,
		zodSchema: taxonomyPayload(config.schema),
		endpoint: `taxonomies/${codename}`,
	});
}
