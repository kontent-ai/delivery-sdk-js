import type { ContentItemSystemPayload } from "../queries/content-items/content-item.models.js";
import type { DeliveryClientSchema } from "./core.models.js";

export type FilterOperators =
	| "eq"
	| "="
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
	readonly operator: FilterOperators;
};

export type CombinedFilter<TSystemProperties extends string, TElementProperties extends string> =
	| QueryFilter<TSystemProperties, TElementProperties>
	| FilterQueryParam<TSystemProperties, TElementProperties>;

const filter: QueryFilter<keyof ContentItemSystemPayload<DeliveryClientSchema>, "hello" | "world"> = {
	property: "elements.hello",
	operator: "gte",
	value: "fe",
};

void filter;
