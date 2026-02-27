import { getCodenameSchema, kontentUuidSchema } from "@kontent-ai/core-sdk";
import { z } from "zod";
import { type DeliveryClientSchema, type DeliveryClientTypes, paginationSchema } from "../../models/core.models.js";

export const taxonomyTermPayload = <TDeliveryClientTypes extends DeliveryClientTypes>(schema: DeliveryClientSchema<TDeliveryClientTypes>) =>
	z.object({
		name: z.string(),
		codename: getCodenameSchema(schema.taxonomyCodenames),
		get terms() {
			return z.array(taxonomyTermPayload(schema)).readonly();
		},
	});

export const taxonomyPayload = <TDeliveryClientTypes extends DeliveryClientTypes>(schema: DeliveryClientSchema<TDeliveryClientTypes>) =>
	z
		.object({
			system: z
				.object({
					id: kontentUuidSchema,
					name: z.string(),
					codename: getCodenameSchema(schema.taxonomyCodenames),
					last_modified: z.iso.datetime(),
				})
				.readonly(),
			terms: z.array(taxonomyTermPayload(schema)).readonly(),
		})
		.readonly();

export const listTaxonomiesPayload = <TDeliveryClientTypes extends DeliveryClientTypes>(
	schema: DeliveryClientSchema<TDeliveryClientTypes>,
) =>
	z
		.object({
			taxonomies: z.array(taxonomyPayload(schema)).readonly(),
			...paginationSchema.shape,
		})
		.readonly();

export type ListTaxonomiesPayload<TDeliveryClientTypes extends DeliveryClientTypes> = z.infer<
	ReturnType<typeof listTaxonomiesPayload<TDeliveryClientTypes>>
>;

export type TaxonomyPayload<TDeliveryClientTypes extends DeliveryClientTypes> = z.infer<
	ReturnType<typeof taxonomyPayload<TDeliveryClientTypes>>
>;
