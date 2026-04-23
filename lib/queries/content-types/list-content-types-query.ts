import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryPagedFetchQuery } from "../../models/core.models.js";
import type { Filter } from "../../models/filter.models.js";
import type { DeliveryRequestWithUrlPaging, ElementSelectionQueryParam, SystemOrderQueryParam } from "../../models/request.models.js";
import { createDeliveryPagedByUrlQuery } from "../delivery-queries.js";
import { type ContentTypePayload, type ListContentTypesPayload, listContentTypesSchema } from "./content-type.models.js";

type SystemProperties = keyof ContentTypePayload<DeliveryClientSchema>["system"];
type ElementProperties<TSchema extends DeliveryClientSchema> = NonNullable<TSchema["elementCodenames"]>[number];

export type ListContentTypesQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<ListContentTypesPayload<TSchema>>;

export type ListContentTypesQueryRequest<TSchema extends DeliveryClientSchema> = DeliveryRequestWithUrlPaging<
	SystemOrderQueryParam<SystemProperties>,
	{
		readonly elements?: ElementSelectionQueryParam<ElementProperties<TSchema>>;
	},
	readonly Filter<SystemProperties, never>[]
>;

export function listContentTypesQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request?: ListContentTypesQueryRequest<TSchema>,
): ListContentTypesQuery<TSchema> {
	return createDeliveryPagedByUrlQuery({
		config,
		request,
		schema: listContentTypesSchema(config.schema),
		endpoint: "types",
	});
}
