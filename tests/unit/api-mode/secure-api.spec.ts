import { type CommonHeaderNames, getDefaultHttpAdapter, getDefaultHttpService, type Header } from "@kontent-ai/core-sdk";
import { mockGlobalFetchJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createDeliveryClient } from "../../../lib/public_api.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

describe("Secure API", async () => {
	afterEach(() => {
		vi.resetAllMocks();
	});

	mockGlobalFetchJsonResponse({
		jsonResponse: {},
		statusCode: 200,
		continuationToken: "x",
	});

	let requestHeaders: readonly Header[] = [];
	const secureApiKey = "y";

	const query = createDeliveryClient({
		apiMode: "secure",
		environmentId: unitEnvironmentId,
		deliveryApiKey: secureApiKey,
		httpService: getDefaultHttpService({
			adapter: {
				executeRequest: async (options) => {
					requestHeaders = options.requestHeaders ?? [];

					return await getDefaultHttpAdapter().executeRequest(options);
				},
			},
		}),
	}).listLanguages();

	// execute query so that http service is called and request headers are captured
	const { success, error, response } = await query.fetchPageSafe();

	it("Response should be successful", () => {
		expect(success).toBeTruthy();
		expect(error).toBeUndefined();
	});

	it("Request headers should contain authorization header with secure API key", () => {
		const authorizationHeader = requestHeaders.find((header) => header.name === ("Authorization" satisfies CommonHeaderNames));
		expect(authorizationHeader?.value).toEqual(`Bearer ${secureApiKey}`);
	});

	it("URL should point to secure API", () => {
		const { host } = new URL(response?.meta?.url ?? "n/a");
		expect(host).toEqual("deliver.kontent.ai");
	});
});
