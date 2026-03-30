import type { JsonValue } from "@kontent-ai/core-sdk";
import { describe, expect, it } from "vitest";
import type { DeliveryPagedFetchQuery } from "../../../lib/models/core.models.js";
import { createDeliveryClient } from "../../../lib/public_api.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

describe("Query parameters", () => {
	const client = createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
	});

	it("Paging parameters should be added to the url", () => {
		const listingQueries: readonly DeliveryPagedFetchQuery<JsonValue>[] = [
			client.listLanguages({
				query: {
					order: "system.name[asc]",
					skip: 5,
					limit: 10,
				},
			}),
			client.listTaxonomies({
				query: {
					order: "system.name[asc]",
					skip: 5,
					limit: 10,
				},
			}),
			client.listContentTypes({
				query: {
					order: "system.name[asc]",
					skip: 5,
					limit: 10,
				},
			}),
		];

		for (const query of listingQueries) {
			const { url } = query;
			const parsedUrl = new URL(url);
			expect(parsedUrl.searchParams.get("skip")).toStrictEqual("5");
			expect(parsedUrl.searchParams.get("limit")).toStrictEqual("10");
			expect(parsedUrl.searchParams.get("order")).toStrictEqual("system.name[asc]");
		}
	});

	it("Elements query parameter should be added as a comma-separated list in the url", () => {
		const { url } = client.listContentTypes({
			query: {
				elements: ["x", "y", "z"],
			},
		});

		const parsedUrl = new URL(url);
		expect(parsedUrl.searchParams.get("elements")).toStrictEqual("x,y,z");
	});

	it("Undefined query parameters should be omitted from the url", () => {
		const { url } = client.listLanguages({
			query: {
				skip: 5,
				// limit and order are absent (undefined) — must not appear in URL
			},
		});

		const parsedUrl = new URL(url);
		expect(parsedUrl.searchParams.get("skip")).toStrictEqual("5");
		expect(parsedUrl.searchParams.has("limit")).toBe(false);
		expect(parsedUrl.searchParams.has("order")).toBe(false);
	});
});
