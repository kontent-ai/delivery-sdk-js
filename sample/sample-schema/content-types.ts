/** biome-ignore-all lint/correctness/noUnusedVariables: Disabled for clarity of the sample */
/**
 * Sample: content type queries (`listContentTypes`, `fetchContentType`, `fetchContentTypeElement`).
 *
 * Content type and element codenames are checked against the schema, and element definitions are narrowed
 * to the schema: the element `type`, multiple choice option codenames and the taxonomy group of taxonomy elements.
 */

import type { ElementCodenamesOf } from "../../lib/public_api.js";
import { client } from "./client.js";
import type { SampleProjectSchema } from "./sample-project.schema.js";

/**
 * 1. Listing content types
 */
export async function listContentTypes(): Promise<void> {
	const response = await client.listContentTypes({ query: { order: "system.name[asc]" } }).fetchPage();
	const codename: "movie" | "actor" | undefined = response.payload.types[0]?.system.codename;
}

/**
 * 2. Fetching a content type
 *
 * A fetched content type keeps its codename, its elements are keyed by the type's element codenames and each
 * element definition is narrowed to the schema.
 */
export async function fetchContentType(): Promise<void> {
	const movieType = await client.fetchContentType({ codename: "movie" }).fetch();
	const codename: "movie" = movieType.payload.system.codename;

	const genre = movieType.payload.elements.genre;
	if (genre) {
		const type: "multiple_choice" = genre.type;
		const optionCodename: "genre1" | "genre2" | undefined = genre.options[0]?.codename;
	}

	// The same element codename resolves to each type's own definition.
	const movieTaxonomyGroup: "category" | undefined = movieType.payload.elements.categories?.taxonomy_group;
	const actorType = await client.fetchContentType({ codename: "actor" }).fetch();
	const actorTaxonomyGroup: "categoryActor" | undefined = actorType.payload.elements.categories?.taxonomy_group;

	// @ts-expect-error "first_name" is an actor element.
	movieType.payload.elements.first_name;

	// @ts-expect-error "moive" is not a content type codename.
	client.fetchContentType({ codename: "moive" });
}

/**
 * 3. Fetching a content type element
 *
 * A fetched element is narrowed to its element type and schema definition.
 */
export async function fetchContentTypeElement(): Promise<void> {
	const genre = await client.fetchContentTypeElement({ typeCodename: "movie", elementCodename: "genre" }).fetch();
	const genreType: "multiple_choice" = genre.payload.type;
	const genreCodename: "genre" = genre.payload.codename;
	const optionCodename: "genre1" | "genre2" | undefined = genre.payload.options[0]?.codename;

	const role = await client.fetchContentTypeElement({ typeCodename: "actor", elementCodename: "role" }).fetch();
	const roleOption: "opt1" | "opt2" | "opt3" | undefined = role.payload.options[0]?.codename;

	const categories = await client.fetchContentTypeElement({ typeCodename: "actor", elementCodename: "categories" }).fetch();
	const taxonomyGroup: "categoryActor" = categories.payload.taxonomy_group;

	// @ts-expect-error "first_name" belongs to "actor", not "movie".
	client.fetchContentTypeElement({ typeCodename: "movie", elementCodename: "first_name" });

	const movieElement: ElementCodenamesOf<SampleProjectSchema, "movie"> = "synopsis";
}
