import { AdapterAbortError, type KontentSdkError } from "@kontent-ai/core-sdk";
import { describe, expect, it } from "vitest";
import { createDeliveryClient } from "../../../lib/public_api.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

describe("Query cancellation via abortSignal", () => {
	it("rejects the in-flight query when the supplied abortSignal is aborted", async () => {
		const client = createDeliveryClient({
			apiMode: "public",
			environmentId: unitEnvironmentId,
			runtimeValidation: {
				validateResponses: false,
			},
		});

		const controller = new AbortController();
		const pendingQuery = client.listLanguages({ config: { abortSignal: controller.signal } }).fetchPageSafe();

		controller.abort();

		const { error } = await pendingQuery;
		expect(error?.details.reason).toEqual<KontentSdkError["details"]["reason"]>("aborted");

		if (error?.details.reason === "aborted") {
			expect(error.details.originalError).toBeInstanceOf(AdapterAbortError);
		}
	});
});
