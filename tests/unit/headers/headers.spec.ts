import { getDefaultHttpAdapter, getDefaultHttpService, getSdkIdHeader, type Header } from "@kontent-ai/core-sdk";
import { mockGlobalFetchJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createDeliveryClient } from "../../../lib/public_api.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

type ListLanguagesConfig = Parameters<ReturnType<typeof createDeliveryClient>["listLanguages"]>[0];

const waitingForLoadingNewContentHeader: Header = { name: "X-KC-Wait-For-Loading-New-Content", value: "true" };

async function captureRequestHeaders(listLanguagesConfig?: ListLanguagesConfig): Promise<readonly Header[]> {
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

	await client.listLanguages(listLanguagesConfig).fetchPageSafe();

	return captured;
}

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

	const requestHeaders = await captureRequestHeaders();

	it("Request headers should contain sync tracking header with current package info", () => {
		const syncTrackingHeader = requestHeaders.find((header) => header.name === expectedHeader.name);
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

	const requestHeaders = await captureRequestHeaders({ config: { bypassCdnCache: true } });

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

	const requestHeaders = await captureRequestHeaders();

	it("Request headers should NOT contain bypass CDN cache header", () => {
		const bypassCdnCacheHeader = requestHeaders.find((header) => header.name === waitingForLoadingNewContentHeader.name);
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

	const requestHeaders = await captureRequestHeaders({ config: { headers: [extraHeader] } });

	it("Request headers should contain extra header", () => {
		const foundHeader = requestHeaders.find((header) => header.name === extraHeader.name);
		expect(foundHeader?.value).toEqual("extra");
	});
});
