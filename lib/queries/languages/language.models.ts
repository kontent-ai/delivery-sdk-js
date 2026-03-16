import { getCodenameSchema, kontentUuidSchema } from "@kontent-ai/core-sdk";
import { z } from "zod";
import { type DefaultDeliveryClientSchema, paginationSchema } from "../../models/core.models.js";

export const languagePayload = <TSchema extends DefaultDeliveryClientSchema>(schema: TSchema) =>
	z
		.object({
			system: z
				.object({
					id: kontentUuidSchema,
					name: z.string(),
					codename: getCodenameSchema<TSchema["languageCodenames"]>(schema.languageCodenames),
				})
				.readonly(),
		})
		.readonly();

export const listLanguagesPayload = <TSchema extends DefaultDeliveryClientSchema>(schema: TSchema) =>
	z
		.object({
			languages: z.array(languagePayload(schema)).readonly(),
			...paginationSchema.shape,
		})
		.readonly();

export type LanguagePayload<TSchema extends DefaultDeliveryClientSchema> = z.infer<ReturnType<typeof languagePayload<TSchema>>>;

export type ListLanguagesPayload<TSchema extends DefaultDeliveryClientSchema> = z.infer<ReturnType<typeof listLanguagesPayload<TSchema>>>;
