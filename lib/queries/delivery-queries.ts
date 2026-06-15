import {
	createFetchQuery,
	createPagedFetchQuery,
	type FetchQuery,
	type FetchQueryRequest,
	type Header,
	type JsonValue,
	type PagedFetchQuery,
	transformFetchQuery,
	transformPagedFetchQuery,
} from "@kontent-ai/core-sdk";
import type { ZodMiniType } from "zod/mini";
import { deliverySdkInfo } from "../delivery-sdk-info.js";
import type {
	DeliveryClientConfig,
	DeliveryEndpoint,
	DeliveryMetadata,
	DeliveryMetadataWithToken,
	TokenPagingDeliveryExtraResponseProps,
	UrlPagingDeliveryExtraResponseProps,
} from "../models/core.models.js";
import type { DeliverySdkError } from "../models/error.models.js";
import type { Filter } from "../models/filter.models.js";
import type { PaginationPayload } from "../models/pagination.models.js";
import type { DeliveryRequest, QueryParameterRecord } from "../models/request.models.js";
import { mapDeliveryError } from "../utils/error.utils.js";
import { getNextPageByContinuationToken, getNextPageByUrl } from "../utils/paging.utils.js";
import { addQueryParametersToUrl, getDeliveryUrl } from "../utils/url.utils.js";

type AnyDeliveryRequest = DeliveryRequest<QueryParameterRecord, readonly Filter<string, string>[]>;

export function createDeliveryPagedByUrlQuery<TPayload extends PaginationPayload>({
	config,
	schema,
	endpoint,
	request,
}: {
	readonly request: AnyDeliveryRequest | undefined;
	readonly config: DeliveryClientConfig;
	readonly schema: () => Promise<ZodMiniType<TPayload>>;
	readonly endpoint: DeliveryEndpoint;
}): PagedFetchQuery<TPayload, DeliverySdkError, DeliveryMetadata, unknown, UrlPagingDeliveryExtraResponseProps> {
	return createPagedFetchQuery<TPayload, DeliverySdkError, DeliveryMetadata, unknown, UrlPagingDeliveryExtraResponseProps>({
		...getSharedRequestData<TPayload>({ config, endpoint, schema: schema, request }),
		getNextPageData: getNextPageByUrl(),
		mapPagingExtraResponseProps: (responses) => ({
			nextPageUrl: responses.at(-1)?.payload?.pagination?.next_page,
		}),
		mapMetadata: () => ({}),
	});
}

export function createDeliveryPagedByTokenQuery<TPayload extends JsonValue>({
	config,
	schema,
	endpoint,
	request,
}: {
	readonly request: AnyDeliveryRequest | undefined;
	readonly config: DeliveryClientConfig;
	readonly schema: () => Promise<ZodMiniType<TPayload>>;
	readonly endpoint: DeliveryEndpoint;
}): PagedFetchQuery<TPayload, DeliverySdkError, DeliveryMetadataWithToken, unknown, TokenPagingDeliveryExtraResponseProps> {
	return createPagedFetchQuery<TPayload, DeliverySdkError, DeliveryMetadataWithToken, unknown, TokenPagingDeliveryExtraResponseProps>({
		...getSharedRequestData<TPayload>({ config, endpoint, schema: schema, request }),
		getNextPageData: getNextPageByContinuationToken(),
		mapPagingExtraResponseProps: (responses) => ({
			nextContinuationToken: responses.at(-1)?.meta?.continuationToken,
		}),
		mapMetadata: (_, data) => ({
			continuationToken: data.continuationToken,
		}),
	});
}

export function createDeliveryFetchQuery<TPayload extends JsonValue>({
	config,
	schema,
	endpoint,
	request,
}: {
	readonly request: AnyDeliveryRequest | undefined;
	readonly config: DeliveryClientConfig;
	readonly schema: () => Promise<ZodMiniType<TPayload>>;
	readonly endpoint: DeliveryEndpoint;
}): FetchQuery<TPayload, DeliverySdkError, DeliveryMetadata, unknown> {
	return createFetchQuery<TPayload, DeliverySdkError, DeliveryMetadata, unknown>({
		...getSharedRequestData<TPayload>({ config, endpoint, schema: schema, request }),
		mapMetadata: () => ({}),
	});
}

