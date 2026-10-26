import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryMetadata, DeliveryPagedFetchQuery } from "../../models/core.models.js";
import type { Filter } from "../../models/filter.models.js";
import type { DeliveryRequestWithUrlPaging, SystemOrderQueryParam } from "../../models/request.models.js";
import type { DeliveryResponse } from "../../models/response.models.js";
import { createDeliveryPagedByUrlQuery } from "../delivery-queries.js";
import type { LanguagePayload, ListLanguagesPayload } from "./models/language.models.js";

export type ListLanguagesResponse<TSchema extends DeliveryClientSchema = DeliveryClientSchema> = DeliveryResponse<
	ListLanguagesPayload<TSchema>,
	DeliveryMetadata
>;

export type ListLanguagesQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<
	ListLanguagesResponse<TSchema>["payload"],
	ListLanguagesResponse<TSchema>["meta"]
>;

type SystemProperties = keyof LanguagePayload<DeliveryClientSchema>["system"];

export type ListLanguagesQueryRequest<TSchema extends DeliveryClientSchema = DeliveryClientSchema> = DeliveryRequestWithUrlPaging<
	ListLanguagesPayload<TSchema>,
	SystemOrderQueryParam<SystemProperties>,
	never,
	readonly Filter<SystemProperties, never>[]
>;

export function listLanguagesQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig,
	request?: ListLanguagesQueryRequest<TSchema>,
): ListLanguagesQuery<TSchema> {
	return createDeliveryPagedByUrlQuery({
		config,
		request,
		schema: request?.config?.schema,
		endpoint: "languages",
	});
}
