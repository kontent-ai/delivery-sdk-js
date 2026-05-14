import { codenameOf, kontentUuidSchema } from "@kontent-ai/core-sdk";
import * as z from "zod/mini";
import type { DeliveryClientSchema } from "../../../models/core.models.js";
import { paginationSchema } from "../../../models/pagination.schemas.js";

export const languageSchema = <TSchema extends DeliveryClientSchema>() =>
	z.readonly(
		z.object({
			system: z.readonly(
				z.object({
					id: kontentUuidSchema,
					name: z.string(),
					codename: codenameOf<TSchema["languageCodenames"][number]>(),
				}),
			),
		}),
	);

export const listLanguagesSchema = <TSchema extends DeliveryClientSchema>() =>
	z.readonly(
		z.object({
			languages: z.readonly(z.array(languageSchema<TSchema>())),
			...paginationSchema.shape,
		}),
	);