export function transformDeliveryFetchQuery<TPayload extends JsonValue, TTransformedPayload extends TPayload>({
	config,
	query,
	transform,
	transformSchema,
}: {
	readonly query: FetchQuery<TPayload, DeliverySdkError, DeliveryMetadata, unknown>;
} & Pick<
	Parameters<typeof transformFetchQuery<TPayload, TTransformedPayload, DeliverySdkError, DeliveryMetadata, unknown>>[0],
	"transform" | "transformSchema" | "config"
>): FetchQuery<TTransformedPayload, DeliverySdkError, DeliveryMetadata, unknown> {
	return transformFetchQuery({
		query,
		transform,
		transformSchema,
		mapError: mapDeliveryError,
		config,
	});
}

export function transformDeliveryPagedByUrlQuery<TPayload extends PaginationPayload, TTransformedPayload extends TPayload>({
	config,
	query,
	transform,
	transformSchema,
}: {
	readonly query: PagedFetchQuery<TPayload, DeliverySdkError, DeliveryMetadata, unknown, UrlPagingDeliveryExtraResponseProps>;
} & Pick<
	Parameters<
		typeof transformPagedFetchQuery<
			TPayload,
			TTransformedPayload,
			DeliverySdkError,
			DeliveryMetadata,
			unknown,
			UrlPagingDeliveryExtraResponseProps
		>
	>[0],
	"transform" | "transformSchema" | "config"
>): PagedFetchQuery<TTransformedPayload, DeliverySdkError, DeliveryMetadata, unknown, UrlPagingDeliveryExtraResponseProps> {
	return transformPagedFetchQuery({
		query,
		transform,
		transformSchema,
		mapError: mapDeliveryError,
		config,
	});
}

export function transformDeliveryPagedByTokenQuery<TPayload extends JsonValue, TTransformedPayload extends TPayload>({
	config,
	query,
	transform,
	transformSchema,
}: {
	readonly query: PagedFetchQuery<TPayload, DeliverySdkError, DeliveryMetadataWithToken, unknown, TokenPagingDeliveryExtraResponseProps>;
} & Pick<
	Parameters<
		typeof transformPagedFetchQuery<
			TPayload,
			TTransformedPayload,
			DeliverySdkError,
			DeliveryMetadataWithToken,
			unknown,
			TokenPagingDeliveryExtraResponseProps
		>
	>[0],
	"transform" | "transformSchema" | "config"
>): PagedFetchQuery<TTransformedPayload, DeliverySdkError, DeliveryMetadataWithToken, unknown, TokenPagingDeliveryExtraResponseProps> {
	return transformPagedFetchQuery({
		query,
		transform,
		transformSchema,
		mapError: mapDeliveryError,
		config,
	});
}

function getSharedRequestData<TPayload extends JsonValue>({
	config,
	endpoint,
	schema,
	request,
}: {
	readonly request: AnyDeliveryRequest | undefined;
	readonly config: DeliveryClientConfig;
	readonly endpoint: DeliveryEndpoint;
	readonly schema: () => Promise<ZodMiniType<TPayload>>;
}): Pick<
	FetchQueryRequest<TPayload, DeliverySdkError>,
	| "abortSignal"
	| "config"
	| "sdkInfo"
	| "authorizationApiKey"
	| "url"
	| "requestHeaders"
	| "schema"
	| "mapError"
	| "mapExtraResponseProps"
> {
	return {
		abortSignal: request?.config?.abortSignal,
		config,
		sdkInfo: deliverySdkInfo,
		mapExtraResponseProps: () => {},
		requestHeaders: getHeaders(request),
		url: getUrl({ request, config, endpoint }),
		authorizationApiKey: config.apiMode === "preview" || config.apiMode === "secure" ? config.deliveryApiKey : undefined,
		schema,
		mapError: mapDeliveryError,
	};
}

function getUrl({
	request,
	config,
	endpoint,
}: {
	readonly request: AnyDeliveryRequest | undefined;
	readonly config: DeliveryClientConfig;
	readonly endpoint: DeliveryEndpoint;
}): string {
	return addQueryParametersToUrl(getDeliveryUrl({ path: endpoint, ...config }), request?.query, request?.filters);
}

function getHeaders(request?: AnyDeliveryRequest): readonly Header[] {
	if (!request) {
		return [];
	}

	const configHeaders: readonly Header[] = request.config?.customHeaders ?? [];
	const requestHeaders: readonly Header[] = Object.entries(request.headers ?? {}).map<Header>(([name, value]) => ({
		name,
		value: value?.toString(),
	}));

	return [...configHeaders, ...requestHeaders];
}
