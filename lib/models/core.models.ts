import type { FetchQuery, JsonValue, PagedFetchQuery, PickStringLiteral, SdkConfig } from "@kontent-ai/core-sdk";
import type { FetchContentItemQuery, FetchContentItemQueryRequest } from "../queries/content-items/fetch-content-item-query.js";
import type { ItemsFeedQuery, ItemsFeedQueryRequest } from "../queries/content-items/items-feed-query.js";
import type {
	ItemsReferencingAssetQuery,
	ItemsReferencingAssetQueryRequest,
} from "../queries/content-items/items-referencing-asset-query.js";
import type { ListContentItemsQuery, ListContentItemsQueryRequest } from "../queries/content-items/list-content-items-query.js";
import type {
	FetchContentTypeElementQuery,
	FetchContentTypeElementQueryRequest,
} from "../queries/content-types/fetch-content-type-element-query.js";
import type { FetchContentTypeQuery, FetchContentTypeQueryRequest } from "../queries/content-types/fetch-content-type-query.js";
import type { ListContentTypesQuery, ListContentTypesQueryRequest } from "../queries/content-types/list-content-types-query.js";
import type { ListLanguagesQuery, ListLanguagesQueryRequest } from "../queries/languages/list-languages-query.js";
import type { FetchTaxonomyQuery, FetchTaxonomyQueryRequest } from "../queries/taxonomies/fetch-taxonomy-query.js";
import type { ListTaxonomiesQuery, ListTaxonomiesQueryRequest } from "../queries/taxonomies/list-taxonomies-query.js";
import type { DeliverySdkError } from "./error.models.js";

export type DefaultDeliveryClientSchema = {
	readonly languageCodenames: readonly string[];
	readonly taxonomyCodenames: readonly string[];
	readonly contentTypeCodenames: readonly string[];
	readonly elementCodenames: readonly string[];
	readonly collectionCodenames: readonly string[];
	readonly workflowCodenames: readonly string[];
	readonly workflowStepCodenames: readonly string[];
};

export type DeliveryClientSchema<TSchema extends DefaultDeliveryClientSchema = DefaultDeliveryClientSchema> = {
	readonly languageCodenames: TSchema["languageCodenames"];
	readonly taxonomyCodenames: TSchema["taxonomyCodenames"];
	readonly contentTypeCodenames: TSchema["contentTypeCodenames"];
	readonly elementCodenames: TSchema["elementCodenames"];
	readonly collectionCodenames: TSchema["collectionCodenames"];
	readonly workflowCodenames: TSchema["workflowCodenames"];
	readonly workflowStepCodenames: TSchema["workflowStepCodenames"];
};

/**
 * Placeholder type if extension is needed in future
 */
export type DeliveryMetadata = NonNullable<unknown>;

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

export type DeliveryClientConfig<TSchema extends DefaultDeliveryClientSchema = DefaultDeliveryClientSchema> = SdkConfig<
	DeliveryApiConfig & {
		/**
		 * The environment ID of your Kontent.ai project. Can be found in the Kontent.ai app.
		 */
		readonly environmentId: string;

		/**
		 * Schema for the delivery client.
		 *
		 * If you provide schema, you can get stronger type safety by enabling the response validation.
		 *
		 * Generate using the `@kontent-ai/model-generator` npm package.
		 *
		 * @see https://github.com/kontent-ai/model-generator-js
		 */
		readonly schema?: TSchema | undefined;
	}
>;

export type DeliveryApiConfig = PublicDeliveryClientConfig | PreviewDeliveryClientConfig | SecureDeliveryClientConfig;

export type DeliveryClient<TSchema extends DeliveryClientSchema = DeliveryClientSchema> = {
	readonly config: DeliveryClientConfig<TSchema>;

	listLanguages(request?: ListLanguagesQueryRequest): ListLanguagesQuery<TSchema>;
	listTaxonomies(request?: ListTaxonomiesQueryRequest): ListTaxonomiesQuery<TSchema>;
	listContentTypes(request?: ListContentTypesQueryRequest<TSchema>): ListContentTypesQuery<TSchema>;
	fetchTaxonomy(request: FetchTaxonomyQueryRequest<TSchema>): FetchTaxonomyQuery<TSchema>;
	fetchContentType(request: FetchContentTypeQueryRequest<TSchema>): FetchContentTypeQuery<TSchema>;
	fetchContentTypeElement(request: FetchContentTypeElementQueryRequest<TSchema>): FetchContentTypeElementQuery<TSchema>;
	fetchContentItem(request: FetchContentItemQueryRequest<TSchema>): FetchContentItemQuery<TSchema>;
	listContentItems(request?: ListContentItemsQueryRequest<TSchema>): ListContentItemsQuery<TSchema>;
	itemsFeed(request?: ItemsFeedQueryRequest<TSchema>): ItemsFeedQuery<TSchema>;
	itemsReferencingAsset(request: ItemsReferencingAssetQueryRequest<TSchema>): ItemsReferencingAssetQuery<TSchema>;
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

type PublicDeliveryClientConfig = {
	/**
	 * The API mode of the delivery client. Public access is the default mode.
	 */
	readonly apiMode: PickStringLiteral<ApiMode, "public">;
};

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
