import type * as z from "@zod/mini";
import type {
	CollectionCodenameOf,
	DeliveryClientSchema,
	DeliveryElementSchema,
	LanguageCodenameOf,
	WorkflowCodenameOf,
	WorkflowStepCodenameOf,
} from "../../../models/core.models.js";
import type {
	ArrayFilter,
	EmptyFilter,
	EmptyRichTextFilter,
	ScalarFilter,
	SystemOrElementsFilterQuery,
	SystemPropertyFilter,
} from "../../../models/filter.models.js";
import type { ContentTypeCodenameOf, ElementCodenamesOf, ElementSchemaOf } from "../../content-types/models/content-type.models.js";
import type { TaxonomyTermCodenamesOf } from "../../taxonomies/models/taxonomy.models.js";
import type {
	contentItemSchema,
	contentItemSchemaExtended,
	contentItemSystemSchema,
	contentItemSystemWithCodename,
	fetchContentItemSchema,
	fetchContentItemSchemaExtended,
	itemsFeedSchema,
	itemsFeedSchemaExtended,
	itemsReferencingAssetSchema,
	itemsReferencingItemSchema,
	listContentItemsSchema,
	listContentItemsSchemaExtended,
} from "../schemas/content-item.schemas.js";
import type { ContentItemElementPayload } from "./element.models.js";

/**
 * Pairs each workflow with its own step codenames, so `workflow_step` narrows once `workflow` is checked.
 */
type WorkflowSystemProperties<TSchema extends DeliveryClientSchema> = {
	readonly [TWorkflow in WorkflowCodenameOf<TSchema>]: {
		readonly workflow: TWorkflow;
		readonly workflow_step: WorkflowStepCodenameOf<TSchema, TWorkflow>;
	};
}[WorkflowCodenameOf<TSchema>];

export type ContentItemSystem<TSchema extends DeliveryClientSchema, TTypeCodename extends ContentTypeCodenameOf<TSchema>> = Omit<
	z.infer<ReturnType<typeof contentItemSystemWithCodename<TSchema, TTypeCodename>>>,
	"workflow" | "workflow_step"
> &
	WorkflowSystemProperties<TSchema>;

/**
 * The shape an element model must satisfy for the given {@link DeliveryElementSchema}: the element `type` must match,
 * multiple choice option codenames must be declared options, taxonomy terms must belong to the declared taxonomy group,
 * and resolved linked items (and rich text components) must be of the declared allowed content types.
 */
export type ElementConstraintOf<
	TSchema extends DeliveryClientSchema,
	TElementSchema extends DeliveryElementSchema,
> = TElementSchema extends {
	readonly type: "multiple_choice";
	readonly options: infer TOptions extends readonly string[];
}
	? { readonly type: "multiple_choice"; readonly value: readonly { readonly codename: TOptions[number] }[] }
	: TElementSchema extends { readonly type: "taxonomy"; readonly taxonomyGroup: infer TGroup extends string }
		? {
				readonly type: "taxonomy";
				readonly taxonomy_group: TGroup;
				readonly value: readonly { readonly codename: TaxonomyTermCodenamesOf<TSchema, TGroup> }[];
			}
		: TElementSchema extends {
					readonly type: infer TType extends "modular_content" | "rich_text";
					readonly allowedContentTypes: infer TAllowed extends readonly string[];
				}
			? {
					readonly type: TType;
					readonly items: readonly { readonly system: { readonly type: TAllowed[number] } }[];
				}
			: { readonly type: TElementSchema["type"] };

/**
 * Validates an element model map against the schema: every key must be an element of the content type(s)
 * and every element model must match the element's type declared in the schema.
 */
export type ElementsOf<TSchema extends DeliveryClientSchema, TTypeCodename extends ContentTypeCodenameOf<TSchema>, TElements> = {
	readonly [Codename in keyof TElements]: Codename extends ElementCodenamesOf<TSchema, TTypeCodename>
		? ElementConstraintOf<TSchema, ElementSchemaOf<TSchema, TTypeCodename, Codename>> & ContentItemElementPayload
		: never;
};

export type SnippetOf<
	TSchema extends DeliveryClientSchema,
	TTypeCodename extends ContentTypeCodenameOf<TSchema>,
	TElements extends ElementsOf<TSchema, TTypeCodename, TElements>,
> = ContentItemOf<TSchema, TTypeCodename, TElements>;

/**
 * A strongly typed content item of content type `TTypeCodename`. Element keys and element types are validated
 * against the schema. You may model a subset of the type's elements.
 */
export type ContentItemOf<
	TSchema extends DeliveryClientSchema,
	TTypeCodename extends ContentTypeCodenameOf<TSchema>,
	TElements extends ElementsOf<TSchema, TTypeCodename, TElements>,
> = {
	readonly system: ContentItemSystem<TSchema, TTypeCodename>;
	readonly elements: TElements;
};

