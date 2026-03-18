import { getCodenameSchema, kontentUuidSchema } from "@kontent-ai/core-sdk";
import { z } from "zod";
import type { DeliveryClientSchema } from "../../models/core.models.js";
import { paginationSchema } from "../../models/pagination.models.js";

const contentTypeElementOptionSchema = z
	.object({
		name: z.string(),
		codename: z.string(),
	})
	.readonly();

const contentTypeElementSchema = z.discriminatedUnion("type", [
	z
		.object({
			type: z.literal("text"),
			name: z.string(),
		})
		.catchall(z.any())
		.readonly(),
	z
		.object({
			type: z.literal("number"),
			name: z.string(),
		})
		.catchall(z.any())
		.readonly(),
	z
		.object({
			type: z.literal("rich_text"),
			name: z.string(),
		})
		.catchall(z.any())
		.readonly(),
	z
		.object({
			type: z.literal("multiple_choice"),
			name: z.string(),
			options: z.array(contentTypeElementOptionSchema).readonly(),
		})
		.catchall(z.any())
		.readonly(),
	z
		.object({
			type: z.literal("date_time"),
			name: z.string(),
		})
		.catchall(z.any())
		.readonly(),
	z
		.object({
			type: z.literal("asset"),
			name: z.string(),
		})
		.catchall(z.any())
		.readonly(),
	z
		.object({
			type: z.literal("taxonomy"),
			name: z.string(),
			taxonomy_group: z.string(),
		})
		.catchall(z.any())
		.readonly(),
	z
		.object({
			type: z.literal("url_slug"),
			name: z.string(),
		})

		.catchall(z.any())
		.readonly(),
	z
		.object({
			type: z.literal("modular_content"),
			name: z.string(),
		})
		.catchall(z.any())
		.readonly(),
	z
		.object({
			type: z.literal("custom"),
			name: z.string(),
			value: z.string().or(z.null()),
		})
		.catchall(z.any())
		.readonly(),
]);

export const contentTypePayload = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z
		.object({
			system: z
				.object({
					id: kontentUuidSchema,
					name: z.string(),
					codename: getCodenameSchema<NonNullable<TSchema["contentTypeCodenames"]>>(schema?.contentTypeCodenames),
					last_modified: z.iso.datetime(),
				})
				.readonly(),
			elements: z.record(z.string(), contentTypeElementSchema).readonly(),
		})
		.readonly();

export const listContentTypesPayload = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z
		.object({
			types: z.array(contentTypePayload(schema)).readonly(),
			...paginationSchema.shape,
		})
		.readonly();

export type ContentTypePayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof contentTypePayload<TSchema>>>;

export type ListContentTypesPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof listContentTypesPayload<TSchema>>>;
