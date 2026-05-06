import { codenameOf, codenameSchema, kontentUuidSchema } from "@kontent-ai/core-sdk";
import { match, P } from "ts-pattern";
import { z } from "zod";

export type LinkedItemsLimitType = "atLeast" | "exactly" | "atMost";

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

export type TextOptions = { readonly maxLength?: number };
export type MultipleChoiceOptions<TCodename extends string = string> = { readonly codenames?: readonly TCodename[] };
export type TaxonomyOptions<TCodename extends string = string> = { readonly codenames?: readonly TCodename[] };
export type LinkedItemsOptions = { readonly limitType?: LinkedItemsLimitType; readonly itemsLimit?: number };

const applyOptionalLinkedItemsLimits =
	({ limitType, itemsLimit }: LinkedItemsOptions) =>
	<T extends z.ZodTypeAny>(arr: z.ZodArray<T>) =>
		match({ limitType, itemsLimit })
			.with({ limitType: "atLeast", itemsLimit: P.number }, ({ itemsLimit }) => arr.min(itemsLimit))
			.with({ limitType: "atMost", itemsLimit: P.number }, ({ itemsLimit }) => arr.max(itemsLimit))
			.with({ limitType: "exactly", itemsLimit: P.number }, ({ itemsLimit }) => arr.length(itemsLimit))
			.otherwise(() => arr);

const applyRequiredLinkedItemsLimits =
	({ limitType, itemsLimit }: LinkedItemsOptions) =>
	<T extends z.ZodTypeAny>(item: T) => {
		const tuple = z.tuple([item]).rest(item);
		return match({ limitType, itemsLimit })
			.with({ limitType: "atLeast", itemsLimit: P.number }, ({ itemsLimit }) =>
				tuple.refine((v): boolean => v.length >= itemsLimit, { error: `Array must contain at least ${itemsLimit} item(s).` }),
			)
			.with({ limitType: "atMost", itemsLimit: P.number }, ({ itemsLimit }) =>
				tuple.refine((v): boolean => v.length <= itemsLimit, { error: `Array must contain at most ${itemsLimit} item(s).` }),
			)
			.with({ limitType: "exactly", itemsLimit: P.number }, ({ itemsLimit }) =>
				tuple.refine((v): boolean => v.length === itemsLimit, { error: `Array must contain exactly ${itemsLimit} item(s).` }),
			)
			.otherwise(() => tuple);
	};

const buildOptionalLinkedItems = <const TAllowedItemTypes extends z.ZodType = z.ZodType>(
	schemas: readonly TAllowedItemTypes[],
	options: LinkedItemsOptions = {},
) => {
	const applyLimits = applyOptionalLinkedItemsLimits(options);
	return baseElementSchemas.linkedItems
		.extend({
			value: applyLimits(z.array(codenameSchema)).readonly(),
			items: applyLimits(z.array(z.union(schemas))).readonly(),
		})
		.readonly();
};

const buildRequiredLinkedItems = <const TAllowedItemTypes extends z.ZodType = z.ZodType>(
	schemas: readonly TAllowedItemTypes[],
	options: LinkedItemsOptions = {},
) => {
	const applyLimits = applyRequiredLinkedItemsLimits(options);
	return baseElementSchemas.linkedItems
		.extend({
			value: applyLimits(codenameSchema).readonly(),
			items: applyLimits(z.union(schemas)).readonly(),
		})
		.readonly();
};

const optionalElementDef = {
	number: () => baseElementSchemas.number.extend({ value: z.number().nullable() }).readonly(),
	richText: () => baseElementSchemas.richText.readonly(),
	dateTime: () => baseElementSchemas.dateTime.extend({ value: z.string().nullable() }).readonly(),
	asset: () => baseElementSchemas.asset.extend({ value: z.array(assetValueSchema).readonly() }).readonly(),
	urlSlug: () => baseElementSchemas.urlSlug.extend({ value: z.string() }).readonly(),
	custom: () => baseElementSchemas.custom.extend({ value: z.string().nullable() }).readonly(),
	text: ({ maxLength }: TextOptions = {}) =>
		baseElementSchemas.text.extend({ value: maxLength ? z.string().max(maxLength) : z.string() }).readonly(),
	multipleChoice: <TCodename extends string = string>({ codenames }: MultipleChoiceOptions<TCodename> = {}) =>
		baseElementSchemas.multipleChoice.extend({ value: z.array(multipleChoiceOptionSchema(codenames)).readonly() }).readonly(),
	taxonomy: <TCodename extends string = string>({ codenames }: TaxonomyOptions<TCodename> = {}) =>
		baseElementSchemas.taxonomy.extend({ value: z.array(taxonomyTermValueSchema(codenames)).readonly() }).readonly(),
	linkedItems: buildOptionalLinkedItems,
} as const;

const requiredElementDef = {
	number: () => baseElementSchemas.number.extend({ value: z.number() }).readonly(),
	richText: () => baseElementSchemas.richText.readonly(),
	dateTime: () => baseElementSchemas.dateTime.extend({ value: z.string() }).readonly(),
	asset: () => baseElementSchemas.asset.extend({ value: z.tuple([assetValueSchema]).rest(assetValueSchema).readonly() }).readonly(),
	urlSlug: () => baseElementSchemas.urlSlug.extend({ value: z.string().min(1) }).readonly(),
	custom: () => baseElementSchemas.custom.extend({ value: z.string() }).readonly(),
	text: ({ maxLength }: TextOptions = {}) => {
		const value = z.string().min(1);
		return baseElementSchemas.text.extend({ value: maxLength ? value.max(maxLength) : value }).readonly();
	},
	multipleChoice: <TCodename extends string = string>({ codenames }: MultipleChoiceOptions<TCodename> = {}) => {
		const item = multipleChoiceOptionSchema(codenames);
		return baseElementSchemas.multipleChoice.extend({ value: z.tuple([item]).rest(item).readonly() }).readonly();
	},
	taxonomy: <TCodename extends string = string>({ codenames }: TaxonomyOptions<TCodename> = {}) => {
		const item = taxonomyTermValueSchema(codenames);
		return baseElementSchemas.taxonomy.extend({ value: z.tuple([item]).rest(item).readonly() }).readonly();
	},
	linkedItems: buildRequiredLinkedItems,
} as const;

/**
 * Building blocks for constructing typed content item schemas.
 */
export const elementDef = {
	required: requiredElementDef,
	optional: optionalElementDef,
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
