import { type CommonHeaderNames, getDefaultHttpAdapter, getDefaultHttpService, type Header } from "@kontent-ai/core-sdk";
import { mockGlobalFetchJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createDeliveryClient } from "../../../lib/public_api.js";

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

	const query = createDeliveryClient("x")
		.withUnknownSchema()
		.publicApi()
		.create({
			httpService: getDefaultHttpService({
				adapter: {
					requestAsync: async (options) => {
						requestHeaders = options.requestHeaders ?? [];

						return await getDefaultHttpAdapter().requestAsync(options);
					},
				},
			}),
		})
		.listLanguages();

	// execute query so that http service is called and request headers are captured
	const { success, error } = await query.toPromise();

	it("Response should be successful", () => {
		expect(success).toBeTruthy();
		expect(error).toBeUndefined();
	});

	it("Request headers should NOT contain authorization header with delivery API key", () => {
		const authorizationHeader = requestHeaders.find((header) => header.name === ("Authorization" satisfies CommonHeaderNames));
		expect(authorizationHeader).toBeUndefined();
	});

	it("URL should point to public deliver API", () => {
		const { host } = new URL(query.toUrl());
		expect(host).toEqual("deliver.kontent.ai");
	});
});
