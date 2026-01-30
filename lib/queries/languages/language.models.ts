import { z } from "zod";
import { type DeliveryClientTypes, paginationSchema } from "../../models/core.models.js";

export const languagePayload = <TDeliveryClientTypes extends DeliveryClientTypes>(
	languageCodenames: z.ZodType<TDeliveryClientTypes["languageCodenames"][number]>,
) =>
	z
		.object({
			system: z
				.object({
					id: z.string(),
					codename: languageCodenames,
				})
				.readonly(),
		})
		.readonly();

export const listLanguagesPayload = <TDeliveryClientTypes extends DeliveryClientTypes>(
	languageCodenames: z.ZodType<TDeliveryClientTypes["languageCodenames"][number]>,
) =>
	z
		.object({
			languages: z.array(languagePayload(languageCodenames)),
			...paginationSchema.shape,
		})
		.readonly();

export type ListLanguagesPayload<TDeliveryClientTypes extends DeliveryClientTypes> = z.infer<
	ReturnType<typeof listLanguagesPayload<TDeliveryClientTypes>>
>;

export type LanguagePayload<TDeliveryClientTypes extends DeliveryClientTypes> = z.infer<
	ReturnType<typeof languagePayload<TDeliveryClientTypes>>
>;
