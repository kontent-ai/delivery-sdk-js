import { getCodenameSchema, kontentUuidSchema } from "@kontent-ai/core-sdk";
import { z } from "zod";
import { type DefaultDeliveryClientSchema, paginationSchema } from "../../models/core.models.js";

export const taxonomyTermPayload = <TSchema extends DefaultDeliveryClientSchema>(schema: TSchema) =>
	z.object({
		name: z.string(),
		codename: getCodenameSchema<TSchema["taxonomyCodenames"]>(schema.taxonomyCodenames),
		get terms() {
			return z.array(taxonomyTermPayload(schema)).readonly();
		},
	});

export const taxonomyPayload = <TSchema extends DefaultDeliveryClientSchema>(schema: TSchema) =>
	z
		.object({
			system: z
				.object({
					id: kontentUuidSchema,
					name: z.string(),
					codename: getCodenameSchema<TSchema["taxonomyCodenames"]>(schema.taxonomyCodenames),
					last_modified: z.iso.datetime(),
				})
				.readonly(),
			terms: z.array(taxonomyTermPayload(schema)).readonly(),
		})
		.readonly();

export const listTaxonomiesPayload = <TSchema extends DefaultDeliveryClientSchema>(schema: TSchema) =>
	z
		.object({
			taxonomies: z.array(taxonomyPayload(schema)).readonly(),
			...paginationSchema.shape,
		})
		.readonly();

export type TaxonomyTermPayload<TSchema extends DefaultDeliveryClientSchema> = z.infer<ReturnType<typeof taxonomyTermPayload<TSchema>>>;

export type TaxonomyPayload<TSchema extends DefaultDeliveryClientSchema> = z.infer<ReturnType<typeof taxonomyPayload<TSchema>>>;

export type ListTaxonomiesPayload<TSchema extends DefaultDeliveryClientSchema> = z.infer<ReturnType<typeof listTaxonomiesPayload<TSchema>>>;
