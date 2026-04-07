import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryPagedFetchQuery } from "../../models/core.models.js";
import type { PagingDeliveryRequest, SystemOrderQueryParam } from "../../models/request.models.js";
import { createDeliveryPagingQuery } from "../delivery-queries.js";
import { type ListTaxonomiesPayload, listTaxonomiesPayload, type TaxonomyPayload } from "./taxonomy.models.js";

export type ListTaxonomiesQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<ListTaxonomiesPayload<TSchema>>;

export type ListTaxonomiesQueryRequest = PagingDeliveryRequest<
	SystemOrderQueryParam<keyof TaxonomyPayload<DeliveryClientSchema>["system"]>
>;

export function listTaxonomiesQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request?: ListTaxonomiesQueryRequest,
): ListTaxonomiesQuery<TSchema> {
	return createDeliveryPagingQuery({
		config,
		request,
		schema: listTaxonomiesPayload(config.schema),
		endpoint: "taxonomies",
	});
}
