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
import type { DeliverySdkError } from "../models/error.models.js";
import type { Filter } from "../models/filter.models.js";
import type { PaginationSchema } from "../models/pagination.models.js";
import type { DeliveryRequest, QueryFilters, QueryParameterRecord, QueryParameters } from "../models/request.models.js";
import { mapDeliveryError } from "../utils/error.utils.js";
import { getNextPageByUrl } from "../utils/paging.utils.js";
import { addQueryParametersToUrl, getDeliveryUrl } from "../utils/url.utils.js";

export function createDeliveryPagingQuery<TPayload extends PaginationSchema>({
	config,
	schema,
	endpoint,
	request,
}: {
	readonly request: DeliveryRequest | undefined;
	readonly config: DeliveryClientConfig<DeliveryClientSchema>;
	readonly schema: ZodType<TPayload>;
	readonly endpoint: DeliveryEndpoints;
}): PagedFetchQuery<TPayload, null, DeliverySdkError> {
	return createPagedFetchQuery<TPayload, null, DeliverySdkError>({
		...getSharedRequestData<TPayload>({ config, endpoint, schema: schema, request }),
		getNextPageData: getNextPageByUrl(),
	});
}

export function createDeliveryFetchQuery<TPayload extends JsonValue>({
	config,
	schema,
	endpoint,
	request,
}: {
	readonly request: DeliveryRequest | undefined;
	readonly config: DeliveryClientConfig<DeliveryClientSchema>;
	readonly schema: ZodType<TPayload>;
	readonly endpoint: DeliveryEndpoints;
}): FetchQuery<TPayload, null, DeliverySdkError> {
	return createFetchQuery<TPayload, null, DeliverySdkError>(
		getSharedRequestData<TPayload>({ config, endpoint, schema: schema, request }),
	);
}

function getSharedRequestData<TPayload extends JsonValue>({
	config,
	endpoint,
	schema,
	request,
}: {
	readonly request: DeliveryRequest | undefined;
	readonly config: DeliveryClientConfig<DeliveryClientSchema>;
	readonly endpoint: DeliveryEndpoints;
	readonly schema: ZodType<TPayload>;
}): Pick<
	FetchQueryRequest<TPayload, null, DeliverySdkError>,
	"abortSignal" | "config" | "sdkInfo" | "mapMetadata" | "request" | "zodSchema" | "mapError"
> {
	return {
		abortSignal: undefined,
		config,
		sdkInfo: deliverySdkInfo,
		mapMetadata: () => {
			return null;
		},
		request: getRequestData<TPayload>({ config, endpoint, request }),
		zodSchema: schema,
		mapError: mapDeliveryError,
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
}): FetchQueryRequest<TPayload, null, DeliverySdkError>["request"] {
	return {
		requestHeaders: getHeaders(request),
		url: addQueryParametersToUrl(getDeliveryUrl({ path: endpoint, ...config }), getQueryParameters(request), getFilters(request)),
		authorizationApiKey: config.apiMode === "preview" || config.apiMode === "secure" ? config.deliveryApiKey : undefined,
	};
}

function getFilters(request: DeliveryRequest | undefined): readonly Filter<string, string>[] | undefined {
	if (!request || !isQueryWithFilters(request)) {
		return undefined;
	}

	return request.filters;
}

function getQueryParameters(request: DeliveryRequest | undefined): QueryParameterRecord | undefined {
	if (!request || !isQueryWithParameters(request)) {
		return undefined;
	}

	return request.query;
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

function isQueryWithParameters(request: DeliveryRequest): request is DeliveryRequest & QueryParameters<QueryParameterRecord> {
	return ("query" satisfies keyof QueryParameters<QueryParameterRecord>) in request;
}

function isQueryWithFilters(request: DeliveryRequest): request is DeliveryRequest & QueryFilters<string, string> {
	return ("filters" satisfies keyof QueryFilters<string, string>) in request;
}
