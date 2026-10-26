import { expect } from "vitest";
import type { ContentTypeCodenameOf } from "../../../lib/public_api.js";
import type { ContentItemPayloadExtended } from "../../../lib/queries/content-items/models/content-item.models.js";
import { contentItemSchemaExtended } from "../../../lib/queries/content-items/schemas/content-item.schemas.js";
import { type IntegrationTestProjectSchema, isMovie, type Movie } from "./integration-test.schema.js";

type ExtendedItem = ContentItemPayloadExtended<IntegrationTestProjectSchema>;

type ExtendedItemsPayload = {
	readonly items: readonly ExtendedItem[];
	readonly modular_content: Readonly<Record<string, ExtendedItem | undefined>>;
};

/**
 * Returns the top level items together with all items from `modular_content`, across all given payloads (pages).
 */
export function getAllItems(payloads: readonly ExtendedItemsPayload[]): readonly ExtendedItem[] {
	return payloads.flatMap((payload) => [
		...payload.items,
		...Object.values(payload.modular_content).filter((item) => item !== undefined),
	]);
}

export function getMovies(items: readonly ExtendedItem[]): readonly Movie[] {
	return items.filter(isMovie);
}

/**
 * Asserts that every linked item of every movie's `cast` element is a resolved `star` item matching the extended item schema.
 */
export function expectMovieCastItemsToBeResolvedStars(movies: readonly Movie[]): void {
	for (const movie of movies) {
		for (const linkedItem of movie.elements.cast.items) {
			const { success, error } = contentItemSchemaExtended<IntegrationTestProjectSchema>().safeParse(linkedItem);
			expect(success, `Movie '${movie.system.codename}' cast item: ${error?.message}`).toBe(true);
			expect(linkedItem.system.type, `Movie '${movie.system.codename}' cast item type`).toBe<
				ContentTypeCodenameOf<IntegrationTestProjectSchema>
			>("star");
		}
	}
}

/**
 * Asserts that every linked item of every movie's `description` rich text element matches the extended item schema.
 */
export function expectMovieDescriptionItemsToBeResolved(movies: readonly Movie[]): void {
	for (const movie of movies) {
		for (const linkedItem of movie.elements.description.items) {
			const { success, error } = contentItemSchemaExtended<IntegrationTestProjectSchema>().safeParse(linkedItem);
			expect(success, `Movie '${movie.system.codename}' description item: ${error?.message}`).toBe(true);
		}
	}
}
