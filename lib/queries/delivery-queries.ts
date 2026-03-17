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
import type { DeliveryRequest } from "../models/request.models.js";
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
		url: getDeliveryUrl({ path: endpoint, ...config }),
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
