import { getCodenameSchema, kontentUuidSchema } from "@kontent-ai/core-sdk";
import { z } from "zod";
import { type DeliveryClientSchema, type DeliveryClientTypes, paginationSchema } from "../../models/core.models.js";

export const languagePayload = <TDeliveryClientTypes extends DeliveryClientTypes>(schema: DeliveryClientSchema<TDeliveryClientTypes>) =>
	z
		.object({
			system: z
				.object({
					id: kontentUuidSchema,
					name: z.string(),
					codename: getCodenameSchema(schema.languageCodenames),
				})
				.readonly(),
		})
		.readonly();

export const listLanguagesPayload = <TDeliveryClientTypes extends DeliveryClientTypes>(
	schema: DeliveryClientSchema<TDeliveryClientTypes>,
) =>
	z
		.object({
			languages: z.array(languagePayload(schema)).readonly(),
			...paginationSchema.shape,
		})
		.readonly();

export type ListLanguagesPayload<TDeliveryClientTypes extends DeliveryClientTypes> = z.infer<
	ReturnType<typeof listLanguagesPayload<TDeliveryClientTypes>>
>;

export type LanguagePayload<TDeliveryClientTypes extends DeliveryClientTypes> = z.infer<
	ReturnType<typeof languagePayload<TDeliveryClientTypes>>
>;
