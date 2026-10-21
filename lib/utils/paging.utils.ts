import { extractContinuationToken, type GetNextPageData, type JsonValue } from "@kontent-ai/core-sdk";
import type { PaginationPayload } from "../models/pagination.models.js";

export function getNextPageByUrl<TPayload extends PaginationPayload, TMeta>(): GetNextPageData<TPayload, TMeta> {
	return (response) => ({
		continuationToken: undefined,
		nextPageUrl: getNextPageUrl(response.payload),
	});
}

/**
 * The API returns an empty string as `next_page` on the last page, which is normalized to `undefined`.
 */
export function getNextPageUrl(payload: PaginationPayload | undefined): string | undefined {
	const nextPageUrl = payload?.pagination.next_page;
	return nextPageUrl?.length ? nextPageUrl : undefined;
}

export function getNextPageByContinuationToken<TPayload extends JsonValue, TMeta>(): GetNextPageData<TPayload, TMeta> {
	return (response) => {
		return {
			continuationToken: extractContinuationToken(response.meta.responseHeaders),
			nextPageUrl: undefined,
		};
	};
}
