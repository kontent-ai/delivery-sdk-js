import type { Header } from "@kontent-ai/core-sdk";
import type { Filter } from "./filter.models.js";

export type DeliveryRequest<
	THeaders extends HeaderParameterRecord,
	TQuery extends QueryParameterRecord,
	TFilters extends readonly Filter<string, string>[],
> = {
	readonly config?: DeliveryRequestConfig;
} & ([THeaders] extends [never] ? object : { readonly headers?: THeaders }) &
	([TQuery] extends [never] ? object : { readonly query?: TQuery }) &
	([TFilters] extends [never] ? object : { readonly filters?: TFilters });

export type DeliveryRequestWithUrlPaging<
	TSortableProperties extends string,
	THeaders extends HeaderParameterRecord,
	TQuery extends QueryParameterRecord,
	TFilters extends readonly Filter<string, string>[],
> = DeliveryRequest<THeaders, TQuery, TFilters> & {
	readonly query?: {
		readonly skip?: number;
		readonly limit?: number;
		readonly order?: TSortableProperties;
	};
};

export type DeliveryRequestWithTokenPaging<
	THeaders extends HeaderParameterRecord,
	TQuery extends QueryParameterRecord,
	TFilters extends readonly Filter<string, string>[],
> = DeliveryRequest<THeaders & { readonly continuationToken?: string }, TQuery, TFilters> & {
	readonly continuationToken?: string;
};

export type DeliveryRequestWithCodename<
	TCodenames extends readonly string[],
	THeaders extends HeaderParameterRecord,
	TQuery extends QueryParameterRecord,
	TFilters extends readonly Filter<string, string>[],
> = DeliveryRequest<THeaders, TQuery, TFilters> & {
	readonly codename: TCodenames[number];
};

export type QueryParameterRecord = Record<string, string | number | boolean | undefined | readonly string[]>;
export type HeaderParameterRecord = Record<string, string | number | boolean>;

export type DeliveryRequestConfig = {
	/**
	 * When enabled, sets the `X-KC-Wait-For-Loading-New-Content` header so the Delivery API
	 * waits for the latest content to be loaded before responding instead of serving
	 * a potentially stale response from the CDN cache. Useful when you know the
	 * requested content has just changed (for example, after handling a webhook).
	 */
	readonly bypassCdnCache?: boolean;

	/**
	 * Additional headers to be added to the request.
	 */
	readonly customHeaders?: readonly Header[];
};

export type OrderDirection = "asc" | "desc";

/**
 * Matches the format of the order parameter in the Delivery API.
 *
 * @example
 * ```ts
 * `order=system.name[asc]`
 * `order=system.name[desc]`
 */
export type SystemOrderQueryParam<TSortableProperties extends string> = `system.${TSortableProperties}[${OrderDirection}]`;

/**
 * Matches the format of the order parameter in the Delivery API.
 *
 * @example
 * ```ts
 * `order=elements.description[asc]`
 * `order=elements.description[desc]`
 */
export type ElementOrderQueryParam<TElementCodenames extends string> = `elements.${TElementCodenames}[${OrderDirection}]`;

/**
 * Array of element codenames that will get transformed into a comma-separated list used in the elements parameter.
 *
 * @example
 * ```ts
 * `elements=title,summary,related_articles`
 */
export type ElementSelectionQueryParam<TElementCodenames extends string> = readonly TElementCodenames[];

export type ExtractString<T extends string | number> = T extends string ? (string extends T ? never : T) : never;
