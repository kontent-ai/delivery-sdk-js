import { getCodenameSchema, kontentUuidSchema } from "@kontent-ai/core-sdk";
import { z } from "zod";
import { type DeliveryClientSchema, paginationSchema } from "../../models/core.models.js";

export const taxonomyTermPayload = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z.object({
		name: z.string(),
		codename: getCodenameSchema<NonNullable<TSchema["taxonomyCodenames"]>>(schema?.taxonomyCodenames),
		get terms() {
			return z.array(taxonomyTermPayload(schema)).readonly();
		},
	});

export const taxonomyPayload = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z
		.object({
			system: z
				.object({
					id: kontentUuidSchema,
					name: z.string(),
					codename: getCodenameSchema<NonNullable<TSchema["taxonomyCodenames"]>>(schema?.taxonomyCodenames),
					last_modified: z.iso.datetime(),
				})
				.readonly(),
			terms: z.array(taxonomyTermPayload(schema)).readonly(),
		})
		.readonly();

export const listTaxonomiesPayload = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z
		.object({
			taxonomies: z.array(taxonomyPayload(schema)).readonly(),
			...paginationSchema.shape,
		})
		.readonly();

export type TaxonomyTermPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof taxonomyTermPayload<TSchema>>>;

export type TaxonomyPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof taxonomyPayload<TSchema>>>;

export type ListTaxonomiesPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof listTaxonomiesPayload<TSchema>>>;
