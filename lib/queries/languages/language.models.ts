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

export type Language2 = z.infer<typeof languageSchema>;

// export type LanguageWithTypedCodename<TDeliveryApiTypes extends DeliveryClientTypes> = Prettify<
// 	Omit<Language, "system"> & {
// 		readonly system: Omit<Language["system"], "codename"> & {
// 			readonly codename: TDeliveryApiTypes["languageCodenames"];
// 		};
// 	}
// >;

// export type ListLanguagesPayload<TDeliveryApiTypes extends DeliveryClientTypes> = Omit<
// 	z.infer<typeof listLanguagesPayloadSchema>,
// 	"languages"
// > & {
// 	readonly languages: ReadonlyArray<LanguageWithTypedCodename<TDeliveryApiTypes>>;
// };

const language = <TCodename extends string>(codenameSchema: z.ZodType<TCodename>) =>
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

export const getListLanguagesPayloadSchema = <TLanguageCodenames extends string>(codenameSchema: z.ZodType<TLanguageCodenames>) =>
	z
		.object({
			languages: z.array(language(codenameSchema)),
			...paginationSchema.shape,
		})
		.readonly();

export type ListLanguagesPayload<TLanguageCodenames extends string> = z.infer<
	ReturnType<typeof getListLanguagesPayloadSchema<TLanguageCodenames>>
>;
