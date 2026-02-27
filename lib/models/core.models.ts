import type { AdapterResponse, SdkConfig } from "@kontent-ai/core-sdk";
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
	readonly taxonomyCodenames?: TDeliveryClientTypes["taxonomyCodenames"];
	readonly languageCodenames?: TDeliveryClientTypes["languageCodenames"];
};

export type DeliveryResponseMeta<TExtraMetadata = unknown> = Pick<AdapterResponse, "status" | "responseHeaders"> & {
	readonly continuationToken?: string;
} & TExtraMetadata;

export type DeliveryResponse<TPayload, TExtraMetadata = unknown> = {
	readonly payload: TPayload;
	readonly meta: DeliveryResponseMeta<TExtraMetadata>;
};

export type ApiMode = "public" | "preview" | "secure";

export type DeliveryClientConfig = SdkConfig & {
	/**
	 * The environment ID of your Kontent.ai project. Can be found under 'Project settings' in the Kontent.ai app.
	 */
	readonly environmentId: string;

	/**
	 * Delivery API key.
	 *
	 * Required for secure and preview modes.
	 */
	readonly deliveryApiKey?: string;

	/**
	 * Mode for the API.
	 *
	 * Secure mode requires a delivery API key with secure access.
	 * Preview mode requires a delivery API key with preview access.
	 * Delivery mode is used for public access.
	 */
	readonly apiMode: ApiMode;
};

/**
 * Delivery client instance. This is the main entry point for the delivery API.
 *
 */
export type DeliveryClient<TDeliveryClientTypes extends DeliveryClientTypes = DeliveryClientTypes> = {
	readonly config: DeliveryClientConfig;

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

export type CreateDeliveryClientOptions = Omit<DeliveryClientConfig, "environmentId" | "apiMode" | "deliveryApiKey">;

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
