import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { describe, expect, test } from "vitest";
import { createDeliveryClient } from "../../../lib/client/delivery-client.js";
import type { DeliveryClientSchema } from "../../../lib/models/core.models.js";
import type { ListLanguagesPayload } from "../../../lib/queries/languages/language.models.js";
import { getFakeUuid, unitEnvironmentId } from "../../utils/test.utils.js";

describe("Valid schema validation with extra props", () => {
	const mockPayload: ListLanguagesPayload<DeliveryClientSchema> & { readonly extraProperty: string } = {
		languages: [
			{
				system: {
					id: getFakeUuid(),
					codename: "de-DE",
					name: "German",
				},
			},
		],
		extraProperty: "extra",
		pagination: {
			skip: 0,
			limit: 0,
			count: 1,
			next_page: "",
		},
	};

	test("Validation should be successful when response includes additional properties", async () => {
		const client = createDeliveryClient({
			apiMode: "public",
			environmentId: unitEnvironmentId,
			schema: {
				languageCodenames: [],
				taxonomyCodenames: [],
				contentTypeCodenames: [],
				elementCodenames: [],
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

		expect(error).toBeUndefined();
		expect(success).toBeTruthy();
	});
});
