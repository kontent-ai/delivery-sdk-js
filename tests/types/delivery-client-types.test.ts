import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { createDeliveryClient } from "../../lib/client/delivery-client.js";

const client = createDeliveryClient({
	apiMode: "public",
	environmentId: "x",
	schema: {
		languageCodenames: ["en-US", "cs-CZ"] as const,
		taxonomyCodenames: ["categories"] as const,
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
const validLanguageCodenames = languageResponse.payload.languages.map((language) => language.system.codename) as readonly (
	| "en-US"
	| "cs-CZ"
)[];

// @ts-expect-error - "de-DE" is not allowed
const invalidLanguageCodename: "en-US" | "cs-CZ" = "de-DE";

void validLanguageCodenames;
void invalidLanguageCodename;
