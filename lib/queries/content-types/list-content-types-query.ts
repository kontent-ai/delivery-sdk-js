import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryPagedFetchQuery } from "../../models/core.models.js";
import type {
	ElementSelectionQueryParam,
	PagingDeliveryRequest,
	QueryFilters,
	QueryParameters,
	SystemOrderQueryParam,
} from "../../models/request.models.js";
import { createDeliveryPagingQuery } from "../delivery-queries.js";
import { type ContentTypePayload, type ListContentTypesPayload, listContentTypesPayload } from "./content-type.models.js";

export type ListContentTypesQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<ListContentTypesPayload<TSchema>>;

export type ListContentTypesQueryRequest<TSchema extends DeliveryClientSchema> = PagingDeliveryRequest<
	SystemOrderQueryParam<keyof ContentTypePayload<DeliveryClientSchema>["system"]>
> &
	QueryFilters<keyof ContentTypePayload<TSchema>["system"], never> &
	QueryParameters<{
		readonly elements?: ElementSelectionQueryParam<NonNullable<TSchema["elementCodenames"]>[number]>;
	}>;

export function listContentTypes<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request?: ListContentTypesQueryRequest<TSchema>,
): ListContentTypesQuery<TSchema> {
	return createDeliveryPagingQuery({
		config,
		request,
		schema: listContentTypesPayload(config.schema),
		endpoint: "types",
	});
}
