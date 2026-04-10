export const emptyRichtextOperators = ["isEmptyRichText", "isNotEmptyRichText"] as const;
export const operatorToFilterOp: Record<EmptyRichtextOperator, FilterOperators> = {
	isEmptyRichText: "eq",
	isNotEmptyRichText: "neq",
};

export type ObjectFilter<TSystemProperties extends string, TElementProperties extends string> = {
	readonly property: FilterProperty<TSystemProperties, TElementProperties>;
	readonly value: string | number | boolean | undefined;
	readonly operator: SpecialFilterOperators | FilterOperators;
};

export type EmptyRichtextFilter<TElementProperties extends string> = {
	readonly property: `elements.${TElementProperties}`;
	readonly operator: EmptyRichtextOperator;
	readonly value?: never;
};

export type Filter<TSystemProperties extends string, TElementProperties extends string> =
	| ObjectFilter<TSystemProperties, TElementProperties>
	| EmptyRichtextFilter<TElementProperties>
	| FullFilterQuery<TSystemProperties, TElementProperties>;

type SpecialFilterOperators = "=" | "!=";
type EmptyRichtextOperator = (typeof emptyRichtextOperators)[number];

type FilterOperators =
	| "eq"
	| "neq"
	| "empty"
	| "nempty"
	| "lt"
	| "lte"
	| "gt"
	| "gte"
	| "range"
	| "in"
	| "nin"
	| "contains"
	| "any"
	| "all";

type FullFilterQuery<TSystemProperties extends string, TElementProperties extends string> =
	| `system.${TSystemProperties}[${FilterOperators}]=${string}`
	| `elements.${TElementProperties}[${FilterOperators}]=${string}`;

type FilterProperty<TSystemProperties extends string, TElementProperties extends string> =
	| `system.${TSystemProperties}`
	| `elements.${TElementProperties}`;
