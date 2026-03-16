import type { PickStringLiteral, SdkConfig } from "@kontent-ai/core-sdk";
import z from "zod";
import type { ListContentTypesQuery } from "../queries/content-types/list-content-types-query.js";
import type { ListLanguagesQuery } from "../queries/languages/list-languages-query.js";
import type { ListTaxonomiesQuery } from "../queries/taxonomies/list-taxonomies-query.js";

export type PartialDeliveryClientShema = {
	readonly languageCodenames?: readonly string[];
	readonly taxonomyCodenames?: readonly string[];
	readonly contentTypeCodenames?: readonly string[];
};

export type DeliveryClientSchema<TSchema extends PartialDeliveryClientShema = PartialDeliveryClientShema> = {
	readonly languageCodenames: TSchema["languageCodenames"] extends readonly string[] ? TSchema["languageCodenames"] : readonly string[];
	readonly taxonomyCodenames: TSchema["taxonomyCodenames"] extends readonly string[] ? TSchema["taxonomyCodenames"] : readonly string[];
	readonly contentTypeCodenames: TSchema["contentTypeCodenames"] extends readonly string[]
		? TSchema["contentTypeCodenames"]
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
};

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
