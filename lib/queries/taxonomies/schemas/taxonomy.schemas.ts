import { codenameOf, kontentUuidSchema } from "@kontent-ai/core-sdk";
import * as z from "zod/mini";
import type { DeliveryClientSchema } from "../../../models/core.models.js";
import { paginationSchema } from "../../../models/pagination.schemas.js";
import type { TaxonomyCodenameOf } from "../models/taxonomy.models.js";

/**
 * Output shape of {@link taxonomyTermSchema}. Hand-written purely because a *recursive* Zod schema
 * cannot be wrapped in `z.readonly()` while staying inferrable — `z.readonly`'s `[P in keyof T]`
 * mapped type circularly references the recursive `terms` getter. Annotating the schema's return type
 * breaks that cycle; this annotation is the source of truth for the deeply-readonly recursive term tree.
 */
export type TaxonomyTermShape<TTermCodenames extends string> = {
	readonly name: string;
	readonly codename: TTermCodenames;
	readonly terms: readonly TaxonomyTermShape<TTermCodenames>[];
};

export const taxonomyTermSchema = <TTermCodenames extends string>(): z.ZodMiniType<TaxonomyTermShape<TTermCodenames>> =>
	z.readonly(
		z.object({
			name: z.string(),
			codename: codenameOf<TTermCodenames>(),
			get terms() {
				return z.readonly(z.array(taxonomyTermSchema<TTermCodenames>()));
			},
		}),
	);

export const taxonomySchema = <TSchema extends DeliveryClientSchema, TTermCodenames extends string>() =>
	z.readonly(
		z.object({
			system: z.readonly(
				z.object({
					id: kontentUuidSchema,
					name: z.string(),
					codename: codenameOf<TaxonomyCodenameOf<TSchema>>(),
					last_modified: z.iso.datetime(),
				}),
			),
			terms: z.readonly(z.array(taxonomyTermSchema<TTermCodenames>())),
		}),
	);

export const listTaxonomiesSchema = <TSchema extends DeliveryClientSchema, TTermCodenames extends string>() =>
	z.readonly(
		z.object({
			taxonomies: z.readonly(z.array(taxonomySchema<TSchema, TTermCodenames>())),
			...paginationSchema.shape,
		}),
	);
