import type {
	DeliveryClientConfig,
	DeliveryClientSchema,
	DeliveryMetadataWithToken,
	DeliveryPagedFetchQuery,
} from "../../models/core.models.js";
import type { Filter } from "../../models/filter.models.js";
import type { DeliveryRequestWithTokenPaging } from "../../models/request.models.js";
import type { DeliveryResponse } from "../../models/response.models.js";
import { createDeliveryPagedByTokenQuery } from "../delivery-queries.js";
import type { ContentItemSystemPayload, ItemsReferencingAssetPayload } from "./models/content-item.models.js";

export type ItemsReferencingAssetResponse<TSchema extends DeliveryClientSchema = DeliveryClientSchema> = DeliveryResponse<
	ItemsReferencingAssetPayload<TSchema>,
	DeliveryMetadataWithToken
>;

export type ItemsReferencingAssetQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<
	ItemsReferencingAssetResponse<TSchema>["payload"],
	ItemsReferencingAssetResponse<TSchema>["meta"]
>;

export type ItemsReferencingAssetQueryRequest<TSchema extends DeliveryClientSchema> = DeliveryRequestWithTokenPaging<
	never,
	readonly Filter<keyof ContentItemSystemPayload<TSchema>, never>[]
> & {
	/**
	 * Codename of the asset to retrieve referencing content items for.
	 */
	readonly codename: string;
};

export function itemsReferencingAssetQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig,
	request: ItemsReferencingAssetQueryRequest<TSchema>,
): ItemsReferencingAssetQuery<TSchema> {
	return createDeliveryPagedByTokenQuery({
		config,
		request,
		schema: async () => (await import("./schemas/content-item.schemas.js")).itemsReferencingAssetSchema<TSchema>(),
		endpoint: `assets/${encodeURIComponent(request.codename)}/used-in`,
	});
}
