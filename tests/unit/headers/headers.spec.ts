import { getDefaultHttpAdapter, getDefaultHttpService, getSdkIdHeader, type Header } from "@kontent-ai/core-sdk";
import { mockGlobalFetchJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getDeliveryClient } from "../../../lib/public_api.js";

describe("Delivery tracking header", async () => {
	const expectedHeader = getSdkIdHeader({
		name: "@kontent-ai/delivery-sdk",
		version: "{{version}}", // macro is replaced by the version from package.json during build
		host: "npmjs.com",
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	mockGlobalFetchJsonResponse({
		jsonResponse: {},
		statusCode: 200,
		continuationToken: "x",
	});

	let requestHeaders: readonly Header[] = [];

	await getDeliveryClient("x")
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
		.listLanguages()
		.toPromise();

	const syncTrackingHeader = requestHeaders.find((header) => header.name === expectedHeader.name);

	it("Request headers should contain sync tracking header with current package info", () => {
		expect(syncTrackingHeader?.value).toEqual(expectedHeader.value);
	});
});
