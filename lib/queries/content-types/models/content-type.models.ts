import type * as z from "@zod/mini";
import type { DeliveryClientSchema, DeliveryElementSchema } from "../../../models/core.models.js";
import type {
	contentTypeAnyElementSchema,
	contentTypeElementSchema,
	contentTypeSchema,
	listContentTypesSchema,
} from "../schemas/content-type.schemas.js";

/**
 * A content type. For a single type (`TCodename`), `system.codename` and the element codenames are narrowed to it.
 */
export type ContentTypePayload<
	TSchema extends DeliveryClientSchema,
	TCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>,
> = Readonly<
	Omit<z.infer<ReturnType<typeof contentTypeSchema<TSchema, TCodename>>>, "elements"> & {
		readonly elements: Readonly<Partial<Record<ElementCodenamesOf<TSchema, TCodename>, ContentTypeElementDefinitionPayload>>>;
	}
>;

/**
 * Definition of a content type element as returned within a content type.
 */
export type ContentTypeElementDefinitionPayload = z.infer<typeof contentTypeAnyElementSchema>;

/**
 * A single content type element. For a known element, `type` and `codename` are narrowed to the schema definition.
 */
export type ContentTypeElementPayload<
	TSchema extends DeliveryClientSchema = DeliveryClientSchema,
	TCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>,
	TElement extends ElementCodenamesOf<TSchema, TCodename> = ElementCodenamesOf<TSchema, TCodename>,
> = ContentTypeElementOfType<ElementSchemaOf<TSchema, TCodename, TElement>["type"]> & {
	readonly codename: TElement;
};

/**
 * Distributes over the element type first, so the payload union is filtered only once the element type is known.
 */
type ContentTypeElementOfType<TType extends DeliveryElementSchema["type"]> = TType extends DeliveryElementSchema["type"]
	? Extract<z.infer<ReturnType<typeof contentTypeElementSchema>>, { readonly type: TType }>
	: never;

export type ListContentTypesPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof listContentTypesSchema<TSchema>>>;

/**
 * The content type codenames declared in the schema (the keys of the `contentTypes` map).
 * Narrows to a literal union for a concrete schema, falling back to `string` for the generic default.
 */
export type ContentTypeCodenameOf<TSchema extends DeliveryClientSchema> = keyof TSchema["contentTypes"] & string;

/**
 * The element codenames belonging to the content type identified by `TCodename`, derived from the
 * schema's `contentTypes` map. Distributes over a union of content types. Falls back to `string` when the
 * codename is unknown, the type declares no elements, or the schema is the generic default.
 */
export type ElementCodenamesOf<
	TSchema extends DeliveryClientSchema,
	TCodename extends string,
> = TCodename extends keyof TSchema["contentTypes"]
	? readonly [keyof NonNullable<TSchema["contentTypes"][TCodename]> & string] extends readonly [never]
		? string
		: keyof NonNullable<TSchema["contentTypes"][TCodename]> & string
	: string;

/**
 * The union of every element codename across all content types in the schema. Used by cross-type
 * queries (items feed, list/fetch items) that aren't scoped to a single content type.
 * Falls back to `string` for the generic default.
 */
export type AllElementCodenamesOf<TSchema extends DeliveryClientSchema> = ElementCodenamesOf<TSchema, ContentTypeCodenameOf<TSchema>>;

/**
 * The {@link DeliveryElementSchema} of element `TElement` in the content type(s) `TCodename`.
 * Distributes over a union of content types, so an element shared by several types yields the union of its definitions.
 * Falls back to {@link DeliveryElementSchema} when the element is unknown (e.g. for the generic default schema).
 */
export type ElementSchemaOf<TSchema extends DeliveryClientSchema, TCodename extends string, TElement extends string> = readonly [
	ElementSchemaLookup<TSchema, TCodename, TElement>,
] extends readonly [never]
	? DeliveryElementSchema
	: ElementSchemaLookup<TSchema, TCodename, TElement>;

type ElementSchemaLookup<
	TSchema extends DeliveryClientSchema,
	TCodename extends string,
	TElement extends string,
> = TCodename extends keyof TSchema["contentTypes"]
	? TElement extends keyof NonNullable<TSchema["contentTypes"][TCodename]>
		? Extract<NonNullable<TSchema["contentTypes"][TCodename]>[TElement], DeliveryElementSchema>
		: never
	: never;
