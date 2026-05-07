import { codenameOf, kontentUuidSchema } from "@kontent-ai/core-sdk";
import { z } from "zod";
import type { DeliveryClientSchema } from "../../models/core.models.js";
import { paginationWithTotalCountSchema } from "../../models/pagination.models.js";
import { contentItemElementSchema } from "./element.models.js";

const baseContentItemSystemSchema = <TSchema extends DeliveryClientSchema>(_schema: TSchema | undefined) =>
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

export const contentItemSystemWithCodename = <
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

export const defineContentItem = <
	TSchema extends DeliveryClientSchema,
	TTypeCodename extends TSchema["contentTypeCodenames"][number],
	TElementsShape extends z.ZodRawShape,
>(
	schema: TSchema | undefined,
	typeCodename: TTypeCodename,
	elements: TElementsShape,
) =>
	z
		.object({
			system: contentItemSystemWithCodename(schema, typeCodename),
			elements: z.object(elements).readonly(),
		})
		.readonly();

export type ContentItemSystem<
	TSchema extends DeliveryClientSchema,
	TTypeCodename extends TSchema["contentTypeCodenames"][number],
> = z.infer<ReturnType<typeof contentItemSystemWithCodename<TSchema, TTypeCodename>>>;

export type InferItemType<
	TSchema extends DeliveryClientSchema,
	TTypeCodename extends TSchema["contentTypeCodenames"][number],
	TElementSchemas extends z.ZodRawShape,
> = {
	readonly system: ContentItemSystem<TSchema, TTypeCodename>;
	readonly elements: {
		readonly [K in keyof TElementSchemas]: z.infer<TElementSchemas[K]>;
	};
};

export type ContentItemSystemPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof contentItemSystemSchema<TSchema>>>;
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
