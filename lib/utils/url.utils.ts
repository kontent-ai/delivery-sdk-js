import { getEndpointUrl } from "@kontent-ai/core-sdk";
import type { ApiMode, DeliveryClientConfig, DeliveryEndpoints } from "../models/core.models.js";
import type { CombinedFilter, QueryFilter } from "../models/filter.models.js";
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

export function addQueryParametersToUrl(
	url: string,
	query: QueryParameterRecord | undefined,
	filters: readonly CombinedFilter<string, string>[] | undefined,
): string {
	if (!query && !filters) {
		return url;
	}

	const searchParams = getUrlSearchParams(query, filters);

	if (searchParams.size === 0) {
		return url;
	}

	return `${url}${url.includes("?") ? "&" : "?"}${searchParams.toString().replaceAll("%5B", "[").replaceAll("%5D", "]")}`;
}

function getDefaultBaseUrlForApiMode(apiMode: ApiMode): string {
	if (apiMode === "preview") {
		return "https://preview-deliver.kontent.ai";
	}

	// Both "public" and "secure" modes use the same base URL.
	// Secure mode is distinguished by the Authorization header, not a different endpoint.
	return "https://deliver.kontent.ai";
}

function getUrlSearchParams(
	query: QueryParameterRecord | undefined,
	filters: readonly CombinedFilter<string, string>[] | undefined,
): URLSearchParams {
	return new URLSearchParams(getQueryParams(query).concat(getFilterParams(filters)));
}

function filterHasDefinedValue(
	filter: QueryFilter<string, string>,
): filter is QueryFilter<string, string> & { readonly value: NonNullable<typeof filter.value> } {
	return filter.value !== undefined && filter.value !== null;
}

function queryHasDefinedValue<Key, Value>(item: [Key, Value | undefined]): item is [Key, Value] {
	const [, value] = item;
	return value !== undefined && value !== null;
}

function isQueryFilter(value: unknown): value is QueryFilter<string, string> {
	return typeof value === "object" && value !== null && "property" in value && "operator" in value && "value" in value;
}

function getQueryParams(query: QueryParameterRecord | undefined): readonly string[][] {
	if (!query) {
		return [];
	}
	return Object.entries(query)
		.filter(queryHasDefinedValue)
		.map(([key, value]) => [key, value.toString()]);
}

function getFilterParams(filters: readonly CombinedFilter<string, string>[] | undefined): readonly string[][] {
	if (!filters) {
		return [];
	}
	return filters.flatMap((filter) => {
		if (isQueryFilter(filter)) {
			if (!filterHasDefinedValue(filter)) {
				return [];
			}

			// Special case for "=" operator which we can just omit from the property definition
			if (filter.operator === "=") {
				return [[filter.property, filter.value.toString()]];
			}

			return [[`${filter.property}[${filter.operator}]`, filter.value.toString()]];
		}

		// Split the filter string into property and value
		const separatorIndex = filter.indexOf("=");
		return [[filter.slice(0, separatorIndex), filter.slice(separatorIndex + 1)]];
	});
}
