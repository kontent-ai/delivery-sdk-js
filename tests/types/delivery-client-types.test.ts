import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { createDeliveryClient } from "../../lib/client/delivery-client.js";

const languageCodenames = ["en-US", "cs-CZ"] as const;
const taxonomyCodenames = ["categories"] as const;

type ValidLanguageCodename = (typeof languageCodenames)[number];

const client = createDeliveryClient({
	apiMode: "public",
	environmentId: "x",
	schema: {
		languageCodenames,
		taxonomyCodenames,
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
