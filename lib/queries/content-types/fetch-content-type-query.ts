import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryFetchQuery, DeliveryMetadata } from "../../models/core.models.js";
import type { DeliveryRequestWithCodename, ElementSelectionQueryParam } from "../../models/request.models.js";
import type { DeliveryResponse } from "../../models/response.models.js";
import { createDeliveryFetchQuery } from "../delivery-queries.js";
import type { ContentTypeCodenameOf, ContentTypePayload, ElementCodenamesOf } from "./models/content-type.models.js";

export type FetchContentTypeResponse<
	TSchema extends DeliveryClientSchema = DeliveryClientSchema,
	TCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>,
> = DeliveryResponse<ContentTypePayload<TSchema, TCodename>, DeliveryMetadata>;

export type FetchContentTypeQuery<
	TSchema extends DeliveryClientSchema,
	TCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>,
> = DeliveryFetchQuery<FetchContentTypeResponse<TSchema, TCodename>["payload"], FetchContentTypeResponse<TSchema, TCodename>["meta"]>;

export type FetchContentTypeQueryRequest<
	TSchema extends DeliveryClientSchema,
	TCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>,
> = DeliveryRequestWithCodename<
	ContentTypePayload<TSchema, TCodename>,
	readonly TCodename[],
	{
		readonly elements?: ElementSelectionQueryParam<ElementCodenamesOf<TSchema, TCodename>>;
	},
	never
>;

export function fetchContentTypeQuery<TSchema extends DeliveryClientSchema, const TCodename extends ContentTypeCodenameOf<TSchema>>(
	config: DeliveryClientConfig,
	request: FetchContentTypeQueryRequest<TSchema, TCodename>,
): FetchContentTypeQuery<TSchema, TCodename> {
	return createDeliveryFetchQuery({
		config,
		request,
		schema: request?.config?.schema,
		endpoint: `types/${encodeURIComponent(request.codename)}`,
	});
}
