import type { FetchQuery, JsonValue, PagedFetchQuery, PickStringLiteral, SdkConfig } from "@kontent-ai/core-sdk";
import type { FetchContentItemQuery, FetchContentItemQueryRequest } from "../queries/content-items/fetch-content-item-query.js";
import type { ItemsFeedQuery, ItemsFeedQueryRequest } from "../queries/content-items/items-feed-query.js";
import type {
	ItemsReferencingAssetQuery,
	ItemsReferencingAssetQueryRequest,
} from "../queries/content-items/items-referencing-asset-query.js";
import type { ItemsReferencingItemQuery, ItemsReferencingItemQueryRequest } from "../queries/content-items/items-referencing-item-query.js";
import type { ListContentItemsQuery, ListContentItemsQueryRequest } from "../queries/content-items/list-content-items-query.js";
import type { ContentItemOfType, ContentItemPayloadExtended, ProjectedItem } from "../queries/content-items/models/content-item.models.js";
import type {
	FetchContentTypeElementQuery,
	FetchContentTypeElementQueryRequest,
} from "../queries/content-types/fetch-content-type-element-query.js";
import type { FetchContentTypeQuery, FetchContentTypeQueryRequest } from "../queries/content-types/fetch-content-type-query.js";
import type { ListContentTypesQuery, ListContentTypesQueryRequest } from "../queries/content-types/list-content-types-query.js";
import type { ListLanguagesQuery, ListLanguagesQueryRequest } from "../queries/languages/list-languages-query.js";
import type { FetchTaxonomyQuery, FetchTaxonomyQueryRequest } from "../queries/taxonomies/fetch-taxonomy-query.js";
import type { ListTaxonomiesQuery, ListTaxonomiesQueryRequest } from "../queries/taxonomies/list-taxonomies-query.js";
import type { AllElementCodenamesOf, ContentTypeCodenameOf, ElementCodenamesOf, TaxonomyCodenameOf } from "./codename.models.js";
import type { DeliverySdkError } from "./error.models.js";

/**
 * Describes a single element of a content type in {@link DeliveryClientSchema}.
 *
 * `type` matches the element `type` returned by the Delivery API. Multiple choice elements list their option
 * codenames and taxonomy elements name the taxonomy group they use, so element values and filters can be narrowed.
 * Linked items and rich text elements may list the content types they allow (`allowedContentTypes`, any type when
 * omitted), so item models must type the resolved linked items (and rich text components) accordingly.
 */
export type DeliveryElementSchema =
	| { readonly type: "text" }
	| { readonly type: "number" }
	| {
			readonly type: "rich_text";
			readonly allowedContentTypes?: readonly string[];
	  }
	| { readonly type: "date_time" }
	| { readonly type: "asset" }
	| { readonly type: "url_slug" }
	| { readonly type: "custom" }
	| {
			readonly type: "modular_content";
			readonly allowedContentTypes?: readonly string[];
	  }
	| {
			readonly type: "multiple_choice";
			readonly options: readonly string[];
	  }
	| {
			readonly type: "taxonomy";
			readonly taxonomyGroup: string;
	  };

/**
 * Element type literals as returned by the Delivery API.
 */
export type DeliveryElementType = DeliveryElementSchema["type"];

/**
 * Describes the codenames of a Kontent.ai environment. Generate it with `@kontent-ai/model-generator`.
 *
 * - `contentTypes` maps each content type codename to its elements (element codename to {@link DeliveryElementSchema}).
 * - `taxonomies` maps each taxonomy codename to its term codenames (all nesting levels).
 * - `workflows` maps each workflow codename to its step codenames.
 * - `snippets` (optional) maps each content type snippet codename to its elements, keyed by their codenames on items
 *   (`<snippet codename>__<element codename>`).
 */
export type DeliveryClientSchema<
	TSchema extends DeliveryClientSchema = {
		readonly languageCodenames: readonly string[];
		readonly collectionCodenames: readonly string[];
		readonly taxonomies: { readonly [taxonomyCodename: string]: readonly string[] };
		readonly workflows: { readonly [workflowCodename: string]: readonly string[] };
		readonly contentTypes: {
			readonly [contentTypeCodename: string]: { readonly [elementCodename: string]: DeliveryElementSchema };
		};
		readonly snippets?: {
			readonly [snippetCodename: string]: { readonly [elementCodename: string]: DeliveryElementSchema };
		};
	},
> = TSchema;

/**
 * Placeholder type if extension is needed in future
 */
export type DeliveryMetadata = Record<string, never>;

export type DeliveryMetadataWithToken = {
	readonly continuationToken: string | undefined;
};

export type TokenPagingDeliveryExtraResponseProps = {
	readonly nextContinuationToken: string | undefined;
};

export type UrlPagingDeliveryExtraResponseProps = {
	readonly nextPageUrl: string | undefined;
};

export type ApiMode = "public" | "preview" | "secure";

export type DeliveryClientConfig = SdkConfig<
	DeliveryApiConfig & {
		/**
		 * The environment ID of your Kontent.ai project. Can be found in the Kontent.ai app.
		 */
		readonly environmentId: string;
	}
>;

/**
 * A delivery client.
 *
 * - `TSchema` narrows codenames (languages, content types, elements, taxonomies, collections, workflows).
 * - `TItem` is the union of your content item models (e.g. `CoreItem` generated by `@kontent-ai/model-generator`).
 *   Content item responses (`items`, `item`, `modular_content`) are typed as this union.
 */
export type DeliveryClient<
	TSchema extends DeliveryClientSchema = DeliveryClientSchema,
	TItem extends ContentItemPayloadExtended<TSchema> = ContentItemPayloadExtended<TSchema>,
