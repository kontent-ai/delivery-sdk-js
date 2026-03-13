import type { PagedFetchQuery } from "@kontent-ai/core-sdk";
import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryClientTypes } from "../../models/core.models.js";
import { createDeliveryPagingQuery } from "../delivery-queries.js";
import { type ListTaxonomiesPayload, listTaxonomiesPayload } from "./taxonomy.models.js";

export type ListTaxonomiesQuery<TDeliveryClientTypes extends DeliveryClientTypes> = PagedFetchQuery<
	ListTaxonomiesPayload<TDeliveryClientTypes>,
	unknown
>;

export function listTaxonomiesQuery<TDeliveryClientTypes extends DeliveryClientTypes>(
	config: DeliveryClientConfig,
	schema: DeliveryClientSchema<TDeliveryClientTypes>,
): ListTaxonomiesQuery<TDeliveryClientTypes> {
	return createDeliveryPagingQuery({
		config,
		zodSchema: listTaxonomiesPayload(schema),
		endpoint: "taxonomies",
	});
}
