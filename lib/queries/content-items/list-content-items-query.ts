import type { QueryResponse, SchemaInput } from "@kontent-ai/core-sdk";
import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryMetadata, DeliveryPagedFetchQuery } from "../../models/core.models.js";
import type {
	DeliveryRequestWithUrlPaging,
	ElementOrderQueryParam,
	ElementSelectionQueryParam,
	SystemOrderQueryParam,
	WithRaw,
} from "../../models/request.models.js";
import type { DeliveryResponse } from "../../models/response.models.js";
import type { AllElementCodenamesOf } from "../../queries/content-types/models/content-type.models.js";
import { extendItemsInPlace, extendModularContentInPlace, joinItems } from "../../transforms/content-item-transforms.js";
import { createDeliveryPagedByUrlQuery, transformDeliveryPagedByUrlQuery } from "../delivery-queries.js";
import type {
	ContentItemFilter,
	ContentItemPayload,
	ListContentItemsPayload,
	ListContentItemsPayloadExtended,
} from "./models/content-item.models.js";

type SystemProperties = keyof ContentItemPayload<DeliveryClientSchema>["system"];
type AllElementCodenames<TSchema extends DeliveryClientSchema> = AllElementCodenamesOf<TSchema>;

export type ListContentItemsResponse<TSchema extends DeliveryClientSchema = DeliveryClientSchema> = DeliveryResponse<
	ListContentItemsPayloadExtended<TSchema>,
	DeliveryMetadata
>;

export type ListContentItemsQuery<TSchema extends DeliveryClientSchema> = DeliveryPagedFetchQuery<
	ListContentItemsResponse<TSchema>["payload"],
	ListContentItemsResponse<TSchema>["meta"]
> &
	WithRaw<
		DeliveryPagedFetchQuery<ListContentItemsPayload<TSchema>, ListContentItemsResponse<TSchema>["meta"]>,
		ListContentItemsPayload<TSchema>
	>;

export type ListContentItemsQueryRequest<TSchema extends DeliveryClientSchema> = DeliveryRequestWithUrlPaging<
	ListContentItemsPayloadExtended<TSchema>,
	SystemOrderQueryParam<SystemProperties> | ElementOrderQueryParam<AllElementCodenames<TSchema>>,
	{
		/**
		 * Determines which language variant of content items to return. By default, the API returns content in the default language.
		 */
		readonly language?: NonNullable<TSchema["languageCodenames"]>[number];

		/**
		 * Specifies which elements to include in the response. By default, all elements are returned.
		 */
		readonly elements?: ElementSelectionQueryParam<AllElementCodenames<TSchema>>;

		/**
		 * Specifies which elements to exclude from the response. By default, no elements are excluded.
		 */
		readonly excludeElements?: ElementSelectionQueryParam<AllElementCodenames<TSchema>>;

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
	readonly ContentItemFilter<TSchema>[]
>;

export function listContentItemsQuery<TSchema extends DeliveryClientSchema>(
	config: DeliveryClientConfig,
	request?: ListContentItemsQueryRequest<TSchema>,
): ListContentItemsQuery<TSchema> {
	const createRawQuery = (schema: SchemaInput<ListContentItemsPayload<TSchema>>) =>
		createDeliveryPagedByUrlQuery<ListContentItemsPayload<TSchema>>({
			config,
			request,
			schema,
			endpoint: "items",
		});
	const extendedQuery = transformDeliveryPagedByUrlQuery({
		query: createRawQuery(undefined),
		transformSchema: request?.config?.schema,
		transform: (responses) => {
			const allItems = joinItems({
				items: responses.flatMap((m) => m.payload.items),
				modularContent: responses.map((m) => m.payload.modular_content),
			});

			return responses.map<QueryResponse<ListContentItemsPayloadExtended<TSchema>, DeliveryMetadata>>((m) => {
				const { items, modular_content } = m.payload;
				extendItemsInPlace(items, allItems);
				extendModularContentInPlace(modular_content, allItems);

				return {
					...m,
					payload: {
						...m.payload,
						items,
						modular_content,
					},
				};
			});
		},
	});
	return { ...extendedQuery, raw: (options) => createRawQuery(options?.schema) };
}
