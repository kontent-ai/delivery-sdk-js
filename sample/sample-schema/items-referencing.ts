/** biome-ignore-all lint/correctness/noUnusedVariables: Disabled for clarity of the sample */
/**
 * Sample: items referencing an asset or an item (`itemsReferencingAsset`, `itemsReferencingItem`).
 *
 * These queries return only the `system` properties of the referencing items and accept filters on system
 * properties only.
 */

import { client } from "./client.js";

export async function itemsReferencingAsset(): Promise<void> {
	const response = await client
		.itemsReferencingAsset({
			codename: "matrix_poster",
			filters: [{ property: "system.type", operator: "eq", value: "actor" }],
		})
		.fetchPage();

	// System codenames are narrowed to the schema.
	const type: "movie" | "actor" | undefined = response.payload.items[0]?.system.type;
	const language: "en-us" | "es-es" | undefined = response.payload.items[0]?.system.language;

	client.itemsReferencingAsset({
		codename: "matrix_poster",
		// @ts-expect-error "moive" is not a content type codename.
		filters: [{ property: "system.type", operator: "eq", value: "moive" }],
	});
}

export async function itemsReferencingItem(): Promise<void> {
	const response = await client
		.itemsReferencingItem({
			codename: "keanu_reeves",
			filters: [{ property: "system.collection", operator: "in", value: ["movies"] }],
		})
		.fetchPage();

	const collection: "movies" | "tv-shows" | undefined = response.payload.items[0]?.system.collection;

	client.itemsReferencingItem({
		codename: "keanu_reeves",
		// @ts-expect-error element filters are not supported by this endpoint.
		filters: [{ property: "elements.title", operator: "eq", value: "The Matrix" }],
	});
}