export type ContentItemSystemPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof contentItemSystemSchema<TSchema>>>;

/**
 * System properties of content items that can be filtered by, mapped to their accepted values.
 */
export type ContentItemSystemFilterValues<
	TSchema extends DeliveryClientSchema,
	TTypeCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>,
> = {
	readonly id: string;
	readonly name: string;
	readonly codename: string;
	readonly language: LanguageCodenameOf<TSchema>;
	readonly type: TTypeCodename;
	readonly collection: CollectionCodenameOf<TSchema>;
	readonly last_modified: string;
	readonly workflow: WorkflowCodenameOf<TSchema>;
	readonly workflow_step: WorkflowStepCodenameOf<TSchema>;
};

/**
 * A filter for content item queries (`listContentItems`, `itemsFeed`). Properties, values and operators are bound
 * to the schema, e.g. `system.type` accepts content type codenames, number elements accept numbers, and taxonomy
 * elements accept their term codenames with the array operators (`contains`, `any`, `all`).
 * Use it to type a filter array declared outside the query call.
 *
 * `TTypeCodename` scopes the filter to the given content type(s): only their elements are accepted, element values
 * follow those types' definitions and `system.type` accepts only those types. Queries scope it by `ofContentTypes`.
 */
export type ContentItemFilter<
	TSchema extends DeliveryClientSchema = DeliveryClientSchema,
	TTypeCodename extends ContentTypeCodenameOf<TSchema> = ContentTypeCodenameOf<TSchema>,
> =
	| SystemPropertyFilter<ContentItemSystemFilterValues<TSchema, TTypeCodename>>
	| ElementFilter<TSchema, TTypeCodename>
	| SystemOrElementsFilterQuery<keyof ContentItemSystemFilterValues<TSchema>, ElementCodenamesOf<TSchema, TTypeCodename>>;

/**
 * A filter on content item system properties only, used by queries that don't support element filters.
 */
export type ContentItemSystemFilter<TSchema extends DeliveryClientSchema = DeliveryClientSchema> =
	| SystemPropertyFilter<ContentItemSystemFilterValues<TSchema>>
	| SystemOrElementsFilterQuery<keyof ContentItemSystemFilterValues<TSchema>, never>;

type ElementFilter<TSchema extends DeliveryClientSchema, TTypeCodename extends ContentTypeCodenameOf<TSchema>> = {
	readonly [TElement in ElementCodenamesOf<TSchema, TTypeCodename>]: ElementFilterOf<
		TSchema,
		`elements.${TElement}`,
		ElementSchemaOf<TSchema, TTypeCodename, TElement>
	>;
}[ElementCodenamesOf<TSchema, TTypeCodename>];

type ElementFilterOf<
	TSchema extends DeliveryClientSchema,
	TProperty extends string,
	TElementSchema extends DeliveryElementSchema,
> = TElementSchema extends { readonly type: "number" }
	? ScalarFilter<TProperty, number> | EmptyFilter<TProperty>
	: TElementSchema extends { readonly type: "multiple_choice"; readonly options: infer TOptions extends readonly string[] }
		? ArrayFilter<TProperty, TOptions[number]> | EmptyFilter<TProperty>
		: TElementSchema extends { readonly type: "taxonomy"; readonly taxonomyGroup: infer TGroup extends string }
			? ArrayFilter<TProperty, TaxonomyTermCodenamesOf<TSchema, TGroup>> | EmptyFilter<TProperty>
			: TElementSchema extends { readonly type: "modular_content" }
				? ArrayFilter<TProperty, string> | EmptyFilter<TProperty>
				: TElementSchema extends { readonly type: "custom" }
					? ScalarFilter<TProperty, string> | ArrayFilter<TProperty, string> | EmptyFilter<TProperty>
					: TElementSchema extends { readonly type: "asset" }
						? EmptyFilter<TProperty>
						: TElementSchema extends { readonly type: "rich_text" }
							? ScalarFilter<TProperty, string> | EmptyRichTextFilter<TProperty>
							: ScalarFilter<TProperty, string> | EmptyFilter<TProperty>;

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

export type ContentItemPayloadExtended<TSchema extends DeliveryClientSchema> = z.infer<
	ReturnType<typeof contentItemSchemaExtended<TSchema>>
>;

/**
 * Narrows a content item union to the items of the given content type(s).
 * Items whose `system.type` is a wider union (e.g. the untyped default item) are narrowed by intersection.
 */
export type ContentItemOfType<TItem extends ContentItemLike, TTypeCodename extends string> = TItem extends unknown
	? TItem extends { readonly system: { readonly type: TTypeCodename } }
		? TItem
		: TTypeCodename extends TItem["system"]["type"]
			? TItem & { readonly system: { readonly type: TTypeCodename } }
			: never
	: never;

