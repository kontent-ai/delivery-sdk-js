import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryPagedFetchQuery } from "../../models/core.models.js";
import type { Filter } from "../../models/filter.models.js";
import type {
	DeliveryRequestWithUrlPaging,
	ElementOrderQueryParam,
	ElementSelectionQueryParam,
	SystemOrderQueryParam,
} from "../../models/request.models.js";
import { createDeliveryPagedByUrlQuery } from "../delivery-queries.js";
import { type ContentItemPayload, type ListContentItemsPayload, listContentItemsPayload } from "./content-item.models.js";

type SystemProperties = keyof ContentItemPayload<DeliveryClientSchema>["system"];
type ElementProperties<TSchema extends DeliveryClientSchema> = NonNullable<TSchema["elementCodenames"]>[number];

export type ListContentItemsQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<ListContentItemsPayload<TSchema>>;

export type ListContentItemsQueryRequest<TSchema extends DeliveryClientSchema> = DeliveryRequestWithUrlPaging<
	SystemOrderQueryParam<SystemProperties> | ElementOrderQueryParam<ElementProperties<TSchema>>,
	{
		/**
		 * Determines which language variant of content items to return. By default, the API returns content in the default language.
		 */
		readonly language?: NonNullable<TSchema["languageCodenames"]>[number];

		/**
		 * Specifies which elements to include in the response. By default, all elements are returned.
		 */
		readonly elements?: ElementSelectionQueryParam<ElementProperties<TSchema>>;

		/**
		 * Specifies which elements to exclude from the response. By default, no elements are excluded.
		 */
		readonly excludeElements?: ElementSelectionQueryParam<ElementProperties<TSchema>>;

		/**
		 * Determines the nesting level for linked content items that the API returns.
		 * By default, only the first level of linked items is returned, which is the same as setting depth=1.
		 * To include more than one level of linked items in the response, set depth to 2 or more.
		 * To exclude all linked items from the response, set depth to 0.
		 */
		readonly depth?: number;

		/**
		 * Adds the information about the total number of content items matching your query.
		 * Only the content filtering parameters affect the resulting number.
		 * Other parameters in your query, such as limit, skip, or order, don't have an effect on it.
		 */
		readonly includeTotalCount?: boolean;
	},
	readonly Filter<SystemProperties, ElementProperties<TSchema>>[]
>;

export function listContentItemsQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig<TSchema>,
	request?: ListContentItemsQueryRequest<TSchema>,
): ListContentItemsQuery<TSchema> {
	return createDeliveryPagedByUrlQuery({
		config,
		request,
		schema: listContentItemsPayload(config.schema),
		endpoint: "items",
	});
}
