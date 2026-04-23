import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryPagedFetchQuery } from "../../models/core.models.js";
import type { Filter } from "../../models/filter.models.js";
import type { DeliveryRequestWithUrlPaging, SystemOrderQueryParam } from "../../models/request.models.js";
import { createDeliveryPagedByUrlQuery } from "../delivery-queries.js";
import { type ListTaxonomiesPayload, listTaxonomiesSchema, type TaxonomyPayload } from "./taxonomy.models.js";

export type ListTaxonomiesQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<ListTaxonomiesPayload<TSchema>>;

type SystemProperties = keyof TaxonomyPayload<DeliveryClientSchema>["system"];

export type ListTaxonomiesQueryRequest = DeliveryRequestWithUrlPaging<
	SystemOrderQueryParam<SystemProperties>,
	never,
	readonly Filter<SystemProperties, never>[]
>;

export function listTaxonomiesQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request?: ListTaxonomiesQueryRequest,
): ListTaxonomiesQuery<TSchema> {
	return createDeliveryPagedByUrlQuery({
		config,
		request,
		schema: listTaxonomiesSchema(config.schema),
		endpoint: "taxonomies",
	});
}
