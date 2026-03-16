import type { PagedFetchQuery } from "@kontent-ai/core-sdk";
import type { DeliveryClientConfigWithSchema, DeliveryClientSchema } from "../../models/core.models.js";
import { createDeliveryPagingQuery } from "../delivery-queries.js";
import { type ListTaxonomiesPayload, listTaxonomiesPayload } from "./taxonomy.models.js";

export type ListTaxonomiesQuery<TSchema extends DeliveryClientSchema> = PagedFetchQuery<ListTaxonomiesPayload<TSchema>, unknown>;

export function listTaxonomiesQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfigWithSchema<TSchema>,
): ListTaxonomiesQuery<TSchema> {
	return createDeliveryPagingQuery({
		config,
		zodSchema: listTaxonomiesPayload(config.schema),
		endpoint: "taxonomies",
	});
}
