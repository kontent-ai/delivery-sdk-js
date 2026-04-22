import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryFetchQuery } from "../../models/core.models.js";
import type { DeliveryRequestWithCodename, ElementSelectionQueryParam } from "../../models/request.models.js";
import { createDeliveryFetchQuery } from "../delivery-queries.js";
import { type ContentTypePayload, contentTypePayload } from "./content-type.models.js";

type ElementProperties<TSchema extends DeliveryClientSchema> = NonNullable<TSchema["elementCodenames"]>[number];

export type FetchContentTypeQuery<TSchema extends DeliveryClientSchema> = DeliveryFetchQuery<ContentTypePayload<TSchema>>;

export type FetchContentTypeQueryRequest<TSchema extends DeliveryClientSchema> = DeliveryRequestWithCodename<
	NonNullable<TSchema["contentTypeCodenames"]>,
	never,
	{
		readonly elements?: ElementSelectionQueryParam<ElementProperties<TSchema>>;
	},
	never
>;

export function fetchContentTypeQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request: FetchContentTypeQueryRequest<TSchema>,
): FetchContentTypeQuery<TSchema> {
	return createDeliveryFetchQuery({
		config,
		request,
		schema: contentTypePayload(config.schema),
		endpoint: `types/${request.codename}`,
	});
}
