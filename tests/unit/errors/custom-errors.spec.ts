import { type ErrorReason, getDefaultHttpService } from "@kontent-ai/core-sdk";
import { describe, expect, it } from "vitest";
import { createDeliveryClient } from "../../../lib/public_api.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

class CustomError extends Error {}

describe("Handling of custom errors", async () => {
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
		httpService: getDefaultHttpService({
			adapter: {
				executeRequest: () => {
					throw new CustomError();
				},
			},
		}),
		responseValidation: {
			enable: true,
		},
	})
		.listLanguages()
		.fetchPageSafe();

	it("Success should be false", () => {
		expect(success).toBe(false);
	});

	it("Error should be adapterError", () => {
		expect(error?.details.reason).toBe<ErrorReason>("adapterError");
	});

	it("Original error should be propagated and be of proper type", () => {
		if (error?.details.reason === "adapterError") {
			expect(error.details.originalError).toBeInstanceOf(CustomError);
		} else {
			throw new Error("Error should be unknown");
		}
	});
});
