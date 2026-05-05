import { codenameOf, codenameSchema, jsonValueSchema, kontentUuidSchema } from "@kontent-ai/core-sdk";
import { z } from "zod";
import type { DeliveryClientSchema } from "../../models/core.models.js";
import { paginationWithTotalCountSchema } from "../../models/pagination.models.js";

const multipleChoiceOptionSchema = <TCodename extends string = string>(codenames?: readonly TCodename[]) =>
	z
		.object({
			name: z.string(),
			codename: codenameOf<TCodename>(codenames),
		})
		.readonly();

const taxonomyTermValueSchema = <TCodename extends string = string>(codenames?: readonly TCodename[]) =>
	z
		.object({
			name: z.string(),
			codename: codenameOf<TCodename>(codenames),
		})
		.readonly();

const renditionSchema = z
	.object({
		rendition_id: kontentUuidSchema,
		preset_id: kontentUuidSchema,
		width: z.number(),
		height: z.number(),
		query: z.string(),
	})
	.catchall(jsonValueSchema)
	.readonly();

const assetValueSchema = z
	.object({
		name: z.string(),
		description: z.string().nullable(),
		type: z.string(),
		size: z.number(),
		url: z.url(),
		width: z.number().nullable(),
		height: z.number().nullable(),
		renditions: z.object({ default: renditionSchema.optional() }).readonly(),
	})
	.catchall(jsonValueSchema)
	.readonly();

const richTextImageSchema = z
	.object({
		image_id: z.string(),
		description: z.string().nullable(),
		url: z.url(),
		width: z.number().nullable(),
		height: z.number().nullable(),
	})
	.catchall(jsonValueSchema)
	.readonly();

const richTextLinkSchema = z
	.object({
		codename: codenameSchema,
		type: z.string(),
		url_slug: z.string(),
	})
	.catchall(jsonValueSchema)
	.readonly();

// Shared concrete element schemas — base shapes only, no catchall or readonly.
// catchall and readonly are applied in elementSchemas and elementDef.
const baseElementSchemas = {
	text: z.object({
		type: z.literal("text"),
		name: z.string(),
		value: z.string(),
	}),
	number: z.object({
		type: z.literal("number"),
		name: z.string(),
		value: z.number().nullable(),
	}),
	richText: z.object({
		type: z.literal("rich_text"),
		name: z.string(),
		value: z.string(),
		images: z.record(z.string(), richTextImageSchema),
		links: z.record(z.string(), richTextLinkSchema),
		modular_content: z.array(codenameSchema).readonly(),
	}),
	multipleChoice: <TCodename extends string = string>(codenames?: readonly TCodename[]) =>
		z.object({
			type: z.literal("multiple_choice"),
			name: z.string(),
			value: z.array(multipleChoiceOptionSchema(codenames)).readonly(),
		}),
	dateTime: z.object({
		type: z.literal("date_time"),
		name: z.string(),
		value: z.string().nullable(),
		display_timezone: z.string().nullable(),
	}),
	asset: z.object({
		type: z.literal("asset"),
		name: z.string(),
		value: z.array(assetValueSchema).readonly(),
	}),
	taxonomy: <TCodename extends string = string>(codenames?: readonly TCodename[]) =>
		z.object({
			type: z.literal("taxonomy"),
			name: z.string(),
			taxonomy_group: z.string(),
			value: z.array(taxonomyTermValueSchema(codenames)).readonly(),
		}),
	urlSlug: z.object({
		type: z.literal("url_slug"),
		name: z.string(),
		value: z.string(),
	}),
	custom: z.object({
		type: z.literal("custom"),
		name: z.string(),
		value: z.string().nullable(),
	}),
	linkedItems: z.object({
		type: z.literal("modular_content"),
		name: z.string(),
		value: z.array(codenameSchema).readonly(),
	}),
} as const;

// elementSchemas — public schemas for working with standard content item elements.
// linkedItems here is the plain API-response shape without the resolved items property.
export const elementSchemas = {
	text: baseElementSchemas.text.catchall(jsonValueSchema).readonly(),
	number: baseElementSchemas.number.catchall(jsonValueSchema).readonly(),
	richText: baseElementSchemas.richText.catchall(jsonValueSchema).readonly(),
	multipleChoice: <TCodename extends string = string>(codenames?: readonly TCodename[]) =>
		baseElementSchemas.multipleChoice(codenames).catchall(jsonValueSchema).readonly(),
	dateTime: baseElementSchemas.dateTime.catchall(jsonValueSchema).readonly(),
	asset: baseElementSchemas.asset.catchall(jsonValueSchema).readonly(),
	taxonomy: <TCodename extends string = string>(codenames?: readonly TCodename[]) =>
		baseElementSchemas.taxonomy(codenames).catchall(jsonValueSchema).readonly(),
	urlSlug: baseElementSchemas.urlSlug.catchall(jsonValueSchema).readonly(),
	custom: baseElementSchemas.custom.catchall(jsonValueSchema).readonly(),
	linkedItems: baseElementSchemas.linkedItems.catchall(jsonValueSchema).readonly(),
} as const;

// elementDef — public building blocks for constructing typed content item schemas.
// linkedItems accepts an array of content item Zod schemas; items will be typed as the union of those types.
export const elementDef = {
	...elementSchemas,
	linkedItems: <
		TSchema extends DeliveryClientSchema = DeliveryClientSchema,
		const TAllowedItemTypes extends z.ZodType<Pick<ContentItemPayload<TSchema>, "system">> = z.ZodType<
			Pick<ContentItemPayload<TSchema>, "system">
		>,
	>(
		schemas: readonly TAllowedItemTypes[],
	) =>
		baseElementSchemas.linkedItems
			.extend({
				items: z.array(z.union(schemas)).readonly(),
			})
			.readonly(),
} as const;

const contentItemElementSchema = z
	.discriminatedUnion("type", [
		elementSchemas.text,
		elementSchemas.number,
		elementSchemas.richText,
		elementSchemas.multipleChoice(),
		elementSchemas.dateTime,
		elementSchemas.asset,
		elementSchemas.taxonomy(),
		elementSchemas.urlSlug,
		elementSchemas.linkedItems,
		elementSchemas.custom,
	])
	.readonly();

const baseContentItemSystemSchema = <TSchema extends DeliveryClientSchema>(schema: TSchema | undefined) =>
	z.object({
		id: kontentUuidSchema,
		name: z.string(),
		codename: codenameSchema,
		language: codenameOf<TSchema["languageCodenames"][number]>(schema?.languageCodenames),
		type: codenameOf<TSchema["contentTypeCodenames"][number]>(schema?.contentTypeCodenames),
		collection: codenameOf<TSchema["collectionCodenames"][number]>(schema?.collectionCodenames),
		last_modified: z.iso.datetime(),
		workflow: codenameOf<TSchema["workflowCodenames"][number]>(schema?.workflowCodenames),
		workflow_step: codenameOf<TSchema["workflowStepCodenames"][number]>(schema?.workflowStepCodenames),
	});

export const specificContentItemSystemSchema = <
	TSchema extends DeliveryClientSchema,
	TTypeCodename extends TSchema["contentTypeCodenames"][number],
>(
	schema: TSchema | undefined,
	type: TTypeCodename,
) =>
	z
		.object({
			...baseContentItemSystemSchema(schema).shape,
			sitemap_locations: z.array(z.string()).readonly(),
			type: z.literal(type),
		})
		.readonly();

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
