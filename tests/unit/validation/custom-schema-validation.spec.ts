import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { describe, expect, it } from "vitest";
import { getDeliveryClient } from "../../../lib/client/delivery-client.js";
import { listLanguagesPayloadSchema } from "../../../lib/queries/languages/language.models.js";

describe("Custom schema validation", async () => {
	const client = getDeliveryClient("x")
		.withSchema({ languageCodenames: ["en-US", "cs-CZ"] as const })
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

	const test: "en-US" | "cs-CZ" | undefined = response?.payload.languages[0].system.codename;
	void test;

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
