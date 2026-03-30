import { getCodenameSchema, jsonValueSchema, kontentUuidSchema } from "@kontent-ai/core-sdk";
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
			value: z.string().or(z.null()),
		})
		.catchall(jsonValueSchema)
		.readonly(),
]);

export const contentTypePayload = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z
		.object({
			system: z
				.object({
					id: kontentUuidSchema,
					name: z.string(),
					codename: getCodenameSchema<TSchema["contentTypeCodenames"][number]>(schema?.contentTypeCodenames),
					last_modified: z.iso.datetime(),
				})
				.readonly(),
			elements: z.record(getCodenameSchema<TSchema["elementCodenames"][number]>(schema?.elementCodenames), contentTypeElementSchema),
		})
		.readonly();

export const listContentTypesPayload = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z
		.object({
			types: z.array(contentTypePayload(schema)).readonly(),
			...paginationSchema.shape,
		})
		.readonly();

export const contentTypeElementPayload = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z
		.intersection(
			contentTypeElementSchema,
			z
				.object({
					// Required only for the endpoint `types/{type}/elements/{element}`
					codename: getCodenameSchema<TSchema["elementCodenames"][number]>(schema?.elementCodenames),
				})
				.readonly(),
		)
		.readonly();

export type ContentTypePayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof contentTypePayload<TSchema>>>;

export type ContentTypeElementPayload<TSchema extends DeliveryClientSchema> = z.infer<
	ReturnType<typeof contentTypeElementPayload<TSchema>>
>;

export type ListContentTypesPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof listContentTypesPayload<TSchema>>>;
