import { getCodenameSchema, kontentUuidSchema } from "@kontent-ai/core-sdk";
import { z } from "zod";
import { type DeliveryClientSchema, paginationSchema } from "../../models/core.models.js";

export const languagePayload = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z
		.object({
			system: z
				.object({
					id: kontentUuidSchema,
					name: z.string(),
					codename: getCodenameSchema<NonNullable<TSchema["languageCodenames"]>>(schema?.languageCodenames),
				})
				.readonly(),
		})
		.readonly();

export const listLanguagesPayload = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z
		.object({
			languages: z.array(languagePayload(schema)).readonly(),
			...paginationSchema.shape,
		})
		.readonly();

export type LanguagePayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof languagePayload<TSchema>>>;

export type ListLanguagesPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof listLanguagesPayload<TSchema>>>;
