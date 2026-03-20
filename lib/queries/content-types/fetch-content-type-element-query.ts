import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryFetchQuery } from "../../models/core.models.js";
import type { DeliveryRequest } from "../../models/request.models.js";
import { createDeliveryFetchQuery } from "../delivery-queries.js";
import { type ContentTypeElementPayload, contentTypeElementPayload } from "./content-type.models.js";

export type FetchContentTypeElementQuery<TSchema extends DeliveryClientSchema> = DeliveryFetchQuery<ContentTypeElementPayload<TSchema>>;

export type FetchContentTypeElementQueryRequest<TSchema extends DeliveryClientSchema> = DeliveryRequest & {
	readonly elementCodename: NonNullable<TSchema["elementCodenames"]>[number];
	readonly typeCodename: NonNullable<TSchema["contentTypeCodenames"]>[number];
};

export function fetchContentTypeElementQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request: FetchContentTypeElementQueryRequest<TSchema>,
): FetchContentTypeElementQuery<TSchema> {
	return createDeliveryFetchQuery({
		config,
		request,
		schema: contentTypeElementPayload(config.schema),
		endpoint: `types/${request.typeCodename}/elements/${request.elementCodename}`,
	});
}
