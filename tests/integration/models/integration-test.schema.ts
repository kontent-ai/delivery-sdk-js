import type { ContentItemOf, DeliveryClientSchema, Elements, TaxonomyTermCodenamesOf } from "../../../lib/public_api.js";
import type { ContentItemPayloadExtended } from "../../../lib/queries/content-items/models/content-item.models.js";

export type IntegrationTestProjectSchema = DeliveryClientSchema<{
	readonly languageCodenames: readonly ["default"];
	readonly taxonomies: {
		readonly movie_type: readonly ["drama", "comedy", "sitcom", "stand_up", "action"];
	};
	readonly contentTypes: {
		readonly movie: readonly [
			"title",
			"length_in_minutes",
			"description",
			"is_blockbuster",
			"release_date",
			"cover",
			"category",
			"url",
			"metadata__metadata_description",
			"cast",
			"custom",
		];
		readonly star: readonly ["firstname", "lastname"];
	};
	readonly collectionCodenames: readonly ["default"];
	readonly workflowCodenames: readonly ["default"];
	readonly workflowStepCodenames: readonly ["published", "draft"];
}>;

export type StarElements = {
	readonly firstname: Elements.Text;
	readonly lastname: Elements.Text;
};

export type Star = ContentItemOf<IntegrationTestProjectSchema, "star", StarElements>;

export type MovieElements = {
	readonly title: Elements.Text;
	readonly length_in_minutes: Elements.Number;
	readonly description: Elements.RichText;
	readonly is_blockbuster: Elements.MultipleChoice<"yes">;
	readonly release_date: Elements.DateTime;
	readonly cover: Elements.Asset;
	readonly category: Elements.Taxonomy;
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
