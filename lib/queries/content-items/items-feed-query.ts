import type { QueryResponse } from "@kontent-ai/core-sdk";
import type {
	DeliveryClientConfig,
	DeliveryClientSchema,
	DeliveryMetadataWithToken,
	DeliveryPagedFetchQuery,
} from "../../models/core.models.js";
import type { Filter } from "../../models/filter.models.js";
import type {
	DeliveryRequestWithTokenPaging,
	ElementOrderQueryParam,
	ElementSelectionQueryParam,
	SystemOrderQueryParam,
	WithRaw,
} from "../../models/request.models.js";
import type { AllElementCodenamesOf } from "../../queries/content-types/models/content-type.models.js";
import { joinItems, mapToExtendedItem, mapToExtendedModularContent } from "../../transforms/content-item-transforms.js";
import { createDeliveryPagedByTokenQuery, transformDeliveryPagedByTokenQuery } from "../delivery-queries.js";
import type {
	ContentItemPayload,
	ContentItemPayloadExtended,
	ItemsFeedPayload,
	ItemsFeedPayloadExtended,
} from "./models/content-item.models.js";

type SystemProperties = keyof ContentItemPayload<DeliveryClientSchema>["system"];
type ElementProperties<TSchema extends DeliveryClientSchema> = AllElementCodenamesOf<TSchema>;

export type ItemsFeedQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<
	ItemsFeedPayloadExtended<TSchema>,
	DeliveryMetadataWithToken
> &
	WithRaw<DeliveryPagedFetchQuery<ItemsFeedPayload<TSchema>, DeliveryMetadataWithToken>>;

export type ItemsFeedQueryRequest<TSchema extends DeliveryClientSchema> = DeliveryRequestWithTokenPaging<
	{
		readonly order?: SystemOrderQueryParam<SystemProperties> | ElementOrderQueryParam<ElementProperties<TSchema>>;
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
	},
	readonly Filter<SystemProperties, ElementProperties<TSchema>>[]
>;

export function itemsFeedQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig,
	request?: ItemsFeedQueryRequest<TSchema>,
): ItemsFeedQuery<TSchema> {
	const rawQuery = createDeliveryPagedByTokenQuery<ItemsFeedPayload<TSchema>>({
		config,
		request,
		schema: async () => (await import("./schemas/content-item.schemas.js")).itemsFeedSchema<TSchema>(),
		endpoint: "items-feed",
	});
	const extendedQuery = transformDeliveryPagedByTokenQuery({
		config,
		query: rawQuery,
		transformSchema: async () => (await import("./schemas/content-item.schemas.js")).itemsFeedSchemaExtended<TSchema>(),
		transform: (responses) => {
			const allItems = joinItems({
				items: responses.flatMap((m) => m.payload.items),
				modularContent: responses.map((m) => m.payload.modular_content),
			});

			return responses.map<QueryResponse<ItemsFeedPayloadExtended<TSchema>, DeliveryMetadataWithToken>>((m) => {
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
