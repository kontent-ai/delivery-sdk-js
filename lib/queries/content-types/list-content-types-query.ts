import type { PagedFetchQuery } from "@kontent-ai/core-sdk";
import type { DeliveryClientConfigWithSchema, DeliveryClientSchema } from "../../models/core.models.js";
import { createDeliveryPagingQuery } from "../delivery-queries.js";
import { type ListContentTypesPayload, listContentTypesPayload } from "./content-type.models.js";

export type ListContentTypesQuery<TSchema extends DeliveryClientSchema> = PagedFetchQuery<ListContentTypesPayload<TSchema>, unknown>;

export function listContentTypes<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfigWithSchema<TSchema>,
): ListContentTypesQuery<TSchema> {
	return createDeliveryPagingQuery({
		config,
		zodSchema: listContentTypesPayload(config.schema),
		endpoint: "types",
	});
}
