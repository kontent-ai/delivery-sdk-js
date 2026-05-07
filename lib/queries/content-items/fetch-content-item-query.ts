import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryFetchQuery, DeliveryMetadata } from "../../models/core.models.js";
import type { DeliveryRequestWithCodename, ElementSelectionQueryParam } from "../../models/request.models.js";
import { createDeliveryFetchQuery } from "../delivery-queries.js";
import { type FetchContentItemPayload, fetchContentItemSchema } from "./content-item.models.js";

export type FetchContentItemQuery<TSchema extends DeliveryClientSchema> = DeliveryFetchQuery<
	FetchContentItemPayload<TSchema>,
	DeliveryMetadata
>;

export type FetchContentItemQueryRequest<TSchema extends DeliveryClientSchema> = DeliveryRequestWithCodename<
	readonly string[],
	{
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
	},
	never
>;

export function fetchContentItemQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request: FetchContentItemQueryRequest<TSchema>,
): FetchContentItemQuery<TSchema> {
	return createDeliveryFetchQuery({
		config,
		request,
		schema: fetchContentItemSchema<TSchema>(),
		endpoint: `items/${request.codename}`,
	});
}
