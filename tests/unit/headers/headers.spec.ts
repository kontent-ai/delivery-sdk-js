import { getDefaultHttpAdapter, getDefaultHttpService, getSdkIdHeader, type Header } from "@kontent-ai/core-sdk";
import { mockGlobalFetchJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createDeliveryClient } from "../../../lib/public_api.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

const waitingForLoadingNewContentHeader: Header = { name: "X-KC-Wait-For-Loading-New-Content", value: "true" };

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
	await query.fetchPageSafe();

	const syncTrackingHeader = requestHeaders.find((header) => header.name === expectedHeader.name);

	it("Request headers should contain sync tracking header with current package info", () => {
		expect(syncTrackingHeader?.value).toEqual(expectedHeader.value);
	});
});

describe("Bypass CDN cache header should be present when bypassCdnCache is true", async () => {
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
	}).listLanguages({
		config: {
			bypassCdnCache: true,
		},
	});

	// execute query so that http service is called and request headers are captured
	await query.fetchPageSafe();

	it("Request headers should contain bypass CDN cache header", () => {
		const bypassCdnCacheHeader = requestHeaders.find((header) => header.name === waitingForLoadingNewContentHeader.name);
		expect(bypassCdnCacheHeader?.value).toEqual(waitingForLoadingNewContentHeader.value);
	});
});

describe("Bypass CDN cache header should be absent by default", async () => {
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
	await query.fetchPageSafe();

	it("Request headers should NOT contain bypass CDN cache header", () => {
		const bypassCdnCacheHeader = requestHeaders.find((header) => header.name === waitingForLoadingNewContentHeader.name);
		expect(bypassCdnCacheHeader).toBeUndefined();
	});
});
