import type { FetchQuery } from "@kontent-ai/core-sdk";
import type { DeliveryClientConfig, DeliveryClientSchema } from "../../models/core.models.js";
import type { DeliveryRequest, QueryRequestWithCodename } from "../../models/request.models.js";
import { createDeliveryFetchQuery } from "../delivery-queries.js";
import { type ContentTypePayload, contentTypePayload } from "./content-type.models.js";

export type FetchContentTypeQuery<TSchema extends DeliveryClientSchema> = FetchQuery<ContentTypePayload<TSchema>, unknown>;

export type FetchContentTypeQueryRequest<TSchema extends DeliveryClientSchema> = DeliveryRequest &
	QueryRequestWithCodename<NonNullable<TSchema["contentTypeCodenames"]>>;

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
