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
	multipleChoice: z.object({
		type: z.literal("multiple_choice"),
		name: z.string(),
		value: z.array(multipleChoiceOptionSchema()).readonly(),
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
	taxonomy: z.object({
		type: z.literal("taxonomy"),
		name: z.string(),
		taxonomy_group: z.string(),
		value: z.array(taxonomyTermValueSchema()).readonly(),
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

/**
 * Building blocks for constructing typed content item schemas.
 */
export const elementDef = {
	number: ({ isRequired }: { readonly isRequired?: boolean } = {}) =>
		baseElementSchemas.number.extend({ value: isRequired ? z.number() : z.number().nullable() }).readonly(),
	richText: () => baseElementSchemas.richText.readonly(),
	dateTime: ({ isRequired }: { readonly isRequired?: boolean } = {}) =>
		baseElementSchemas.dateTime.extend({ value: isRequired ? z.string() : z.string().nullable() }).readonly(),
	asset: ({ isRequired }: { readonly isRequired?: boolean } = {}) =>
		baseElementSchemas.asset
			.extend({ value: isRequired ? z.array(assetValueSchema).min(1).readonly() : z.array(assetValueSchema).readonly() })
			.readonly(),
	urlSlug: ({ isRequired }: { readonly isRequired?: boolean } = {}) =>
		baseElementSchemas.urlSlug.extend({ value: isRequired ? z.string().min(1) : z.string() }).readonly(),
	custom: ({ isRequired }: { readonly isRequired?: boolean } = {}) =>
		baseElementSchemas.custom.extend({ value: isRequired ? z.string() : z.string().nullable() }).readonly(),
	text: ({ maxLength, isRequired }: { readonly maxLength?: number; readonly isRequired?: boolean } = {}) => {
		const valueWithMinLength = isRequired ? z.string().min(1) : z.string();
		return baseElementSchemas.text.extend({ value: maxLength ? valueWithMinLength.max(maxLength) : valueWithMinLength }).readonly();
	},
	multipleChoice: <TCodename extends string = string>({
		codenames,
		isRequired,
	}: {
		readonly codenames?: readonly TCodename[];
		readonly isRequired?: boolean;
	} = {}) => {
		const valueSchema = z.array(multipleChoiceOptionSchema(codenames));
		return baseElementSchemas.multipleChoice
			.extend({ value: isRequired ? valueSchema.min(1).readonly() : valueSchema.readonly() })
			.readonly();
	},
	taxonomy: <TCodename extends string = string>({ codenames }: { readonly codenames?: readonly TCodename[] } = {}) =>
		baseElementSchemas.taxonomy.extend({ value: z.array(taxonomyTermValueSchema(codenames)).readonly() }).readonly(),
	linkedItems: <const TAllowedItemTypes extends z.ZodType = z.ZodType>(
		schemas: readonly TAllowedItemTypes[],
		{ isRequired }: { readonly isRequired?: boolean } = {},
	) =>
		baseElementSchemas.linkedItems
			.extend({
				value: isRequired ? z.array(codenameSchema).min(1).readonly() : z.array(codenameSchema).readonly(),
				items: isRequired ? z.array(z.union(schemas)).min(1).readonly() : z.array(z.union(schemas)).readonly(),
			})
			.readonly(),
} as const;

export const contentItemElementSchema = z
	.discriminatedUnion("type", [
		baseElementSchemas.text.readonly(),
		baseElementSchemas.number.readonly(),
		baseElementSchemas.richText.readonly(),
		baseElementSchemas.multipleChoice.readonly(),
		baseElementSchemas.dateTime.readonly(),
		baseElementSchemas.asset.readonly(),
		baseElementSchemas.taxonomy.readonly(),
		baseElementSchemas.urlSlug.readonly(),
		baseElementSchemas.linkedItems.readonly(),
		baseElementSchemas.custom.readonly(),
	])
	.readonly();

export type ContentItemElementPayload = z.infer<typeof contentItemElementSchema>;
