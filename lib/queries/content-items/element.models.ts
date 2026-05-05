import { codenameOf, codenameSchema, kontentUuidSchema } from "@kontent-ai/core-sdk";
import { z } from "zod";

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
	.readonly();

const richTextImageSchema = z
	.object({
		image_id: z.string(),
		description: z.string().nullable(),
		url: z.url(),
		width: z.number().nullable(),
		height: z.number().nullable(),
	})
	.readonly();

const richTextLinkSchema = z
	.object({
		codename: codenameSchema,
		type: z.string(),
		url_slug: z.string(),
	})
	.readonly();

// Shared concrete element schemas — base shapes only, no readonly.
// readonly is applied in elementSchemas and elementDef.
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
	text: baseElementSchemas.text.readonly(),
	number: baseElementSchemas.number.readonly(),
	richText: baseElementSchemas.richText.readonly(),
	multipleChoice: <TCodename extends string = string>(codenames?: readonly TCodename[]) =>
		baseElementSchemas.multipleChoice(codenames).readonly(),
	dateTime: baseElementSchemas.dateTime.readonly(),
	asset: baseElementSchemas.asset.readonly(),
	taxonomy: <TCodename extends string = string>(codenames?: readonly TCodename[]) => baseElementSchemas.taxonomy(codenames).readonly(),
	urlSlug: baseElementSchemas.urlSlug.readonly(),
	custom: baseElementSchemas.custom.readonly(),
	linkedItems: baseElementSchemas.linkedItems.readonly(),
} as const;

// elementDef — public building blocks for constructing typed content item schemas.
// linkedItems accepts an array of content item Zod schemas; items will be typed as the union of those types.
export const elementDef = {
	...elementSchemas,
	linkedItems: <const TAllowedItemTypes extends z.ZodType = z.ZodType>(schemas: readonly TAllowedItemTypes[]) =>
		baseElementSchemas.linkedItems
			.extend({
				items: z.array(z.union(schemas)).readonly(),
			})
			.readonly(),
} as const;

export const contentItemElementSchema = z
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

export type ContentItemElementPayload = z.infer<typeof contentItemElementSchema>;
