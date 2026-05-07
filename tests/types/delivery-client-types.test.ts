import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import type z from "zod";
import { createDeliveryClient } from "../../lib/client/delivery-client.js";
import type { DeliveryClient, DeliveryClientSchema } from "../../lib/models/core.models.js";
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
	first_name: ReturnType<typeof elementDef.optional.text>;
	last_name: ReturnType<typeof elementDef.optional.text>;
	role: ReturnType<typeof elementDef.optional.multipleChoice<"opt1" | "opt2" | "opt3">>;
	relatedActors: ReturnType<typeof elementDef.optional.linkedItems<z.ZodType<ActorPayload>>>;
};

// circular reference — relatedActors items are ActorPayload itself
type ActorPayload = ContentItemOf<TypedSchema, "actor", ActorElements>;

// Mixes required and optional element factories to verify both branches of elementDef.
// Required factories drop nullability on scalar values (number/dateTime/custom),
// optional factories preserve it.
type MovieElements = {
	title: ReturnType<typeof elementDef.required.text>;
	rating: ReturnType<typeof elementDef.required.number>;
	synopsis: ReturnType<typeof elementDef.optional.richText>;
	genre: ReturnType<typeof elementDef.required.multipleChoice<"genre1" | "genre2">>;
	release_date: ReturnType<typeof elementDef.required.dateTime>;
	poster: ReturnType<typeof elementDef.required.asset>;
	categories: ReturnType<typeof elementDef.required.taxonomy<"term1" | "term2">>;
	url_slug: ReturnType<typeof elementDef.required.urlSlug>;
	custom_id: ReturnType<typeof elementDef.required.custom>;
	actors: ReturnType<typeof elementDef.required.linkedItems<z.ZodType<ActorPayload>>>;
};

type MoviePayload = ContentItemOf<TypedSchema, "movie", MovieElements>;

const actorSchema: z.ZodType<ActorPayload> = defineContentItem<TypedSchema, "actor", ActorElements>("actor", {
	first_name: elementDef.optional.text(),
	last_name: elementDef.optional.text(),
	role: elementDef.optional.multipleChoice({ codenames: ["opt1", "opt2", "opt3"] }),
	get relatedActors() {
		return elementDef.optional.linkedItems([actorSchema]);
	},
});

const movieSchema: z.ZodType<MoviePayload> = defineContentItem<TypedSchema, "movie", MovieElements>("movie", {
	title: elementDef.required.text(),
	rating: elementDef.required.number(),
	synopsis: elementDef.optional.richText(),
	genre: elementDef.required.multipleChoice({ codenames: ["genre1", "genre2"] }),
	release_date: elementDef.required.dateTime(),
	poster: elementDef.required.asset(),
	categories: elementDef.required.taxonomy({ codenames: ["term1", "term2"] }),
	url_slug: elementDef.required.urlSlug(),
	custom_id: elementDef.required.custom(),
	actors: elementDef.required.linkedItems([actorSchema]),
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
const firstRelatedActor: ActorPayload | undefined = actor.elements.relatedActors.items[0];

void firstName;
void roleCodename;
void firstRelatedActor;

declare const movie: MoviePayload;

const title: string = movie.elements.title.value;
const rating: number = movie.elements.rating.value;
const synopsis: string = movie.elements.synopsis.value;
const genreCodename: "genre1" | "genre2" = movie.elements.genre.value[0].codename;
const releaseDate: string = movie.elements.release_date.value;
const displayTimezone: string | null = movie.elements.release_date.display_timezone;
const posterUrl: string = movie.elements.poster.value[0].url;
const categoryCodename: "term1" | "term2" = movie.elements.categories.value[0].codename;
const urlSlug: string = movie.elements.url_slug.value;
const customId: string = movie.elements.custom_id.value;
const movieActor: ActorPayload = movie.elements.actors.items[0];

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
void movieActor;
