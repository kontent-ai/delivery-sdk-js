import type { PagedFetchQuery } from "@kontent-ai/core-sdk";
import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryClientTypes } from "../../models/core.models.js";
import { createDeliveryPagingQuery } from "../delivery-queries.js";
import { type ListContentTypesPayload, listContentTypesPayload } from "./content-type.models.js";

export type ListContentTypesQuery<TDeliveryClientTypes extends DeliveryClientTypes> = PagedFetchQuery<
	ListContentTypesPayload<TDeliveryClientTypes>,
	unknown
>;

export function listContentTypes<TDeliveryClientTypes extends DeliveryClientTypes>(
	config: DeliveryClientConfig,
	schema: DeliveryClientSchema<TDeliveryClientTypes>,
): ListContentTypesQuery<TDeliveryClientTypes> {
	return createDeliveryPagingQuery({
		config,
		zodSchema: listContentTypesPayload(schema),
		endpoint: "types",
	});
}
