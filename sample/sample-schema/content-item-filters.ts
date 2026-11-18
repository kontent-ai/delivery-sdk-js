/** biome-ignore-all lint/correctness/noUnusedVariables: Disabled for clarity of the sample */
/**
 * Sample: content item filters (`listContentItems`, `itemsFeed`).
 *
 * Filter properties, values and operators are checked against the schema. To type a filter array declared
 * outside the query call, use `ContentItemFilter`.
 */

import type { ContentItemFilter, Filter } from "../../lib/public_api.js";
import { client } from "./client.js";
import type { Movie } from "./sample-project.models.js";
import type { SampleProjectSchema } from "./sample-project.schema.js";

/**
 * 1. Filters across all content types
 */
export async function typedFilters(): Promise<void> {
	const filters: readonly ContentItemFilter<SampleProjectSchema>[] = [
		// System properties accept their codenames.
		{ property: "system.type", operator: "in", value: ["movie", "actor"] },
		{ property: "system.language", operator: "eq", value: "en-us" },
		{ property: "system.workflow_step", operator: "neq", value: "draft" },
		// Number elements accept numbers, including ranges.
		{ property: "elements.rating", operator: "range", value: [7, 10] },
		// Taxonomy and multiple choice elements accept their codenames with array operators.
		// Without `ofContentTypes`, "categories" accepts the terms of both types' taxonomies.
		{ property: "elements.categories", operator: "contains", value: "term3" },
		{ property: "elements.genre", operator: "any", value: ["genre1", "genre2"] },
		// Rich text emptiness uses the SDK helper operators.
		{ property: "elements.synopsis", operator: "isNotEmptyRichText" },
		// Asset elements support only `empty` / `nempty`.
		{ property: "elements.poster", operator: "nempty" },
		// Raw string filters are an escape hatch: only the property is checked.
		"elements.genre[any]=genre1,genre2",
	];
	await client.listContentItems({ filters }).fetchPage();
	await client.itemsFeed({ filters }).fetchPage();

	const badFilters: readonly ContentItemFilter<SampleProjectSchema>[] = [
		// @ts-expect-error "titel" is not an element codename declared in the schema.
		{ property: "elements.titel", operator: "eq", value: "Matrix" },
		// @ts-expect-error "moive" is not a content type codename.
		{ property: "system.type", operator: "eq", value: "moive" },
		// @ts-expect-error number elements accept numbers.
		{ property: "elements.rating", operator: "gte", value: "8" },
		// @ts-expect-error "news" is not a term of the taxonomies used by "categories".
		{ property: "elements.categories", operator: "contains", value: "news" },
		// @ts-expect-error `contains` is an array operator and "title" is a text element.
		{ property: "elements.title", operator: "contains", value: "Matrix" },
		// @ts-expect-error the Delivery API does not support `empty` on rich text, use `isEmptyRichText`.
		{ property: "elements.synopsis", operator: "empty" },
		// @ts-expect-error asset elements support only `empty` / `nempty`.
		{ property: "elements.poster", operator: "eq", value: "x" },
	];
}

/**
 * 2. Filters scoped by `ofContentTypes`
 *
 * With `ofContentTypes`, filters accept only the elements of the selected types, element values follow those
 * types' definitions and `system.type` accepts only the selected types. Filters never widen the inferred types,
 * so the items stay narrowed.
 */
export async function scopedFilters(): Promise<void> {
	const movies = await client
		.listContentItems({
			ofContentTypes: ["movie"],
			filters: [
				{ property: "elements.rating", operator: "gte", value: 7 },
				// Only the terms of the "category" taxonomy, the one used by the movie's "categories" element.
				{ property: "elements.categories", operator: "contains", value: "term1" },
			],
		})
		.fetchPage();
	const movieItems: readonly Movie[] = movies.payload.items;

	// To declare a scoped filter array outside the query call, pass the content types to `ContentItemFilter`.
	const movieFilters: readonly ContentItemFilter<SampleProjectSchema, "movie">[] = [
		{ property: "elements.genre", operator: "contains", value: "genre1" },
		{ property: "elements.release_date", operator: "gte", value: "2020-01-01" },
	];
	await client.itemsFeed({ ofContentTypes: ["movie"], filters: movieFilters }).fetchPage();

	const badMovieFilters: readonly ContentItemFilter<SampleProjectSchema, "movie">[] = [
		// @ts-expect-error "first_name" is an actor element.
		{ property: "elements.first_name", operator: "eq", value: "Keanu" },
		// @ts-expect-error "term3" belongs to "categoryActor", the taxonomy of the actor's "categories" element.
		{ property: "elements.categories", operator: "contains", value: "term3" },
		// @ts-expect-error only "movie" items are queried.
		{ property: "system.type", operator: "eq", value: "actor" },
	];

	// A filter array for all content types is too wide for a scoped query.
	const allTypeFilters: readonly ContentItemFilter<SampleProjectSchema>[] = [];
	// @ts-expect-error `ContentItemFilter<SampleProjectSchema>` accepts actor elements, use `ContentItemFilter<SampleProjectSchema, "movie">`.
	await client.listContentItems({ ofContentTypes: ["movie"], filters: allTypeFilters }).fetchPage();
}

/**
 * 3. Loose filters
 *
 * The generic `Filter<string, string>` is too wide for content item queries. Use `ContentItemFilter` instead.
 */
export async function looseFilters(): Promise<void> {
	const filters: readonly Filter<string, string>[] = [{ property: "system.type", operator: "eq", value: "movie" }];
	// @ts-expect-error `system.${string}` is wider than the accepted system properties.
	await client.listContentItems({ filters }).fetchPage();
}
