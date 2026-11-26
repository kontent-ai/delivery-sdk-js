import type * as z from "@zod/mini";
import type { ContentTypeCodenameOf, ElementCodenamesOf } from "../../../models/codename.models.js";
import type { DeliveryClientSchema, DeliveryElementSchema } from "../../../models/core.models.js";
import type {
	contentTypeAnyElementSchema,
	contentTypeElementSchema,
	contentTypeSchema,
	listContentTypesSchema,
} from "../schemas/content-type.schemas.js";

/**
 * A content type. For a single type (`TCodename`), `system.codename` and the element codenames are narrowed to it,
 * and each element definition is narrowed to its schema definition (see {@link ContentTypeElementDefinitionOf}).
 */
export type ContentTypePayload<
	TSchema extends DeliveryClientSchema,
	TCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>,
> = Readonly<
	Omit<z.infer<ReturnType<typeof contentTypeSchema<TSchema, TCodename>>>, "elements"> & {
		readonly elements: {
			readonly [TElement in ElementCodenamesOf<TSchema, TCodename>]?: ContentTypeElementDefinitionOf<
				ElementSchemaOf<TSchema, TCodename, TElement>
			>;
		};
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
> = ContentTypeElementDefinitionOf<ElementSchemaOf<TSchema, TCodename, TElement>, z.infer<ReturnType<typeof contentTypeElementSchema>>> & {
	readonly codename: TElement;
};

/**
 * A content type element definition narrowed to its {@link DeliveryElementSchema}: the element `type` is narrowed,
 * multiple choice `options[].codename` is narrowed to the declared options and taxonomy `taxonomy_group` to the declared group.
 * Distributes over the element schema, so the payload union is filtered only once the element type is known.
 */
export type ContentTypeElementDefinitionOf<
	TElementSchema extends DeliveryElementSchema,
	TPayload extends ContentTypeElementDefinitionPayload = ContentTypeElementDefinitionPayload,
> = TElementSchema extends DeliveryElementSchema
	? Extract<TPayload, { readonly type: TElementSchema["type"] }> & ElementDefinitionNarrowingOf<TElementSchema>
	: never;

type ElementDefinitionNarrowingOf<TElementSchema extends DeliveryElementSchema> = TElementSchema extends {
	readonly type: "multiple_choice";
	readonly options: infer TOptions extends readonly string[];
}
	? { readonly options: readonly { readonly name: string; readonly codename: TOptions[number] }[] }
	: TElementSchema extends { readonly type: "taxonomy"; readonly taxonomyGroup: infer TGroup extends string }
		? { readonly taxonomy_group: TGroup }
		: unknown;

export type ListContentTypesPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof listContentTypesSchema<TSchema>>>;

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
