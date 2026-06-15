import type { QueryResponse } from "@kontent-ai/core-sdk";
import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryMetadata, DeliveryPagedFetchQuery } from "../../models/core.models.js";
import type { Filter } from "../../models/filter.models.js";
import type {
	DeliveryRequestWithUrlPaging,
	ElementOrderQueryParam,
	ElementSelectionQueryParam,
	SystemOrderQueryParam,
	WithRaw,
} from "../../models/request.models.js";
import type { AllElementCodenamesOf } from "../../queries/content-types/models/content-type.models.js";
import { joinItems, mapToExtendedItem, mapToExtendedModularContent } from "../../transforms/content-item-transforms.js";
import { createDeliveryPagedByUrlQuery, transformDeliveryPagedByUrlQuery } from "../delivery-queries.js";
import type {
	ContentItemPayload,
	ContentItemPayloadExtended,
	ListContentItemsPayload,
	ListContentItemsPayloadExtended,
} from "./models/content-item.models.js";

type SystemProperties = keyof ContentItemPayload<DeliveryClientSchema>["system"];
type ElementProperties<TSchema extends DeliveryClientSchema> = AllElementCodenamesOf<TSchema>;

export type ListContentItemsQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<
	ListContentItemsPayloadExtended<TSchema>,
	DeliveryMetadata
> &
	WithRaw<DeliveryPagedFetchQuery<ListContentItemsPayload<TSchema>, DeliveryMetadata>>;

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
	const rawQuery = createDeliveryPagedByUrlQuery<ListContentItemsPayload<TSchema>>({
		config,
		request,
		schema: async () => (await import("./schemas/content-item.schemas.js")).listContentItemsSchema<TSchema>(),
		endpoint: "items",
	});
	const extendedQuery = transformDeliveryPagedByUrlQuery({
		config,
		query: rawQuery,
		transformSchema: async () => (await import("./schemas/content-item.schemas.js")).listContentItemsSchemaExtended<TSchema>(),
		transform: (responses) => {
			const allItems = joinItems({
				items: responses.flatMap((m) => m.payload.items),
				modularContent: responses.map((m) => m.payload.modular_content),
			});

			return responses.map<QueryResponse<ListContentItemsPayloadExtended<TSchema>, DeliveryMetadata>>((m) => {
				return {
					...m,
					payload: {
						...m.payload,
						items: m.payload.items.map<ContentItemPayloadExtended<TSchema>>((item) => mapToExtendedItem({ allItems, item })),
						modular_content: mapToExtendedModularContent({ allItems, modularContents: m.payload.modular_content }),
					},
				};
			});
		},
	});
	return { ...extendedQuery, raw: () => rawQuery };
}
