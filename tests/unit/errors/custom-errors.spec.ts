import { type ErrorReason, getDefaultHttpService } from "@kontent-ai/core-sdk";
import { describe, expect, it } from "vitest";
import { createDeliveryClient } from "../../../lib/public_api.js";

class CustomError extends Error {}

describe("Handling of custom errors", async () => {
	const { success, error } = await createDeliveryClient("x")
		.withUnknownSchema()
		.publicApi()
		.create({
			responseValidation: {
				enable: true,
			},
			httpService: getDefaultHttpService({
				adapter: {
					requestAsync: () => {
						throw new CustomError();
					},
				},
			}),
		})
		.listLanguages()
		.toPromise();

	it("Success should be false", () => {
		expect(success).toBe(false);
	});

	it("Error should be unknown", () => {
		expect(error?.details.reason).toBe<ErrorReason>("unknown");
	});

	it("Original error should be propagated and be of proper type", () => {
		if (error?.details.reason === "unknown") {
			expect(error.details.originalError).toBeInstanceOf(CustomError);
		} else {
			throw new Error("Error should be unknown");
		}
	});
});
