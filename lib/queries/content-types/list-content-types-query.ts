import type { PagedFetchQuery } from "@kontent-ai/core-sdk";
import type { DefaultDeliveryClientSchema, DeliveryClientConfigWithSchema } from "../../models/core.models.js";
import { createDeliveryPagingQuery } from "../delivery-queries.js";
import { type ListContentTypesPayload, listContentTypesPayload } from "./content-type.models.js";

export type ListContentTypesQuery<TSchema extends DefaultDeliveryClientSchema> = PagedFetchQuery<ListContentTypesPayload<TSchema>, unknown>;

export function listContentTypes<TSchema extends DefaultDeliveryClientSchema>(
	config: DeliveryClientConfigWithSchema<TSchema>,
): ListContentTypesQuery<TSchema> {
	return createDeliveryPagingQuery({
		config,
		zodSchema: listContentTypesPayload(config.schema),
		endpoint: "types",
	});
}
