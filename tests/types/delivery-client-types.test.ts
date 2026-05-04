import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import z from "zod";
import { createDeliveryClient } from "../../lib/client/delivery-client.js";
import type { DeliveryClient } from "../../lib/models/core.models.js";
import { type ContentItemPayload, contentItemSystemSchema, elementSchemas } from "../../lib/queries/content-items/content-item.models.js";

const schema = {
	languageCodenames: ["en-us", "es-es"],
	taxonomyCodenames: ["category", "tag"],
	contentTypeCodenames: ["movie", "actor"],
	elementCodenames: ["title", "first_name", "last_name"],
	collectionCodenames: ["movies", "tv-shows"],
	workflowCodenames: ["published", "draft"],
	workflowStepCodenames: ["published", "draft"],
} as const;

type DeliverySchema = typeof schema;

type TypedDeliveryClient = DeliveryClient<DeliverySchema>;

const actorSchema = z
	.object({
		system: contentItemSystemSchema(schema),
		elements: z
			.object({
				first_name: elementSchemas.text,
				last_name: elementSchemas.text,
				role: elementSchemas.multipleChoice(["hero", "villain", "sidekick"]),
				category: elementSchemas.taxonomy(["action_film", "drama", "comedy"]),
			})
			.readonly(),
	})
	.readonly();

type Actor = z.infer<typeof actorSchema>;

function isActor(item: ContentItemPayload<DeliverySchema>): item is Actor {
	return actorSchema.safeParse(item).success;
}

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

const { payload } = await client
	.fetchContentItem({
		codename: "itemCodename",
	})
	.fetch();

if (isActor(payload.item)) {
	const firstName: string = payload.item.elements.first_name.value;
	const lastName: string = payload.item.elements.last_name.value;
	const roleCodename: undefined | "hero" | "villain" | "sidekick" = payload.item.elements.role.value[0]?.codename;
	const categoryCodename: undefined | "action_film" | "drama" | "comedy" = payload.item.elements.category.value[0]?.codename;

	void firstName;
	void lastName;
	void roleCodename;
	void categoryCodename;
}

void responseLanguageCodenames;
