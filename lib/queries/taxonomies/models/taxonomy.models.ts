import type * as z from "@zod/mini";
import type { TaxonomyCodenameOf, TaxonomyTermCodenamesOf } from "../../../models/codename.models.js";
import type { DeliveryClientSchema } from "../../../models/core.models.js";
import type { listTaxonomiesSchema, taxonomySchema, taxonomyTermSchema } from "../schemas/taxonomy.schemas.js";

export type TaxonomyTermPayload<TTermCodenames extends string = string> = z.infer<ReturnType<typeof taxonomyTermSchema<TTermCodenames>>>;

export type TaxonomyPayload<
	TSchema extends DeliveryClientSchema,
	TTermCodenames extends string = string,
	TCodename extends TaxonomyCodenameOf<TSchema> = TaxonomyCodenameOf<TSchema>,
> = z.infer<ReturnType<typeof taxonomySchema<TSchema, TTermCodenames, TCodename>>>;

/**
 * A union of every taxonomy in the schema, each with its own term codenames. Narrow it by checking `system.codename`.
 */
export type AnyTaxonomyPayload<TSchema extends DeliveryClientSchema> = {
	readonly [TCodename in TaxonomyCodenameOf<TSchema>]: TaxonomyPayload<TSchema, TaxonomyTermCodenamesOf<TSchema, TCodename>, TCodename>;
}[TaxonomyCodenameOf<TSchema>];

export type ListTaxonomiesPayload<TSchema extends DeliveryClientSchema> = Readonly<
	Omit<z.infer<ReturnType<typeof listTaxonomiesSchema<TSchema, string>>>, "taxonomies"> & {
		readonly taxonomies: readonly AnyTaxonomyPayload<TSchema>[];
	}
>;
