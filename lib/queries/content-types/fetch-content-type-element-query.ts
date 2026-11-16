import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryFetchQuery, DeliveryMetadata } from "../../models/core.models.js";
import type { DeliveryRequest } from "../../models/request.models.js";
import type { DeliveryResponse } from "../../models/response.models.js";
import { createDeliveryFetchQuery } from "../delivery-queries.js";
import type { ContentTypeCodenameOf, ContentTypeElementPayload, ElementCodenamesOf } from "./models/content-type.models.js";

export type FetchContentTypeElementResponse<
	TSchema extends DeliveryClientSchema = DeliveryClientSchema,
	TCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>,
	TElement extends ElementCodenamesOf<TSchema, TCodename> = ElementCodenamesOf<TSchema, TCodename>,
> = DeliveryResponse<ContentTypeElementPayload<TSchema, TCodename, TElement>, DeliveryMetadata>;

export type FetchContentTypeElementQuery<
	TSchema extends DeliveryClientSchema = DeliveryClientSchema,
	TCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>,
	TElement extends ElementCodenamesOf<TSchema, TCodename> = ElementCodenamesOf<TSchema, TCodename>,
> = DeliveryFetchQuery<
	FetchContentTypeElementResponse<TSchema, TCodename, TElement>["payload"],
	FetchContentTypeElementResponse<TSchema, TCodename, TElement>["meta"]
>;

export type FetchContentTypeElementQueryRequest<
	TSchema extends DeliveryClientSchema,
	TCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>,
	TElement extends ElementCodenamesOf<TSchema, TCodename> = ElementCodenamesOf<TSchema, TCodename>,
> = DeliveryRequest<ContentTypeElementPayload<TSchema, TCodename, TElement>, never, never> & {
	readonly typeCodename: TCodename;
	readonly elementCodename: TElement;
};

export function fetchContentTypeElementQuery<
	TSchema extends DeliveryClientSchema,
	const TCodename extends ContentTypeCodenameOf<TSchema>,
	const TElement extends ElementCodenamesOf<TSchema, TCodename>,
>(
	config: DeliveryClientConfig,
	request: FetchContentTypeElementQueryRequest<TSchema, TCodename, TElement>,
): FetchContentTypeElementQuery<TSchema, TCodename, TElement> {
	return createDeliveryFetchQuery({
		config,
		request,
		schema: request?.config?.schema,
		endpoint: `types/${encodeURIComponent(request.typeCodename)}/elements/${encodeURIComponent(request.elementCodename)}`,
	});
}
