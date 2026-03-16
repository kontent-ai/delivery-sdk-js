import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { describe, expect, test } from "vitest";
import { createDeliveryClient } from "../../../lib/client/delivery-client.js";
import type { DeliveryClientSchema } from "../../../lib/models/core.models.js";
import type { ListLanguagesPayload } from "../../../lib/queries/languages/language.models.js";
import { getFakeUuid, unitEnvironmentId } from "../../utils/test.utils.js";

describe("Valid schema validation with missing props", () => {
	const mockPayload: Omit<ListLanguagesPayload<DeliveryClientSchema>, "pagination"> = {
		languages: [
			{
				system: {
					id: getFakeUuid(),
					codename: "de-DE",
					name: "German",
				},
			},
		],
	};

	test("Validation should fail when response is missing schema properties", async () => {
		const client = createDeliveryClient({
			apiMode: "public",
			environmentId: unitEnvironmentId,
			schema: {
				languageCodenames: [],
				taxonomyCodenames: [],
			},
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
});
