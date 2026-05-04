import { extractContinuationToken, type GetNextPageData, type JsonValue } from "@kontent-ai/core-sdk";
import type { PaginationPayload } from "../models/pagination.models.js";

export function getNextPageByUrl<TPayload extends PaginationPayload, TMeta>(): GetNextPageData<TPayload, TMeta> {
	return (response) => {
		const nextPageUrl = response.payload.pagination.next_page;
		return {
			continuationToken: undefined,
			nextPageUrl: nextPageUrl.length ? nextPageUrl : undefined,
		};
	};
}

export function getNextPageByContinuationToken<TPayload extends JsonValue, TMeta>(): GetNextPageData<TPayload, TMeta> {
	return (response) => {
		return {
			continuationToken: extractContinuationToken(response.meta.responseHeaders),
			nextPageUrl: undefined,
		};
	};
}
