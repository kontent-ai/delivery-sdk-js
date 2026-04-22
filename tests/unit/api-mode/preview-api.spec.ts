import { getDefaultHttpAdapter, getDefaultHttpService, type Header, type KnownHeaderName } from "@kontent-ai/core-sdk";
import { mockGlobalFetchJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createDeliveryClient } from "../../../lib/public_api.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

describe("Preview API", async () => {
	afterEach(() => {
		vi.resetAllMocks();
	});

	mockGlobalFetchJsonResponse({
		jsonResponse: {},
		statusCode: 200,
		continuationToken: "x",
	});

	let requestHeaders: readonly Header[] = [];
	const previewApiKey = "y";

	const query = createDeliveryClient({
		apiMode: "preview",
		environmentId: unitEnvironmentId,
		deliveryApiKey: previewApiKey,
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

	it("Request headers should contain authorization header with delivery API key", () => {
		const authorizationHeader = requestHeaders.find((header) => header.name === ("Authorization" satisfies KnownHeaderName));
		expect(authorizationHeader?.value).toEqual(`Bearer ${previewApiKey}`);
	});

	it("URL should point to preview API", () => {
		const { host } = new URL(response?.meta?.url ?? "n/a");
		expect(host).toEqual("preview-deliver.kontent.ai");
	});
});
