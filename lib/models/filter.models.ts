import type { DeliveryClientSchema } from "./core.models.js";

export const emptyRichtextOperators = ["isEmptyRichText", "isNotEmptyRichText"] as const;

export type SpecialFilterOperators = "=" | "!=";
export type EmptyRichtextOperator = (typeof emptyRichtextOperators)[number];

export type FilterOperators =
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

export type FilterQueryParam<TSystemProperties extends string, TElementProperties extends string> =
	| `system.${TSystemProperties}[${FilterOperators}]=${string}`
	| `elements.${TElementProperties}[${FilterOperators}]=${string}`;

export type QueryFilterProperty<TSystemProperties extends string, TElementProperties extends string> =
	| `system.${TSystemProperties}`
	| `elements.${TElementProperties}`;

export type ElementsFilterQueryParam<TSchema extends DeliveryClientSchema> =
	`elements.${NonNullable<TSchema["elementCodenames"]>[number]}[${FilterOperators}]=${string}`;

export type QueryFilter<TSystemProperties extends string, TElementProperties extends string> = {
	readonly property: QueryFilterProperty<TSystemProperties, TElementProperties>;
	readonly value: string | number | boolean | undefined;
	readonly operator: SpecialFilterOperators | FilterOperators;
};

export type EmptyRichtextFilter<TElementProperties extends string> = {
	readonly property: `elements.${TElementProperties}`;
	readonly operator: EmptyRichtextOperator;
	readonly value?: never;
};

export type CombinedFilter<TSystemProperties extends string, TElementProperties extends string> =
	| QueryFilter<TSystemProperties, TElementProperties>
	| EmptyRichtextFilter<TElementProperties>
	| FilterQueryParam<TSystemProperties, TElementProperties>;
