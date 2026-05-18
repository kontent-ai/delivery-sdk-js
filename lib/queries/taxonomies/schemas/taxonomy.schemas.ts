import { codenameOf, kontentUuidSchema } from "@kontent-ai/core-sdk";
import * as z from "zod/mini";
import type { DeliveryClientSchema } from "../../../models/core.models.js";
import { paginationSchema } from "../../../models/pagination.schemas.js";

export const taxonomyTermSchema = <TCodename extends string>() =>
	z.object({
		name: z.string(),
		codename: codenameOf<TCodename>(),
		get terms() {
			return z.readonly(z.array(taxonomyTermSchema<TCodename>()));
		},
	});

export const taxonomySchema = <TSchema extends DeliveryClientSchema, TCodename extends string>() =>
	z.readonly(
		z.object({
			system: z.readonly(
				z.object({
					id: kontentUuidSchema,
					name: z.string(),
					codename: codenameOf<TSchema["taxonomyCodenames"][number]>(),
					last_modified: z.iso.datetime(),
				}),
			),
			terms: z.readonly(z.array(taxonomyTermSchema<TCodename>())),
		}),
	);

export const listTaxonomiesSchema = <TSchema extends DeliveryClientSchema, TCodename extends string>() =>
	z.readonly(
		z.object({
			taxonomies: z.readonly(z.array(taxonomySchema<TSchema, TCodename>())),
			...paginationSchema.shape,
		}),
	);
