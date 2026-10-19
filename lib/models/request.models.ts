import type { Header } from "@kontent-ai/core-sdk";
import type { Filter } from "./filter.models.js";

export type DeliveryRequest<TQuery extends QueryParameterRecord, TFilters extends readonly Filter<string, string>[]> = {
	readonly config?: DeliveryRequestConfig;
	readonly headers?: {
		readonly "X-KC-Wait-For-Loading-New-Content"?: boolean;
	};
} & ([TQuery] extends [never] ? object : { readonly query?: TQuery }) &
	([TFilters] extends [never] ? object : { readonly filters?: TFilters });

export type DeliveryRequestWithUrlPaging<
	TSortableProperties extends string,
	TQuery extends QueryParameterRecord,
	TFilters extends readonly Filter<string, string>[],
> = DeliveryRequest<TQuery, TFilters> & {
	readonly query?: {
		readonly skip?: number;
		readonly limit?: number;
		readonly order?: TSortableProperties;
	};
};

export type DeliveryRequestWithTokenPaging<
	TQuery extends QueryParameterRecord,
	TFilters extends readonly Filter<string, string>[],
> = DeliveryRequest<TQuery, TFilters> & {
	readonly headers?: {
		readonly "X-Continuation"?: string;
	};
};

export type DeliveryRequestWithCodename<
	TCodenames extends readonly string[],
	TQuery extends QueryParameterRecord,
	TFilters extends readonly Filter<string, string>[],
> = DeliveryRequest<TQuery, TFilters> & {
	readonly codename: TCodenames[number];
};

export type QueryParameterRecord = Record<string, string | number | boolean | undefined | readonly string[]>;

/**
 * Adds access to the untransformed version of a query.
 *
 * By default, queries transform the Delivery API response for convenience. For example, `rich_text` and
 * `modular_content` elements get an extra `items` property with the linked items resolved from `modular_content`.
 *
 * Resolved items are shared object references, so items that link to each other create circular references
 * and the transformed response may not be serializable (e.g. with `JSON.stringify`). Use `raw()` when you need
 * a serializable response.
 */
export type WithRaw<TRawQuery> = {
	/**
	 * Returns the same query without transformations, so its response has the same shape as the Delivery API response and is always serializable.
	 */
	readonly raw: () => TRawQuery;
};

export type DeliveryRequestConfig = {
	/**
	 * Additional headers to be added to the request.
	 */
	readonly customHeaders?: readonly Header[];
	readonly abortSignal?: AbortSignal;
};

export type OrderDirection = "asc" | "desc";

/**
 * Matches the format of the order parameter in the Delivery API.
 *
 * @example
 * ```text
 * order=system.name[asc]
 * order=system.name[desc]
 * ```
 */
export type SystemOrderQueryParam<TSortableProperties extends string> = `system.${TSortableProperties}[${OrderDirection}]`;

/**
 * Matches the format of the order parameter in the Delivery API.
 *
 * @example
 * ```text
 * order=elements.description[asc]
 * order=elements.description[desc]
 * ```
 */
export type ElementOrderQueryParam<TElementCodenames extends string> = `elements.${TElementCodenames}[${OrderDirection}]`;

/**
 * Array of element codenames that will get transformed into a comma-separated list used in the elements parameter.
 *
 * @example
 * ```text
 * elements=title,summary,related_articles
 * ```
 */
export type ElementSelectionQueryParam<TElementCodenames extends string> = readonly TElementCodenames[];
