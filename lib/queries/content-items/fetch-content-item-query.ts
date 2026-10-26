import type { SchemaInput } from "@kontent-ai/core-sdk";
import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryFetchQuery, DeliveryMetadata } from "../../models/core.models.js";
import type { DeliveryRequestWithCodename, ElementSelectionQueryParam, WithRaw } from "../../models/request.models.js";
import type { DeliveryResponse } from "../../models/response.models.js";
import type { AllElementCodenamesOf } from "../../queries/content-types/models/content-type.models.js";
import { extendItemInPlace, extendModularContentInPlace, joinItems } from "../../transforms/content-item-transforms.js";
import { createDeliveryFetchQuery, transformDeliveryFetchQuery } from "../delivery-queries.js";
import type { FetchContentItemPayload, FetchContentItemPayloadExtended } from "./models/content-item.models.js";

export type FetchContentItemResponse<TSchema extends DeliveryClientSchema = DeliveryClientSchema> = DeliveryResponse<
	FetchContentItemPayloadExtended<TSchema>,
	DeliveryMetadata
>;

export type FetchContentItemQuery<TSchema extends DeliveryClientSchema> = DeliveryFetchQuery<
	FetchContentItemResponse<TSchema>["payload"],
	FetchContentItemResponse<TSchema>["meta"]
> &
	WithRaw<
		DeliveryFetchQuery<FetchContentItemPayload<TSchema>, FetchContentItemResponse<TSchema>["meta"]>,
		FetchContentItemPayload<TSchema>
	>;

export type FetchContentItemQueryRequest<TSchema extends DeliveryClientSchema> = DeliveryRequestWithCodename<
	FetchContentItemPayloadExtended<TSchema>,
	readonly string[],
	{
		/**
		 * Determines which language variant of content items to return. By default, the API returns content in the default language.
		 */
		readonly language?: NonNullable<TSchema["languageCodenames"]>[number];

		/**
		 * Specifies which elements to include in the response. By default, all elements are returned.
		 */
		readonly elements?: ElementSelectionQueryParam<AllElementCodenamesOf<TSchema>>;

		/**
		 * Specifies which elements to exclude from the response. By default, no elements are excluded.
		 */
		readonly excludeElements?: ElementSelectionQueryParam<AllElementCodenamesOf<TSchema>>;

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
	config: DeliveryClientConfig,
	request: FetchContentItemQueryRequest<TSchema>,
): FetchContentItemQuery<TSchema> {
	const createRawQuery = (schema: SchemaInput<FetchContentItemPayload<TSchema>>) =>
		createDeliveryFetchQuery<FetchContentItemPayload<TSchema>>({
			config,
			request,
			schema,
			endpoint: `items/${encodeURIComponent(request.codename)}`,
		});
	const extendedQuery = transformDeliveryFetchQuery({
		query: createRawQuery(undefined),
		transformSchema: request.config?.schema,
		transform: (response) => {
			const allItems = joinItems({
				modularContent: [response.payload.modular_content],
				items: [response.payload.item],
			});

			const { item, modular_content } = response.payload;
			extendItemInPlace(item, allItems);
			extendModularContentInPlace(modular_content, allItems);

			return {
				...response,
				meta: response.meta,
				payload: {
					...response.payload,
					item,
					modular_content,
				},
			};
		},
	});
	return { ...extendedQuery, raw: (options) => createRawQuery(options?.schema) };
}
