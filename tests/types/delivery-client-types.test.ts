import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { createDeliveryClient } from "../../lib/client/delivery-client.js";
import type { DeliveryClient, DeliveryClientSchema, DeliveryClientTypes } from "../../lib/models/core.models.js";

type DeliveryTypes = DeliveryClientTypes & {
	readonly languageCodenames: readonly ["en-US", "cs-CZ"];
};

const schema: DeliveryClientSchema<DeliveryTypes> = {
	languageCodenames: ["en-US", "cs-CZ"],
};

const client: DeliveryClient<DeliveryTypes> = createDeliveryClient("x")
	.withSchema(schema)
	.publicApi()
	.create({
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
const validLanguageCodenames: readonly ("en-US" | "cs-CZ")[] = languageResponse.payload.languages.map(
	(language) => language.system.codename,
);

// @ts-expect-error - "de-DE" is not allowed
const invalidLanguageCodename: DeliveryTypes["languageCodenames"][number] = "de-DE";

void validLanguageCodenames;
void invalidLanguageCodename;
