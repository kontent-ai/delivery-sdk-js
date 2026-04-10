import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryPagedFetchQuery } from "../../models/core.models.js";
import type { PagingDeliveryRequest, QueryFilters, SystemOrderQueryParam } from "../../models/request.models.js";
import { createDeliveryPagingQuery } from "../delivery-queries.js";
import { type ListTaxonomiesPayload, listTaxonomiesPayload, type TaxonomyPayload } from "./taxonomy.models.js";

export type ListTaxonomiesQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<ListTaxonomiesPayload<TSchema>>;

export type ListTaxonomiesQueryRequest<TSchema extends DeliveryClientSchema> = PagingDeliveryRequest<
	SystemOrderQueryParam<keyof TaxonomyPayload<TSchema>["system"]>
> &
	QueryFilters<keyof TaxonomyPayload<TSchema>["system"], never>;

export function listTaxonomiesQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request?: ListTaxonomiesQueryRequest<TSchema>,
): ListTaxonomiesQuery<TSchema> {
	return createDeliveryPagingQuery({
		config,
		request,
		schema: listTaxonomiesPayload(config.schema),
		endpoint: "taxonomies",
	});
}
