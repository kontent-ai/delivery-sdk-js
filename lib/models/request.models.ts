import type { Header } from "@kontent-ai/core-sdk";

export type DeliveryRequest = {
	readonly config?: DeliveryRequestConfig;
};

export type QueryRequestWithCodename<TCodenames extends readonly string[]> = {
	readonly codename: TCodenames[number];
};

export type QueryParameters<TParameters extends Record<string, string | number | undefined>> = {
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

export type SystemOrderQueryParam<TSortableProperties extends string> = `system.${TSortableProperties}[${OrderDirection}]`;
