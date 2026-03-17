import {
	createFetchQuery,
	createPagedFetchQuery,
	type FetchQuery,
	type FetchQueryRequest,
	type Header,
	type JsonValue,
	type PagedFetchQuery,
} from "@kontent-ai/core-sdk";
import type { ZodType } from "zod";
import { deliverySdkInfo } from "../delivery-sdk-info.js";
import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryEndpoints } from "../models/core.models.js";
import type { PaginationSchema } from "../models/pagination.models.js";
import type { DeliveryRequest, QueryParameters } from "../models/request.models.js";
import { getNextPageByUrl } from "../utils/paging.utils.js";
import { getDeliveryUrl } from "../utils/url.utils.js";

export function createDeliveryPagingQuery<TPayload extends PaginationSchema>({
	config,
	zodSchema,
	endpoint,
	request,
}: {
	readonly request: DeliveryRequest | undefined;
	readonly config: DeliveryClientConfig<DeliveryClientSchema>;
	readonly zodSchema: ZodType<TPayload>;
	readonly endpoint: DeliveryEndpoints;
}): PagedFetchQuery<TPayload, null> {
	return createPagedFetchQuery<TPayload, null>({
		...getSharedRequestData<TPayload>({ config, endpoint, zodSchema, request }),
		getNextPageData: getNextPageByUrl(),
	});
}

export function createDeliveryFetchQuery<TPayload extends JsonValue>({
	config,
	zodSchema,
	endpoint,
	request,
}: {
	readonly request: DeliveryRequest | undefined;
	readonly config: DeliveryClientConfig<DeliveryClientSchema>;
	readonly zodSchema: ZodType<TPayload>;
	readonly endpoint: DeliveryEndpoints;
}): FetchQuery<TPayload, null> {
	return createFetchQuery<TPayload, null>(getSharedRequestData<TPayload>({ config, endpoint, zodSchema, request }));
}

function getSharedRequestData<TPayload extends JsonValue>({
	config,
	endpoint,
	zodSchema,
	request,
}: {
	readonly request: DeliveryRequest | undefined;
	readonly config: DeliveryClientConfig<DeliveryClientSchema>;
	readonly endpoint: DeliveryEndpoints;
	readonly zodSchema: ZodType<TPayload>;
}): Pick<FetchQueryRequest<TPayload, null>, "abortSignal" | "config" | "sdkInfo" | "mapMetadata" | "request" | "zodSchema"> {
	return {
		abortSignal: undefined,
		config,
		sdkInfo: deliverySdkInfo,
		mapMetadata: () => {
			return null;
		},
		request: getRequestData<TPayload>({ config, endpoint, request }),
		zodSchema,
	};
}

function getRequestData<TPayload extends JsonValue>({
	request,
	config,
	endpoint,
}: {
	readonly request: DeliveryRequest | undefined;
	readonly config: DeliveryClientConfig<DeliveryClientSchema>;
	readonly endpoint: DeliveryEndpoints;
}): FetchQueryRequest<TPayload, null>["request"] {
	return {
		requestHeaders: getHeaders(request),
		url: addQueryParametersToUrl(getDeliveryUrl({ path: endpoint, ...config }), request),
		authorizationApiKey: config.apiMode === "preview" || config.apiMode === "secure" ? config.deliveryApiKey : undefined,
	};
}

function getHeaders(request?: DeliveryRequest): readonly Header[] {
	if (!request?.config) {
		return [];
	}
	return [...(request.config?.headers ?? []), ...(request.config.bypassCdnCache ? [getBypassCdnCacheHeader()] : [])];
}

function getBypassCdnCacheHeader(): Header {
	return { name: "X-KC-Wait-For-Loading-New-Content", value: "true" };
}

function addQueryParametersToUrl(url: string, request: DeliveryRequest | undefined): string {
	if (!isQueryWithParameters(request)) {
		return url;
	}
	return `${url}${url.includes("?") ? "&" : "?"}${getUrlSearchParams(request).toString()}`;
}

function getUrlSearchParams(request: QueryParameters<Record<string, string | number | undefined>>): URLSearchParams {
	return new URLSearchParams(
		Object.entries(request.query ?? {})
			.filter(hasDefinedQueryValue)
			.map(([key, value]) => [key, value.toString()]),
	);
}

function isQueryWithParameters(
	request: DeliveryRequest | undefined,
): request is DeliveryRequest & QueryParameters<Record<string, string | number | undefined>> {
	if (!request) {
		return false;
	}

	if (("query" satisfies keyof QueryParameters<Record<string, string | number | undefined>>) in request) {
		return true;
	}

	return false;
}

function hasDefinedQueryValue<K, V>(item: [K, V | undefined]): item is [K, V] {
	const [, value] = item;
	return value !== undefined || value !== null;
}
