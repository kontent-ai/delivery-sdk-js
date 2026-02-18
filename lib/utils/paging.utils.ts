import type { GetNextPageData } from "@kontent-ai/core-sdk";
import type { PaginationSchema } from "../models/core.models.js";

export function getNextPageByUrl<TPayload extends PaginationSchema, TMeta>(): GetNextPageData<TPayload, TMeta> {
	return (response) => {
		return {
			continuationToken: undefined,
			nextPageUrl: response.payload.pagination.next_page,
		};
	};
}
