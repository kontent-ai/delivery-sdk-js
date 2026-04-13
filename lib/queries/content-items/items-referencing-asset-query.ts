import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryPagedFetchQuery } from "../../models/core.models.js";
import type { PagingByTokenDeliveryRequest, QueryFilters } from "../../models/request.models.js";
import { createDeliveryPagingByTokenQuery } from "../delivery-queries.js";
import { type ContentItemSystemPayload, type ItemsReferencingAssetPayload, itemsReferencingAssetPayload } from "./content-item.models.js";

export type ItemsReferencingAssetQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<
	ItemsReferencingAssetPayload<TSchema>
>;

export type ItemsReferencingAssetQueryRequest<TSchema extends DeliveryClientSchema> = PagingByTokenDeliveryRequest & {
	/**
	 * Codename of the asset to retrieve referencing content items for.
	 */
	readonly codename: string;
} & QueryFilters<keyof ContentItemSystemPayload<TSchema>, never>;

export function itemsReferencingAssetQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request: ItemsReferencingAssetQueryRequest<TSchema>,
): ItemsReferencingAssetQuery<TSchema> {
	return createDeliveryPagingByTokenQuery({
		config,
		request,
		schema: itemsReferencingAssetPayload(config.schema),
		endpoint: `assets/${request.codename}/used-in`,
	});
}
