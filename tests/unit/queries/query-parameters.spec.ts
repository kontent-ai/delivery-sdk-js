import type { JsonValue } from "@kontent-ai/core-sdk";
import { describe, expect, it } from "vitest";
import type { DeliveryMetadata, DeliveryPagedFetchQuery } from "../../../lib/models/core.models.js";
import { createDeliveryClient } from "../../../lib/public_api.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

describe("Query Parameters", () => {
	const client = createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
	});

	const pagingQuery = { order: "system.name[asc]", skip: 5, limit: 10 } as const;
	const expectedPagingParams = { order: "system.name[asc]", skip: "5", limit: "10" };

	const pagingCases: readonly {
		readonly name: string;
		readonly query: DeliveryPagedFetchQuery<JsonValue, DeliveryMetadata>;
		readonly expectedParams: Readonly<Record<string, string>>;
	}[] = [
		{ name: "listLanguages", query: client.listLanguages({ query: pagingQuery }), expectedParams: expectedPagingParams },
		{ name: "listTaxonomies", query: client.listTaxonomies({ query: pagingQuery }), expectedParams: expectedPagingParams },
		{ name: "listContentTypes", query: client.listContentTypes({ query: pagingQuery }), expectedParams: expectedPagingParams },
		{
			name: "listContentItems",
			query: client.listContentItems({ query: { ...pagingQuery, depth: 4 } }),
			expectedParams: { ...expectedPagingParams, depth: "4" },
		},
	];

	it.each(pagingCases)("adds paging parameters to the URL: $name", ({ query, expectedParams }) => {
		const { success, data, error } = query.inspect();

		if (!success) {
			throw new Error(`Failed to inspect query: ${error}`);
		}

		expect(Object.fromEntries(data.url.searchParams)).toStrictEqual(expectedParams);
	});

	it("adds the elements parameter as a comma-separated list", () => {
		const { inspect } = client.listContentTypes({
			query: {
				elements: ["x", "y", "z"],
			},
		});

		const { success, data, error } = inspect();

		if (!success) {
			throw new Error(`Failed to inspect query: ${error}`);
		}

		expect(data.url.searchParams.get("elements")).toStrictEqual("x,y,z");
	});
});
