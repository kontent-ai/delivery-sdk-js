import type { ContentItemOf, DeliveryClientSchema, ElementType, TaxonomyTermCodenamesOf } from "../../../lib/public_api.js";
import type { ContentItemPayloadExtended } from "../../../lib/queries/content-items/models/content-item.models.js";

export type IntegrationTestProjectSchema = DeliveryClientSchema<{
	readonly languageCodenames: readonly ["default"];
	readonly taxonomies: {
		readonly movie_type: readonly ["drama", "comedy", "sitcom", "stand_up", "action"];
	};
	readonly contentTypeCodenames: readonly ["movie", "star"];
	readonly elementCodenames: readonly [
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
		"firstname",
		"lastname",
		"custom",
	];
	readonly collectionCodenames: readonly ["default"];
	readonly workflowCodenames: readonly ["default"];
	readonly workflowStepCodenames: readonly ["published", "draft"];
}>;

export type StarElements = {
	readonly firstname: ElementType.Text;
	readonly lastname: ElementType.Text;
};

export type Star = ContentItemOf<IntegrationTestProjectSchema, "star", StarElements>;

export type MovieElements = {
	readonly title: ElementType.Text;
	readonly length_in_minutes: ElementType.Number;
	readonly description: ElementType.RichText;
	readonly is_blockbuster: ElementType.MultipleChoice<"yes">;
	readonly release_date: ElementType.DateTime;
	readonly cover: ElementType.Asset;
	readonly category: ElementType.Taxonomy;
	readonly url: ElementType.UrlSlug;
	readonly metadata__metadata_description: ElementType.Text;
	readonly cast: ElementType.LinkedItems<Star>;
};

export type Movie = ContentItemOf<IntegrationTestProjectSchema, "movie", MovieElements>;

export function isMovie(item: ContentItemPayloadExtended<IntegrationTestProjectSchema>): item is Movie {
	return item.system.type === "movie";
}

export function isStar(item: ContentItemPayloadExtended<IntegrationTestProjectSchema>): item is Star {
	return item.system.type === "star";
}

export type MovieTaxonomyTerms = TaxonomyTermCodenamesOf<IntegrationTestProjectSchema, "movie_type">;
