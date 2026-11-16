import type {
	DeliveryClientConfig,
	DeliveryClientSchema,
	DeliveryMetadataWithToken,
	DeliveryPagedFetchQuery,
} from "../../models/core.models.js";
import type { DeliveryRequestWithTokenPaging } from "../../models/request.models.js";
import type { DeliveryResponse } from "../../models/response.models.js";
import { createDeliveryPagedByTokenQuery } from "../delivery-queries.js";
import type { ContentItemSystemFilter, ItemsReferencingItemPayload } from "./models/content-item.models.js";

export type ItemsReferencingItemResponse<TSchema extends DeliveryClientSchema = DeliveryClientSchema> = DeliveryResponse<
	ItemsReferencingItemPayload<TSchema>,
	DeliveryMetadataWithToken
>;

export type ItemsReferencingItemQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<
	ItemsReferencingItemResponse<TSchema>["payload"],
	ItemsReferencingItemResponse<TSchema>["meta"]
>;

export type ItemsReferencingItemQueryRequest<TSchema extends DeliveryClientSchema> = DeliveryRequestWithTokenPaging<
	ItemsReferencingItemPayload<TSchema>,
	never,
	readonly ContentItemSystemFilter<TSchema>[]
> & {
	/**
	 * Codename of the content item to retrieve referencing content items for.
	 */
	readonly codename: string;
};

export function itemsReferencingItemQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig,
	request: ItemsReferencingItemQueryRequest<TSchema>,
): ItemsReferencingItemQuery<TSchema> {
	return createDeliveryPagedByTokenQuery({
		config,
		request,
		schema: request?.config?.schema,
		endpoint: `items/${encodeURIComponent(request.codename)}/used-in`,
	});
}
