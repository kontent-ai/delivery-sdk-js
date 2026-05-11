import { codenameOf, kontentUuidSchema } from "@kontent-ai/core-sdk";
import { z } from "zod";
import type { DeliveryClientSchema } from "../../../models/core.models.js";
import { paginationSchema } from "../../../models/pagination.schemas.js";

export const taxonomyTermSchema = <TSchema extends DeliveryClientSchema>() =>
	z.object({
		name: z.string(),
		codename: codenameOf<TSchema["taxonomyCodenames"][number]>(),
		get terms() {
			return z.array(taxonomyTermSchema<TSchema>()).readonly();
		},
	});

export const taxonomySchema = <TSchema extends DeliveryClientSchema>() =>
	z
		.object({
			system: z
				.object({
					id: kontentUuidSchema,
					name: z.string(),
					codename: codenameOf<TSchema["taxonomyCodenames"][number]>(),
					last_modified: z.iso.datetime(),
				})
				.readonly(),
			terms: z.array(taxonomyTermSchema<TSchema>()).readonly(),
		})
		.readonly();

export const listTaxonomiesSchema = <TSchema extends DeliveryClientSchema>() =>
	z
		.object({
			taxonomies: z.array(taxonomySchema<TSchema>()).readonly(),
			...paginationSchema.shape,
		})
		.readonly();
