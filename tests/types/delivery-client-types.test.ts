import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { getDeliveryClient } from "../../lib/client/delivery-client.js";
import type { DeliveryClient, DeliveryClientSchema, DeliveryClientTypes } from "../../lib/models/core.models.js";

type DeliveryTypes = DeliveryClientTypes & {
	readonly languageCodenames: readonly ["en-US", "cs-CZ"];
};

const schema: DeliveryClientSchema<DeliveryTypes> = {
	languageCodenames: ["en-US", "cs-CZ"],
};

const client: DeliveryClient<DeliveryTypes> = getDeliveryClient("x")
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

const { response: languageResponse } = await client.listLanguages().toPromise();

if (!languageResponse) {
	throw new Error("Language response is undefined");
}

// Verifies that the language codenames are assignable from the response schema
const validLanguageCodenames: readonly ("en-US" | "cs-CZ")[] = languageResponse.data.languages.map((language) => language.system.codename);

// @ts-expect-error - "de-DE" is not allowed
const invalidLanguageCodename: DeliveryTypes["languageCodenames"][number] = "de-DE";

void validLanguageCodenames;
void invalidLanguageCodename;