/**
 * Narrows a content item union to the elements returned for an element projection (the `elements` and
 * `excludeElements` query parameters). `TSelected` keeps only the given elements, `TExcluded` removes the given
 * elements. Linked items resolved in `items` of linked items and rich text elements are projected too, because the
 * API applies the projection to `modular_content` as well.
 *
 * Items are left unchanged when there is no projection or when their elements are not modeled (untyped items).
 */
export type ProjectedItem<TItem extends ContentItemLike, TSelected extends string = never, TExcluded extends string = never> = readonly [
	TSelected | TExcluded,
] extends readonly [never]
	? TItem
	: ProjectItem<TItem, TSelected, TExcluded>;

type ProjectItem<TItem, TSelected extends string, TExcluded extends string> = TItem extends { readonly elements: infer TElements }
	? string extends keyof TElements
		? TItem
		: {
				readonly [TKey in keyof TItem]: TKey extends "elements" ? ProjectElements<TElements, TSelected, TExcluded> : TItem[TKey];
			}
	: TItem;

type ProjectElements<TElements, TSelected extends string, TExcluded extends string> = {
	readonly [TKey in keyof TElements as TKey extends TExcluded
		? never
		: readonly [TSelected] extends readonly [never]
			? TKey
			: TKey extends TSelected
				? TKey
				: never]: ProjectElement<TElements[TKey], TSelected, TExcluded>;
};

type ProjectElement<TElement, TSelected extends string, TExcluded extends string> = TElement extends {
	readonly items: readonly (infer TLinkedItem)[];
}
	? {
			readonly [TKey in keyof TElement]: TKey extends "items"
				? readonly ProjectItem<TLinkedItem, TSelected, TExcluded>[]
				: TElement[TKey];
		}
	: TElement;

/**
 * Minimal shape of a content item, used to constrain user supplied item unions.
 */
export type ContentItemLike = { readonly system: { readonly type: string; readonly codename: string } };

/**
 * Minimal shape of a content item with elements, used to constrain user supplied item unions.
 */
export type ContentItemWithElementsLike = ContentItemLike & { readonly elements: object };

/**
 * Codenames of the snippets used by the item models of a content item union. Snippet elements are named
 * `<snippet codename>__<element codename>`, so the codenames are read from the element keys. Untyped items (and items
 * whose element keys are unknown) accept any string.
 */
export type SnippetCodenameOf<TItem extends ContentItemWithElementsLike> = TItem extends unknown
	? string extends keyof TItem["elements"]
		? string
		: readonly [keyof TItem["elements"]] extends readonly [never]
			? string
			: keyof TItem["elements"] extends infer TElement
				? TElement extends `${infer TSnippet}__${string}`
					? TSnippet
					: never
				: never
	: never;

/**
 * Narrows a content item union to the items whose models contain elements of the given snippet.
 * Untyped items are left unchanged.
 */
export type ContentItemWithSnippet<TItem extends ContentItemWithElementsLike, TSnippet extends string> = TItem extends unknown
	? string extends keyof TItem["elements"]
		? TItem
		: readonly [Extract<keyof TItem["elements"], `${TSnippet}__${string}`>] extends readonly [never]
			? never
			: TItem
	: never;

type ModularContentOf<TItem> = Readonly<Record<string, TItem | undefined>>;

export type FetchContentItemPayloadExtended<
	TSchema extends DeliveryClientSchema,
	TItem extends ContentItemPayloadExtended<TSchema> = ContentItemPayloadExtended<TSchema>,
> = Readonly<
	Omit<z.infer<ReturnType<typeof fetchContentItemSchemaExtended<TSchema>>>, "item" | "modular_content"> & {
		readonly item: TItem;
		readonly modular_content: ModularContentOf<TItem>;
	}
>;
export type ListContentItemsPayloadExtended<
	TSchema extends DeliveryClientSchema,
	TItem extends ContentItemPayloadExtended<TSchema> = ContentItemPayloadExtended<TSchema>,
	TResponseItem extends TItem = TItem,
> = Readonly<
	Omit<z.infer<ReturnType<typeof listContentItemsSchemaExtended<TSchema>>>, "items" | "modular_content"> & {
		readonly items: readonly TResponseItem[];
		readonly modular_content: ModularContentOf<TItem>;
	}
>;
export type ItemsFeedPayloadExtended<
	TSchema extends DeliveryClientSchema,
	TItem extends ContentItemPayloadExtended<TSchema> = ContentItemPayloadExtended<TSchema>,
	TResponseItem extends TItem = TItem,
> = Readonly<
	Omit<z.infer<ReturnType<typeof itemsFeedSchemaExtended<TSchema>>>, "items" | "modular_content"> & {
		readonly items: readonly TResponseItem[];
		readonly modular_content: ModularContentOf<TItem>;
	}
>;
