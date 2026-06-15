import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryFetchQuery, DeliveryMetadata } from "../../models/core.models.js";
import type { DeliveryRequest } from "../../models/request.models.js";
import type { DeliveryResponse } from "../../models/response.models.js";
import { createDeliveryFetchQuery } from "../delivery-queries.js";
import type { ContentTypeCodenameOf, ContentTypeElementPayload, ElementCodenamesOf } from "./models/content-type.models.js";

export type FetchContentTypeElementResponse = DeliveryResponse<ContentTypeElementPayload, DeliveryMetadata>;

export type FetchContentTypeElementQuery = DeliveryFetchQuery<
	FetchContentTypeElementResponse["payload"],
	FetchContentTypeElementResponse["meta"]
>;

export type FetchContentTypeElementQueryRequest<
	TSchema extends DeliveryClientSchema,
	TCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>,
> = DeliveryRequest<never, never> & {
	readonly typeCodename: TCodename;
	readonly elementCodename: ElementCodenamesOf<TSchema, TCodename>;
};

export function fetchContentTypeElementQuery<TSchema extends DeliveryClientSchema, const TCodename extends ContentTypeCodenameOf<TSchema>>(
	config: DeliveryClientConfig,
	request: FetchContentTypeElementQueryRequest<TSchema, TCodename>,
): FetchContentTypeElementQuery {
	return createDeliveryFetchQuery({
		config,
		request,
		schema: async () => (await import("./schemas/content-type.schemas.js")).contentTypeElementSchema(),
		endpoint: `types/${request.typeCodename}/elements/${request.elementCodename}`,
	});
}
