/**
 * Compile-time tests for the strongly typed client. Checked by `pnpm run test:types`, never executed.
 */
import { expectTypeOf } from "vitest";
import {
	type ContentItemFilter,
	type ContentItemOfType,
	type ContentItemPayloadExtended,
	type ContentTypeElementPayload,
	type DeliveryClient,
	type DeliveryClientSchema,
	isContentItemOfType,
} from "../../lib/public_api.js";
import type { SampleDeliveryClient } from "../../sample/sample-schema/client.js";
import type { Actor, Movie, SampleItem } from "../../sample/sample-schema/sample-project.models.js";
import type { SampleProjectSchema } from "../../sample/sample-schema/sample-project.schema.js";

declare const client: SampleDeliveryClient;
declare const untypedClient: DeliveryClient;

export async function responseNarrowing(): Promise<void> {
	const all = await client.listContentItems().fetchPage();
	expectTypeOf(all.payload.items).toEqualTypeOf<readonly SampleItem[]>();
	expectTypeOf(all.payload.modular_content).toEqualTypeOf<Readonly<Record<string, SampleItem | undefined>>>();

	const movies = await client.listContentItems({ ofContentTypes: ["movie"] }).fetchPage();
	expectTypeOf(movies.payload.items).toEqualTypeOf<readonly Movie[]>();

	const feed = await client.itemsFeed({ ofContentTypes: ["actor"] }).fetchPage();
	expectTypeOf(feed.payload.items).toEqualTypeOf<readonly Actor[]>();

	const single = await client.fetchContentItem({ codename: "x" }).fetch();
	expectTypeOf(single.payload.item).toEqualTypeOf<SampleItem>();

	// @ts-expect-error "moive" is not a content type codename.
	client.listContentItems({ ofContentTypes: ["moive"] });
}

export async function untypedClientFallsBackToGenericItems(): Promise<void> {
	const all = await untypedClient.listContentItems({ ofContentTypes: ["anything"] }).fetchPage();
	expectTypeOf(all.payload.items[0]?.system.type).toEqualTypeOf<"anything" | undefined>();
	expectTypeOf(all.payload.items).toExtend<readonly ContentItemPayloadExtended<DeliveryClientSchema>[]>();
}

export function guard(item: SampleItem): void {
	if (isContentItemOfType(item, "movie")) {
		expectTypeOf(item).toEqualTypeOf<Movie>();
	}
	if (isContentItemOfType(item, ["movie", "actor"])) {
		expectTypeOf(item).toEqualTypeOf<Movie | Actor>();
	}
	expectTypeOf<ContentItemOfType<SampleItem, "actor">>().toEqualTypeOf<Actor>();
}

export function workflowSteps(movie: Movie): void {
	if (movie.system.workflow === "default") {
		expectTypeOf(movie.system.workflow_step).toEqualTypeOf<"draft" | "review" | "published">();
	}
}

export async function contentTypes(): Promise<void> {
	const type = await client.fetchContentType({ codename: "actor" }).fetch();
	expectTypeOf(type.payload.system.codename).toEqualTypeOf<"actor">();
	expectTypeOf<keyof typeof type.payload.elements>().toEqualTypeOf<
		"first_name" | "last_name" | "role" | "related_actors" | "metadata__internal_id" | "categories"
	>();

	const element = await client.fetchContentTypeElement({ typeCodename: "movie", elementCodename: "categories" }).fetch();
	expectTypeOf(element.payload.type).toEqualTypeOf<"taxonomy">();
	expectTypeOf(element.payload.codename).toEqualTypeOf<"categories">();
	expectTypeOf<ContentTypeElementPayload<SampleProjectSchema, "movie", "rating">["type"]>().toEqualTypeOf<"number">();
}

