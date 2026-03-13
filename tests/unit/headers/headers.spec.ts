import { getDefaultHttpAdapter, getDefaultHttpService, getSdkIdHeader, type Header } from "@kontent-ai/core-sdk";
import { mockGlobalFetchJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createDeliveryClient } from "../../../lib/public_api.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

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

	const query = createDeliveryClient(unitEnvironmentId)
		.withUnknownSchema()
		.publicApi()
		.create({
			httpService: getDefaultHttpService({
				adapter: {
					executeRequest: async (options) => {
						requestHeaders = options.requestHeaders ?? [];

						return await getDefaultHttpAdapter().executeRequest(options);
					},
				},
			}),
		})
		.listLanguages();

	// execute query so that http service is called and request headers are captured
	const { success, error } = await query.fetchPageSafe();

	it("Response should be successful", () => {
		expect(success).toBeTruthy();
		expect(error).toBeUndefined();
	});

	const syncTrackingHeader = requestHeaders.find((header) => header.name === expectedHeader.name);

	it("Request headers should contain sync tracking header with current package info", () => {
		expect(syncTrackingHeader?.value).toEqual(expectedHeader.value);
	});
});
