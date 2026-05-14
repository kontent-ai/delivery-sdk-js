import { codenameOf, kontentUuidSchema } from "@kontent-ai/core-sdk";
import * as z from "zod/mini";
import type { DeliveryClientSchema } from "../../../models/core.models.js";
import type { ContentItemPayload } from "../models/content-item.models.js";
import { contentItemSchema } from "./content-item.schemas.js";

const multipleChoiceOptionSchema = <TCodename extends string = string>() =>
	z.readonly(
		z.object({
			name: z.string(),
			codename: codenameOf<TCodename>(),
		}),
	);

const taxonomyTermValueSchema = <TCodename extends string = string>() =>
	z.readonly(
		z.object({
			name: z.string(),
			codename: codenameOf<TCodename>(),
		}),
	);

const renditionSchema = z.readonly(
	z.object({
		rendition_id: kontentUuidSchema,
		preset_id: kontentUuidSchema,
		width: z.number(),
		height: z.number(),
		query: z.string(),
	}),
);

export const assetValueSchema = z.readonly(
	z.object({
		name: z.string(),
		description: z.nullable(z.string()),
		type: z.string(),
		size: z.number(),
		url: z.url(),
		width: z.nullable(z.number()),
		height: z.nullable(z.number()),
		renditions: z.readonly(z.object({ default: z.optional(renditionSchema) })),
	}),
);

const richTextImageSchema = z.readonly(
	z.object({
		image_id: z.string(),
		description: z.nullable(z.string()),
		url: z.url(),
		width: z.nullable(z.number()),
		height: z.nullable(z.number()),
	}),
);

const richTextLinkSchema = z.readonly(
	z.object({
		codename: codenameOf(),
		type: z.string(),
		url_slug: z.string(),
	}),
);

/**
 * Base element schema as provided by Kontent.ai API
 */
const baseElementSchemas = {
	text: z.object({
		type: z.literal("text"),
		name: z.string(),
		value: z.string(),
	}),
	number: z.object({
		type: z.literal("number"),
		name: z.string(),
		value: z.nullable(z.number()),
	}),
	richText: z.object({
		type: z.literal("rich_text"),
		name: z.string(),
		value: z.string(),
		images: z.record(z.string(), richTextImageSchema),
		links: z.record(z.string(), richTextLinkSchema),
		modular_content: z.readonly(z.array(codenameOf())),
	}),
	multipleChoice: z.object({
		type: z.literal("multiple_choice"),
		name: z.string(),
		value: z.readonly(z.array(multipleChoiceOptionSchema())),
	}),
	dateTime: z.object({
		type: z.literal("date_time"),
		name: z.string(),
		value: z.nullable(z.string()),
		display_timezone: z.nullable(z.string()),
	}),
	asset: z.object({
		type: z.literal("asset"),
		name: z.string(),
		value: z.readonly(z.array(assetValueSchema)),
	}),
	taxonomy: z.object({
		type: z.literal("taxonomy"),
		name: z.string(),
		taxonomy_group: z.string(),
		value: z.readonly(z.array(taxonomyTermValueSchema())),
	}),
	urlSlug: z.object({
		type: z.literal("url_slug"),
		name: z.string(),
		value: z.string(),
	}),
	custom: z.object({
		type: z.literal("custom"),
		name: z.string(),
		value: z.nullable(z.string()),
	}),
	linkedItems: z.object({
		type: z.literal("modular_content"),
		name: z.string(),
		value: z.readonly(z.array(codenameOf())),
	}),
} as const;

/**
 * Building blocks for constructing typed content item schemas.
 */
export const elementDef = {
	text: z.readonly(baseElementSchemas.text),
	number: z.readonly(baseElementSchemas.number),
	richText: z.readonly(baseElementSchemas.richText),
	multipleChoice: <TCodename extends string = string>() =>
		z.readonly(
			z.extend(baseElementSchemas.multipleChoice, {
				value: z.readonly(z.array(multipleChoiceOptionSchema<TCodename>())),
			}),
		),
	dateTime: z.readonly(baseElementSchemas.dateTime),
	asset: z.readonly(baseElementSchemas.asset),
	taxonomy: <TCodename extends string = string>() =>
		z.readonly(
			z.extend(baseElementSchemas.taxonomy, {
				value: z.readonly(z.array(taxonomyTermValueSchema<TCodename>())),
			}),
		),
	urlSlug: z.readonly(baseElementSchemas.urlSlug),
	custom: z.readonly(baseElementSchemas.custom),
	linkedItems: <TAllowedItemTypes extends ContentItemPayload<DeliveryClientSchema> = ContentItemPayload<DeliveryClientSchema>>() =>
		z.readonly(
			z.extend(baseElementSchemas.linkedItems, {
				items: z.readonly(
					z.array(
						z.custom<TAllowedItemTypes>((item) => contentItemSchema().safeParse(item).success, {
							error: "Invalid referenced linked item",
						}),
					),
				),
			}),
		),
} as const;

export const contentItemElementSchema = z.readonly(
	z.discriminatedUnion("type", [
		z.readonly(baseElementSchemas.text),
		z.readonly(baseElementSchemas.number),
		z.readonly(baseElementSchemas.richText),
		z.readonly(baseElementSchemas.multipleChoice),
		z.readonly(baseElementSchemas.dateTime),
		z.readonly(baseElementSchemas.asset),
		z.readonly(baseElementSchemas.taxonomy),
		z.readonly(baseElementSchemas.urlSlug),
		z.readonly(baseElementSchemas.linkedItems),
		z.readonly(baseElementSchemas.custom),
	]),
);
