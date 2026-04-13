import type { Header } from "@kontent-ai/core-sdk";
import type { Filter } from "./filter.models.js";

export type DeliveryRequest = {
	readonly config?: DeliveryRequestConfig;
};

export type QueryParameterRecord = Record<string, string | number | boolean | undefined | readonly string[]>;
export type HeaderParameterRecord = Record<string, string | number | boolean>;

export type PagingByUrlDeliveryRequest<TSortableProperties extends string> = DeliveryRequest &
	QueryParameters<{
		readonly skip?: number;
		readonly limit?: number;
		readonly order?: TSortableProperties;
	}>;

export type PagingByTokenDeliveryRequest = DeliveryRequest &
	HeaderParameters<{
		readonly continuationToken?: string;
	}>;

export type QueryRequestWithCodename<TCodenames extends readonly string[]> = {
	readonly codename: TCodenames[number];
};

export type HeaderParameters<TParameters extends HeaderParameterRecord> = {
	readonly headers?: TParameters;
};

export type QueryParameters<TParameters extends QueryParameterRecord> = {
	readonly query?: TParameters;
};

export type QueryFilters<TSystemProperties extends string, TElementProperties extends string> = {
	readonly filters?: readonly Filter<TSystemProperties, TElementProperties>[];
};

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
	readonly headers?: readonly Header[];
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
