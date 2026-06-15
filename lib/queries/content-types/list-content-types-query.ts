import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryMetadata, DeliveryPagedFetchQuery } from "../../models/core.models.js";
import type { Filter } from "../../models/filter.models.js";
import type { DeliveryRequestWithUrlPaging, ElementSelectionQueryParam, SystemOrderQueryParam } from "../../models/request.models.js";
import { createDeliveryPagedByUrlQuery } from "../delivery-queries.js";
import type { AllElementCodenamesOf, ContentTypePayload, ListContentTypesPayload } from "./models/content-type.models.js";

type SystemProperties = keyof ContentTypePayload<DeliveryClientSchema>["system"];
type ElementProperties<TSchema extends DeliveryClientSchema> = AllElementCodenamesOf<TSchema>;

export type ListContentTypesQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<
	ListContentTypesPayload<TSchema>,
	DeliveryMetadata
>;

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
		schema: async () => (await import("./schemas/content-type.schemas.js")).listContentTypesSchema<TSchema>(),
		endpoint: "types",
	});
}