> = {
	readonly config: DeliveryClientConfig;

	listLanguages(request?: ListLanguagesQueryRequest<TSchema>): ListLanguagesQuery<TSchema>;
	listTaxonomies(request?: ListTaxonomiesQueryRequest<TSchema>): ListTaxonomiesQuery<TSchema>;
	listContentTypes(request?: ListContentTypesQueryRequest<TSchema>): ListContentTypesQuery<TSchema>;
	fetchTaxonomy<const TCodename extends TaxonomyCodenameOf<TSchema>>(
		request: FetchTaxonomyQueryRequest<TSchema, TCodename>,
	): FetchTaxonomyQuery<TSchema, TCodename>;
	fetchContentType<const TCodename extends ContentTypeCodenameOf<TSchema>>(
		request: FetchContentTypeQueryRequest<TSchema, TCodename>,
	): FetchContentTypeQuery<TSchema, TCodename>;
	fetchContentTypeElement<
		const TCodename extends ContentTypeCodenameOf<TSchema>,
		const TElement extends ElementCodenamesOf<TSchema, TCodename>,
	>(
		request: FetchContentTypeElementQueryRequest<TSchema, TCodename, TElement>,
	): FetchContentTypeElementQuery<TSchema, TCodename, TElement>;
	/**
	 * `elements` / `excludeElements` narrow the elements of the returned items (see {@link ProjectedItem}).
	 */
	fetchContentItem<
		const TSelected extends AllElementCodenamesOf<TSchema> = never,
		const TExcluded extends AllElementCodenamesOf<TSchema> = never,
	>(
		request: FetchContentItemQueryRequest<TSchema, TSelected, TExcluded>,
	): FetchContentItemQuery<TSchema, ProjectedItem<TItem, TSelected, TExcluded>>;
	/**
	 * `ofContentTypes` narrows the returned items to the given content types and scopes filters, order and element
	 * selection to their elements. `elements` / `excludeElements` narrow the elements of the returned items.
	 */
	listContentItems<
		const TTypeCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>,
		const TSelected extends ElementCodenamesOf<TSchema, NoInfer<TTypeCodename>> = never,
		const TExcluded extends ElementCodenamesOf<TSchema, NoInfer<TTypeCodename>> = never,
	>(
		request?: ListContentItemsQueryRequest<TSchema, TTypeCodename, TSelected, TExcluded>,
	): ListContentItemsQuery<
		TSchema,
		ProjectedItem<TItem, TSelected, TExcluded>,
		ContentItemOfType<ProjectedItem<TItem, TSelected, TExcluded>, TTypeCodename>
	>;
	/**
	 * Same narrowing as {@link DeliveryClient.listContentItems}.
	 */
	itemsFeed<
		const TTypeCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>,
		const TSelected extends ElementCodenamesOf<TSchema, NoInfer<TTypeCodename>> = never,
		const TExcluded extends ElementCodenamesOf<TSchema, NoInfer<TTypeCodename>> = never,
	>(
		request?: ItemsFeedQueryRequest<TSchema, TTypeCodename, TSelected, TExcluded>,
	): ItemsFeedQuery<
		TSchema,
		ProjectedItem<TItem, TSelected, TExcluded>,
		ContentItemOfType<ProjectedItem<TItem, TSelected, TExcluded>, TTypeCodename>
	>;
	itemsReferencingAsset(request: ItemsReferencingAssetQueryRequest<TSchema>): ItemsReferencingAssetQuery<TSchema>;
	itemsReferencingItem(request: ItemsReferencingItemQueryRequest<TSchema>): ItemsReferencingItemQuery<TSchema>;
};

export type DeliveryFetchQuery<TPayload extends JsonValue, TMeta extends DeliveryMetadata | DeliveryMetadataWithToken> = FetchQuery<
	TPayload,
	DeliverySdkError,
	TMeta
>;

export type DeliveryPagedFetchQuery<
	TPayload extends JsonValue,
	TMeta extends DeliveryMetadata | DeliveryMetadataWithToken,
> = PagedFetchQuery<TPayload, DeliverySdkError, TMeta>;

export type DeliveryEndpoint =
	| "languages"
	| "items"
	| `items/${string}`
	| "items-feed"
	| `assets/${string}/used-in`
	| `items/${string}/used-in`
	| "taxonomies"
	| `taxonomies/${string}`
	| "types"
	| `types/${string}`
	| `types/${string}/elements/${string}`;

export type WaitForLoadingNewContentHeaderName = "X-KC-Wait-For-Loading-New-Content";

export type DeliveryApiConfig =
	| PublicDeliveryClientConfig
	| PreviewDeliveryClientConfig
	| SecureDeliveryClientConfig
	| CustomDeliveryClientConfig;

type PublicDeliveryClientConfig = {
	/**
	 * The API mode of the delivery client. Public access is the default mode.
	 */
	readonly apiMode: PickStringLiteral<ApiMode, "public">;
};

type CustomDeliveryClientConfig = {
	readonly deliveryApiKey?: string;
	readonly apiMode?: never;
} & Required<Pick<SdkConfig, "baseUrl">>;

type PreviewDeliveryClientConfig = {
	/**
	 * The API mode of the delivery client.
	 */
	readonly apiMode: PickStringLiteral<ApiMode, "preview">;
	/**
	 * The delivery API key of your Kontent.ai project with preview access enabled.
	 */
	readonly deliveryApiKey: string;
};

type SecureDeliveryClientConfig = {
	/**
	 * The API mode of the delivery client.
	 */
	readonly apiMode: PickStringLiteral<ApiMode, "secure">;
	/**
	 * The delivery API key of your Kontent.ai project with secure access enabled.
	 */
	readonly deliveryApiKey: string;
};
