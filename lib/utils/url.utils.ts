import { getEndpointUrl } from "@kontent-ai/core-sdk";
import type { ApiMode, DeliveryClientConfig, DeliveryEndpoints } from "../models/core.models.js";
import type { QueryParameterRecord } from "../models/request.models.js";

export function getDeliveryUrl({
	environmentId,
	path,
	baseUrl,
	apiMode,
}: { readonly path: DeliveryEndpoints } & Pick<DeliveryClientConfig, "baseUrl" | "environmentId" | "apiMode">): string {
	return getEndpointUrl({
		environmentId,
		path,
		baseUrl: baseUrl ?? getDefaultBaseUrlForApiMode(apiMode),
	});
}

export function addQueryParametersToUrl(url: string, query: QueryParameterRecord | undefined): string {
	if (!query) {
		return url;
	}
	return `${url}${url.includes("?") ? "&" : "?"}${getUrlSearchParams(query).toString()}`;
}

function getDefaultBaseUrlForApiMode(apiMode: ApiMode): string {
	if (apiMode === "preview") {
		return "https://preview-deliver.kontent.ai";
	}

	// Both "public" and "secure" modes use the same base URL.
	// Secure mode is distinguished by the Authorization header, not a different endpoint.
	return "https://deliver.kontent.ai";
}

function getUrlSearchParams(query: QueryParameterRecord): URLSearchParams {
	return new URLSearchParams(
		Object.entries(query)
			.filter(hasDefinedQueryValue)
			.map(([key, value]) => [key, value.toString()]),
	);
}

function hasDefinedQueryValue<Key, Value>(item: [Key, Value | undefined]): item is [Key, Value] {
	const [, value] = item;
	return value !== undefined && value !== null;
}
