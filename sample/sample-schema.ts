/** biome-ignore-all lint/correctness/noUnusedVariables: Disabled for clarity of the sample  */
/**
 * Sample: defining a strongly typed Kontent.ai delivery model.
 *
 * Top to bottom:
 *  1. Declare your project's codename schema.
 *  2. Define content-type element shapes and their payload types.
 *  4. Create a typed delivery client.
 *  5. See how response values narrow at the call site.
 *
 * In a real consumer project, imports below would come from
 * `@kontent-ai/delivery-sdk`. This sample lives in the SDK repo,
 * so it imports from the in-tree source instead.
 */

import type { QueryResponse } from "@kontent-ai/core-sdk";
import { createDeliveryClient } from "../lib/client/delivery-client.js";
import type { DeliveryMetadata } from "../lib/models/core.models.js";
import type {
	ContentItemOf,
	ContentItemPayload,
	DeliveryClient,
	DeliveryClientSchema,
	ElementCodenamesOf,
	ElementType,
	FetchContentItemResponse,
	TaxonomyPayload,
} from "../lib/public_api.js";

/**
 * 1. Schema declaration
 *
 * `DeliveryClientSchema` lists every codename your project uses so queries,
 * payloads, and element accessors are checked against it.
 *
 * `contentTypes` is a map: each key is a content type codename, and its value
 * lists that type's element codenames. Elements therefore belong to a type,
 * which lets single-type queries narrow elements to the queried type (see
 * `typedContentTypeElement` below). `taxonomies` follows the same shape, with
 * each taxonomy mapping to its term codenames.
 */
export type SampleProjectSchema = DeliveryClientSchema<{
	readonly languageCodenames: readonly ["en-us", "es-es"];
	readonly taxonomies: {
		readonly category: readonly ["term1", "term2"];
		readonly tag: readonly ["news", "featured"];
	};
	readonly contentTypes: {
		readonly movie: readonly [
			"title",
			"rating",
			"synopsis",
			"genre",
			"release_date",
			"poster",
			"categories",
			"url_slug",
			"custom_id",
			"actors",
		];
		readonly actor: readonly ["first_name", "last_name", "role", "relatedActors"];
	};
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
	readonly relatedActors: ElementType.LinkedItems<Actor>;
};

// Fully-typed Actor item payload (system metadata + elements).
export type Actor = ContentItemOf<SampleProjectSchema, "actor", ActorElements>;

/**
 * 3. Content type: Movie
 *
 * Movie exercises every element type the SDK supports. `LinkedItems<Actor>`
 * tells the SDK that the resolved `items[i]` of `actors` should be typed as
 * `Actor`, so consumers get full element narrowing on referenced items.
 */
export type MovieElements = {
	readonly title: ElementType.Text;
	readonly rating: ElementType.Number;
	readonly synopsis: ElementType.RichText<Actor>;
	readonly genre: ElementType.MultipleChoice<"genre1" | "genre2">;
	readonly release_date: ElementType.DateTime;
	readonly poster: ElementType.Asset;
	readonly categories: ElementType.Taxonomy<"term1" | "term2">;
	readonly url_slug: ElementType.UrlSlug;
	readonly custom_id: ElementType.Custom;
	readonly actors: ElementType.LinkedItems<Actor>;
};

// Fully-typed Movie item payload.
export type Movie = ContentItemOf<SampleProjectSchema, "movie", MovieElements>;

/**
 * The element shape is validated against the schema: every key must be an element codename declared
 * for the content type. You may type a subset of the type's elements, but unknown codenames are rejected.
 */
// @ts-expect-error "titel" is not an element codename declared for "movie" in the schema.
export type BadMovie = ContentItemOf<SampleProjectSchema, "movie", { readonly titel: ElementType.Text }>;

// A partial shape (only some of the type's elements) is still allowed.
export type PartialMovie = ContentItemOf<SampleProjectSchema, "movie", { readonly title: ElementType.Text }>;

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
export async function queries(): Promise<void> {
	const languageResponse = await client.listLanguages().fetchPage();

	// Languages are typed to the schema codenames.
	const responseLanguageCodenames: readonly ("en-us" | "es-es")[] = languageResponse.payload.languages.map(
		(language) => language.system.codename,
	);

	// `fetchContentItem` returns a fully typed item payload. Annotate it with `FetchContentItemResponse`
	// instead of hand-assembling the response type from `@kontent-ai/core-sdk`.
	const response: FetchContentItemResponse<SampleProjectSchema> = await client.fetchContentItem({ codename: "itemCodename" }).fetch();

	const movieItem = response.payload.item;
	if (isMovie(movieItem)) {
		const title: string = movieItem.elements.title.value;
		const releaseDate: string | null = movieItem.elements.release_date.value;
		const actors: readonly Actor[] = movieItem.elements.actors.items;
	}
}

