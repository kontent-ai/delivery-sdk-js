/** biome-ignore-all lint/correctness/noUnusedVariables: We don't want to use the variables in this file */
import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { getDeliveryClient } from "../../lib/client/delivery-client.js";

type OriginTypes = {
	readonly languageCodenames: "en-US" | "cs-CZ";
};

const client = getDeliveryClient<OriginTypes>("x")
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

const validLanguageCodenames: readonly OriginTypes["languageCodenames"][] = languageResponse.payload.languages.map(
	(language) => language.system.codename,
);

// @ts-expect-error - "de-DE" is not allowed
const invalidLanguageCodename: OriginTypes["languageCodenames"] = "de-DE";

void validLanguageCodenames;
void invalidLanguageCodename;
