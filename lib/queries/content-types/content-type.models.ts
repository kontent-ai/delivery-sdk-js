import { getCodenameSchema, kontentUuidSchema } from "@kontent-ai/core-sdk";
import { z } from "zod";
import { type DefaultDeliveryClientSchema, paginationSchema } from "../../models/core.models.js";

export const contentTypePayload = <TSchema extends DefaultDeliveryClientSchema>(schema: TSchema) =>
	z
		.object({
			system: z
				.object({
					id: kontentUuidSchema,
					name: z.string(),
					codename: getCodenameSchema<NonNullable<TSchema["contentTypeCodenames"]>>(schema.contentTypeCodenames),
					last_modified: z.iso.datetime(),
				})
				.readonly(),
			elements: z.any(),
		})
		.readonly();

export const listContentTypesPayload = <TSchema extends DefaultDeliveryClientSchema>(schema: TSchema) =>
	z
		.object({
			types: z.array(contentTypePayload(schema)).readonly(),
			...paginationSchema.shape,
		})
		.readonly();

export type ContentTypePayload<TSchema extends DefaultDeliveryClientSchema> = z.infer<ReturnType<typeof contentTypePayload<TSchema>>>;

export type ListContentTypesPayload<TSchema extends DefaultDeliveryClientSchema> = z.infer<
	ReturnType<typeof listContentTypesPayload<TSchema>>
>;
