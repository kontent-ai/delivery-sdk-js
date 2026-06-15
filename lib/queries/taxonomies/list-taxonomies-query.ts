import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryMetadata, DeliveryPagedFetchQuery } from "../../models/core.models.js";
import type { Filter } from "../../models/filter.models.js";
import type { DeliveryRequestWithUrlPaging, SystemOrderQueryParam } from "../../models/request.models.js";
import type { DeliveryResponse } from "../../models/response.models.js";
import { createDeliveryPagedByUrlQuery } from "../delivery-queries.js";
import type { ListTaxonomiesPayload, TaxonomyPayload } from "./models/taxonomy.models.js";

export type ListTaxonomiesResponse<TSchema extends DeliveryClientSchema = DeliveryClientSchema> = DeliveryResponse<
	ListTaxonomiesPayload<TSchema, string>,
	DeliveryMetadata
>;

export type ListTaxonomiesQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<
	ListTaxonomiesResponse<TSchema>["payload"],
	ListTaxonomiesResponse<TSchema>["meta"]
>;

type SystemProperties = keyof TaxonomyPayload<DeliveryClientSchema, string>["system"];

export type ListTaxonomiesQueryRequest = DeliveryRequestWithUrlPaging<
	SystemOrderQueryParam<SystemProperties>,
	never,
	readonly Filter<SystemProperties, never>[]
>;

export function listTaxonomiesQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig,
	request?: ListTaxonomiesQueryRequest,
): ListTaxonomiesQuery<TSchema> {
	return createDeliveryPagedByUrlQuery({
		config,
		request,
		schema: async () => (await import("./schemas/taxonomy.schemas.js")).listTaxonomiesSchema<TSchema, string>(),
		endpoint: "taxonomies",
	});
}
