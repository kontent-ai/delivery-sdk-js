import type { QueryResponse, SchemaInput } from "@kontent-ai/core-sdk";
import type {
	DeliveryClientConfig,
	DeliveryClientSchema,
	DeliveryMetadataWithToken,
	DeliveryPagedFetchQuery,
	LanguageCodenameOf,
} from "../../models/core.models.js";
import type {
	ContentTypesRequestParam,
	DeliveryRequestWithTokenPaging,
	ElementOrderQueryParam,
	ElementSelectionQueryParam,
	SystemOrderQueryParam,
	WithRaw,
} from "../../models/request.models.js";
import type { DeliveryResponse } from "../../models/response.models.js";
import type { ContentTypeCodenameOf, ElementCodenamesOf } from "../../queries/content-types/models/content-type.models.js";
import {
	asTypedItems,
	asTypedModularContent,
	extendItemsInPlace,
	extendModularContentInPlace,
	joinItems,
	withContentTypesFilter,
} from "../../transforms/content-item-transforms.js";
import { createDeliveryPagedByTokenQuery, transformDeliveryPagedByTokenQuery } from "../delivery-queries.js";
import type {
	ContentItemFilter,
	ContentItemOfType,
	ContentItemPayload,
	ContentItemPayloadExtended,
	ItemsFeedPayload,
	ItemsFeedPayloadExtended,
} from "./models/content-item.models.js";

type SystemProperties = keyof ContentItemPayload<DeliveryClientSchema>["system"];
/**
 * Element codenames of the content types selected by `ofContentTypes` (all content types when omitted).
 * `NoInfer` keeps `ofContentTypes` as the only inference source for the content types.
 */
type ScopedElementCodenames<
	TSchema extends DeliveryClientSchema,
	TTypeCodename extends ContentTypeCodenameOf<TSchema>,
> = ElementCodenamesOf<TSchema, NoInfer<TTypeCodename>>;

export type ItemsFeedResponse<
	TSchema extends DeliveryClientSchema = DeliveryClientSchema,
	TItem extends ContentItemPayloadExtended<TSchema> = ContentItemPayloadExtended<TSchema>,
	TResponseItem extends TItem = TItem,
> = DeliveryResponse<ItemsFeedPayloadExtended<TSchema, TItem, TResponseItem>, DeliveryMetadataWithToken>;

export type ItemsFeedQuery<
	TSchema extends DeliveryClientSchema,
	TItem extends ContentItemPayloadExtended<TSchema> = ContentItemPayloadExtended<TSchema>,
	TResponseItem extends TItem = TItem,
> = DeliveryPagedFetchQuery<
	ItemsFeedResponse<TSchema, TItem, TResponseItem>["payload"],
	ItemsFeedResponse<TSchema, TItem, TResponseItem>["meta"]
> &
	WithRaw<DeliveryPagedFetchQuery<ItemsFeedPayload<TSchema>, ItemsFeedResponse<TSchema>["meta"]>, ItemsFeedPayload<TSchema>>;

export type ItemsFeedQueryRequest<
	TSchema extends DeliveryClientSchema,
	TTypeCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>,
	TItem extends ContentItemPayloadExtended<TSchema> = ContentItemPayloadExtended<TSchema>,
> = DeliveryRequestWithTokenPaging<
	ItemsFeedPayloadExtended<TSchema, TItem, ContentItemOfType<TItem, TTypeCodename>>,
	{
		readonly order?: SystemOrderQueryParam<SystemProperties> | ElementOrderQueryParam<ScopedElementCodenames<TSchema, TTypeCodename>>;
		/**
		 * Determines which language variant of content items to return. By default, the API returns content in the default language.
		 */
		readonly language?: LanguageCodenameOf<TSchema>;

		/**
		 * Specifies which elements to include in the response. By default, all elements are returned.
		 */
		readonly elements?: ElementSelectionQueryParam<ScopedElementCodenames<TSchema, TTypeCodename>>;

		/**
		 * Specifies which elements to exclude from the response. By default, no elements are excluded.
		 */
		readonly excludeElements?: ElementSelectionQueryParam<ScopedElementCodenames<TSchema, TTypeCodename>>;

		/**
		 * Determines the nesting level for linked content items that the API returns.
		 * By default, only the first level of linked items is returned, which is the same as setting depth=1.
		 * To include more than one level of linked items in the response, set depth to 2 or more.
		 * To exclude all linked items from the response, set depth to 0.
		 */
		readonly depth?: number;
	},
	readonly ContentItemFilter<TSchema, NoInfer<TTypeCodename>>[]
> &
	ContentTypesRequestParam<TTypeCodename>;

export function itemsFeedQuery<
	TSchema extends DeliveryClientSchema,
	TItem extends ContentItemPayloadExtended<TSchema> = ContentItemPayloadExtended<TSchema>,
	TTypeCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>,
>(
	config: DeliveryClientConfig,
	request?: ItemsFeedQueryRequest<TSchema, TTypeCodename, TItem>,
): ItemsFeedQuery<TSchema, TItem, ContentItemOfType<TItem, TTypeCodename>> {
	const createRawQuery = (schema: SchemaInput<ItemsFeedPayload<TSchema>>) =>
		createDeliveryPagedByTokenQuery<ItemsFeedPayload<TSchema>>({
			config,
			request: withContentTypesFilter(request),
			schema,
			endpoint: "items-feed",
		});
	const extendedQuery = transformDeliveryPagedByTokenQuery({
		query: createRawQuery(undefined),
		transformSchema: request?.config?.schema,
		transform: (responses) => {
			const allItems = joinItems({
				items: responses.flatMap((m) => m.payload.items),
				modularContent: responses.map((m) => m.payload.modular_content),
			});

			return responses.map<
				QueryResponse<ItemsFeedPayloadExtended<TSchema, TItem, ContentItemOfType<TItem, TTypeCodename>>, DeliveryMetadataWithToken>
			>((m) => {
				const { items, modular_content } = m.payload;
				extendItemsInPlace(items, allItems);
				extendModularContentInPlace(modular_content, allItems);

				return {
					...m,
					payload: {
						...m.payload,
						items: asTypedItems<TSchema, ContentItemOfType<TItem, TTypeCodename>>(items),
						modular_content: asTypedModularContent<TSchema, TItem>(modular_content),
					},
				};
			});
		},
	});
	return { ...extendedQuery, raw: (options) => createRawQuery(options?.schema) };
}
