import type { PagedFetchQuery } from "@kontent-ai/core-sdk";
import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryClientTypes } from "../../models/core.models.js";
import { createDeliveryPagingQuery } from "../delivery-queries.js";
import { type ListLanguagesPayload, listLanguagesPayload } from "./language.models.js";

export type ListLanguagesQuery<TDeliveryClientTypes extends DeliveryClientTypes> = PagedFetchQuery<
	ListLanguagesPayload<TDeliveryClientTypes>,
	unknown
>;

export function listLanguagesQuery<TDeliveryClientTypes extends DeliveryClientTypes>(
	config: DeliveryClientConfig,
	schema: DeliveryClientSchema<TDeliveryClientTypes>,
): ListLanguagesQuery<TDeliveryClientTypes> {
	return createDeliveryPagingQuery({
		config,
		zodSchema: listLanguagesPayload(schema),
		endpoint: "languages",
	});
}
