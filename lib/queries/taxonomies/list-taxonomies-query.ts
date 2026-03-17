import type { PagedFetchQuery } from "@kontent-ai/core-sdk";
import type { DeliveryClientConfig, DeliveryClientSchema } from "../../models/core.models.js";
import type { DeliveryRequest, QueryParameters } from "../../models/request.models.js";
import { createDeliveryPagingQuery } from "../delivery-queries.js";
import { type ListTaxonomiesPayload, listTaxonomiesPayload } from "./taxonomy.models.js";

export type ListTaxonomiesQuery<TSchema extends DeliveryClientSchema> = PagedFetchQuery<ListTaxonomiesPayload<TSchema>, unknown>;

export type ListTaxonomiesQueryRequest = DeliveryRequest &
	QueryParameters<{
		readonly skip?: number;
		readonly limit?: number;
	}>;

export function listTaxonomiesQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request?: ListTaxonomiesQueryRequest,
): ListTaxonomiesQuery<TSchema> {
	return createDeliveryPagingQuery({
		config,
		request,
		zodSchema: listTaxonomiesPayload(config.schema),
		endpoint: "taxonomies",
	});
}
