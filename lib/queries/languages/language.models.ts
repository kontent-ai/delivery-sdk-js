import { z } from "zod";
import { type DeliveryClientTypes, paginationSchema } from "../../models/core.models.js";

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

const language2 = <TCodename extends string>(
	codenames: z.ZodTemplateLiteral<TCodename>,
): z.ZodReadonly<
	z.ZodObject<
		{
			system: z.ZodReadonly<
				z.ZodObject<
					{
						id: z.ZodString;
						codename: z.ZodTemplateLiteral<TCodename>;
					},
					z.core.$strip
				>
			>;
		},
		z.core.$strip
	>
> =>
	z
		.object({
			system: z
				.object({
					id: z.string(),
					codename: codenames,
				})
				.readonly(),
		})
		.readonly();

export const getListLanguagesPayloadSchema = <TCodename extends string>(codenames: z.ZodTemplateLiteral<TCodename>) => {
	return z.object({
		languages: z.array(language2(codenames)),
		...paginationSchema.shape,
	});
};

export type ListLanguagesPayload<TDeliveryClientTypes extends DeliveryClientTypes> = z.infer<
	ReturnType<typeof getListLanguagesPayloadSchema<TDeliveryClientTypes["languageCodenames"]>>
>;
