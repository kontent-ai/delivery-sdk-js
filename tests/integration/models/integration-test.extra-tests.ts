import { expect, it } from "vitest";
import type { ContentItemPayload } from "../../../lib/public_api.js";
import { type IntegrationTestProjectSchema, isMovie, isStar } from "./integration-test.schema.js";

export function registerMovieCastExtraTests(items: readonly ContentItemPayload<IntegrationTestProjectSchema>[]): void {
	it("There should be > 0 items", () => {
		expect(items.length).toBeGreaterThan(0);
	});

	for (const item of items) {
		if (isMovie(item)) {
			it(`Movie item with codename "${item.system.codename}" of type "${item.system.type}" has typed Star cast items`, () => {
				for (const star of item.elements.cast.items) {
					expect(star.system.type).toEqual<IntegrationTestProjectSchema["contentTypeCodenames"][number]>("star");
					expect(isStar(star)).toBe(true);
					expect(star.elements.firstname).toBeDefined();
					expect(star.elements.lastname).toBeDefined();
				}
			});
		}
	}
}
