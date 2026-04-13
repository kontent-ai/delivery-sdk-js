import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryPagedFetchQuery } from "../../models/core.models.js";
import type {
	DeliveryRequest,
	ElementOrderQueryParam,
	ElementSelectionQueryParam,
	QueryFilters,
	QueryParameters,
	SystemOrderQueryParam,
} from "../../models/request.models.js";
import { createDeliveryPagingByTokenQuery } from "../delivery-queries.js";
import { type ContentItemPayload, type ContentItemSystemPayload, type ItemsFeedPayload, itemsFeedPayload } from "./content-item.models.js";

export type ItemsFeedQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<ItemsFeedPayload<TSchema>>;

export type ItemsFeedQueryRequest<TSchema extends DeliveryClientSchema> = DeliveryRequest &
	QueryFilters<keyof ContentItemSystemPayload<TSchema>, NonNullable<TSchema["elementCodenames"]>[number]> &
	QueryParameters<{
		readonly order?:
			| SystemOrderQueryParam<keyof ContentItemPayload<DeliveryClientSchema>["system"]>
			| ElementOrderQueryParam<NonNullable<TSchema["elementCodenames"]>[number]>;
		/**
		 * Determines which language variant of content items to return. By default, the API returns content in the default language.
		 */
		readonly language?: NonNullable<TSchema["languageCodenames"]>[number];

		/**
		 * Specifies which elements to include in the response. By default, all elements are returned.
		 */
		readonly elements?: ElementSelectionQueryParam<NonNullable<TSchema["elementCodenames"]>[number]>;

		/**
		 * Specifies which elements to exclude from the response. By default, no elements are excluded.
		 */
		readonly excludeElements?: ElementSelectionQueryParam<NonNullable<TSchema["elementCodenames"]>[number]>;

		/**
		 * Determines the nesting level for linked content items that the API returns.
		 * By default, only the first level of linked items is returned, which is the same as setting depth=1.
		 * To include more than one level of linked items in the response, set depth to 2 or more.
		 * To exclude all linked items from the response, set depth to 0.
		 */
		readonly depth?: number;
	}>;

export function itemsFeedQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request?: ItemsFeedQueryRequest<TSchema>,
): ItemsFeedQuery<TSchema> {
	return createDeliveryPagingByTokenQuery({
		config,
		request,
		schema: itemsFeedPayload(config.schema),
		endpoint: "items-feed",
	});
}
