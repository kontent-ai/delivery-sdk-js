import type { ErrorReason } from "@kontent-ai/core-sdk";
import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { describe, test } from "vitest";
import { ZodError } from "zod";
import { createDeliveryClient } from "../../../lib/client/delivery-client.js";

describe("Response validation", () => {
	test("Error should be returned when response does not match schema and validation is enabled", async ({ expect }) => {
		const query = createDeliveryClient("x")
			.withUnknownSchema()
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
			})
			.listLanguages();

		const { success, error } = await query.toPromise();

		expect(success).toBe(false);
		expect(error).toBeDefined();
		expect(error?.details.reason).toStrictEqual<ErrorReason>("validationFailed");

		if (error?.details.reason === "validationFailed") {
			expect(error.details.url).toStrictEqual(query.toUrl());
			expect(error.details.zodError).toBeInstanceOf(ZodError);
			expect(error.details.message).toBeDefined();
			expect(error.details.response).toBeDefined();
		} else {
			throw new Error(`Unexpected error reason '${error?.details.reason}'`);
		}
	});

	test("Error should not be returned when response does not match schema but validation is disabled", async ({ expect }) => {
		const { success, error } = await createDeliveryClient("x")
			.withUnknownSchema()
			.publicApi()
			.create({
				responseValidation: {
					enable: false,
				},

				httpService: getTestHttpServiceWithJsonResponse({
					jsonResponse: {
						value: "invalidValue",
					},
					statusCode: 200,
				}),
			})
			.listLanguages()
			.toPromise();

		expect(success).toBe(true);
		expect(error).toBeUndefined();
	});
});
