import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryPagedFetchQuery } from "../../models/core.models.js";
import type { Filter } from "../../models/filter.models.js";
import type { DeliveryRequestWithTokenPaging } from "../../models/request.models.js";
import { createDeliveryPagedByTokenQuery } from "../delivery-queries.js";
import { type ContentItemSystemPayload, type ItemsReferencingAssetPayload, itemsReferencingAssetPayload } from "./content-item.models.js";

export type ItemsReferencingAssetQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<
	ItemsReferencingAssetPayload<TSchema>
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
	config: DeliveryClientConfig<TSchema>,
	request: ItemsReferencingAssetQueryRequest<TSchema>,
): ItemsReferencingAssetQuery<TSchema> {
	return createDeliveryPagedByTokenQuery({
		config,
		request,
		schema: itemsReferencingAssetPayload(config.schema),
		endpoint: `assets/${request.codename}/used-in`,
	});
}
