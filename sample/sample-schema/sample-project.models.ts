/**
 * Sample: content item models.
 *
 * Each property maps an element codename to its element model. `ContentItemOf` checks the element keys and the
 * element types against the schema. Codename generics on `MultipleChoice<...>` and `Taxonomy<...>` are TypeScript
 * hints only: the runtime schema still accepts any codename the API returns.
 */

import type { ContentItemOf, Elements, SnippetOf } from "../../lib/public_api.js";
import type { SampleProjectSchema } from "./sample-project.schema.js";

/**
 * A snippet shared by several content types.
 */
export type Metadata = SnippetOf<
	SampleProjectSchema,
	"movie" | "actor",
	{
		readonly metadata__internal_id: Elements.Text;
	}
>;

export type Actor = ContentItemOf<
	SampleProjectSchema,
	"actor",
	{
		readonly first_name: Elements.Text;
		readonly last_name: Elements.Text;
		readonly role: Elements.MultipleChoice<"opt1" | "opt2" | "opt3">;
		readonly categories: Elements.Taxonomy<"term3" | "term4", "categoryActor">;
		readonly related_actors: Elements.LinkedItems<Actor>;
	} & Metadata["elements"]
>;

/**
 * `LinkedItems<Actor>` types the resolved `items` of `actors` as `Actor`. `RichText<Actor, "movie">` types
 * the linked items and components in `items` as `Actor` and the content types of linked items (`links[].type`) as "movie".
 */
export type Movie = ContentItemOf<
	SampleProjectSchema,
	"movie",
	{
		readonly title: Elements.Text;
		readonly rating: Elements.Number;
		readonly synopsis: Elements.RichText<Actor, "movie">;
		readonly genre: Elements.MultipleChoice<"genre1" | "genre2">;
		readonly release_date: Elements.DateTime;
		readonly poster: Elements.Asset;
		readonly categories: Elements.Taxonomy<"term1" | "term2", "category">;
		readonly url_slug: Elements.UrlSlug;
		readonly custom_id: Elements.Custom;
		readonly actors: Elements.LinkedItems<Actor>;
	} & Metadata["elements"]
>;

/**
 * The union of all item models. Content item responses are typed as this union.
 */
export type SampleItem = Movie | Actor;

// @ts-expect-error "titel" is not an element codename declared for "movie" in the schema.
export type BadMovieCodename = ContentItemOf<SampleProjectSchema, "movie", { readonly titel: Elements.Text }>;

// @ts-expect-error "title" is a text element, not a number element.
export type BadMovieElementType = ContentItemOf<SampleProjectSchema, "movie", { readonly title: Elements.Number }>;

// @ts-expect-error "genre3" is not an option of the "genre" element.
export type BadMovieOption = ContentItemOf<SampleProjectSchema, "movie", { readonly genre: Elements.MultipleChoice<"genre3"> }>;

// @ts-expect-error "news" is a term of the "tag" taxonomy, but "categories" uses the "category" taxonomy.
export type BadMovieTerm = ContentItemOf<SampleProjectSchema, "movie", { readonly categories: Elements.Taxonomy<"news", "category"> }>;

// A partial shape (only some of the type's elements) is still allowed.
export type PartialMovie = ContentItemOf<SampleProjectSchema, "movie", { readonly title: Elements.Text }>;