/**
 * 6. Demonstration: element value narrowing
 *
 * Annotations below are the types the SDK gives you at compile time. They
 * produce a compile error if the public types drift. Narrowed codenames are
 * TypeScript hints; the runtime value can be any string the API returns.
 */
export function typedActor(actor: Actor): void {
	const firstName: string = actor.elements.first_name.value;

	// `value[0]?.codename` is narrowed to one of the declared literals (or undefined when empty).
	const roleCodename: "opt1" | "opt2" | "opt3" | undefined = actor.elements.role.value[0]?.codename;

	// `relatedActors.value` holds the codenames of the referenced items.
	const firstRelatedActorCodename: string | undefined = actor.elements.relatedActors.value[0];
}

export function typedMovie(movie: Movie): void {
	const title: string = movie.elements.title.value;
	const rating: number | null = movie.elements.rating.value;
	const synopsis: string = movie.elements.synopsis.value;
	const synopsisActors: readonly Actor[] = movie.elements.synopsis.items;
	const genreCodename: "genre1" | "genre2" | undefined = movie.elements.genre.value[0]?.codename;
	const releaseDate: string | null = movie.elements.release_date.value;
	const displayTimezone: string | null = movie.elements.release_date.display_timezone;
	const posterUrl: string | undefined = movie.elements.poster.value[0]?.url;
	const categoryCodename: "term1" | "term2" | undefined = movie.elements.categories.value[0]?.codename;
	const urlSlug: string = movie.elements.url_slug.value;
	const customId: string | null = movie.elements.custom_id.value;
	const movieActorCodename: string | undefined = movie.elements.actors.value[0];
	const firstMovieActor: Actor | undefined = movie.elements.actors.items[0];
	const actors: readonly Actor[] = movie.elements.actors.items;
}

export async function typedTaxonomy(): Promise<void> {
	const categoryTaxonomy: QueryResponse<TaxonomyPayload<SampleProjectSchema, "term1" | "term2">, DeliveryMetadata> = await client
		.fetchTaxonomy({ codename: "category" })
		.fetch();

	// Term codenames are narrowed to the terms declared for the "category" taxonomy in the schema.
	const termCodename: "term1" | "term2" | undefined = categoryTaxonomy.payload.terms[0]?.codename;

	// Narrowing applies at every nesting level (the term tree shares one flat codename union).
	const nestedTermCodename: "term1" | "term2" | undefined = categoryTaxonomy.payload.terms[0]?.terms[0]?.codename;

	// A different taxonomy narrows to its own terms.
	const tagTaxonomy = await client.fetchTaxonomy({ codename: "tag" }).fetch();
	const tagCodename: "news" | "featured" | undefined = tagTaxonomy.payload.terms[0]?.codename;
}

/**
 * 7. Demonstration: per-content-type element codenames
 *
 * Because elements live under their content type in the schema, single-type
 * queries narrow element codenames to the queried type — exactly how
 * `fetchTaxonomy` narrows term codenames to the queried taxonomy.
 */
export async function typedContentTypeElement(): Promise<void> {
	// `elementCodename` is narrowed to the elements declared for the "movie" type.
	await client.fetchContentTypeElement({ typeCodename: "movie", elementCodename: "title" }).fetch();

	// A different type narrows to its own elements.
	await client.fetchContentTypeElement({ typeCodename: "actor", elementCodename: "first_name" }).fetch();

	// @ts-expect-error "first_name" belongs to "actor", not "movie".
	await client.fetchContentTypeElement({ typeCodename: "movie", elementCodename: "first_name" }).fetch();

	// `fetchContentType` narrows its element selection to the queried type too.
	await client.fetchContentType({ codename: "movie", query: { elements: ["title", "rating"] } }).fetch();

	// The element codenames of a single type can be derived directly from the schema.
	const movieElement: ElementCodenamesOf<SampleProjectSchema, "movie"> = "synopsis";
}

function isMovie(item: ContentItemPayload<SampleProjectSchema>): item is Movie {
	return item.system.codename === ("movie" as keyof SampleProjectSchema["contentTypes"]);
}
