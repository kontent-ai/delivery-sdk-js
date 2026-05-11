import { codenameOf, kontentUuidSchema } from "@kontent-ai/core-sdk";
import { z } from "zod";
import type { DeliveryClientSchema } from "../../models/core.models.js";
import { paginationWithTotalCountSchema } from "../../models/pagination.schemas.js";
import type { ContentItemElementShape } from "./content-item.models.js";
import { contentItemElementSchema } from "./element.schemas.js";

type ElementSchemasOf<TElements extends ContentItemElementShape> = {
	readonly [K in keyof TElements]: z.ZodType<TElements[K]>;
};

const baseContentItemSystemSchema = <TSchema extends DeliveryClientSchema>() =>
	z.object({
		id: kontentUuidSchema,
		name: z.string(),
		codename: codenameOf(),
		language: codenameOf<TSchema["languageCodenames"][number]>(),
		type: codenameOf<TSchema["contentTypeCodenames"][number]>(),
		collection: codenameOf<TSchema["collectionCodenames"][number]>(),
		last_modified: z.iso.datetime(),
		workflow: codenameOf<TSchema["workflowCodenames"][number]>(),
		workflow_step: codenameOf<TSchema["workflowStepCodenames"][number]>(),
	});

export const contentItemSchema = <TSchema extends DeliveryClientSchema>() =>
	z
		.object({
			system: contentItemSystemSchema<TSchema>(),
			elements: z.record(z.string(), contentItemElementSchema),
		})
		.readonly();

export const contentItemSystemWithCodename = <
	TSchema extends DeliveryClientSchema,
	TTypeCodename extends TSchema["contentTypeCodenames"][number],
>(
	type: TTypeCodename,
) =>
	z
		.object({
			...baseContentItemSystemSchema<TSchema>().shape,
			sitemap_locations: z.array(z.string()).readonly(),
			type: z.literal(type),
		})
		.readonly();

export const contentItemSystemSchema = <TSchema extends DeliveryClientSchema>() =>
	z
		.object({
			...baseContentItemSystemSchema<TSchema>().shape,
			sitemap_locations: z.array(z.string()).readonly(),
		})
		.readonly();

export const listContentItemsSchema = <TSchema extends DeliveryClientSchema>() =>
	z
		.object({
			items: z.array(contentItemSchema<TSchema>()).readonly(),
			modular_content: z.record(z.string(), contentItemSchema<TSchema>()),
			...paginationWithTotalCountSchema.shape,
		})
		.readonly();

export const itemsFeedSchema = <TSchema extends DeliveryClientSchema>() =>
	z
		.object({
			items: z.array(contentItemSchema<TSchema>()).readonly(),
			modular_content: z.record(z.string(), contentItemSchema<TSchema>()),
		})
		.readonly();

export const itemsReferencingAssetSchema = <TSchema extends DeliveryClientSchema>() =>
	z
		.object({
			items: z
				.array(
					z.object({
						system: baseContentItemSystemSchema<TSchema>(),
					}),
				)
				.readonly(),
		})
		.readonly();

export const itemsReferencingItemSchema = <TSchema extends DeliveryClientSchema>() =>
	z
		.object({
			items: z
				.array(
					z.object({
						system: baseContentItemSystemSchema<TSchema>(),
					}),
				)
				.readonly(),
		})
		.readonly();

export const fetchContentItemSchema = <TSchema extends DeliveryClientSchema>() =>
	z
		.object({
			item: contentItemSchema<TSchema>(),
			modular_content: z.record(z.string(), contentItemSchema<TSchema>()),
		})
		.readonly();

export const defineContentItem = <
	TSchema extends DeliveryClientSchema,
	TTypeCodename extends TSchema["contentTypeCodenames"][number],
	TElements extends ContentItemElementShape,
>(
	typeCodename: TTypeCodename,
	elements: ElementSchemasOf<TElements>,
) =>
	z
		.object({
			system: contentItemSystemWithCodename<TSchema, TTypeCodename>(typeCodename),
			elements: z.object(elements).readonly(),
		})
		.readonly();
