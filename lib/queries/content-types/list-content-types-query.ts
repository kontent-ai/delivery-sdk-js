import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryPagedFetchQuery } from "../../models/core.models.js";
import type {
	ElementSelectionQueryParam,
	PagingByUrlDeliveryRequest,
	QueryFilters,
	QueryParameters,
	SystemOrderQueryParam,
} from "../../models/request.models.js";
import { createDeliveryPagingByUrlQuery } from "../delivery-queries.js";
import { type ContentTypePayload, type ListContentTypesPayload, listContentTypesPayload } from "./content-type.models.js";

export type ListContentTypesQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<ListContentTypesPayload<TSchema>>;

export type ListContentTypesQueryRequest<TSchema extends DeliveryClientSchema> = PagingByUrlDeliveryRequest<
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
	return createDeliveryPagingByUrlQuery({
		config,
		request,
		schema: listContentTypesPayload(config.schema),
		endpoint: "types",
	});
}
