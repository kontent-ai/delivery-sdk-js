import { type BaseUrl, getEndpointUrl } from "@kontent-ai/core-sdk";
import { match, P } from "ts-pattern";
import type { ApiMode, DeliveryClientConfig, DeliveryEndpoint } from "../models/core.models.js";
import {
	type Filter,
	type FilterWithoutValue,
	type FilterWithValue,
	filterWithoutValueOperators,
	filterWithoutValueToParam,
} from "../models/filter.models.js";
import type { QueryParameterRecord } from "../models/request.models.js";

export function getDeliveryUrl({
	environmentId,
	path,
	baseUrl,
	apiMode,
}: { readonly path: DeliveryEndpoint } & Pick<DeliveryClientConfig, "baseUrl" | "environmentId" | "apiMode">): string {
	return getEndpointUrl({
		environmentId,
		path,
		baseUrl: baseUrl ?? getDefaultBaseUrlForApiMode(apiMode),
	});
}

export function addQueryParametersToUrl(
	url: string,
	query: QueryParameterRecord | undefined,
	filters: readonly Filter<string, string>[] | undefined,
): string {
	if (!query && !filters) {
		return url;
	}

	const searchParams = getUrlSearchParams(query, filters);

	if (searchParams.size === 0) {
		return url;
	}

	return `${url}${url.includes("?") ? "&" : "?"}${searchParams.toString()}`;
}

/** @internal exported for unit tests */
export function isFilterWithoutValue(value: unknown): value is FilterWithoutValue<string, string> {
	if (typeof value !== "object" || value === null || value === undefined) {
		return false;
	}

	if (!(("operator" satisfies keyof FilterWithoutValue<string, string>) in value)) {
		return false;
	}

	return filterWithoutValueOperators.some((operator) => operator === value.operator);
}

function getDefaultBaseUrlForApiMode(apiMode: ApiMode | undefined): BaseUrl {
	if (apiMode === "preview") {
		return { protocol: "https", host: "preview-deliver.kontent.ai" };
	}

	// Both "public" and "secure" modes use the same base URL.
	// Secure mode is distinguished by the Authorization header, not a different endpoint.
	return { protocol: "https", host: "deliver.kontent.ai" };
}

function getUrlSearchParams(
	query: QueryParameterRecord | undefined,
	filters: readonly Filter<string, string>[] | undefined,
): URLSearchParams {
	return new URLSearchParams(getQueryParams(query).concat(getFilterParams(filters)));
}

function filterWithValueHasDefinedValue(
	filter: FilterWithValue<string, string>,
): filter is FilterWithValue<string, string> & { readonly value: NonNullable<typeof filter.value> } {
	return filter.value !== undefined && filter.value !== null;
}

function queryHasDefinedValue<Key, Value>(item: [Key, Value | undefined]): item is [Key, Value] {
	const [, value] = item;
	return value !== undefined && value !== null;
}

function isFilterWithValue(value: unknown): value is FilterWithValue<string, string> {
	return typeof value === "object" && value !== null && "property" in value && "operator" in value;
}

function getQueryParams(query: QueryParameterRecord | undefined): readonly [string, string][] {
	if (!query) {
		return [];
	}
	return Object.entries(query)
		.filter(queryHasDefinedValue)
		.map(([key, value]) => [key, value.toString()]);
}

function getFilterParams(filters: readonly Filter<string, string>[] | undefined): readonly [string, string][] {
	if (!filters) {
		return [];
	}
	return filters.flatMap((filter) => {
		return match(filter)
			.returnType<readonly [string, string][]>()
			.with(P.when(isFilterWithoutValue), (filter) => [filterWithoutValueToParam[filter.operator](filter.property)])
			.with(P.when(isFilterWithValue), (filter) => {
				if (!filterWithValueHasDefinedValue(filter)) {
					return [];
				}

				// Special case for "=" operator which we can just omit from the property definition
				if (filter.operator === "=") {
					return [[filter.property, filter.value.toString()]];
				}

				// Special case for "!=" operator which we need to convert to "neq"
				if (filter.operator === "!=") {
					return [[`${filter.property}[neq]`, filter.value.toString()]];
				}

				return [[`${filter.property}[${filter.operator}]`, filter.value.toString()]];
			})
			.with(P.string, (stringFilter) => {
				// Filters without a value (e.g. "elements.title[empty]") have no separator
				const separatorIndex = stringFilter.indexOf("=");
				if (separatorIndex === -1) {
					return [[stringFilter, ""]];
				}
				return [[stringFilter.slice(0, separatorIndex), stringFilter.slice(separatorIndex + 1)]];
			})
			.exhaustive();
	});
}
