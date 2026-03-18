import type { FetchQuery, JsonValue, PagedFetchQuery, PickStringLiteral, SdkConfig } from "@kontent-ai/core-sdk";
import type { FetchContentTypeQuery, FetchContentTypeQueryRequest } from "../queries/content-types/fetch-content-type-query.js";
import type { ListContentTypesQuery } from "../queries/content-types/list-content-types-query.js";
import type { ListLanguagesQuery, ListLanguagesQueryRequest } from "../queries/languages/list-languages-query.js";
import type { FetchTaxonomyQuery, FetchTaxonomyQueryRequest } from "../queries/taxonomies/fetch-taxonomy-query.js";
import type { ListTaxonomiesQuery, ListTaxonomiesQueryRequest } from "../queries/taxonomies/list-taxonomies-query.js";
import type { DeliveryRequest } from "./request.models.js";

export type PartialDeliveryClientShema = {
	readonly languageCodenames?: readonly string[];
	readonly taxonomyCodenames?: readonly string[];
	readonly contentTypeCodenames?: readonly string[];
};

export type DeliveryClientSchema<TSchema extends PartialDeliveryClientShema = PartialDeliveryClientShema> = {
	readonly languageCodenames?: NonNullable<TSchema["languageCodenames"]> extends readonly string[]
		? NonNullable<TSchema["languageCodenames"]>
		: readonly string[];
	readonly taxonomyCodenames?: NonNullable<TSchema["taxonomyCodenames"]> extends readonly string[]
		? NonNullable<TSchema["taxonomyCodenames"]>
		: readonly string[];
	readonly contentTypeCodenames?: NonNullable<TSchema["contentTypeCodenames"]> extends readonly string[]
		? NonNullable<TSchema["contentTypeCodenames"]>
		: readonly string[];
};

export type ApiMode = "public" | "preview" | "secure";

export type DeliveryClientConfig<TSchema extends PartialDeliveryClientShema = PartialDeliveryClientShema> = SdkConfig &
	ApiDeliveryClientConfig & {
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
	};

export type ApiDeliveryClientConfig = PublicDeliveryClientConfig | PreviewDeliveryClientConfig | SecureDeliveryClientConfig;

export type DeliveryClientConfigWithSchema<TSchema extends DeliveryClientSchema> = DeliveryClientConfig<TSchema> & {
	readonly schema: TSchema;
};

export type DeliveryClient<TSchema extends DeliveryClientSchema = DeliveryClientSchema> = {
	readonly config: DeliveryClientConfig<TSchema>;

	listLanguages(request?: ListLanguagesQueryRequest): ListLanguagesQuery<TSchema>;
	listTaxonomies(request?: ListTaxonomiesQueryRequest): ListTaxonomiesQuery<TSchema>;
	listContentTypes(request?: DeliveryRequest): ListContentTypesQuery<TSchema>;
	fetchTaxonomy(request: FetchTaxonomyQueryRequest<TSchema>): FetchTaxonomyQuery<TSchema>;
	fetchContentType(request: FetchContentTypeQueryRequest<TSchema>): FetchContentTypeQuery<TSchema>;
};

export type DeliveryFetchQuery<TPayload extends JsonValue> = FetchQuery<TPayload, unknown>;

export type DeliveryPagedFetchQuery<TPayload extends JsonValue> = PagedFetchQuery<TPayload, unknown>;

export type DeliveryEndpoints =
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
