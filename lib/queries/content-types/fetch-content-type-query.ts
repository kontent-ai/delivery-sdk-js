import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryFetchQuery, DeliveryMetadata } from "../../models/core.models.js";
import type { DeliveryRequestWithCodename, ElementSelectionQueryParam } from "../../models/request.models.js";
import type { DeliveryResponse } from "../../models/response.models.js";
import { createDeliveryFetchQuery } from "../delivery-queries.js";
import type { ContentTypeCodenameOf, ContentTypePayload, ElementCodenamesOf } from "./models/content-type.models.js";

export type FetchContentTypeResponse<TSchema extends DeliveryClientSchema = DeliveryClientSchema> = DeliveryResponse<
	ContentTypePayload<TSchema>,
	DeliveryMetadata
>;

export type FetchContentTypeQuery<TSchema extends DeliveryClientSchema> = DeliveryFetchQuery<
	FetchContentTypeResponse<TSchema>["payload"],
	FetchContentTypeResponse<TSchema>["meta"]
>;

export type FetchContentTypeQueryRequest<
	TSchema extends DeliveryClientSchema,
	TCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>,
> = DeliveryRequestWithCodename<
	readonly TCodename[],
	{
		readonly elements?: ElementSelectionQueryParam<ElementCodenamesOf<TSchema, TCodename>>;
	},
	never
>;

export function fetchContentTypeQuery<TSchema extends DeliveryClientSchema, const TCodename extends ContentTypeCodenameOf<TSchema>>(
	config: DeliveryClientConfig,
	request: FetchContentTypeQueryRequest<TSchema, TCodename>,
): FetchContentTypeQuery<TSchema> {
	return createDeliveryFetchQuery({
		config,
		request,
		schema: async () => (await import("./schemas/content-type.schemas.js")).contentTypeSchema<TSchema>(),
		endpoint: `types/${encodeURIComponent(request.codename)}`,
	});
}
