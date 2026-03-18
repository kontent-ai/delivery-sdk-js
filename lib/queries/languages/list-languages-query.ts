import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryPagedFetchQuery } from "../../models/core.models.js";
import type { PagingDeliveryRequest, QueryParameters, SystemOrderQueryParam } from "../../models/request.models.js";
import { createDeliveryPagingQuery } from "../delivery-queries.js";
import { type LanguagePayload, type ListLanguagesPayload, listLanguagesPayload } from "./language.models.js";

export type ListLanguagesQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<ListLanguagesPayload<TSchema>>;

export type ListLanguagesQueryRequest = PagingDeliveryRequest &
	QueryParameters<{
		readonly order?: SystemOrderQueryParam<keyof LanguagePayload<DeliveryClientSchema>["system"]>;
	}>;

export function listLanguagesQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request?: ListLanguagesQueryRequest,
): ListLanguagesQuery<TSchema> {
	return createDeliveryPagingQuery({
		config,
		request,
		schema: listLanguagesPayload(config.schema),
		endpoint: "languages",
	});
}
