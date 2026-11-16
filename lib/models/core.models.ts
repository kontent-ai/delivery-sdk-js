import type { FetchQuery, JsonValue, PagedFetchQuery, PickStringLiteral, SdkConfig } from "@kontent-ai/core-sdk";
import type { FetchContentItemQuery, FetchContentItemQueryRequest } from "../queries/content-items/fetch-content-item-query.js";
import type { ItemsFeedQuery, ItemsFeedQueryRequest } from "../queries/content-items/items-feed-query.js";
import type {
	ItemsReferencingAssetQuery,
	ItemsReferencingAssetQueryRequest,
} from "../queries/content-items/items-referencing-asset-query.js";
import type { ItemsReferencingItemQuery, ItemsReferencingItemQueryRequest } from "../queries/content-items/items-referencing-item-query.js";
import type { ListContentItemsQuery, ListContentItemsQueryRequest } from "../queries/content-items/list-content-items-query.js";
import type { ContentItemOfType, ContentItemPayloadExtended } from "../queries/content-items/models/content-item.models.js";
import type {
	FetchContentTypeElementQuery,
	FetchContentTypeElementQueryRequest,
} from "../queries/content-types/fetch-content-type-element-query.js";
import type { FetchContentTypeQuery, FetchContentTypeQueryRequest } from "../queries/content-types/fetch-content-type-query.js";
import type { ListContentTypesQuery, ListContentTypesQueryRequest } from "../queries/content-types/list-content-types-query.js";
import type { ContentTypeCodenameOf, ElementCodenamesOf } from "../queries/content-types/models/content-type.models.js";
import type { ListLanguagesQuery, ListLanguagesQueryRequest } from "../queries/languages/list-languages-query.js";
import type { FetchTaxonomyQuery, FetchTaxonomyQueryRequest } from "../queries/taxonomies/fetch-taxonomy-query.js";
import type { ListTaxonomiesQuery, ListTaxonomiesQueryRequest } from "../queries/taxonomies/list-taxonomies-query.js";
import type { TaxonomyCodenameOf } from "../queries/taxonomies/models/taxonomy.models.js";
import type { DeliverySdkError } from "./error.models.js";

/**
 * Describes a single element of a content type in {@link DeliveryClientSchema}.
 *
 * `type` matches the element `type` returned by the Delivery API. Multiple choice elements list their option
 * codenames and taxonomy elements name the taxonomy group they use, so element values and filters can be narrowed.
 */
export type DeliveryElementSchema =
	| { readonly type: "text" }
	| { readonly type: "number" }
	| { readonly type: "rich_text" }
	| { readonly type: "date_time" }
	| { readonly type: "asset" }
	| { readonly type: "url_slug" }
	| { readonly type: "custom" }
	| { readonly type: "modular_content" }
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
	},
> = TSchema;

/**
 * The language codenames declared in the schema.
 */
export type LanguageCodenameOf<TSchema extends DeliveryClientSchema> = TSchema["languageCodenames"][number];

/**
 * The collection codenames declared in the schema.
 */
export type CollectionCodenameOf<TSchema extends DeliveryClientSchema> = TSchema["collectionCodenames"][number];

/**
 * The workflow codenames declared in the schema (the keys of the `workflows` map).
 */
export type WorkflowCodenameOf<TSchema extends DeliveryClientSchema> = keyof TSchema["workflows"] & string;

/**
 * The workflow step codenames of the workflow identified by `TWorkflow` (all workflows by default).
 */
export type WorkflowStepCodenameOf<
	TSchema extends DeliveryClientSchema,
	TWorkflow extends WorkflowCodenameOf<TSchema> = WorkflowCodenameOf<TSchema>,
> = TWorkflow extends keyof TSchema["workflows"] ? NonNullable<TSchema["workflows"][TWorkflow]>[number] : never;

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
	fetchContentItem(request: FetchContentItemQueryRequest<TSchema, TItem>): FetchContentItemQuery<TSchema, TItem>;
	listContentItems<const TTypeCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>>(
		request?: ListContentItemsQueryRequest<TSchema, TTypeCodename, TItem>,
	): ListContentItemsQuery<TSchema, TItem, ContentItemOfType<TItem, TTypeCodename>>;
	itemsFeed<const TTypeCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>>(
		request?: ItemsFeedQueryRequest<TSchema, TTypeCodename, TItem>,
	): ItemsFeedQuery<TSchema, TItem, ContentItemOfType<TItem, TTypeCodename>>;
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
