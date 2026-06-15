import { codenameOf, kontentUuidSchema } from "@kontent-ai/core-sdk";
import * as z from "zod/mini";
import type { DeliveryClientSchema } from "../../../models/core.models.js";
import { paginationWithTotalCountSchema } from "../../../models/pagination.schemas.js";
import type { ContentTypeCodenameOf } from "../../content-types/models/content-type.models.js";
import { contentItemElementSchema, contentItemElementSchemaExtended } from "./element.schemas.js";

const baseContentItemSystemSchema = <TSchema extends DeliveryClientSchema>() =>
	z.object({
		id: kontentUuidSchema,
		name: z.string(),
		codename: codenameOf(),
		language: codenameOf<TSchema["languageCodenames"][number]>(),
		type: codenameOf<ContentTypeCodenameOf<TSchema>>(),
		collection: codenameOf<TSchema["collectionCodenames"][number]>(),
		last_modified: z.iso.datetime(),
		workflow: codenameOf<TSchema["workflowCodenames"][number]>(),
		workflow_step: codenameOf<TSchema["workflowStepCodenames"][number]>(),
	});

export const contentItemSchema = <TSchema extends DeliveryClientSchema>() =>
	z.readonly(
		z.object({
			system: contentItemSystemSchema<TSchema>(),
			elements: z.readonly(z.record(z.string(), contentItemElementSchema)),
		}),
	);

export const contentItemSystemWithCodename = <TSchema extends DeliveryClientSchema, TTypeCodename extends ContentTypeCodenameOf<TSchema>>(
	type: TTypeCodename,
) =>
	z.readonly(
		z.object({
			...baseContentItemSystemSchema<TSchema>().shape,
			sitemap_locations: z.readonly(z.array(z.string())),
			type: z.literal(type),
		}),
	);

export const contentItemSystemSchema = <TSchema extends DeliveryClientSchema>() =>
	z.readonly(
		z.object({
			...baseContentItemSystemSchema<TSchema>().shape,
			sitemap_locations: z.readonly(z.array(z.string())),
		}),
	);

export const listContentItemsSchema = <TSchema extends DeliveryClientSchema>() =>
	z.readonly(
		z.object({
			items: z.readonly(z.array(contentItemSchema<TSchema>())),
			modular_content: z.readonly(z.record(z.string(), contentItemSchema<TSchema>())),
			...paginationWithTotalCountSchema.shape,
		}),
	);

export const itemsFeedSchema = <TSchema extends DeliveryClientSchema>() =>
	z.readonly(
		z.object({
			items: z.readonly(z.array(contentItemSchema<TSchema>())),
			modular_content: z.readonly(z.record(z.string(), contentItemSchema<TSchema>())),
		}),
	);

export const itemsReferencingAssetSchema = <TSchema extends DeliveryClientSchema>() =>
	z.readonly(
		z.object({
			items: z.readonly(
				z.array(
					z.object({
						system: baseContentItemSystemSchema<TSchema>(),
					}),
				),
			),
		}),
	);

export const itemsReferencingItemSchema = <TSchema extends DeliveryClientSchema>() =>
	z.readonly(
		z.object({
			items: z.readonly(
				z.array(
					z.object({
						system: baseContentItemSystemSchema<TSchema>(),
					}),
				),
			),
		}),
	);

export const fetchContentItemSchema = <TSchema extends DeliveryClientSchema>() =>
	z.readonly(
		z.object({
			item: contentItemSchema<TSchema>(),
			modular_content: z.readonly(z.record(z.string(), contentItemSchema<TSchema>())),
		}),
	);

export const contentItemSchemaExtended = <TSchema extends DeliveryClientSchema>() =>
	z.readonly(
		z.object({
			system: contentItemSystemSchema<TSchema>(),
			elements: z.readonly(z.record(z.string(), contentItemElementSchemaExtended)),
		}),
	);

export const listContentItemsSchemaExtended = <TSchema extends DeliveryClientSchema>() =>
	z.readonly(
		z.object({
			items: z.readonly(z.array(contentItemSchemaExtended<TSchema>())),
			modular_content: z.readonly(z.record(z.string(), contentItemSchemaExtended<TSchema>())),
			...paginationWithTotalCountSchema.shape,
		}),
	);

export const itemsFeedSchemaExtended = <TSchema extends DeliveryClientSchema>() =>
	z.readonly(
		z.object({
			items: z.readonly(z.array(contentItemSchemaExtended<TSchema>())),
			modular_content: z.readonly(z.record(z.string(), contentItemSchemaExtended<TSchema>())),
		}),
	);

export const fetchContentItemSchemaExtended = <TSchema extends DeliveryClientSchema>() =>
	z.readonly(
		z.object({
			item: contentItemSchemaExtended<TSchema>(),
			modular_content: z.readonly(z.record(z.string(), contentItemSchemaExtended<TSchema>())),
		}),
	);
