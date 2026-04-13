import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryPagedFetchQuery } from "../../models/core.models.js";
import type { PagingByUrlDeliveryRequest, QueryFilters, SystemOrderQueryParam } from "../../models/request.models.js";
import { createDeliveryPagingByUrlQuery } from "../delivery-queries.js";
import { type ListTaxonomiesPayload, listTaxonomiesPayload, type TaxonomyPayload } from "./taxonomy.models.js";

export type ListTaxonomiesQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<ListTaxonomiesPayload<TSchema>>;

export type ListTaxonomiesQueryRequest<TSchema extends DeliveryClientSchema> = PagingByUrlDeliveryRequest<
	SystemOrderQueryParam<keyof TaxonomyPayload<TSchema>["system"]>
> &
	QueryFilters<keyof TaxonomyPayload<TSchema>["system"], never>;

export function listTaxonomiesQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request?: ListTaxonomiesQueryRequest<TSchema>,
): ListTaxonomiesQuery<TSchema> {
	return createDeliveryPagingByUrlQuery({
		config,
		request,
		schema: listTaxonomiesPayload(config.schema),
		endpoint: "taxonomies",
	});
}
