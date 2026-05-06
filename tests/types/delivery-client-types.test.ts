import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import type z from "zod";
import { createDeliveryClient } from "../../lib/client/delivery-client.js";
import type { DeliveryClient, DeliveryClientSchema } from "../../lib/models/core.models.js";
import { type InferItemType as ContentItemOf, defineContentItem } from "../../lib/queries/content-items/content-item.models.js";
import { elementDef } from "../../lib/queries/content-items/element.models.js";

const schema = {
	languageCodenames: ["en-us", "es-es"],
	taxonomyCodenames: ["category", "tag"],
	contentTypeCodenames: ["movie", "actor"],
	elementCodenames: ["title", "first_name", "last_name"],
	collectionCodenames: ["movies", "tv-shows"],
	workflowCodenames: ["published", "draft"],
	workflowStepCodenames: ["published", "draft"],
} as const satisfies DeliveryClientSchema;

type DeliverySchema = typeof schema;

type TypedDeliveryClient = DeliveryClient<DeliverySchema>;

type ActorElements = {
	first_name: ReturnType<typeof elementDef.text>;
	last_name: ReturnType<typeof elementDef.text>;
	role: ReturnType<typeof elementDef.multipleChoice<"opt1" | "opt2" | "opt3">>;
	relatedActors: ReturnType<typeof elementDef.linkedItems<z.ZodType<ActorPayload>>>;
};

// circular reference — relatedActors items are ActorPayload itself
type ActorPayload = ContentItemOf<typeof schema, "actor", ActorElements>;

// Covers every element type in elementDef
type MovieElements = {
	title: ReturnType<typeof elementDef.text>;
	rating: ReturnType<typeof elementDef.number>;
	synopsis: typeof elementDef.richText;
	genre: ReturnType<typeof elementDef.multipleChoice<"genre1" | "genre2">>;
	release_date: typeof elementDef.dateTime;
	poster: typeof elementDef.asset;
	categories: ReturnType<typeof elementDef.taxonomy<"term1" | "term2">>;
	url_slug: typeof elementDef.urlSlug;
	custom_id: typeof elementDef.custom;
	actors: ReturnType<typeof elementDef.linkedItems<z.ZodType<ActorPayload>>>;
};

type MoviePayload = ContentItemOf<typeof schema, "movie", MovieElements>;

const actorSchema: z.ZodType<ActorPayload> = defineContentItem<typeof schema, "actor", ActorElements>(schema, "actor", {
	first_name: elementDef.text(),
	last_name: elementDef.text(),
	role: elementDef.multipleChoice({ codenames: ["opt1", "opt2", "opt3"] }),
	get relatedActors() {
		return elementDef.linkedItems([actorSchema]);
	},
});

const movieSchema: z.ZodType<MoviePayload> = defineContentItem(schema, "movie", {
	title: elementDef.text(),
	rating: elementDef.number(),
	synopsis: elementDef.richText,
	genre: elementDef.multipleChoice({ codenames: ["genre1", "genre2"] }),
	release_date: elementDef.dateTime,
	poster: elementDef.asset,
	categories: elementDef.taxonomy({ codenames: ["term1", "term2"] }),
	url_slug: elementDef.urlSlug,
	custom_id: elementDef.custom,
	actors: elementDef.linkedItems([actorSchema]),
});

void movieSchema;

const client: TypedDeliveryClient = createDeliveryClient({
	apiMode: "public",
	environmentId: "x",
	schema,
	httpService: getTestHttpServiceWithJsonResponse({
		jsonResponse: {},
		statusCode: 200,
	}),
});

const languageResponse = await client.listLanguages().fetchPage();

// Verifies that the language codenames are assignable from the response schema
const responseLanguageCodenames: readonly (typeof schema.languageCodenames)[number][] = languageResponse.payload.languages.map(
	(language) => language.system.codename,
);

void responseLanguageCodenames;

await client.fetchContentItem({ codename: "itemCodename" }).fetch();

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
const rating: number | null = movie.elements.rating.value;
const synopsis: string = movie.elements.synopsis.value;
const genreCodename: "genre1" | "genre2" | undefined = movie.elements.genre.value[0]?.codename;
const releaseDate: string | null = movie.elements.release_date.value;
const displayTimezone: string | null = movie.elements.release_date.display_timezone;
const posterUrl: string | undefined = movie.elements.poster.value[0]?.url;
const categoryCodename: "term1" | "term2" | undefined = movie.elements.categories.value[0]?.codename;
const urlSlug: string = movie.elements.url_slug.value;
const customId: string | null = movie.elements.custom_id.value;
const movieActor: ActorPayload | undefined = movie.elements.actors.items[0];

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
