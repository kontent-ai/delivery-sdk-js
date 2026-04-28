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
import type {
	DeliveryClientConfig,
	DeliveryClientSchema,
	DeliveryEndpoint,
	DeliveryMetadata,
	DeliveryMetadataWithToken,
} from "../models/core.models.js";
import type { DeliverySdkError } from "../models/error.models.js";
import type { Filter } from "../models/filter.models.js";
import type { PaginationPayload } from "../models/pagination.models.js";
import type { DeliveryRequest, QueryParameterRecord } from "../models/request.models.js";
import { mapDeliveryError } from "../utils/error.utils.js";
import { getNextPageByContinuationToken, getNextPageByUrl } from "../utils/paging.utils.js";
import { addQueryParametersToUrl, getDeliveryUrl } from "../utils/url.utils.js";

type DefaultDeliveryRequest = DeliveryRequest<QueryParameterRecord, readonly Filter<string, string>[]>;

export function createDeliveryPagedByUrlQuery<TPayload extends PaginationPayload>({
	config,
	schema,
	endpoint,
	request,
}: {
	readonly request: DefaultDeliveryRequest | undefined;
	readonly config: DeliveryClientConfig<DeliveryClientSchema>;
	readonly schema: ZodType<TPayload>;
	readonly endpoint: DeliveryEndpoint;
}): PagedFetchQuery<TPayload, DeliverySdkError, DeliveryMetadata> {
	return createPagedFetchQuery<TPayload, DeliverySdkError, DeliveryMetadata>({
		...getSharedRequestData<TPayload>({ config, endpoint, schema: schema, request }),
		getNextPageData: getNextPageByUrl(),
		mapPagingExtraResponseProps: () => {},
		mapMetadata: () => ({}),
	});
}

export function createDeliveryPagedByTokenQuery<TPayload extends JsonValue>({
	config,
	schema,
	endpoint,
	request,
}: {
	readonly request: DefaultDeliveryRequest | undefined;
	readonly config: DeliveryClientConfig<DeliveryClientSchema>;
	readonly schema: ZodType<TPayload>;
	readonly endpoint: DeliveryEndpoint;
}): PagedFetchQuery<TPayload, DeliverySdkError, DeliveryMetadataWithToken> {
	return createPagedFetchQuery<TPayload, DeliverySdkError, DeliveryMetadataWithToken>({
		...getSharedRequestData<TPayload>({ config, endpoint, schema: schema, request }),
		getNextPageData: getNextPageByContinuationToken(),
		mapPagingExtraResponseProps: () => {},
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
	readonly request: DefaultDeliveryRequest | undefined;
	readonly config: DeliveryClientConfig<DeliveryClientSchema>;
	readonly schema: ZodType<TPayload>;
	readonly endpoint: DeliveryEndpoint;
}): FetchQuery<TPayload, DeliverySdkError, DeliveryMetadata> {
	return createFetchQuery<TPayload, DeliverySdkError, DeliveryMetadata>({
		...getSharedRequestData<TPayload>({ config, endpoint, schema: schema, request }),
		mapMetadata: () => ({}),
	});
}

export function createDeliveryFetchWithTokenQuery<TPayload extends JsonValue>({
	config,
	schema,
	endpoint,
	request,
}: {
	readonly request: DefaultDeliveryRequest | undefined;
	readonly config: DeliveryClientConfig<DeliveryClientSchema>;
	readonly schema: ZodType<TPayload>;
	readonly endpoint: DeliveryEndpoint;
}): FetchQuery<TPayload, DeliverySdkError, DeliveryMetadataWithToken> {
	return createFetchQuery<TPayload, DeliverySdkError, DeliveryMetadataWithToken>({
		...getSharedRequestData<TPayload>({ config, endpoint, schema: schema, request }),
		mapMetadata: (_, data) => ({
			continuationToken: data.continuationToken,
		}),
	});
}

function getSharedRequestData<TPayload extends JsonValue>({
	config,
	endpoint,
	schema,
	request,
}: {
	readonly request: DefaultDeliveryRequest | undefined;
	readonly config: DeliveryClientConfig<DeliveryClientSchema>;
	readonly endpoint: DeliveryEndpoint;
	readonly schema: ZodType<TPayload>;
}): Pick<
	FetchQueryRequest<TPayload, DeliverySdkError>,
	| "abortSignal"
	| "config"
	| "sdkInfo"
	| "authorizationApiKey"
	| "url"
	| "requestHeaders"
	| "zodSchema"
	| "mapError"
	| "mapExtraResponseProps"
> {
	return {
		abortSignal: undefined,
		config,
		sdkInfo: deliverySdkInfo,
		mapExtraResponseProps: () => {},
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
	readonly endpoint: DeliveryEndpoint;
}): string {
	return addQueryParametersToUrl(getDeliveryUrl({ path: endpoint, ...config }), request?.query, request?.filters);
}

function getHeaders(request?: DefaultDeliveryRequest): readonly Header[] {
	if (!request) {
		return [];
	}

	const configHeaders: readonly Header[] = request.config?.customHeaders ?? [];
	const requestHeaders: readonly Header[] = Object.entries(request.headers ?? {}).map<Header>(([name, value]) => ({
		name,
		value: value.toString(),
	}));

	return [...configHeaders, ...requestHeaders];
}
