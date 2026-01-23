import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { describe, expect, test } from "vitest";
import { getDeliveryClient } from "../../../lib/client/delivery-client.js";
import type { ListLanguagesPayload } from "../../../lib/queries/languages/language.models.js";

type AllLanguageCodenames = "en-US" | "cs-CZ" | "de-DE";

describe("Schema validation", () => {
	const mockPayload: ListLanguagesPayload<AllLanguageCodenames> = {
		languages: [
			{
				system: {
					id: "1",
					codename: "de-DE",
				},
			},
		],
		pagination: {
			skip: 0,
			limit: 0,
			count: 1,
			next_page: "",
		},
	};

	test("Response should NOT be successful when response does not match defined language codenames schema", async () => {
		const client = getDeliveryClient("x")
			.withSchema({ languageCodenames: ["en-US", "cs-CZ"] }) // does not include "de-DE"
			.publicApi()
			.create({
				responseValidation: {
					enable: true,
				},
				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse: mockPayload,
					statusCode: 200,
				}),
			});

		const { success, error } = await client.listLanguages().toPromise();

		expect(success).toBeFalsy();
		expect(error).toBeDefined();
		expect(error?.details.reason).toBe("validationFailed");
	});

	test("Response should be successful when response matches defines language codenames schema", async () => {
		const client = getDeliveryClient("x")
			.withSchema({ languageCodenames: ["en-US", "cs-CZ", "de-DE"] }) // includes all allowed codenames
			.publicApi()
			.create({
				responseValidation: {
					enable: true,
				},
				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse: mockPayload,
					statusCode: 200,
				}),
			});

		const { success, error } = await client.listLanguages().toPromise();

		expect(success).toBeTruthy();
		expect(error).toBeUndefined();
	});

	test("Response should be successful when response matches general string codename schema", async () => {
		const client = getDeliveryClient("x")
			.withUnknownSchema() // should use general string for validation
			.publicApi()
			.create({
				responseValidation: {
					enable: true,
				},
				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse: mockPayload,
					statusCode: 200,
				}),
			});

		const { success, error } = await client.listLanguages().toPromise();

		expect(success).toBeTruthy();
		expect(error).toBeUndefined();
	});
});
