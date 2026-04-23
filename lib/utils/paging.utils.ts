import type { ExtractNextPageDataFn, JsonValue } from "@kontent-ai/core-sdk";
import type { PaginationPayload } from "../models/pagination.models.js";

export function getNextPageByUrl<TPayload extends PaginationPayload, TMeta>(): ExtractNextPageDataFn<TPayload, TMeta> {
	return (response) => {
		return {
			continuationToken: undefined,
			nextPageUrl: response.payload.pagination.next_page,
		};
	};
}

export function getNextPageByContinuationToken<TPayload extends JsonValue, TMeta>(): ExtractNextPageDataFn<TPayload, TMeta> {
	return (response) => {
		return {
			continuationToken: response.meta.continuationToken,
			nextPageUrl: undefined,
		};
	};
}
