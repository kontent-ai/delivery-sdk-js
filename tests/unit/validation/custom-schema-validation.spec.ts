import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { describe, expect, it } from "vitest";
import { getDeliveryClient } from "../../../lib/client/delivery-client.js";
import { listLanguagesPayloadSchema } from "../../../lib/queries/languages/language.models.js";

describe("Custom schema validation", async () => {
	const client = getDeliveryClient<{ languageCodenames: "en-US" | "cs-CZ" }>("x", {
		languageCodenames: ["en-US", "cs-CZ"],
	})
		.publicApi()
		.create({
			responseValidation: {
				enable: true,
			},
			httpService: getTestHttpServiceWithJsonResponse({
				jsonResponse: {
					result: "invalidValue",
				},
				statusCode: 200,
			}),
		});

	const { response, success, error } = await client.listLanguages().toPromise();

	console.log(response?.payload.languages[0].system.codename);

	it("Response should be successful", () => {
		expect(success).toBeTruthy();
		expect(error).toBeUndefined();
	});

	it("Response payload should match schema", async () => {
		const { error: parseError, success: parseSuccess } = await listLanguagesPayloadSchema.safeParseAsync(response?.payload);
		expect(parseSuccess).toBeTruthy();
		expect(parseError).toBeUndefined();
	});

	it("Response should contain at least one language", () => {
		expect(response?.payload.languages.length).toBeGreaterThanOrEqual(1);
	});
});
