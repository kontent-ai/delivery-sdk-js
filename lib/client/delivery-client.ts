import type {
	DefaultDeliveryClientSchema,
	DeliveryClient,
	DeliveryClientConfig,
	DeliveryClientConfigWithSchema,
	FullDeliveryClientSchema,
	PartialDeliveryClientShema,
} from "../models/core.models.js";
import { listContentTypes } from "../queries/content-types/list-content-types-query.js";
import { listLanguagesQuery } from "../queries/languages/list-languages-query.js";
import { listTaxonomiesQuery } from "../queries/taxonomies/list-taxonomies-query.js";
import { toRequiredSchema } from "../utils/schema.utils.js";

/**
 * Creates a delivery client. When you provide a schema, codenames are inferred for type safety.
 * When schema is omitted or undefined, codenames are generic strings.
 *
 * We highly recommend generating the schema using the `@kontent-ai/model-generator` npm package.
 * and passing it here for full compile-time safety.
 *
 * By enabling the response validation, you can also achieve a run-time type safety.
 *
 * @example
 * // With schema – narrow codename types
 * const client = createDeliveryClient({
 *   apiMode: "public",
 *   environmentId: "x",
 *   schema: { languageCodenames: ["en-us", "es-es"], taxonomyCodenames: ["tags"] },
 * });
 *
 * @example
 * // Without schema – schema optional, codenames are string
 * const client = createDeliveryClient({
 *   apiMode: "public",
 *   environmentId: "x",
 * });
 */
export function createDeliveryClient<const TSchema extends PartialDeliveryClientShema = PartialDeliveryClientShema>(
	config: DeliveryClientConfig<TSchema>,
): DeliveryClient<FullDeliveryClientSchema<TSchema>> {
	if (config.schema === undefined) {
		const configWithSchema: DeliveryClientConfigWithSchema<DefaultDeliveryClientSchema> = {
			...config,
			schema: toRequiredSchema(undefined),
		};
		return {
			config: configWithSchema,
			listTaxonomies: () => listTaxonomiesQuery(configWithSchema),
			listLanguages: () => listLanguagesQuery(configWithSchema),
			listContentTypes: () => listContentTypes(configWithSchema),
		};
	}
	const schema = config.schema;
	const configWithSchema: DeliveryClientConfigWithSchema<FullDeliveryClientSchema<TSchema>> = {
		...config,
		schema: schema as FullDeliveryClientSchema<TSchema>,
	};
	return {
		config: configWithSchema,
		listTaxonomies: () => listTaxonomiesQuery(configWithSchema),
		listLanguages: () => listLanguagesQuery(configWithSchema),
		listContentTypes: () => listContentTypes(configWithSchema),
	};
}

const fe = createDeliveryClient({
	apiMode: "preview",
	deliveryApiKey: "x",
	environmentId: "c",
	schema: { languageCodenames: ["en-us", "de-de"], taxonomyCodenames: ["categories"] },
});

const fefe = await fe.listContentTypes().fetchAllPages();
const ggg = fefe.responses[0]?.payload.types[0]?.system.codename;

type Fe3 = FullDeliveryClientSchema<{
	readonly taxonomyCodenames: readonly ("categories" | "tags")[];
	readonly languageCodenames: readonly ("en-us" | "de-de")[];
	readonly contentTypeCodenames: readonly ("article" | "product")[];
}>;

const fe3: DeliveryClient<Fe3> = createDeliveryClient<Fe3>({
	apiMode: "preview",
	deliveryApiKey: "x",
	environmentId: "c",
	schema: { languageCodenames: ["en-us", "de-de"], taxonomyCodenames: ["categories"], contentTypeCodenames: [] },
});

const fe4 = createDeliveryClient({
	apiMode: "preview",
	deliveryApiKey: "x",
	environmentId: "c",
});

const query = await fe.listLanguages().fetchAllPages();
const query3 = await fe3.listLanguages().fetchAllPages();
const query4 = await fe4.listLanguages().fetchAllPages();

if (query.responses[0]?.payload.languages[0]) {
	query.responses[0].payload.languages[0].system.codename === "de-de";
	query.responses[0].payload.languages[0].system.codename === "de-deF";
}

query.responses[0]?.payload.languages[0]?.system.codename === "de-de2";
query3.responses[0]?.payload.languages[0]?.system.codename === "de-de";

query4.responses[0]?.payload.languages[0]?.system.codename === "en-us";
