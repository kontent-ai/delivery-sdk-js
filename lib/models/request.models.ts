import type { Header } from "@kontent-ai/core-sdk";

export type DeliveryRequest = {
	readonly config?: DeliveryRequestConfig;
};

export type QueryParameterRecord = Record<string, string | number | undefined | readonly string[]>;

export type PagingDeliveryRequest<TSortableProperties extends string> = DeliveryRequest &
	QueryParameters<{
		readonly skip?: number;
		readonly limit?: number;
		readonly order?: SystemOrderQueryParam<TSortableProperties>;
	}>;

export type QueryRequestWithCodename<TCodenames extends readonly string[]> = {
	readonly codename: TCodenames[number];
};

export type QueryParameters<TParameters extends QueryParameterRecord> = {
	readonly query?: TParameters;
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
 * `order=system.id[asc]`
 */
export type SystemOrderQueryParam<TSortableProperties extends string> = `system.${TSortableProperties}[${OrderDirection}]`;

/**
 * Array of element codenames that will get transformed into a comma-separated list used in the elements parameter.
 *
 * @example
 * ```ts
 * `elements=title,summary,related_articles`
 */
export type ElementSelectionQueryParam<TElementCodenames extends string> = readonly TElementCodenames[];
