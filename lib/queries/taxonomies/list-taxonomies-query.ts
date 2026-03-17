import type { PagedFetchQuery } from "@kontent-ai/core-sdk";
import type { DeliveryClientConfig, DeliveryClientSchema } from "../../models/core.models.js";
import type { PagingDeliveryRequest, QueryParameters, SystemOrderQueryParam } from "../../models/request.models.js";
import { createDeliveryPagingQuery } from "../delivery-queries.js";
import { type ListTaxonomiesPayload, listTaxonomiesPayload, type TaxonomyPayload } from "./taxonomy.models.js";

export type ListTaxonomiesQuery<TSchema extends DeliveryClientSchema> = PagedFetchQuery<ListTaxonomiesPayload<TSchema>, unknown>;

export type ListTaxonomiesQueryRequest = PagingDeliveryRequest &
	QueryParameters<{
		readonly order?: SystemOrderQueryParam<keyof TaxonomyPayload<DeliveryClientSchema>["system"]>;
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
