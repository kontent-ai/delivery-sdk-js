import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryPagedFetchQuery } from "../../models/core.models.js";
import type { Filter } from "../../models/filter.models.js";
import type { DeliveryRequestWithUrlPaging, SystemOrderQueryParam } from "../../models/request.models.js";
import { createDeliveryPagedByUrlQuery } from "../delivery-queries.js";
import { type LanguagePayload, type ListLanguagesPayload, listLanguagesPayload } from "./language.models.js";

export type ListLanguagesQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<ListLanguagesPayload<TSchema>>;

type SystemProperties = keyof LanguagePayload<DeliveryClientSchema>["system"];

export type ListLanguagesQueryRequest = DeliveryRequestWithUrlPaging<
	SystemOrderQueryParam<SystemProperties>,
	never,
	readonly Filter<SystemProperties, never>[]
>;

export function listLanguagesQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request?: ListLanguagesQueryRequest,
): ListLanguagesQuery<TSchema> {
	return createDeliveryPagedByUrlQuery({
		config,
		request,
		schema: listLanguagesPayload(config.schema),
		endpoint: "languages",
	});
}
