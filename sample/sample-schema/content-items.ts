/** biome-ignore-all lint/correctness/noUnusedVariables: Disabled for clarity of the sample */
/**
 * Sample: content item queries (`fetchContentItem`, `listContentItems`, `itemsFeed`).
 *
 * Each annotated `const` shows what the SDK narrows a response value to. Filters have their own sample
 * in `content-item-filters.ts`.
 */

import { isContentItemOfType, type ProjectedItem, type WorkflowStepCodenameOf } from "../../lib/public_api.js";
import { client } from "./client.js";
import type { Actor, Movie, SampleItem } from "./sample-project.models.js";
import type { SampleProjectSchema } from "./sample-project.schema.js";

/**
 * 1. Fetching a single item
 *
 * The item is typed as the item union. `language` accepts the language codenames of the schema.
 */
export async function fetchItem(): Promise<void> {
	const response = await client.fetchContentItem({ codename: "the_matrix", query: { language: "es-es" } }).fetch();
	const item: SampleItem = response.payload.item;

	// Linked items in `modular_content` are typed as the item union.
	const linkedItem: SampleItem | undefined = response.payload.modular_content.keanu_reeves;

	// `isContentItemOfType` narrows the union by content type. (TypeScript can't narrow the item by the nested
	// `item.system.type` check, so use the guard instead.)
	if (isContentItemOfType(item, "movie")) {
		const title: string = item.elements.title.value;
		const actors: readonly Actor[] = item.elements.actors.items;
	}
	if (isContentItemOfType(item, ["movie", "actor"])) {
		const both: Movie | Actor = item;
	}

	// @ts-expect-error "moive" is not a content type codename.
	isContentItemOfType(item, "moive");

	// @ts-expect-error "fr-fr" is not a language codename.
	client.fetchContentItem({ codename: "the_matrix", query: { language: "fr-fr" } });
}

/**
 * 2. Listing items of specific content types
 *
 * `ofContentTypes` filters by content type and narrows the returned items. It also scopes the rest of the
 * request: `order`, `elements` and `excludeElements` accept only the elements of the selected types.
 */
export async function listItemsOfContentTypes(): Promise<void> {
	const movies = await client
		.listContentItems({
			ofContentTypes: ["movie"],
			query: {
				order: "elements.rating[desc]",
				elements: ["title", "rating", "actors"],
				includeTotalCount: true,
			},
		})
		.fetchPage();
	// `elements` narrows the items to the selected elements (see 2b).
	const movieItems: readonly ProjectedItem<Movie, "title" | "rating" | "actors">[] = movies.payload.items;
	const totalCount: number | undefined = movies.payload.pagination.total_count;

	// Several content types narrow to their union, and accept elements of any of them.
	const feed = await client.itemsFeed({ ofContentTypes: ["movie", "actor"] }).fetchPage();
	const feedItems: readonly (Movie | Actor)[] = feed.payload.items;

	// Without `ofContentTypes`, items are the whole item union and elements of all content types are accepted.
	const all = await client.listContentItems({ query: { order: "elements.first_name[asc]" } }).fetchPage();
	const allItems: readonly SampleItem[] = all.payload.items;

	client.listContentItems({
		ofContentTypes: ["actor"],
		// @ts-expect-error "rating" is a movie element, but only actors are queried.
		query: { order: "elements.rating[asc]" },
	});
	client.itemsFeed({
		ofContentTypes: ["actor"],
		// @ts-expect-error "title" is a movie element, but only actors are queried.
		query: { elements: ["title"] },
	});
	// @ts-expect-error "moive" is not a content type codename.
	client.listContentItems({ ofContentTypes: ["moive"] });
}

/**
 * 2b. Element projection
 *
 * `elements` keeps only the selected elements and `excludeElements` removes elements, both in the response
 * types and in the API response. The projection also applies to `modular_content` and so to resolved linked items.
 */
export async function elementProjection(): Promise<void> {
	const movies = await client.listContentItems({ ofContentTypes: ["movie"], query: { elements: ["title", "actors"] } }).fetchPage();

	for (const movie of movies.payload.items) {
		const title: string = movie.elements.title.value;

		// @ts-expect-error "rating" was not selected, so it is not in the response.
		movie.elements.rating;

		// Linked actors are projected too, and "first_name" was not selected.
		// @ts-expect-error "first_name" is not in the response.
		movie.elements.actors.items[0]?.elements.first_name;
	}

	const actors = await client.listContentItems({ ofContentTypes: ["actor"], query: { excludeElements: ["categories"] } }).fetchPage();
	for (const actor of actors.payload.items) {
		const firstName: string = actor.elements.first_name.value;

		// @ts-expect-error "categories" is excluded.
		actor.elements.categories;
	}
}

/**
 * 3. Element values
 *
 * Element values are typed by the item model: option and term codenames, resolved linked items and the
 * content types of rich text links.
 */
export function elementValues(movie: Movie): void {
	const rating: number | null = movie.elements.rating.value;
	const synopsisActors: readonly Actor[] = movie.elements.synopsis.items;
	const linkType: "movie" | undefined = Object.values(movie.elements.synopsis.links)[0]?.type;
	const genreCodename: "genre1" | "genre2" | undefined = movie.elements.genre.value[0]?.codename;
	const categoryCodename: "term1" | "term2" | undefined = movie.elements.categories.value[0]?.codename;
	const taxonomyGroup: "category" = movie.elements.categories.taxonomy_group;
	const firstActor: Actor | undefined = movie.elements.actors.items[0];
	const actorRole: "opt1" | "opt2" | "opt3" | undefined = firstActor?.elements.role.value[0]?.codename;

	// @ts-expect-error "first_name" is an actor element.
	movie.elements.first_name;
}

/**
 * 4. System properties
 *
 * Codenames in `system` are narrowed to the schema, and `workflow_step` narrows once `workflow` is checked.
 */
export function systemProperties(movie: Movie): void {
	const type: "movie" = movie.system.type;
	const language: "en-us" | "es-es" = movie.system.language;
	const collection: "movies" | "tv-shows" = movie.system.collection;

	if (movie.system.workflow === "legal") {
		const step: "draft" | "legal_approval" | "published" = movie.system.workflow_step;
	} else {
		// @ts-expect-error legal_approval step is not in the non-legal workflow
		const legalStep: "legal_approval" = movie.system.workflow_step;
	}
	const allSteps: WorkflowStepCodenameOf<SampleProjectSchema> = "review";
	const legalSteps: WorkflowStepCodenameOf<SampleProjectSchema, "legal"> = "legal_approval";
}
