import { codenameOf, kontentUuidSchema } from "@kontent-ai/core-sdk";
import { z } from "zod";
import type { DeliveryClientSchema } from "../../models/core.models.js";
import { paginationSchema } from "../../models/pagination.models.js";

export const languageSchema = <TSchema extends DeliveryClientSchema>() =>
	z
		.object({
			system: z
				.object({
					id: kontentUuidSchema,
					name: z.string(),
					codename: codenameOf<TSchema["languageCodenames"][number]>(),
				})
				.readonly(),
		})
		.readonly();

export const listLanguagesSchema = <TSchema extends DeliveryClientSchema>() =>
	z
		.object({
			languages: z.array(languageSchema<TSchema>()).readonly(),
			...paginationSchema.shape,
		})
		.readonly();

export type LanguagePayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof languageSchema<TSchema>>>;

export type ListLanguagesPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof listLanguagesSchema<TSchema>>>;
