export const emptyRichTextOperators = ["isEmptyRichText", "isNotEmptyRichText"] as const;
export const emptyRichTextToFilterOperator: Readonly<Record<EmptyRichTextOperator, FilterOperator>> = {
	isEmptyRichText: "eq",
	isNotEmptyRichText: "neq",
};

export type ObjectFilter<TSystemProperties extends string, TElementProperties extends string> = {
	readonly property: FilterProperty<TSystemProperties, TElementProperties>;
	readonly value: string | number | boolean | undefined | string[];
	readonly operator: SpecialFilterOperator | FilterOperator;
};

export type EmptyRichTextFilter<TElementProperties extends string> = {
	readonly property: `elements.${TElementProperties}`;
	readonly operator: EmptyRichTextOperator;
	readonly value?: never;
};

export type Filter<TSystemProperties extends string, TElementProperties extends string> =
	| ObjectFilter<TSystemProperties, TElementProperties>
	| EmptyRichTextFilter<TElementProperties>
	| SystemOrElementsFilterQuery<TSystemProperties, TElementProperties>;

type SpecialFilterOperator = "=" | "!=";
type EmptyRichTextOperator = (typeof emptyRichTextOperators)[number];

type FilterOperator = "eq" | "neq" | "empty" | "nempty" | "lt" | "lte" | "gt" | "gte" | "range" | "in" | "nin" | "contains" | "any" | "all";

type SystemOrElementsFilterQuery<TSystemProperties extends string, TElementProperties extends string> =
	| `system.${TSystemProperties}[${FilterOperator}]=${string}`
	| `elements.${TElementProperties}[${FilterOperator}]=${string}`;

type FilterProperty<TSystemProperties extends string, TElementProperties extends string> =
	| `system.${TSystemProperties}`
	| `elements.${TElementProperties}`;
