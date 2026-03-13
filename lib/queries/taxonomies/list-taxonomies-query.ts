import type { PagedFetchQuery } from "@kontent-ai/core-sdk";
import type { DeliveryClientConfigWithSchema, DeliveryClientTypes } from "../../models/core.models.js";
import { createDeliveryPagingQuery } from "../delivery-queries.js";
import { type ListTaxonomiesPayload, listTaxonomiesPayload } from "./taxonomy.models.js";

export type ListTaxonomiesQuery<TDeliveryClientTypes extends DeliveryClientTypes> = PagedFetchQuery<
	ListTaxonomiesPayload<TDeliveryClientTypes>,
	unknown
>;

export function listTaxonomiesQuery<TDeliveryClientTypes extends DeliveryClientTypes>(
	config: DeliveryClientConfigWithSchema<TDeliveryClientTypes>,
): ListTaxonomiesQuery<TDeliveryClientTypes> {
	return createDeliveryPagingQuery({
		config,
		zodSchema: listTaxonomiesPayload<TDeliveryClientTypes>(config.schema),
		endpoint: "taxonomies",
	});
}
