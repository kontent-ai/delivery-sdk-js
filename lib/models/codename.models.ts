import type { DeliveryClientSchema } from "./core.models.js";

/**
 * The language codenames declared in the schema.
 */
export type LanguageCodenameOf<TSchema extends DeliveryClientSchema> = TSchema["languageCodenames"][number];

/**
 * The collection codenames declared in the schema.
 */
export type CollectionCodenameOf<TSchema extends DeliveryClientSchema> = TSchema["collectionCodenames"][number];

/**
 * The workflow codenames declared in the schema (the keys of the `workflows` map).
 */
export type WorkflowCodenameOf<TSchema extends DeliveryClientSchema> = keyof TSchema["workflows"] & string;

/**
 * The workflow step codenames of the workflow identified by `TWorkflow` (all workflows by default).
 */
export type WorkflowStepCodenameOf<
	TSchema extends DeliveryClientSchema,
	TWorkflow extends WorkflowCodenameOf<TSchema> = WorkflowCodenameOf<TSchema>,
> = TWorkflow extends keyof TSchema["workflows"] ? NonNullable<TSchema["workflows"][TWorkflow]>[number] : never;

/**
 * The taxonomy codenames declared in the schema (the keys of the `taxonomies` map).
 * Narrows to a literal union for a concrete schema, falling back to `string` for the generic default.
 */
export type TaxonomyCodenameOf<TSchema extends DeliveryClientSchema> = keyof TSchema["taxonomies"] & string;

/**
 * The term codenames belonging to the taxonomy identified by `TCodename`, derived from the schema's
 * `taxonomies` map. Covers every nesting depth (the term tree shares one flat codename union).
 * Falls back to `string` when the codename is unknown or the schema is the generic default.
 */
export type TaxonomyTermCodenamesOf<
	TSchema extends DeliveryClientSchema,
	TCodename extends string,
> = TCodename extends keyof TSchema["taxonomies"]
	? readonly [Extract<NonNullable<TSchema["taxonomies"][TCodename]>[number], string>] extends readonly [never]
		? string
		: Extract<NonNullable<TSchema["taxonomies"][TCodename]>[number], string>
	: string;

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
 * The content type snippet codenames declared in the schema's optional `snippets` map (`never` when it is omitted).
 */
export type SnippetCodenameOf<TSchema extends DeliveryClientSchema> = keyof NonNullable<TSchema["snippets"]> & string;

/**
 * The element codenames of the snippet(s) `TSnippet`, as they appear on items (`<snippet codename>__<element codename>`).
 * Distributes over a union of snippets. Falls back to `string` when the snippet is unknown or the schema is the generic default.
 */
export type SnippetElementCodenamesOf<TSchema extends DeliveryClientSchema, TSnippet extends string> = TSnippet extends keyof NonNullable<
	TSchema["snippets"]
>
	? readonly [keyof NonNullable<NonNullable<TSchema["snippets"]>[TSnippet]> & string] extends readonly [never]
		? string
		: keyof NonNullable<NonNullable<TSchema["snippets"]>[TSnippet]> & string
	: string;
