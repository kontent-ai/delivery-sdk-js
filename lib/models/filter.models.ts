import type { PickStringLiteral } from "@kontent-ai/core-sdk";

/**
 * Operators that take no value. `empty` / `nempty` map directly to the Delivery API operators, while
 * `isEmptyRichText` / `isNotEmptyRichText` are SDK helpers, because the API does not support `empty` on rich text.
 */
export const filterWithoutValueOperators = ["empty", "nempty", "isEmptyRichText", "isNotEmptyRichText"] as const;

const emptyRichTextValue = "<p><br></p>";

export const filterWithoutValueToParam: Readonly<Record<FilterWithoutValueOperator, (property: string) => [string, string]>> = {
	empty: (property) => [`${property}[empty]`, ""],
	nempty: (property) => [`${property}[nempty]`, ""],
	isEmptyRichText: (property) => [`${property}[eq]`, emptyRichTextValue],
	isNotEmptyRichText: (property) => [`${property}[neq]`, emptyRichTextValue],
};

export type FilterWithValue<TSystemProperties extends string, TElementProperties extends string> = {
	readonly property: FilterProperty<TSystemProperties, TElementProperties>;
	readonly value: string | number | boolean | undefined | readonly string[];
	readonly operator: SpecialFilterWithValueOperator | FilterWithValueOperator;
};

export type FilterWithoutValue<TSystemProperties extends string, TElementProperties extends string> =
	| {
			readonly property: FilterProperty<TSystemProperties, TElementProperties>;
			readonly operator: EmptyOperator;
			readonly value?: never;
	  }
	| {
			readonly property: `elements.${TElementProperties}`;
			readonly operator: EmptyRichTextOperator;
			readonly value?: never;
	  };

export type Filter<TSystemProperties extends string, TElementProperties extends string> =
	| FilterWithValue<TSystemProperties, TElementProperties>
	| FilterWithoutValue<TSystemProperties, TElementProperties>
	| SystemOrElementsFilterQuery<TSystemProperties, TElementProperties>;

type FilterWithoutValueOperator = (typeof filterWithoutValueOperators)[number];
type EmptyOperator = PickStringLiteral<FilterWithoutValueOperator, "empty" | "nempty">;
type EmptyRichTextOperator = PickStringLiteral<FilterWithoutValueOperator, "isEmptyRichText" | "isNotEmptyRichText">;

type SpecialFilterWithValueOperator = "=" | "!=";

type FilterWithValueOperator = "eq" | "neq" | "lt" | "lte" | "gt" | "gte" | "range" | "in" | "nin" | "contains" | "any" | "all";

type SystemOrElementsFilterQuery<TSystemProperties extends string, TElementProperties extends string> =
	| `system.${TSystemProperties}[${FilterWithValueOperator}]=${string}`
	| `elements.${TElementProperties}[${FilterWithValueOperator}]=${string}`
	| `system.${TSystemProperties}[${EmptyOperator}]`
	| `elements.${TElementProperties}[${EmptyOperator}]`;

type FilterProperty<TSystemProperties extends string, TElementProperties extends string> =
	| `system.${TSystemProperties}`
	| `elements.${TElementProperties}`;
