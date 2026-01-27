import { z } from "zod";
import { paginationSchema } from "../../models/core.models.js";

export const languagePayload = <TCodename extends string>(codenameSchema: z.ZodType<TCodename>) =>
	z
		.object({
			system: z
				.object({
					id: z.string(),
					codename: codenameSchema,
				})
				.readonly(),
		})
		.readonly();

export const listLanguagesPayload = <TLanguageCodenames extends string>(codenameSchema: z.ZodType<TLanguageCodenames>) =>
	z
		.object({
			languages: z.array(languagePayload(codenameSchema)),
			...paginationSchema.shape,
		})
		.readonly();

export type ListLanguagesPayload<TLanguageCodenames extends string> = z.infer<ReturnType<typeof listLanguagesPayload<TLanguageCodenames>>>;

export type LanguagePayload<TLanguageCodenames extends string> = z.infer<ReturnType<typeof languagePayload<TLanguageCodenames>>>;
