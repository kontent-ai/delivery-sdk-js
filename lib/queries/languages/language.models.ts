import { getCodenameSchema, kontentUuidSchema } from "@kontent-ai/core-sdk";
import { z } from "zod";
import { type DefaultDeliveryClientSchema, type PartialDeliveryClientShema, paginationSchema } from "../../models/core.models.js";

export const languagePayload = <TSchema extends PartialDeliveryClientShema>(schema: TSchema) =>
	z
		.object({
			system: z
				.object({
					id: kontentUuidSchema,
					name: z.string(),
					codename: getCodenameSchema<NonNullable<TSchema["languageCodenames"]>>(schema.languageCodenames),
				})
				.readonly(),
		})
		.readonly();

export const listLanguagesPayload = <TSchema extends PartialDeliveryClientShema>(schema: TSchema) =>
	z
		.object({
			languages: z.array(languagePayload(schema)).readonly(),
			...paginationSchema.shape,
		})
		.readonly();

export type LanguagePayload<TSchema extends DefaultDeliveryClientSchema> = z.infer<ReturnType<typeof languagePayload<TSchema>>>;

export type ListLanguagesPayload<TSchema extends DefaultDeliveryClientSchema> = z.infer<ReturnType<typeof listLanguagesPayload<TSchema>>>;

/** Non-distributive: when T is a union (e.g. readonly string[] | undefined), resolves to readonly string[] so the argument is assignable. */
//type CodenameArray<T> = [T] extends [readonly string[]] ? T : readonly string[];
