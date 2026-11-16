import type * as z from "@zod/mini";
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

/**
 * The taxonomy codenames declared in the schema (the keys of the `taxonomies` map).
 * Narrows to a literal union for a concrete schema, falling back to `string` for the generic default.
 */
export type TaxonomyCodenameOf<TSchema extends DeliveryClientSchema> = keyof TSchema["taxonomies"] & string;

/**
 * The term codenames belonging to the taxonomy identified by `TCodename`, derived from the schema's
 * `taxonomies` map. Covers every nesting depth (the term tree shares one flat codename union).
 * Falls back to `string` when the codename is unknown or the schema is the generic default.
 */
export type TaxonomyTermCodenamesOf<
	TSchema extends DeliveryClientSchema,
	TCodename extends string,
> = TCodename extends keyof TSchema["taxonomies"]
	? readonly [Extract<NonNullable<TSchema["taxonomies"][TCodename]>[number], string>] extends readonly [never]
		? string
		: Extract<NonNullable<TSchema["taxonomies"][TCodename]>[number], string>
	: string;
