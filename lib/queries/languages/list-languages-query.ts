import type { PagedFetchQuery } from "@kontent-ai/core-sdk";
import type { DeliveryClientConfigWithSchema, DeliveryClientTypes } from "../../models/core.models.js";
import { createDeliveryPagingQuery } from "../delivery-queries.js";
import { type ListLanguagesPayload, listLanguagesPayload } from "./language.models.js";

export type ListLanguagesQuery<TDeliveryClientTypes extends DeliveryClientTypes> = PagedFetchQuery<
	ListLanguagesPayload<TDeliveryClientTypes>,
	unknown
>;

export function listLanguagesQuery<TDeliveryClientTypes extends DeliveryClientTypes>(
	config: DeliveryClientConfigWithSchema<TDeliveryClientTypes>,
): ListLanguagesQuery<TDeliveryClientTypes> {
	return createDeliveryPagingQuery({
		config,
		zodSchema: listLanguagesPayload(config.schema),
		endpoint: "languages",
	});
}
