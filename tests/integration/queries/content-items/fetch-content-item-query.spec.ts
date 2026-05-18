import { describe, expect, it } from "vitest";
import type {
	FetchContentItemPayload,
	FetchContentItemPayloadExtended,
} from "../../../../lib/queries/content-items/models/content-item.models.js";
import {
	fetchContentItemSchema,
	fetchContentItemSchemaExtended,
} from "../../../../lib/queries/content-items/schemas/content-item.schemas.js";
import { runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import { type IntegrationTestProjectSchema, isMovie, isStar } from "../../models/integration-test.schema.js";
import rawPayload from "./fetch-content-item-query.payload.js";

describe("Fetch content item query", async () => {
	const codename = rawPayload.item.system.codename;
	await runQueryTestsAsync<FetchContentItemPayload<IntegrationTestProjectSchema>, IntegrationTestProjectSchema>({
		endpoint: `items/${codename}`,
		rawPayload,
		selectQuery: (client) => client.fetchContentItem({ codename }).raw(),
		expectedSchema: fetchContentItemSchema<IntegrationTestProjectSchema>(),
	});
});

describe("Fetch content item query - extended", async () => {
	const codename = rawPayload.item.system.codename;
	await runQueryTestsAsync<FetchContentItemPayloadExtended<IntegrationTestProjectSchema>, IntegrationTestProjectSchema>({
		endpoint: `items/${codename}`,
		rawPayload: undefined,
		selectQuery: (client) => client.fetchContentItem({ codename }),
		expectedSchema: fetchContentItemSchemaExtended<IntegrationTestProjectSchema>(),
		extraTests: (response) => {
			const item = response.item;
			if (!isMovie(item)) {
				throw new Error("Item is not a movie");
			}

			it("Star items should contain items with identical codenames as raw value", () => {
				expect(item.elements.cast.items.map((m) => m.system.codename).sort()).toEqual(rawPayload.item.elements.cast.value.sort());
			});

			it("Star items should be typed as Star and elements should be defined", () => {
				for (const star of item.elements.cast.items) {
					expect(isStar(star)).toBe(true);
					expect(star.elements.firstname).toBeDefined();
					expect(star.elements.lastname).toBeDefined();
				}
			});
		},
	});
});
