import type * as z from "zod/mini";
import type { DeliveryClientSchema } from "../../../models/core.models.js";
import type { contentTypeElementSchema, contentTypeSchema, listContentTypesSchema } from "../schemas/content-type.schemas.js";

export type ContentTypePayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof contentTypeSchema<TSchema>>>;

export type ContentTypeElementPayload = z.infer<ReturnType<typeof contentTypeElementSchema>>;

export type ListContentTypesPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof listContentTypesSchema<TSchema>>>;

/**
 * The content type codenames declared in the schema (the keys of the `contentTypes` map).
 * Narrows to a literal union for a concrete schema, falling back to `string` for the generic default.
 */
export type ContentTypeCodenameOf<TSchema extends DeliveryClientSchema> = keyof TSchema["contentTypes"] & string;

/**
 * The element codenames belonging to the content type identified by `TCodename`, derived from the
 * schema's `contentTypes` map. Falls back to `string` when the codename is unknown, the type declares
 * no elements, or the schema is the generic default.
 */
export type ElementCodenamesOf<
	TSchema extends DeliveryClientSchema,
	TCodename extends string,
> = TCodename extends keyof TSchema["contentTypes"]
	? [Extract<NonNullable<TSchema["contentTypes"][TCodename]>[number], string>] extends [never]
		? string
		: Extract<NonNullable<TSchema["contentTypes"][TCodename]>[number], string>
	: string;

/**
 * The union of every element codename across all content types in the schema. Used by cross-type
 * queries (items feed, list/fetch items) that aren't scoped to a single content type.
 * Falls back to `string` for the generic default.
 */
export type AllElementCodenamesOf<TSchema extends DeliveryClientSchema> = ElementCodenamesOf<TSchema, ContentTypeCodenameOf<TSchema>>;
