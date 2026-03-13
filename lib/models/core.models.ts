import type { AdapterResponse, JsonValue, SdkConfig } from "@kontent-ai/core-sdk";
import z from "zod";
import type { ListContentTypesQuery } from "../queries/content-types/list-content-types-query.js";
import type { ListLanguagesQuery } from "../queries/languages/list-languages-query.js";
import type { ListTaxonomiesQuery } from "../queries/taxonomies/list-taxonomies-query.js";

export type DeliveryClientTypes = {
	// readonly contentItemType: IContentItem;
	// readonly contentTypeCodenames: readonly [string, ...string[]];
	// readonly workflowCodenames: readonly [string, ...string[]];
	// readonly workflowStepCodenames: readonly [string, ...string[]];
	// readonly collectionCodenames: readonly [string, ...string[]];
	readonly taxonomyCodenames: readonly string[];
	readonly languageCodenames: readonly string[];
	// readonly elementCodenames: readonly [string, ...string[]];
};

export type DeliveryClientSchema<TDeliveryClientTypes extends DeliveryClientTypes> = {
	readonly taxonomyCodenames: TDeliveryClientTypes["taxonomyCodenames"];
	readonly languageCodenames: TDeliveryClientTypes["languageCodenames"];
};

export type DeliveryResponseMeta<TExtraMetadata = unknown> = Pick<AdapterResponse<JsonValue>, "status" | "responseHeaders"> & {
	readonly continuationToken?: string;
} & TExtraMetadata;

export type DeliveryResponse<TPayload, TExtraMetadata = unknown> = {
	readonly payload: TPayload;
	readonly meta: DeliveryResponseMeta<TExtraMetadata>;
};

export type ApiMode = "public" | "preview" | "secure";

export type DeliveryClientConfig<TDeliveryClientTypes extends DeliveryClientTypes = DeliveryClientTypes> = SdkConfig &
	ApiDeliveryClientConfig & {
		/**
		 * The environment ID of your Kontent.ai project. Can be found under 'Project settings' in the Kontent.ai app.
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
		readonly schema?: DeliveryClientSchema<TDeliveryClientTypes>;
	};

export type ApiDeliveryClientConfig = PublicDeliveryClientConfig | PreviewDeliveryClientConfig | SecureDeliveryClientConfig;

export type PublicDeliveryClientConfig = {
	readonly apiMode: PickStringLiteral<ApiMode, "public">;
};

export type PreviewDeliveryClientConfig = {
	readonly apiMode: PickStringLiteral<ApiMode, "preview">;
	readonly deliveryApiKey: string;
};

export type SecureDeliveryClientConfig = {
	readonly apiMode: PickStringLiteral<ApiMode, "secure">;
	readonly deliveryApiKey: string;
};

/**
 * Delivery client instance. This is the main entry point for the delivery API.
 *
 */
export type DeliveryClient<TDeliveryClientTypes extends DeliveryClientTypes = DeliveryClientTypes> = {
	readonly config: DeliveryClientConfig<TDeliveryClientTypes>;

	/**
	 * List languages.
	 */
	listLanguages(): ListLanguagesQuery<TDeliveryClientTypes>;

	/**
	 * List taxonomies.
	 */
	listTaxonomies(): ListTaxonomiesQuery<TDeliveryClientTypes>;

	/**
	 * List content types.
	 */
	listContentTypes(): ListContentTypesQuery<TDeliveryClientTypes>;
};

export type DeliveryClientConfigWithSchema<TDeliveryClientTypes extends DeliveryClientTypes> = DeliveryClientConfig<TDeliveryClientTypes> &
	Required<Pick<DeliveryClientConfig<TDeliveryClientTypes>, "schema">>;

export const paginationSchema = z.object({
	pagination: z
		.object({
			skip: z.number(),
			limit: z.number(),
			count: z.number(),
			next_page: z.string(),
		})
		.readonly(),
});

export type PaginationSchema = Readonly<z.infer<typeof paginationSchema>>;

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

type PickStringLiteral<T extends string, U extends T> = U;
