import { z } from "zod";
import { type DeliveryClientSchema, type DeliveryClientTypes, kontentUuidSchema, paginationSchema } from "../../models/core.models.js";
import { getCodenameSchema } from "../../utils/type.utils.js";

export const contentTypePayload = <TDeliveryClientTypes extends DeliveryClientTypes>(schema: DeliveryClientSchema<TDeliveryClientTypes>) =>
	z
		.object({
			system: z
				.object({
					id: kontentUuidSchema,
					name: z.string(),
					codename: getCodenameSchema(schema.taxonomyCodenames),
					last_modified: z.iso.datetime(),
				})
				.readonly(),
			elements: z.any(),
		})
		.readonly();

export const listContentTypesPayload = <TDeliveryClientTypes extends DeliveryClientTypes>(
	schema: DeliveryClientSchema<TDeliveryClientTypes>,
) =>
	z
		.object({
			types: z.array(contentTypePayload(schema)).readonly(),
			...paginationSchema.shape,
		})
		.readonly();

export type ListContentTypesPayload<TDeliveryClientTypes extends DeliveryClientTypes> = z.infer<
	ReturnType<typeof listContentTypesPayload<TDeliveryClientTypes>>
>;

export type ContentTypePayload<TDeliveryClientTypes extends DeliveryClientTypes> = z.infer<
	ReturnType<typeof contentTypePayload<TDeliveryClientTypes>>
>;
