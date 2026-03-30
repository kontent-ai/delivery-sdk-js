import { type CommonHeaderNames, getDefaultHttpAdapter, getDefaultHttpService, type Header } from "@kontent-ai/core-sdk";
import { mockGlobalFetchJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createDeliveryClient } from "../../../lib/public_api.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

describe("Public deliver API", async () => {
	afterEach(() => {
		vi.resetAllMocks();
	});

	mockGlobalFetchJsonResponse({
		jsonResponse: {},
		statusCode: 200,
		continuationToken: "x",
	});

	let requestHeaders: readonly Header[] = [];

	const query = createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
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

	it("Request headers should NOT contain authorization header with delivery API key", () => {
		const authorizationHeader = requestHeaders.find((header) => header.name === ("Authorization" satisfies CommonHeaderNames));
		expect(authorizationHeader).toBeUndefined();
	});

	it("URL should point to public deliver API", () => {
		const { host } = new URL(response?.meta?.url ?? "n/a");
		expect(host).toEqual("deliver.kontent.ai");
	});
});
