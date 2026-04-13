import type { GetNextPageData, JsonValue } from "@kontent-ai/core-sdk";
import type { PaginationSchema } from "../models/pagination.models.js";

export function getNextPageByUrl<TPayload extends PaginationSchema, TMeta>(): GetNextPageData<TPayload, TMeta> {
	return (response) => {
		return {
			continuationToken: undefined,
			nextPageUrl: response.payload.pagination.next_page,
		};
	};
}

export function getNextPageByContinuationToken<TPayload extends JsonValue, TMeta>(): GetNextPageData<TPayload, TMeta> {
	return (response) => {
		return {
			continuationToken: response.meta.continuationToken,
			nextPageUrl: undefined,
		};
	};
}
