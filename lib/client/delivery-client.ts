import type {
	DeliveryClient,
	DeliveryClientConfig,
	DeliveryClientConfigWithSchema,
	DeliveryClientSchema,
	PartialDeliveryClientShema,
} from "../models/core.models.js";
import { listContentTypes } from "../queries/content-types/list-content-types-query.js";
import { listLanguagesQuery } from "../queries/languages/list-languages-query.js";
import { listTaxonomiesQuery } from "../queries/taxonomies/list-taxonomies-query.js";
import { getDefaultSchema, toFullSchema } from "../utils/schema.utils.js";

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
 *   schema: { languageCodenames: ["en-us", "es-es"] },
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
): DeliveryClient<DeliveryClientSchema<TSchema>> {
	const configWithSchema: DeliveryClientConfigWithSchema<DeliveryClientSchema<TSchema>> = {
		...config,
		schema: toFullSchema(config.schema ?? getDefaultSchema()),
	};
	return {
		config: configWithSchema,
		listTaxonomies: () => listTaxonomiesQuery(configWithSchema),
		listLanguages: () => listLanguagesQuery(configWithSchema),
		listContentTypes: () => listContentTypes(configWithSchema),
	};
}
