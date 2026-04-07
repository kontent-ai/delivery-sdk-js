import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { createDeliveryClient } from "../../lib/client/delivery-client.js";
import type { DeliveryClient } from "../../lib/models/core.models.js";

const languageCodenames = ["en-US", "cs-CZ"] as const;
const taxonomyCodenames = ["categories"] as const;

type ValidLanguageCodename = (typeof languageCodenames)[number];

const client: DeliveryClient<{
	languageCodenames: typeof languageCodenames;
	taxonomyCodenames: typeof taxonomyCodenames;
	contentTypeCodenames: string[];
	elementCodenames: string[];
	collectionCodenames: string[];
	workflowCodenames: string[];
	workflowStepCodenames: string[];
}> = createDeliveryClient({
	apiMode: "public",
	environmentId: "x",
	schema: {
		languageCodenames,
		taxonomyCodenames,
		contentTypeCodenames: [],
		elementCodenames: [],
		collectionCodenames: [],
		workflowCodenames: [],
		workflowStepCodenames: [],
	},
	responseValidation: {
		enable: false,
	},
	httpService: getTestHttpServiceWithJsonResponse({
		jsonResponse: {},
		statusCode: 200,
	}),
});

const languageResponse = await client.listLanguages().fetchPage();

// Verifies that the language codenames are assignable from the response schema
const responseLanguageCodenames: readonly ValidLanguageCodename[] = languageResponse.payload.languages.map(
	(language) => language.system.codename,
);

void responseLanguageCodenames;
