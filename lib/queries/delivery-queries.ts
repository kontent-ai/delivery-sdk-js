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
import type { DeliveryClientConfig, DeliveryClientSchema, DeliveryEndpoints, DeliveryMetadata } from "../models/core.models.js";
import type { DeliverySdkError } from "../models/error.models.js";
import type { Filter } from "../models/filter.models.js";
import type { PaginationSchema } from "../models/pagination.models.js";
import type { DeliveryRequest, HeaderParameterRecord, QueryParameterRecord } from "../models/request.models.js";
import { mapDeliveryError } from "../utils/error.utils.js";
import { getNextPageByContinuationToken, getNextPageByUrl } from "../utils/paging.utils.js";
import { addQueryParametersToUrl, getDeliveryUrl } from "../utils/url.utils.js";

type DefaultDeliveryRequest = DeliveryRequest<HeaderParameterRecord, QueryParameterRecord, readonly Filter<string, string>[]>;

export function createDeliveryPagingByUrlQuery<TPayload extends PaginationSchema>({
	config,
	schema,
	endpoint,
	request,
}: {
	readonly request: DefaultDeliveryRequest | undefined;
	readonly config: DeliveryClientConfig<DeliveryClientSchema>;
	readonly schema: ZodType<TPayload>;
	readonly endpoint: DeliveryEndpoints;
}): PagedFetchQuery<TPayload, DeliveryMetadata, DeliverySdkError> {
	return createPagedFetchQuery<TPayload, DeliveryMetadata, DeliverySdkError>({
		...getSharedRequestData<TPayload>({ config, endpoint, schema: schema, request }),
		getNextPageData: getNextPageByUrl(),
	});
}

export function createDeliveryPagingByTokenQuery<TPayload extends JsonValue>({
	config,
	schema,
	endpoint,
	request,
}: {
	readonly request: DefaultDeliveryRequest | undefined;
	readonly config: DeliveryClientConfig<DeliveryClientSchema>;
	readonly schema: ZodType<TPayload>;
	readonly endpoint: DeliveryEndpoints;
}): PagedFetchQuery<TPayload, DeliveryMetadata, DeliverySdkError> {
	return createPagedFetchQuery<TPayload, DeliveryMetadata, DeliverySdkError>({
		...getSharedRequestData<TPayload>({ config, endpoint, schema: schema, request }),
		getNextPageData: getNextPageByContinuationToken(),
	});
}

export function createDeliveryFetchQuery<TPayload extends JsonValue>({
	config,
	schema,
	endpoint,
	request,
}: {
	readonly request: DefaultDeliveryRequest | undefined;
	readonly config: DeliveryClientConfig<DeliveryClientSchema>;
	readonly schema: ZodType<TPayload>;
	readonly endpoint: DeliveryEndpoints;
}): FetchQuery<TPayload, DeliveryMetadata, DeliverySdkError> {
	return createFetchQuery<TPayload, DeliveryMetadata, DeliverySdkError>(
		getSharedRequestData<TPayload>({ config, endpoint, schema: schema, request }),
	);
}

function getSharedRequestData<TPayload extends JsonValue>({
	config,
	endpoint,
	schema,
	request,
}: {
	readonly request: DefaultDeliveryRequest | undefined;
	readonly config: DeliveryClientConfig<DeliveryClientSchema>;
	readonly endpoint: DeliveryEndpoints;
	readonly schema: ZodType<TPayload>;
}): Pick<
	FetchQueryRequest<TPayload, DeliveryMetadata, DeliverySdkError>,
	"abortSignal" | "config" | "sdkInfo" | "mapMetadata" | "authorizationApiKey" | "url" | "requestHeaders" | "zodSchema" | "mapError"
> {
	return {
		abortSignal: undefined,
		config,
		sdkInfo: deliverySdkInfo,
		mapMetadata: () => {
			return {};
		},
		requestHeaders: getHeaders(request),
		url: getUrl({ request, config, endpoint }),
		authorizationApiKey: config.apiMode === "preview" || config.apiMode === "secure" ? config.deliveryApiKey : undefined,
		zodSchema: schema,
		mapError: mapDeliveryError,
	};
}

function getUrl({
	request,
	config,
	endpoint,
}: {
	readonly request: DefaultDeliveryRequest | undefined;
	readonly config: DeliveryClientConfig<DeliveryClientSchema>;
	readonly endpoint: DeliveryEndpoints;
}): string {
	return addQueryParametersToUrl(getDeliveryUrl({ path: endpoint, ...config }), getQueryParameters(request), getFilters(request));
}

function getFilters(request: DefaultDeliveryRequest | undefined): readonly Filter<string, string>[] | undefined {
	if (!request?.filters) {
		return undefined;
	}

	return request.filters;
}

function getQueryParameters(request: DefaultDeliveryRequest | undefined): QueryParameterRecord | undefined {
	return request?.query;
}

function getHeaders(request?: DefaultDeliveryRequest): readonly Header[] {
	if (!request) {
		return [];
	}

	const configHeaders: readonly Header[] = request.config?.headers ?? [];
	const requestHeaders: readonly Header[] = Object.entries(request.headers ?? {}).map<Header>(([name, value]) => ({
		name,
		value: value.toString(),
	}));

	return [...configHeaders, ...requestHeaders, ...(request.config?.bypassCdnCache ? [getBypassCdnCacheHeader()] : [])];
}

function getBypassCdnCacheHeader(): Header {
	return { name: "X-KC-Wait-For-Loading-New-Content", value: "true" };
}
