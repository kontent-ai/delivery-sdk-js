import type { PagedFetchQuery } from "@kontent-ai/core-sdk";
import type { DeliveryClientConfig, DeliveryClientSchema } from "../../models/core.models.js";
import type { DeliveryRequest, PagingDeliveryRequest, QueryParameters, SystemOrderQueryParam } from "../../models/request.models.js";
import { createDeliveryPagingQuery } from "../delivery-queries.js";
import { type ContentTypePayload, type ListContentTypesPayload, listContentTypesPayload } from "./content-type.models.js";

export type ListContentTypesQuery<TSchema extends DeliveryClientSchema> = PagedFetchQuery<ListContentTypesPayload<TSchema>, unknown>;

export type ListContentTypesQueryRequest = PagingDeliveryRequest &
	QueryParameters<{
		readonly order?: SystemOrderQueryParam<keyof ContentTypePayload<DeliveryClientSchema>["system"]>;
	}>;

export function listContentTypes<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request?: DeliveryRequest,
): ListContentTypesQuery<TSchema> {
	return createDeliveryPagingQuery({
		config,
		request,
		schema: listContentTypesPayload(config.schema),
		endpoint: "types",
	});
}
