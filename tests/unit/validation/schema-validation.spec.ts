import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { describe, expect, test } from "vitest";
import { createDeliveryClient } from "../../../lib/client/delivery-client.js";
import type { DeliveryClientSchema } from "../../../lib/models/core.models.js";
import type { ListLanguagesPayload } from "../../../lib/queries/languages/language.models.js";
import { getFakeUuid, unitEnvironmentId } from "../../utils/test.utils.js";

describe("Schema validation", () => {
	type TestDeliveryClientTypes = DeliveryClientSchema<{
		readonly languageCodenames: readonly ["en-US", "cs-CZ", "de-DE"];
		readonly taxonomyCodenames: readonly [];
		readonly contentTypeCodenames: readonly [];
		readonly elementCodenames: readonly [];
	}>;

	const mockPayload: ListLanguagesPayload<TestDeliveryClientTypes> = {
		languages: [
			{
				system: {
					id: getFakeUuid(),
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
		const client = createDeliveryClient({
			apiMode: "public",
			environmentId: unitEnvironmentId,
			schema: { languageCodenames: ["en-US", "cs-CZ"], taxonomyCodenames: [], contentTypeCodenames: [], elementCodenames: [] },
			httpService: getTestHttpServiceWithJsonResponse({
				jsonResponse: mockPayload,
				statusCode: 200,
			}),
			responseValidation: {
				enable: true,
			},
		});

		const { success, error } = await client.listLanguages().fetchPageSafe();

		expect(error).toBeDefined();
		expect(success).toBeFalsy();
		expect(error?.details.reason).toBe("validationFailed");
	});

	test("Response should be successful when response matches defines language codenames schema", async () => {
		const client = createDeliveryClient({
			apiMode: "public",
			environmentId: unitEnvironmentId,
			schema: {
				languageCodenames: ["en-US", "cs-CZ", "de-DE"],
				taxonomyCodenames: [],
				contentTypeCodenames: [],
				elementCodenames: [],
			},
			httpService: getTestHttpServiceWithJsonResponse({
				jsonResponse: mockPayload,
				statusCode: 200,
			}),
		});

		const { success, error } = await client.listLanguages().fetchPageSafe();

		expect(error).toBeUndefined();
		expect(success).toBeTruthy();
	});

	test("Response should be successful when response matches general string codename schema", async () => {
		const client = createDeliveryClient({
			apiMode: "public",
			environmentId: unitEnvironmentId,
			schema: { languageCodenames: [], taxonomyCodenames: [], contentTypeCodenames: [], elementCodenames: [] },
			httpService: getTestHttpServiceWithJsonResponse({
				jsonResponse: mockPayload,
				statusCode: 200,
			}),
		});

		const { success, error } = await client.listLanguages().fetchPageSafe();

		expect(error).toBeUndefined();
		expect(success).toBeTruthy();
	});
});
