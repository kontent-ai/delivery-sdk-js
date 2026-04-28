import type { JsonValue } from "@kontent-ai/core-sdk";
import { describe, expect, it } from "vitest";
import type { DeliveryMetadata, DeliveryPagedFetchQuery } from "../../../lib/models/core.models.js";
import { createDeliveryClient } from "../../../lib/public_api.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

describe("Query parameters", () => {
	const client = createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
	});

	it("Paging parameters should be added to the url", () => {
		const listingQueries: readonly DeliveryPagedFetchQuery<JsonValue, DeliveryMetadata>[] = [
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
			client.listContentItems({
				query: {
					order: "system.name[asc]",
					skip: 5,
					limit: 10,
					depth: 4,
				},
			}),
		];

		for (const { inspect } of listingQueries) {
			const { success, data, error } = inspect();

			if (!success) {
				throw new Error(`Failed to inspect query: ${error}`);
			}

			const { url } = data;
			expect(url.searchParams.get("skip")).toStrictEqual("5");
			expect(url.searchParams.get("limit")).toStrictEqual("10");
			expect(url.searchParams.get("order")).toStrictEqual("system.name[asc]");
		}
	});

	it("Elements query parameter should be added as a comma-separated list in the url", () => {
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
