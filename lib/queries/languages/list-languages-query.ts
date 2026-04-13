import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryPagedFetchQuery } from "../../models/core.models.js";
import type { PagingByUrlDeliveryRequest, QueryFilters, SystemOrderQueryParam } from "../../models/request.models.js";
import { createDeliveryPagingByUrlQuery } from "../delivery-queries.js";
import { type LanguagePayload, type ListLanguagesPayload, listLanguagesPayload } from "./language.models.js";

export type ListLanguagesQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<ListLanguagesPayload<TSchema>>;

export type ListLanguagesQueryRequest<TSchema extends DeliveryClientSchema> = PagingByUrlDeliveryRequest<
	SystemOrderQueryParam<keyof LanguagePayload<TSchema>["system"]>
> &
	QueryFilters<keyof LanguagePayload<TSchema>["system"], never>;

export function listLanguagesQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request?: ListLanguagesQueryRequest<TSchema>,
): ListLanguagesQuery<TSchema> {
	return createDeliveryPagingByUrlQuery({
		config,
		request,
		schema: listLanguagesPayload(config.schema),
		endpoint: "languages",
	});
}
