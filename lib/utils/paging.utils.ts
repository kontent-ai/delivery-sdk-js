import type { Pagination } from "@kontent-ai/core-sdk";
import type { PaginationSchema } from "../models/core.models.js";

export function getPaginationByUrl<TPayload extends PaginationSchema, TMeta>(): Pagination<TPayload, TMeta> {
	return {
		getNextPageData: (response) => {
			return {
				continuationToken: undefined,
				nextPageUrl: response.payload.pagination.next_page,
			};
		},
	};
}
