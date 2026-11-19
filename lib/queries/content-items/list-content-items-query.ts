import type { QueryResponse, SchemaInput } from "@kontent-ai/core-sdk";
import type {
	DeliveryClientConfig,
	DeliveryClientSchema,
	DeliveryMetadata,
	DeliveryPagedFetchQuery,
	LanguageCodenameOf,
} from "../../models/core.models.js";
import type {
	ContentTypesRequestParam,
	DeliveryRequestWithUrlPaging,
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
	asTypedPayloadSchema,
	extendItemsInPlace,
	extendModularContentInPlace,
	joinItems,
	withContentTypesFilter,
} from "../../transforms/content-item-transforms.js";
import { createDeliveryPagedByUrlQuery, transformDeliveryPagedByUrlQuery } from "../delivery-queries.js";
import type {
	ContentItemFilter,
	ContentItemOfType,
	ContentItemPayload,
	ContentItemPayloadExtended,
	ListContentItemsPayload,
	ListContentItemsPayloadExtended,
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

export type ListContentItemsResponse<
	TSchema extends DeliveryClientSchema = DeliveryClientSchema,
	TItem extends ContentItemPayloadExtended<TSchema> = ContentItemPayloadExtended<TSchema>,
	TResponseItem extends TItem = TItem,
> = DeliveryResponse<ListContentItemsPayloadExtended<TSchema, TItem, TResponseItem>, DeliveryMetadata>;

export type ListContentItemsQuery<
	TSchema extends DeliveryClientSchema,
	TItem extends ContentItemPayloadExtended<TSchema> = ContentItemPayloadExtended<TSchema>,
	TResponseItem extends TItem = TItem,
> = DeliveryPagedFetchQuery<
	ListContentItemsResponse<TSchema, TItem, TResponseItem>["payload"],
	ListContentItemsResponse<TSchema, TItem, TResponseItem>["meta"]
> &
	WithRaw<
		DeliveryPagedFetchQuery<ListContentItemsPayload<TSchema>, ListContentItemsResponse<TSchema>["meta"]>,
		ListContentItemsPayload<TSchema>
	>;

export type ListContentItemsQueryRequest<
	TSchema extends DeliveryClientSchema,
	TTypeCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>,
> = DeliveryRequestWithUrlPaging<
	ListContentItemsPayloadExtended<TSchema>,
	SystemOrderQueryParam<SystemProperties> | ElementOrderQueryParam<ScopedElementCodenames<TSchema, TTypeCodename>>,
	{
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

		/**
		 * Adds the information about the total number of content items matching your query.
		 * Only the content filtering parameters affect the resulting number.
		 * Other parameters in your query, such as limit, skip, or order, don't have an effect on it.
		 */
		readonly includeTotalCount?: boolean;
	},
	readonly ContentItemFilter<TSchema, NoInfer<TTypeCodename>>[]
> &
	ContentTypesRequestParam<TTypeCodename>;

export function listContentItemsQuery<
	TSchema extends DeliveryClientSchema,
	TItem extends ContentItemPayloadExtended<TSchema> = ContentItemPayloadExtended<TSchema>,
	TTypeCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>,
>(
	config: DeliveryClientConfig,
	request?: ListContentItemsQueryRequest<TSchema, TTypeCodename>,
): ListContentItemsQuery<TSchema, TItem, ContentItemOfType<TItem, TTypeCodename>> {
	const createRawQuery = (schema: SchemaInput<ListContentItemsPayload<TSchema>>) =>
		createDeliveryPagedByUrlQuery<ListContentItemsPayload<TSchema>>({
			config,
			request: withContentTypesFilter(request),
			schema,
			endpoint: "items",
		});
	const extendedQuery = transformDeliveryPagedByUrlQuery({
		query: createRawQuery(undefined),
		transformSchema: asTypedPayloadSchema<ListContentItemsPayloadExtended<TSchema, TItem, ContentItemOfType<TItem, TTypeCodename>>>(
			request?.config?.schema,
		),
		transform: (responses) => {
			const allItems = joinItems({
				items: responses.flatMap((m) => m.payload.items),
				modularContent: responses.map((m) => m.payload.modular_content),
			});

			return responses.map<
				QueryResponse<ListContentItemsPayloadExtended<TSchema, TItem, ContentItemOfType<TItem, TTypeCodename>>, DeliveryMetadata>
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
