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
	readonly value: FilterValue;
	readonly operator: SpecialFilterWithValueOperator | FilterWithValueOperator;
};

/**
 * Any value accepted by a filter. Arrays are serialized as comma-separated lists. `undefined` skips the filter.
 */
export type FilterValue = string | number | boolean | undefined | readonly (string | number)[];

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

export type SystemOrElementsFilterQuery<TSystemProperties extends string, TElementProperties extends string> =
	| `system.${TSystemProperties}[${FilterWithValueOperator}]=${string}`
	| `elements.${TElementProperties}[${FilterWithValueOperator}]=${string}`
	| `system.${TSystemProperties}[${EmptyOperator}]`
	| `elements.${TElementProperties}[${EmptyOperator}]`;

type FilterProperty<TSystemProperties extends string, TElementProperties extends string> =
	| `system.${TSystemProperties}`
	| `elements.${TElementProperties}`;

/**
 * Operators for properties holding a single value (text, number, date & time, URL slug, rich text, system properties).
 */
export type ScalarFilterOperator = SpecialFilterWithValueOperator | "eq" | "neq" | "lt" | "lte" | "gt" | "gte";

/**
 * Operators for properties holding an array of values (linked items, multiple choice, taxonomy, custom elements storing a JSON array).
 */
export type ArrayFilterOperator = "contains";

/**
 * A strongly typed filter for a property holding a single value of type `TValue`.
 */
export type ScalarFilter<TProperty extends string, TValue extends string | number> =
	| {
			readonly property: TProperty;
			readonly operator: ScalarFilterOperator;
			readonly value: TValue | undefined;
	  }
	| {
			readonly property: TProperty;
			readonly operator: "in" | "nin";
			readonly value: readonly TValue[] | undefined;
	  }
	| {
			readonly property: TProperty;
			readonly operator: "range";
			readonly value: readonly [TValue, TValue] | undefined;
	  };

/**
 * A strongly typed filter for a property holding an array of values of type `TValue`.
 */
export type ArrayFilter<TProperty extends string, TValue extends string> =
	| {
			readonly property: TProperty;
			readonly operator: ArrayFilterOperator;
			readonly value: TValue | undefined;
	  }
	| {
			readonly property: TProperty;
			readonly operator: "any" | "all";
			readonly value: readonly TValue[] | undefined;
	  };

/**
 * A filter checking that a property is (or is not) empty.
 */
export type EmptyFilter<TProperty extends string> = {
	readonly property: TProperty;
	readonly operator: EmptyOperator;
	readonly value?: never;
};

/**
 * A filter checking that a rich text element is (or is not) empty. The Delivery API does not support `empty` on rich text.
 */
export type EmptyRichTextFilter<TProperty extends string> = {
	readonly property: TProperty;
	readonly operator: EmptyRichTextOperator;
	readonly value?: never;
};

/**
 * Strongly typed filters for system properties. `TValues` maps each system property to its accepted value.
 */
export type SystemPropertyFilter<TValues extends Readonly<Record<string, string>>> = {
	readonly [TKey in keyof TValues & string]: ScalarFilter<`system.${TKey}`, TValues[TKey]> | EmptyFilter<`system.${TKey}`>;
}[keyof TValues & string];
