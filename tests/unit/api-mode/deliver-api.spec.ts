import { getDefaultHttpAdapter, getDefaultHttpService, type Header, type KnownHeaderName } from "@kontent-ai/core-sdk";
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
		runtimeValidation: {
			validateResponses: false,
		},
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

	it("returns a successful response", () => {
		expect(success).toBeTruthy();
		expect(error).toBeUndefined();
	});

	it("does not include an authorization header", () => {
		const authorizationHeader = requestHeaders.find((header) => header.name === ("Authorization" satisfies KnownHeaderName));
		expect(authorizationHeader).toBeUndefined();
	});

	it("uses the public deliver API URL", () => {
		const { host } = new URL(response?.meta?.url ?? "n/a");
		expect(host).toEqual("deliver.kontent.ai");
	});
});
