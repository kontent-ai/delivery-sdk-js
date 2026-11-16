import type {
	ContentItemOf,
	ContentItemPayloadExtended,
	DeliveryClientSchema,
	Elements,
	TaxonomyTermCodenamesOf,
} from "../../../lib/public_api.js";

export type IntegrationTestProjectSchema = DeliveryClientSchema<{
	readonly languageCodenames: readonly ["default"];
	readonly collectionCodenames: readonly ["default"];
	readonly taxonomies: {
		readonly movie_type: readonly ["drama", "comedy", "sitcom", "stand_up", "action"];
	};
	readonly workflows: {
		readonly default: readonly ["published", "draft"];
	};
	readonly contentTypes: {
		readonly movie: {
			readonly just_a_number_and_required: { readonly type: "number" };
			readonly title: { readonly type: "text" };
			readonly length_in_minutes: { readonly type: "number" };
			readonly description: { readonly type: "rich_text" };
			readonly is_blockbuster: { readonly type: "multiple_choice"; readonly options: readonly ["yes"] };
			readonly release_date: { readonly type: "date_time" };
			readonly cover: { readonly type: "asset" };
			readonly category: { readonly type: "taxonomy"; readonly taxonomyGroup: "movie_type" };
			readonly url: { readonly type: "url_slug" };
			readonly metadata__metadata_description: { readonly type: "text" };
			readonly cast: { readonly type: "modular_content" };
			readonly custom: { readonly type: "custom" };
		};
		readonly star: {
			readonly firstname: { readonly type: "text" };
			readonly lastname: { readonly type: "text" };
		};
	};
}>;

type StarElements = {
	readonly firstname: Elements.Text;
	readonly lastname: Elements.Text;
};

export type Star = ContentItemOf<IntegrationTestProjectSchema, "star", StarElements>;

type MovieElements = {
	readonly title: Elements.Text;
	readonly length_in_minutes: Elements.Number;
	readonly description: Elements.RichText;
	readonly is_blockbuster: Elements.MultipleChoice<"yes">;
	readonly release_date: Elements.DateTime;
	readonly cover: Elements.Asset;
	readonly category: Elements.Taxonomy<MovieTaxonomyTerms, "movie_type">;
	readonly url: Elements.UrlSlug;
	readonly metadata__metadata_description: Elements.Text;
	readonly cast: Elements.LinkedItems<Star>;
};

export type Movie = ContentItemOf<IntegrationTestProjectSchema, "movie", MovieElements>;

export function isMovie(item: ContentItemPayloadExtended<IntegrationTestProjectSchema>): item is Movie {
	return item.system.type === "movie";
}

export function isStar(item: ContentItemPayloadExtended<IntegrationTestProjectSchema>): item is Star {
	return item.system.type === "star";
}

export type MovieTaxonomyTerms = TaxonomyTermCodenamesOf<IntegrationTestProjectSchema, "movie_type">;
