import { codenameOf, jsonValueSchema, kontentUuidSchema } from "@kontent-ai/core-sdk";
import { z } from "zod";
import type { DeliveryClientSchema } from "../../models/core.models.js";
import { paginationSchema } from "../../models/pagination.models.js";

const contentTypeElementOptionSchema = z
	.object({
		name: z.string(),
		codename: codenameOf(),
	})
	.readonly();

const contentTypeAnyElementSchema = z.discriminatedUnion("type", [
	z
		.object({
			type: z.literal("text"),
			name: z.string(),
		})
		.catchall(jsonValueSchema)
		.readonly(),
	z
		.object({
			type: z.literal("number"),
			name: z.string(),
		})
		.catchall(jsonValueSchema)
		.readonly(),
	z
		.object({
			type: z.literal("rich_text"),
			name: z.string(),
		})
		.catchall(jsonValueSchema)
		.readonly(),
	z
		.object({
			type: z.literal("multiple_choice"),
			name: z.string(),
			options: z.array(contentTypeElementOptionSchema).readonly(),
		})
		.catchall(jsonValueSchema)
		.readonly(),
	z
		.object({
			type: z.literal("date_time"),
			name: z.string(),
		})
		.catchall(jsonValueSchema)
		.readonly(),
	z
		.object({
			type: z.literal("asset"),
			name: z.string(),
		})
		.catchall(jsonValueSchema)
		.readonly(),
	z
		.object({
			type: z.literal("taxonomy"),
			name: z.string(),
			taxonomy_group: z.string(),
		})
		.catchall(jsonValueSchema)
		.readonly(),
	z
		.object({
			type: z.literal("url_slug"),
			name: z.string(),
		})

		.catchall(jsonValueSchema)
		.readonly(),
	z
		.object({
			type: z.literal("modular_content"),
			name: z.string(),
		})
		.catchall(jsonValueSchema)
		.readonly(),
	z
		.object({
			type: z.literal("custom"),
			name: z.string(),
		})
		.catchall(jsonValueSchema)
		.readonly(),
]);

export const contentTypeSchema = <TSchema extends DeliveryClientSchema>(_schema: TSchema | undefined) =>
	z
		.object({
			system: z
				.object({
					id: kontentUuidSchema,
					name: z.string(),
					codename: codenameOf<TSchema["contentTypeCodenames"][number]>(),
					last_modified: z.iso.datetime(),
				})
				.readonly(),
			elements: z.record(codenameOf<TSchema["elementCodenames"][number]>(), contentTypeAnyElementSchema),
		})
		.readonly();

export const listContentTypesSchema = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z
		.object({
			types: z.array(contentTypeSchema(schema)).readonly(),
			...paginationSchema.shape,
		})
		.readonly();

export const contentTypeElementSchema = () =>
	z
		.intersection(
			contentTypeAnyElementSchema,
			z
				.object({
					// Required only for the endpoint `types/{type}/elements/{element}`
					codename: codenameOf(),
				})
				.readonly(),
		)
		.readonly();

export type ContentTypePayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof contentTypeSchema<TSchema>>>;

export type ContentTypeElementPayload = z.infer<ReturnType<typeof contentTypeElementSchema>>;

export type ListContentTypesPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof listContentTypesSchema<TSchema>>>;
