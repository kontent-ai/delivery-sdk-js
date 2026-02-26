import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { describe, expect, test } from "vitest";
import { createDeliveryClient } from "../../../lib/client/delivery-client.js";
import type { DeliveryClientTypes } from "../../../lib/models/core.models.js";
import type { ListLanguagesPayload } from "../../../lib/queries/languages/language.models.js";

type TestDeliveryClientTypes = DeliveryClientTypes & {
	readonly languageCodenames: readonly ["en-US", "cs-CZ", "de-DE"];
};

describe("Schema validation", () => {
	const mockPayload: ListLanguagesPayload<TestDeliveryClientTypes> = {
		languages: [
			{
				system: {
					id: "1",
					codename: "de-DE",
					name: "German",
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
		const client = createDeliveryClient("x")
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

		expect(error).toBeDefined();
		expect(success).toBeFalsy();
		expect(error?.details.reason).toBe("validationFailed");
	});

	test("Response should be successful when response matches defines language codenames schema", async () => {
		const client = createDeliveryClient("x")
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

		expect(error).toBeUndefined();
		expect(success).toBeTruthy();
	});

	test("Response should be successful when response matches general string codename schema", async () => {
		const client = createDeliveryClient("x")
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

		expect(error).toBeUndefined();
		expect(success).toBeTruthy();
	});

	test("Response should be successful when an empty array is provided as codenames source", async () => {
		const client = createDeliveryClient("x")
			.withSchema({ languageCodenames: [] }) // empty array
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

		expect(error).toBeUndefined();
		expect(success).toBeTruthy();
	});
});
