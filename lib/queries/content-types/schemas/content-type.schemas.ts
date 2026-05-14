import { codenameOf, jsonValueSchema, kontentUuidSchema } from "@kontent-ai/core-sdk";
import * as z from "zod/mini";
import type { DeliveryClientSchema } from "../../../models/core.models.js";
import { paginationSchema } from "../../../models/pagination.schemas.js";

const contentTypeElementOptionSchema = z.readonly(
	z.object({
		name: z.string(),
		codename: codenameOf(),
	}),
);

const contentTypeAnyElementSchema = z.discriminatedUnion("type", [
	z.readonly(
		z.catchall(
			z.object({
				type: z.literal("text"),
				name: z.string(),
			}),
			jsonValueSchema,
		),
	),
	z.readonly(
		z.catchall(
			z.object({
				type: z.literal("number"),
				name: z.string(),
			}),
			jsonValueSchema,
		),
	),
	z.readonly(
		z.catchall(
			z.object({
				type: z.literal("rich_text"),
				name: z.string(),
			}),
			jsonValueSchema,
		),
	),
	z.readonly(
		z.catchall(
			z.object({
				type: z.literal("multiple_choice"),
				name: z.string(),
				options: z.readonly(z.array(contentTypeElementOptionSchema)),
			}),
			jsonValueSchema,
		),
	),
	z.readonly(
		z.catchall(
			z.object({
				type: z.literal("date_time"),
				name: z.string(),
			}),
			jsonValueSchema,
		),
	),
	z.readonly(
		z.catchall(
			z.object({
				type: z.literal("asset"),
				name: z.string(),
			}),
			jsonValueSchema,
		),
	),
	z.readonly(
		z.catchall(
			z.object({
				type: z.literal("taxonomy"),
				name: z.string(),
				taxonomy_group: z.string(),
			}),
			jsonValueSchema,
		),
	),
	z.readonly(
		z.catchall(
			z.object({
				type: z.literal("url_slug"),
				name: z.string(),
			}),
			jsonValueSchema,
		),
	),
	z.readonly(
		z.catchall(
			z.object({
				type: z.literal("modular_content"),
				name: z.string(),
			}),
			jsonValueSchema,
		),
	),
	z.readonly(
		z.catchall(
			z.object({
				type: z.literal("custom"),
				name: z.string(),
			}),
			jsonValueSchema,
		),
	),
]);

export const contentTypeSchema = <TSchema extends DeliveryClientSchema>() =>
	z.readonly(
		z.object({
			system: z.readonly(
				z.object({
					id: kontentUuidSchema,
					name: z.string(),
					codename: codenameOf<TSchema["contentTypeCodenames"][number]>(),
					last_modified: z.iso.datetime(),
				}),
			),
			elements: z.record(codenameOf<TSchema["elementCodenames"][number]>(), contentTypeAnyElementSchema),
		}),
	);

export const listContentTypesSchema = <TSchema extends DeliveryClientSchema>() =>
	z.readonly(
		z.object({
			types: z.readonly(z.array(contentTypeSchema<TSchema>())),
			...paginationSchema.shape,
		}),
	);

export const contentTypeElementSchema = () =>
	z.readonly(
		z.intersection(
			contentTypeAnyElementSchema,
			z.readonly(
				z.object({
					// Required only for the endpoint `types/{type}/elements/{element}`
					codename: codenameOf(),
				}),
			),
		),
	);
