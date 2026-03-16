import type { PagedFetchQuery } from "@kontent-ai/core-sdk";
import type { DefaultDeliveryClientSchema, DeliveryClientConfigWithSchema } from "../../models/core.models.js";
import { createDeliveryPagingQuery } from "../delivery-queries.js";
import { type ListLanguagesPayload, listLanguagesPayload } from "./language.models.js";

export type ListLanguagesQuery<TSchema extends DefaultDeliveryClientSchema> = PagedFetchQuery<ListLanguagesPayload<TSchema>, unknown>;

export function listLanguagesQuery<TSchema extends DefaultDeliveryClientSchema>(
	config: DeliveryClientConfigWithSchema<TSchema>,
): ListLanguagesQuery<TSchema> {
	return createDeliveryPagingQuery({
		config,
		zodSchema: listLanguagesPayload(config.schema),
		endpoint: "languages",
	});
}
