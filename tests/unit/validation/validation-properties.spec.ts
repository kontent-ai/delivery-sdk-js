import type { ErrorReason } from "@kontent-ai/core-sdk";
import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { describe, test } from "vitest";
import { ZodError } from "zod";
import { createDeliveryClient } from "../../../lib/client/delivery-client.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

describe("Response Validation", () => {
	test("returns an error when the response does not match the schema and validation is enabled", async ({ expect }) => {
		const query = createDeliveryClient({
			apiMode: "public",
			environmentId: unitEnvironmentId,
			schema: {
				languageCodenames: [],
				taxonomyCodenames: [],
				contentTypeCodenames: [],
				elementCodenames: [],
				collectionCodenames: [],
				workflowCodenames: [],
				workflowStepCodenames: [],
			},
			httpService: getTestHttpServiceWithJsonResponse({
				jsonResponse: {
					result: "invalidValue",
				},
				statusCode: 200,
			}),
			responseValidation: {
				enable: true,
			},
		}).listLanguages();

		const { success, error } = await query.fetchPageSafe();

		expect(success).toBe(false);
		expect(error).toBeDefined();
		expect(error?.details.reason).toStrictEqual<ErrorReason>("validationFailed");

		if (error?.details.reason === "validationFailed") {
			expect(error.details.url).toStrictEqual(query.inspect().data?.url);
			expect(error.details.zodError).toBeInstanceOf(ZodError);
			expect(error.details.response).toBeDefined();
		} else {
			throw new Error(`Unexpected error reason '${error?.details.reason}'`);
		}
	});

	test("returns no error when the response does not match the schema but validation is disabled", async ({ expect }) => {
		const { success, error } = await createDeliveryClient({
			apiMode: "public",
			environmentId: unitEnvironmentId,
			schema: {
				languageCodenames: [],
				taxonomyCodenames: [],
				contentTypeCodenames: [],
				elementCodenames: [],
				collectionCodenames: [],
				workflowCodenames: [],
				workflowStepCodenames: [],
			},
			httpService: getTestHttpServiceWithJsonResponse({
				jsonResponse: {
					value: "invalidValue",
				},
				statusCode: 200,
			}),
			responseValidation: {
				enable: false,
			},
		})
			.listLanguages()
			.fetchPageSafe();

		expect(success).toBe(true);
		expect(error).toBeUndefined();
	});
});
