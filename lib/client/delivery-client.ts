import type {
	DeliveryClient,
	DeliveryClientConfig,
	DeliveryClientConfigWithSchema,
	DeliveryClientSchema,
	DeliveryClientTypes,
} from "../models/core.models.js";
import { listContentTypes } from "../queries/content-types/list-content-types-query.js";
import { listLanguagesQuery } from "../queries/languages/list-languages-query.js";
import { listTaxonomiesQuery } from "../queries/taxonomies/list-taxonomies-query.js";
import { toRequiredSchema } from "../utils/schema.utils.js";

export type InferClientTypesFromSchema<TSchema extends DeliveryClientSchema<DeliveryClientTypes>> = {
	readonly languageCodenames: NonNullable<TSchema["languageCodenames"]>;
	readonly taxonomyCodenames: NonNullable<TSchema["taxonomyCodenames"]>;
};

/**
 * Creates a strongly typed delivery client using the provided schema.
 *
 * The schema is used to infer codenames and other metadata, so your code
 * gets full compile-time safety.
 *
 * We strongly recommend generating the schema using the `@kontent-ai/model-generator`
 * npm package and passing it here.
 *
 * @example
 * const client = createDeliveryClient({
 *   apiMode: "public",
 *   environmentId: "x",
 *   schema: {
 *     languageCodenames: ["en-us", "de-de"] as const,
 *     taxonomyCodenames: ["categories"] as const,
 *   },
 * });
 */
export function createDeliveryClient<const TSchema extends DeliveryClientSchema<DeliveryClientTypes>>(
	config: DeliveryClientConfig<InferClientTypesFromSchema<TSchema>> & { readonly schema: TSchema },
): DeliveryClient<InferClientTypesFromSchema<TSchema>>;

/**
 * Creates a delivery client when you don't want to provide a concrete schema.
 *
 * This overload is more permissive and keeps codenames as generic strings,
 * which means you lose the compile-time guarantees that the typed overload provides.
 *
 * Prefer the overload above with an explicit `schema` whenever possible to get
 * better type safety and earlier feedback from the compiler.
 */
export function createDeliveryClient(config: DeliveryClientConfig<DeliveryClientTypes>): DeliveryClient<DeliveryClientTypes> {
	const configWithSchema: DeliveryClientConfigWithSchema<DeliveryClientTypes> = {
		...config,
		schema: toRequiredSchema<DeliveryClientTypes>(config.schema),
	};
	return {
		config,
		listTaxonomies: () => listTaxonomiesQuery<DeliveryClientTypes>(configWithSchema),
		listLanguages: () => listLanguagesQuery<DeliveryClientTypes>(configWithSchema),
		listContentTypes: () => listContentTypes<DeliveryClientTypes>(configWithSchema),
	};
}

// const fe = createDeliveryClient({
// 	apiMode: "preview",
// 	deliveryApiKey: "x",
// 	environmentId: "c",
// 	schema: { languageCodenames: ["en-us", "de-de"], taxonomyCodenames: ["categories"] },
// });

// type Fe3 = InferClientTypesFromSchema<{
// 	readonly taxonomyCodenames: readonly ("categories" | "tags")[];
// 	readonly languageCodenames: readonly ("en-us" | "de-de")[];
// }>;

// const fe3: DeliveryClient<Fe3> = createDeliveryClient<Fe3>({
// 	apiMode: "preview",
// 	deliveryApiKey: "x",
// 	environmentId: "c",
// 	schema: { languageCodenames: ["en-us", "de-de"], taxonomyCodenames: ["categories"] },
// });

// const query = await fe.listLanguages().fetchAllPages();
// const query3 = await fe3.listLanguages().fetchAllPages();
// query.responses[0]?.payload.languages[0]?.system.codename === "en-s";
// query3.responses[0]?.payload.languages[0]?.system.codename === "de-d";
