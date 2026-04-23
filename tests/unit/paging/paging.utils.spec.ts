import type { QueryResponse } from "@kontent-ai/core-sdk";
import { describe, expect, it } from "vitest";
import type { PaginationPayload } from "../../../lib/models/pagination.models.js";
import { getNextPageByUrl } from "../../../lib/utils/paging.utils.js";

describe("Paging utils", () => {
	it("Next page URL should be returned", () => {
		const response: QueryResponse<PaginationPayload, unknown> = {
			meta: {
				status: 200,
				responseHeaders: [],
				url: new URL("https://domain.com"),
				continuationToken: undefined,
			},
			payload: {
				pagination: {
					skip: 0,
					limit: 10,
					count: 100,
					next_page: "https://domain.com/next",
				},
			},
		};

		const result = getNextPageByUrl<PaginationPayload, unknown>()(response);

		expect(result).toEqual({
			continuationToken: undefined,
			nextPageUrl: "https://domain.com/next",
		});
	});
});
