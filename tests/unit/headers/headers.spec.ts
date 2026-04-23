import {
	type ContinuationTokenHeaderName,
	getDefaultHttpAdapter,
	getDefaultHttpService,
	getSdkIdHeader,
	type Header,
} from "@kontent-ai/core-sdk";
import { mockGlobalFetchJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createDeliveryClient } from "../../../lib/client/delivery-client.js";
import type { DefaultDeliveryClientSchema, WaitForLoadingNewContentHeaderName } from "../../../lib/models/core.models.js";
import type { ItemsFeedQueryRequest } from "../../../lib/queries/content-items/items-feed-query.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

async function captureRequestHeaders(listConfig?: ItemsFeedQueryRequest<DefaultDeliveryClientSchema>): Promise<readonly Header[]> {
	let captured: readonly Header[] = [];

	const client = createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
		httpService: getDefaultHttpService({
			adapter: {
				executeRequest: async (options) => {
					captured = options.requestHeaders ?? [];
					return await getDefaultHttpAdapter().executeRequest(options);
				},
			},
		}),
	});

	await client.itemsFeed(listConfig).fetchPageSafe();

	return captured;
}

describe("Delivery tracking header", async () => {
	const expectedHeader = getSdkIdHeader({
		name: "@kontent-ai/delivery-sdk",
		version: "{{version}}",
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

	const requestHeaders = await captureRequestHeaders();

	it("Request headers should contain delivery tracking header with current package info", () => {
		const syncTrackingHeader = requestHeaders.find((header) => header.name === expectedHeader.name);
		expect(syncTrackingHeader?.value).toEqual(expectedHeader.value);
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

	const requestHeaders = await captureRequestHeaders();

	it("Request headers should NOT contain bypass CDN cache header", () => {
		const bypassCdnCacheHeader = requestHeaders.find(
			(header) => header.name === ("X-KC-Wait-For-Loading-New-Content" satisfies WaitForLoadingNewContentHeaderName),
		);
		expect(bypassCdnCacheHeader).toBeUndefined();
	});
});

describe("Extra headers should be present", async () => {
	const extraHeader: Header = { name: "X-Extra-Header", value: "extra" };

	afterEach(() => {
		vi.resetAllMocks();
	});

	mockGlobalFetchJsonResponse({
		jsonResponse: {},
		statusCode: 200,
		continuationToken: "x",
	});

	const requestHeaders = await captureRequestHeaders({ config: { customHeaders: [extraHeader] } });

	it("Request headers should contain extra header", () => {
		const foundHeader = requestHeaders.find((header) => header.name === extraHeader.name);
		expect(foundHeader?.value).toEqual(extraHeader.value);
	});
});

describe("Continuation header token should be present", async () => {
	const continuationTokenValue = "x";
	const requestHeaders = await captureRequestHeaders({ headers: { "X-Continuation": continuationTokenValue } });

	it("Request headers should contain continuation token header", () => {
		const foundHeader = requestHeaders.find((header) => header.name === ("X-Continuation" satisfies ContinuationTokenHeaderName));
		expect(foundHeader?.value).toEqual(continuationTokenValue);
	});
});

describe("Continuation header token should be absent by default", async () => {
	const requestHeaders = await captureRequestHeaders();

	it("Request headers should NOT contain continuation token header", () => {
		const foundHeader = requestHeaders.find((header) => header.name === ("X-Continuation" satisfies ContinuationTokenHeaderName));
		expect(foundHeader).toBeUndefined();
	});
});
