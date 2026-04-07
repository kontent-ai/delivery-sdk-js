import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryFetchQuery } from "../../models/core.models.js";
import type {
	DeliveryRequest,
	ElementSelectionQueryParam,
	QueryParameters,
	QueryRequestWithCodename,
} from "../../models/request.models.js";
import { createDeliveryFetchQuery } from "../delivery-queries.js";
import { type FetchContentItemPayload, fetchContentItemPayload } from "./content-item.models.js";

export type FetchContentItemQuery<TSchema extends DeliveryClientSchema> = DeliveryFetchQuery<FetchContentItemPayload<TSchema>>;

export type FetchContentItemQueryRequest<TSchema extends DeliveryClientSchema> = DeliveryRequest &
	QueryRequestWithCodename<NonNullable<TSchema["contentTypeCodenames"]>> &
	QueryParameters<{
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

export function fetchContentItemQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request: FetchContentItemQueryRequest<TSchema>,
): FetchContentItemQuery<TSchema> {
	return createDeliveryFetchQuery({
		config,
		request,
		schema: fetchContentItemPayload(config.schema),
		endpoint: `items/${request.codename}`,
	});
}
