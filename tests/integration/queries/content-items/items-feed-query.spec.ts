import { describe, expect, it } from "vitest";
import type { ItemsFeedPayloadExtended } from "../../../../lib/queries/content-items/models/content-item.models.js";
import { itemsFeedSchema, itemsFeedSchemaExtended } from "../../../../lib/queries/content-items/schemas/content-item.schemas.js";
import { runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import { type IntegrationTestProjectSchema, isMovie, isStar } from "../../models/integration-test.schema.js";
import unitTestPayload from "./items-feed-query.payload.js";

describe("Items feed query", async () => {
	await runQueryTestsAsync({
		endpoint: "items-feed",
		rawPayload: unitTestPayload,
		selectQuery: (client) => client.itemsFeed().raw(),
		expectedSchema: itemsFeedSchema(),
	});
});

describe("Items feed query - extended", async () => {
	await runQueryTestsAsync<ItemsFeedPayloadExtended<IntegrationTestProjectSchema>, IntegrationTestProjectSchema>({
		endpoint: "items-feed",
		rawPayload: undefined,
		selectQuery: (client) => client.itemsFeed(),
		expectedSchema: itemsFeedSchemaExtended<IntegrationTestProjectSchema>(),
		extraTests: (response) => {
			const items = response.items;

			it("There should be at > 0 items", () => {
				expect(items.length).toBeGreaterThan(0);
			});

			for (const item of items) {
				if (isMovie(item)) {
					it(`Movie item with codename "${item.system.codename}" of type "${item.system.type}" has casted stars`, () => {
						for (const star of item.elements.cast.items) {
							expect(star.system.type).toEqual<IntegrationTestProjectSchema["contentTypeCodenames"][number]>("star");
							expect(isStar(star)).toBe(true);
							expect(star.elements.firstname).toBeDefined();
							expect(star.elements.lastname).toBeDefined();
						}
					});
				}
			}
		},
	});
});
