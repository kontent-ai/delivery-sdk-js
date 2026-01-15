import { z } from "zod";
import { paginationSchema } from "../../models/core.models.js";

export const languageSchema = z
	.object({
		system: z
			.object({
				id: z.string(),
				codename: z.string(),
				name: z.string(),
			})
			.readonly(),
	})
	.readonly();

export const listLanguagesPayloadSchema = z
	.object({
		languages: z.array(languageSchema).readonly(),
		...paginationSchema.shape,
	})
	.readonly();

export type Language = z.infer<typeof languageSchema>;

export type ListLanguagesPayload = z.infer<typeof listLanguagesPayloadSchema>;
