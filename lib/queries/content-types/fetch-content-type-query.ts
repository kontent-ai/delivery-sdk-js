import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryFetchQuery } from "../../models/core.models.js";
import type {
	DeliveryRequest,
	ElementSelectionQueryParam,
	QueryParameters,
	QueryRequestWithCodename,
} from "../../models/request.models.js";
import { createDeliveryFetchQuery } from "../delivery-queries.js";
import { type ContentTypePayload, contentTypePayload } from "./content-type.models.js";

export type FetchContentTypeQuery<TSchema extends DeliveryClientSchema> = DeliveryFetchQuery<ContentTypePayload<TSchema>>;

export type FetchContentTypeQueryRequest<TSchema extends DeliveryClientSchema> = DeliveryRequest &
	QueryRequestWithCodename<NonNullable<TSchema["contentTypeCodenames"]>> &
	QueryParameters<{
		readonly elements?: ElementSelectionQueryParam<NonNullable<TSchema["elementCodenames"]>[number]>;
	}>;

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
