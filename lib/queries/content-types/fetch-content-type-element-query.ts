import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryFetchQuery, DeliveryMetadata } from "../../models/core.models.js";
import type { DeliveryRequest } from "../../models/request.models.js";
import { createDeliveryFetchQuery } from "../delivery-queries.js";
import type { ContentTypeElementPayload } from "./content-type.models.js";

export type FetchContentTypeElementQuery = DeliveryFetchQuery<ContentTypeElementPayload, DeliveryMetadata>;

export type FetchContentTypeElementQueryRequest<TSchema extends DeliveryClientSchema> = DeliveryRequest<never, never> & {
	readonly elementCodename: NonNullable<TSchema["elementCodenames"]>[number];
	readonly typeCodename: NonNullable<TSchema["contentTypeCodenames"]>[number];
};

export function fetchContentTypeElementQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request: FetchContentTypeElementQueryRequest<TSchema>,
): FetchContentTypeElementQuery {
	return createDeliveryFetchQuery({
		config,
		request,
		schema: async () => (await import("./content-type.schemas.js")).contentTypeElementSchema(),
		endpoint: `types/${request.typeCodename}/elements/${request.elementCodename}`,
	});
}
