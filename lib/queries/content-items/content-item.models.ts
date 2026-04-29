import { getCodenameSchema, jsonValueSchema, kontentUuidSchema } from "@kontent-ai/core-sdk";
import { z } from "zod";
import type { DeliveryClientSchema } from "../../models/core.models.js";
import { paginationWithTotalCountSchema } from "../../models/pagination.models.js";

const multipleChoiceOptionSchema = z
	.object({
		name: z.string(),
		codename: z.string(),
	})
	.readonly();

const taxonomyTermValueSchema = z
	.object({
		name: z.string(),
		codename: z.string(),
	})
	.readonly();

const assetValueSchema = z
	.object({
		name: z.string(),
		description: z.string().nullable(),
		type: z.string(),
		size: z.number(),
		url: z.string(),
		width: z.number().nullable(),
		height: z.number().nullable(),
		renditions: z.record(z.string(), jsonValueSchema),
	})
	.catchall(jsonValueSchema)
	.readonly();

const richTextImageSchema = z
	.object({
		image_id: z.string(),
		description: z.string().nullable(),
		url: z.string(),
		width: z.number().nullable(),
		height: z.number().nullable(),
	})
	.catchall(jsonValueSchema)
	.readonly();

const richTextLinkSchema = z
	.object({
		codename: z.string(),
		type: z.string(),
		url_slug: z.string(),
	})
	.catchall(jsonValueSchema)
	.readonly();

export const elementSchemas = {
	text: z
		.object({
			type: z.literal("text"),
			name: z.string(),
			value: z.string(),
		})
		.catchall(jsonValueSchema)
		.readonly(),
	number: z
		.object({
			type: z.literal("number"),
			name: z.string(),
			value: z.number().nullable(),
		})
		.catchall(jsonValueSchema)
		.readonly(),
	richText: z
		.object({
			type: z.literal("rich_text"),
			name: z.string(),
			value: z.string(),
			images: z.record(z.string(), richTextImageSchema),
			links: z.record(z.string(), richTextLinkSchema),
			modular_content: z.array(z.string()).readonly(),
		})
		.catchall(jsonValueSchema)
		.readonly(),
	multipleChoice: z
		.object({
			type: z.literal("multiple_choice"),
			name: z.string(),
			value: z.array(multipleChoiceOptionSchema).readonly(),
		})
		.catchall(jsonValueSchema)
		.readonly(),
	dateTime: z
		.object({
			type: z.literal("date_time"),
			name: z.string(),
			value: z.string().nullable(),
			display_timezone: z.string().nullable(),
		})
		.catchall(jsonValueSchema)
		.readonly(),
	asset: z
		.object({
			type: z.literal("asset"),
			name: z.string(),
			value: z.array(assetValueSchema).readonly(),
		})
		.catchall(jsonValueSchema)
		.readonly(),
	taxonomy: z
		.object({
			type: z.literal("taxonomy"),
			name: z.string(),
			taxonomy_group: z.string(),
			value: z.array(taxonomyTermValueSchema).readonly(),
		})
		.catchall(jsonValueSchema)
		.readonly(),
	urlSlug: z
		.object({
			type: z.literal("url_slug"),
			name: z.string(),
			value: z.string(),
		})
		.catchall(jsonValueSchema)
		.readonly(),
	linkedItems: z
		.object({
			type: z.literal("modular_content"),
			name: z.string(),
			value: z.array(z.string()).readonly(),
		})
		.catchall(jsonValueSchema)
		.readonly(),
	custom: z
		.object({
			type: z.literal("custom"),
			name: z.string(),
			value: z.string().nullable(),
		})
		.catchall(jsonValueSchema)
		.readonly(),
};

const contentItemElementSchema = z
	.discriminatedUnion("type", [
		elementSchemas.text,
		elementSchemas.number,
		elementSchemas.richText,
		elementSchemas.multipleChoice,
		elementSchemas.dateTime,
		elementSchemas.asset,
		elementSchemas.taxonomy,
		elementSchemas.urlSlug,
		elementSchemas.linkedItems,
		elementSchemas.custom,
	])
	.readonly();

const baseContentItemSystemSchema = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z.object({
		id: kontentUuidSchema,
		name: z.string(),
		codename: getCodenameSchema<TSchema["contentTypeCodenames"][number]>(schema?.contentTypeCodenames),
		language: getCodenameSchema<TSchema["languageCodenames"][number]>(schema?.languageCodenames),
		type: getCodenameSchema<TSchema["contentTypeCodenames"][number]>(schema?.contentTypeCodenames),
		collection: getCodenameSchema<TSchema["collectionCodenames"][number]>(schema?.collectionCodenames),
		last_modified: z.iso.datetime(),
		workflow: getCodenameSchema<TSchema["workflowCodenames"][number]>(schema?.workflowCodenames),
		workflow_step: getCodenameSchema<TSchema["workflowStepCodenames"][number]>(schema?.workflowStepCodenames),
	});

export const contentItemSystemSchema = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z
		.object({
			...baseContentItemSystemSchema(schema).shape,
			sitemap_locations: z.array(z.string()).readonly(),
		})
		.readonly();

const contentItemSchema = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z
		.object({
			system: contentItemSystemSchema(schema),
			elements: z.record(z.string(), contentItemElementSchema),
		})
		.readonly();

export const listContentItemsSchema = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z
		.object({
			items: z.array(contentItemSchema(schema)).readonly(),
			modular_content: z.record(z.string(), contentItemSchema(schema)),
			...paginationWithTotalCountSchema.shape,
		})
		.readonly();

export const itemsFeedSchema = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z
		.object({
			items: z.array(contentItemSchema(schema)).readonly(),
			modular_content: z.record(z.string(), contentItemSchema(schema)),
		})
		.readonly();

export const itemsReferencingAssetSchema = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z
		.object({
			items: z
				.array(
					z.object({
						system: baseContentItemSystemSchema(schema),
					}),
				)
				.readonly(),
		})
		.readonly();

export const itemsReferencingItemSchema = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z
		.object({
			items: z
				.array(
					z.object({
						system: baseContentItemSystemSchema(schema),
					}),
				)
				.readonly(),
		})
		.readonly();

export const fetchContentItemSchema = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z
		.object({
			item: contentItemSchema(schema),
			modular_content: z.record(z.string(), contentItemSchema(schema)),
		})
		.readonly();

export type ContentItemSystemPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof contentItemSystemSchema<TSchema>>>;
export type ContentItemElementPayload = z.infer<typeof contentItemElementSchema>;
export type ContentItemPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof contentItemSchema<TSchema>>>;
export type ListContentItemsPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof listContentItemsSchema<TSchema>>>;
export type FetchContentItemPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof fetchContentItemSchema<TSchema>>>;
export type ItemsFeedPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof itemsFeedSchema<TSchema>>>;
export type ItemsReferencingAssetPayload<TSchema extends DeliveryClientSchema> = z.infer<
	ReturnType<typeof itemsReferencingAssetSchema<TSchema>>
>;
export type ItemsReferencingItemPayload<TSchema extends DeliveryClientSchema> = z.infer<
	ReturnType<typeof itemsReferencingItemSchema<TSchema>>
>;
