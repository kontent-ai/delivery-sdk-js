import { expect, it } from "vitest";
import type { ContentItemPayloadExtended } from "../../../lib/queries/content-items/models/content-item.models.js";
import { contentItemSchemaExtended } from "../../../lib/queries/content-items/schemas/content-item.schemas.js";
import { type IntegrationTestProjectSchema, isMovie } from "./integration-test.schema.js";

export function registerExtendedItemsTests(
	items: readonly ContentItemPayloadExtended<IntegrationTestProjectSchema>[],
	modularContent: Readonly<Record<string, ContentItemPayloadExtended<IntegrationTestProjectSchema>>>,
): void {
	const allItems = [...items, ...Object.values(modularContent)];

	it("There should be > 0 items", () => {
		expect(allItems.length).toBeGreaterThan(0);
	});

	for (const item of allItems) {
		if (isMovie(item)) {
			it(`Movie item with codename "${item.system.codename}" has resolved cast items matching extended content-item schema`, () => {
				for (const linkedItem of item.elements.cast.items) {
					const { success, error } = contentItemSchemaExtended<IntegrationTestProjectSchema>().safeParse(linkedItem);
					expect(success, error?.message).toBe(true);
					expect(linkedItem.system.type).toBe<IntegrationTestProjectSchema["contentTypeCodenames"][number]>("star");
				}
			});

			it(`Movie item with codename "${item.system.codename}" has resolved rich-text description items matching extended content-item schema`, () => {
				for (const linkedItem of item.elements.description.items) {
					const { success, error } = contentItemSchemaExtended<IntegrationTestProjectSchema>().safeParse(linkedItem);
					expect(success, error?.message).toBe(true);
				}
			});
		}
	}
}
