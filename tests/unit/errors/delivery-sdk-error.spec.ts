import { getDefaultHttpService } from "@kontent-ai/core-sdk";
import { describe, expect, it } from "vitest";
import { DeliverySdkError } from "../../../lib/models/error.models.js";
import { createDeliveryClient } from "../../../lib/public_api.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

describe("DeliverySdkError", async () => {
	const { error } = await createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
		httpService: getDefaultHttpService({
			adapter: {
				executeRequest: () => {
					throw new Error("Simulated failure");
				},
			},
		}),
	})
		.listLanguages()
		.fetchPageSafe();

	it("error returned from a failed query should be an instance of DeliverySdkError", () => {
		expect(error).toBeInstanceOf(DeliverySdkError);
	});
});
