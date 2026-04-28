import {
	type ContinuationTokenHeaderName,
	createSdkIdHeader,
	getDefaultHttpAdapter,
	getDefaultHttpService,
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
	const expectedHeader = createSdkIdHeader({
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

	it("includes the delivery tracking header with current package info", () => {
		const syncTrackingHeader = requestHeaders.find((header) => header.name === expectedHeader.name);
		expect(syncTrackingHeader?.value).toEqual(expectedHeader.value);
	});
});

describe("Bypass CDN Cache Header", async () => {
	afterEach(() => {
		vi.resetAllMocks();
	});

	mockGlobalFetchJsonResponse({
		jsonResponse: {},
		statusCode: 200,
		continuationToken: "x",
	});

	const requestHeaders = await captureRequestHeaders();

	it("is absent by default", () => {
		const bypassCdnCacheHeader = requestHeaders.find(
			(header) => header.name === ("X-KC-Wait-For-Loading-New-Content" satisfies WaitForLoadingNewContentHeaderName),
		);
		expect(bypassCdnCacheHeader).toBeUndefined();
	});
});

describe("Extra Request Headers", async () => {
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

	it("are forwarded from the request config", () => {
		const foundHeader = requestHeaders.find((header) => header.name === extraHeader.name);
		expect(foundHeader?.value).toEqual(extraHeader.value);
	});
});

describe("Continuation Token Header — when provided in the request", async () => {
	const continuationTokenValue = "x";
	const requestHeaders = await captureRequestHeaders({ headers: { "X-Continuation": continuationTokenValue } });

	it("is sent to the API", () => {
		const foundHeader = requestHeaders.find((header) => header.name === ("X-Continuation" satisfies ContinuationTokenHeaderName));
		expect(foundHeader?.value).toEqual(continuationTokenValue);
	});
});

describe("Continuation Token Header — when not provided", async () => {
	const requestHeaders = await captureRequestHeaders();

	it("is not sent to the API", () => {
		const foundHeader = requestHeaders.find((header) => header.name === ("X-Continuation" satisfies ContinuationTokenHeaderName));
		expect(foundHeader).toBeUndefined();
	});
});
