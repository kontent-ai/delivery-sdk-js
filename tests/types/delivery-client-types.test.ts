import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import type z from "zod";
import { createDeliveryClient } from "../../lib/client/delivery-client.js";
import type { DeliveryClient, DeliveryClientSchema, ElementType } from "../../lib/public_api.js";
import { type InferItemType as ContentItemOf, defineContentItem } from "../../lib/queries/content-items/content-item.models.js";
import { elementDef } from "../../lib/queries/content-items/element.models.js";

type TypedSchema = DeliveryClientSchema<{
	readonly languageCodenames: readonly ["en-us", "es-es"];
	readonly taxonomyCodenames: readonly ["category", "tag"];
	readonly contentTypeCodenames: readonly ["movie", "actor"];
	readonly elementCodenames: readonly ["title", "first_name", "last_name"];
	readonly collectionCodenames: readonly ["movies", "tv-shows"];
	readonly workflowCodenames: readonly ["published", "draft"];
	readonly workflowStepCodenames: readonly ["published", "draft"];
}>;

type TypedDeliveryClient = DeliveryClient<TypedSchema>;

type ActorElements = {
	first_name: ElementType.Text;
	last_name: ElementType.Text;
	role: ElementType.MultipleChoice<"opt1" | "opt2" | "opt3">;
	relatedActors: ElementType.LinkedItems;
};

type ActorPayload = ContentItemOf<TypedSchema, "actor", ActorElements>;

type MovieElements = {
	title: ElementType.Text;
	rating: ElementType.Number;
	synopsis: ElementType.RichText;
	genre: ElementType.MultipleChoice<"genre1" | "genre2">;
	release_date: ElementType.DateTime;
	poster: ElementType.Asset;
	categories: ElementType.Taxonomy<"term1" | "term2">;
	url_slug: ElementType.UrlSlug;
	custom_id: ElementType.Custom;
	actors: ElementType.LinkedItems;
};

type MoviePayload = ContentItemOf<TypedSchema, "movie", MovieElements>;

const actorSchema: z.ZodType<ActorPayload> = defineContentItem<TypedSchema, "actor", ActorElements>("actor", {
	first_name: elementDef.text,
	last_name: elementDef.text,
	role: elementDef.multipleChoice<"opt1" | "opt2" | "opt3">(),
	relatedActors: elementDef.linkedItems,
});

void actorSchema;

const movieSchema: z.ZodType<MoviePayload> = defineContentItem<TypedSchema, "movie", MovieElements>("movie", {
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

void movieSchema;

const client: TypedDeliveryClient = createDeliveryClient<TypedSchema>({
	apiMode: "public",
	environmentId: "x",
	httpService: getTestHttpServiceWithJsonResponse({
		jsonResponse: {},
		statusCode: 200,
	}),
});

const languageResponse = await client.listLanguages().fetchPage();

// Verifies that the language codenames are assignable from the response schema
const responseLanguageCodenames: readonly TypedSchema["languageCodenames"][number][] = languageResponse.payload.languages.map(
	(language) => language.system.codename,
);

void responseLanguageCodenames;

const item = await client.fetchContentItem({ codename: "itemCodename" }).fetch();
void item;

// Type showcase — compile-time verification of typed element access
declare const actor: ActorPayload;

const firstName: string = actor.elements.first_name.value;
const roleCodename: "opt1" | "opt2" | "opt3" | undefined = actor.elements.role.value[0]?.codename;
const firstRelatedActorCodename: string | undefined = actor.elements.relatedActors.value[0];

void firstName;
void roleCodename;
void firstRelatedActorCodename;

declare const movie: MoviePayload;

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

void title;
void rating;
void synopsis;
void genreCodename;
void releaseDate;
void displayTimezone;
void posterUrl;
void categoryCodename;
void urlSlug;
void customId;
void movieActorCodename;
