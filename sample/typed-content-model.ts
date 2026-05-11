/** biome-ignore-all lint/correctness/noUnusedVariables: Disabled for clarity of the sample  */
/**
 * Sample: defining a strongly typed Kontent.ai delivery model.
 *
 * Top to bottom:
 *  1. Declare your project's codename schema.
 *  2. Define content-type element shapes and their payload types.
 *  3. Build Zod schemas with `defineContentItem`.
 *  4. Create a typed delivery client.
 *  5. See how response values narrow at the call site.
 *
 * In a real consumer project, imports below would come from
 * `@kontent-ai/delivery-sdk`. This sample lives in the SDK repo,
 * so it imports from the in-tree source instead.
 */

import type z from "zod";
import { createDeliveryClient } from "../lib/client/delivery-client.js";
import type { DeliveryClient, DeliveryClientSchema, ElementType } from "../lib/public_api.js";
import { defineContentItem, type InferItemType } from "../lib/queries/content-items/content-item.models.js";
import { elementDef } from "../lib/queries/content-items/element.models.js";

/**
 * 1. Schema declaration
 *
 * `DeliveryClientSchema` lists every codename your project uses so queries,
 * payloads, and element accessors are checked against it.
 */
export type SampleProjectSchema = DeliveryClientSchema<{
	readonly languageCodenames: readonly ["en-us", "es-es"];
	readonly taxonomyCodenames: readonly ["category", "tag"];
	readonly contentTypeCodenames: readonly ["movie", "actor"];
	readonly elementCodenames: readonly ["title", "first_name", "last_name"];
	readonly collectionCodenames: readonly ["movies", "tv-shows"];
	readonly workflowCodenames: readonly ["published", "draft"];
	readonly workflowStepCodenames: readonly ["published", "draft"];
}>;

/**
 * 2. Content type: Actor
 *
 * Each property on `ActorElements` maps an element codename to its element type.
 * Codename generics on `MultipleChoice<...>` and `Taxonomy<...>` are TypeScript
 * hints only: they power autocomplete and narrowing, but the runtime schema
 * still accepts any string codename the API returns.
 */
export type ActorElements = {
	readonly first_name: ElementType.Text;
	readonly last_name: ElementType.Text;
	readonly role: ElementType.MultipleChoice<"opt1" | "opt2" | "opt3">;
	readonly relatedActors: ElementType.LinkedItems;
};

// Fully-typed Actor item payload (system metadata + elements).
export type Actor = InferItemType<SampleProjectSchema, "actor", ActorElements>;

// Runtime Zod schema for parsing Actor items into the typed `Actor` payload.
export const actorSchema: z.ZodType<Actor> = defineContentItem<SampleProjectSchema, "actor", ActorElements>("actor", {
	first_name: elementDef.text,
	last_name: elementDef.text,
	role: elementDef.multipleChoice<"opt1" | "opt2" | "opt3">(),
	relatedActors: elementDef.linkedItems,
});

/**
 * 3. Content type: Movie
 *
 * Movie exercises every element type the SDK supports.
 */
export type MovieElements = {
	readonly title: ElementType.Text;
	readonly rating: ElementType.Number;
	readonly synopsis: ElementType.RichText;
	readonly genre: ElementType.MultipleChoice<"genre1" | "genre2">;
	readonly release_date: ElementType.DateTime;
	readonly poster: ElementType.Asset;
	readonly categories: ElementType.Taxonomy<"term1" | "term2">;
	readonly url_slug: ElementType.UrlSlug;
	readonly custom_id: ElementType.Custom;
	readonly actors: ElementType.LinkedItems;
};

// Fully-typed Movie item payload.
export type Movie = InferItemType<SampleProjectSchema, "movie", MovieElements>;

export const movieSchema: z.ZodType<Movie> = defineContentItem<SampleProjectSchema, "movie", MovieElements>("movie", {
	title: elementDef.text,
	rating: elementDef.number,
	synopsis: elementDef.richText,
	genre: elementDef.multipleChoice<"genre1" | "genre2">(),
	release_date: elementDef.dateTime,
	poster: elementDef.asset,
	categories: elementDef.taxonomy<"term1" | "term2">(),
	url_slug: elementDef.urlSlug,
	custom_id: elementDef.custom,
	actors: elementDef.linkedItems,
});

/**
 * 4. Typed delivery client
 *
 * Pass `SampleProjectSchema` as the generic to `createDeliveryClient` and
 * every query is narrowed against your schema.
 */
export type SampleDeliveryClient = DeliveryClient<SampleProjectSchema>;

export const client: SampleDeliveryClient = createDeliveryClient<SampleProjectSchema>({
	apiMode: "public",
	environmentId: "x",
});

/**
 * 5. Demonstration: query typing
 *
 * Each annotated `const` shows what the SDK narrows a response value to.
 */
export async function demonstrateQueries(): Promise<void> {
	const languageResponse = await client.listLanguages().fetchPage();

	// Languages are typed to the schema codenames.
	const responseLanguageCodenames: readonly ("en-us" | "es-es")[] = languageResponse.payload.languages.map(
		(language) => language.system.codename,
	);

	// `fetchContentItem` returns a fully typed item payload.
	const item = await client.fetchContentItem({ codename: "itemCodename" }).fetch();
}

/**
 * 6. Demonstration: element value narrowing
 *
 * Annotations below are the types the SDK gives you at compile time. They
 * produce a compile error if the public types drift. Narrowed codenames are
 * TypeScript hints; the runtime value can be any string the API returns.
 */
export function demonstrateActorAccess(actor: Actor): void {
	const firstName: string = actor.elements.first_name.value;

	// `value[0]?.codename` is narrowed to one of the declared literals (or undefined when empty).
	const roleCodename: "opt1" | "opt2" | "opt3" | undefined = actor.elements.role.value[0]?.codename;

	// `relatedActors.value` holds the codenames of the referenced items.
	const firstRelatedActorCodename: string | undefined = actor.elements.relatedActors.value[0];
}

export function demonstrateMovieAccess(movie: Movie): void {
	const title: string = movie.elements.title.value;
	const rating: number | null = movie.elements.rating.value;
	const synopsis: string = movie.elements.synopsis.value;
	const genreCodename: "genre1" | "genre2" | undefined = movie.elements.genre.value[0]?.codename;
	const releaseDate: string | null = movie.elements.release_date.value;
	const displayTimezone: string | null = movie.elements.release_date.display_timezone;
	const posterUrl: string | undefined = movie.elements.poster.value[0]?.url;
	const categoryCodename: "term1" | "term2" | undefined = movie.elements.categories.value[0]?.codename;
	const urlSlug: string = movie.elements.url_slug.value;
	const customId: string | null = movie.elements.custom_id.value;
	const movieActorCodename: string | undefined = movie.elements.actors.value[0];
}
