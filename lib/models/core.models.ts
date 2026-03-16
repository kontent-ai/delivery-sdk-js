import type { PickStringLiteral, SdkConfig } from "@kontent-ai/core-sdk";
import type { ListContentTypesQuery } from "../queries/content-types/list-content-types-query.js";
import type { ListLanguagesQuery } from "../queries/languages/list-languages-query.js";
import type { FetchTaxonomyQuery } from "../queries/taxonomies/fetch-taxonomy-query.js";
import type { ListTaxonomiesQuery } from "../queries/taxonomies/list-taxonomies-query.js";

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
		readonly schema?: TSchema | undefined;
	};

export type ApiDeliveryClientConfig = PublicDeliveryClientConfig | PreviewDeliveryClientConfig | SecureDeliveryClientConfig;

export type DeliveryClientConfigWithSchema<TSchema extends DeliveryClientSchema> = DeliveryClientConfig<TSchema> & {
	readonly schema: TSchema;
};

export type DeliveryClient<TSchema extends DeliveryClientSchema = DeliveryClientSchema> = {
	readonly config: DeliveryClientConfig<TSchema>;

	listLanguages(): ListLanguagesQuery<TSchema>;
	listTaxonomies(): ListTaxonomiesQuery<TSchema>;
	listContentTypes(): ListContentTypesQuery<TSchema>;
	fetchTaxonomy(codename: NonNullable<TSchema["taxonomyCodenames"]>[number]): FetchTaxonomyQuery<TSchema>;
};

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
	readonly apiMode: PickStringLiteral<ApiMode, "public">;
};

type PreviewDeliveryClientConfig = {
	readonly apiMode: PickStringLiteral<ApiMode, "preview">;
	readonly deliveryApiKey: string;
};

type SecureDeliveryClientConfig = {
	readonly apiMode: PickStringLiteral<ApiMode, "secure">;
	readonly deliveryApiKey: string;
};
