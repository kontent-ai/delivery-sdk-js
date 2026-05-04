import { type ErrorReason, getDefaultHttpService } from "@kontent-ai/core-sdk";
import { describe, expect, it } from "vitest";
import { createDeliveryClient } from "../../../lib/public_api.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

class CustomError extends Error {}

describe("Custom Error Handling", async () => {
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
	})
		.listLanguages()
		.fetchPageSafe();

	it("returns a failed response", () => {
		expect(success).toBe(false);
	});

	it("sets the error reason to adapterError", () => {
		expect(error?.details.reason).toBe<ErrorReason>("adapterError");
	});

	it("propagates the original error as a CustomError instance", () => {
		if (error?.details.reason === "adapterError") {
			expect(error.details.originalError).toBeInstanceOf(CustomError);
		} else {
			throw new Error("Error should be unknown");
		}
	});
});