export function filters(): void {
	expectTypeOf<{ readonly property: "elements.rating"; readonly operator: "range"; readonly value: readonly [1, 5] }>().toExtend<
		ContentItemFilter<SampleProjectSchema>
	>();
	expectTypeOf<{ readonly property: "elements.rating"; readonly operator: "eq"; readonly value: "5" }>().not.toExtend<
		ContentItemFilter<SampleProjectSchema>
	>();
	expectTypeOf<{ readonly property: "elements.poster"; readonly operator: "contains"; readonly value: "x" }>().not.toExtend<
		ContentItemFilter<SampleProjectSchema>
	>();
	expectTypeOf<{ readonly property: "system.collection"; readonly operator: "eq"; readonly value: "movies" }>().toExtend<
		ContentItemFilter<SampleProjectSchema>
	>();
	expectTypeOf<{ readonly property: "system.collection"; readonly operator: "eq"; readonly value: "music" }>().not.toExtend<
		ContentItemFilter<SampleProjectSchema>
	>();
}

export async function contentTypeElementDefinitions(): Promise<void> {
	const genre = await client.fetchContentTypeElement({ typeCodename: "movie", elementCodename: "genre" }).fetch();
	expectTypeOf<(typeof genre.payload.options)[number]["codename"]>().toEqualTypeOf<"genre1" | "genre2">();

	const categories = await client.fetchContentTypeElement({ typeCodename: "actor", elementCodename: "categories" }).fetch();
	expectTypeOf(categories.payload.taxonomy_group).toEqualTypeOf<"categoryActor">();

	const movieType = await client.fetchContentType({ codename: "movie" }).fetch();
	const genreDefinition = movieType.payload.elements.genre;
	if (genreDefinition) {
		expectTypeOf(genreDefinition.type).toEqualTypeOf<"multiple_choice">();
		expectTypeOf<(typeof genreDefinition.options)[number]["codename"]>().toEqualTypeOf<"genre1" | "genre2">();
	}
	expectTypeOf(movieType.payload.elements.categories?.taxonomy_group).toEqualTypeOf<"category" | undefined>();
}

export async function filtersScopedByContentTypes(): Promise<void> {
	const movies = await client
		.listContentItems({
			ofContentTypes: ["movie"],
			filters: [
				{ property: "elements.rating", operator: "gte", value: 7 },
				{ property: "elements.categories", operator: "contains", value: "term1" },
			],
			query: { order: "elements.rating[desc]", elements: ["title", "rating"] },
		})
		.fetchPage();
	// Filters must not widen the content types inferred from `ofContentTypes`.
	expectTypeOf(movies.payload.items).toEqualTypeOf<readonly Movie[]>();

	client.listContentItems({
		ofContentTypes: ["movie"],
		// @ts-expect-error "first_name" is an actor element.
		filters: [{ property: "elements.first_name", operator: "eq", value: "Keanu" }],
	});
	client.listContentItems({
		ofContentTypes: ["movie"],
		// @ts-expect-error "term3" belongs to "categoryActor", the taxonomy of the actor's "categories" element.
		filters: [{ property: "elements.categories", operator: "contains", value: "term3" }],
	});
	client.listContentItems({
		ofContentTypes: ["movie"],
		// @ts-expect-error only "movie" items are queried.
		filters: [{ property: "system.type", operator: "eq", value: "actor" }],
	});
	client.itemsFeed({
		ofContentTypes: ["actor"],
		// @ts-expect-error "rating" is a movie element.
		query: { order: "elements.rating[asc]" },
	});
	client.itemsFeed({
		ofContentTypes: ["actor"],
		// @ts-expect-error "title" is a movie element.
		query: { elements: ["title"] },
	});

	// Without `ofContentTypes`, elements of all content types are accepted.
	client.listContentItems({ filters: [{ property: "elements.first_name", operator: "eq", value: "Keanu" }] });

	expectTypeOf<{ readonly property: "elements.first_name"; readonly operator: "eq"; readonly value: "x" }>().not.toExtend<
		ContentItemFilter<SampleProjectSchema, "movie">
	>();
}
