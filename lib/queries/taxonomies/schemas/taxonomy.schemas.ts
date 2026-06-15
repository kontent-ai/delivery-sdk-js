import { codenameOf, kontentUuidSchema } from "@kontent-ai/core-sdk";
import * as z from "zod/mini";
import type { DeliveryClientSchema } from "../../../models/core.models.js";
import { paginationSchema } from "../../../models/pagination.schemas.js";
import type { TaxonomyCodenameOf } from "../models/taxonomy.models.js";

export const taxonomyTermSchema = <TTermCodenames extends string>() =>
	z.object({
		name: z.readonly(z.string()),
		codename: codenameOf<TTermCodenames>(),
		get terms() {
			return z.readonly(z.array(taxonomyTermSchema<TTermCodenames>()));
		},
	});

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
