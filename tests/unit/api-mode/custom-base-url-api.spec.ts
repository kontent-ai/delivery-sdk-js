import type { BaseUrl } from "@kontent-ai/core-sdk";
import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { describe, expect, it } from "vitest";
import { createDeliveryClient } from "../../../lib/public_api.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

describe("Custom base URL API", async () => {
	const customBaseUrl: BaseUrl = { protocol: "https", host: "domain.com" };

	const query = createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
		httpService: getTestHttpServiceWithJsonResponse({
			jsonResponse: {},
			statusCode: 200,
		}),
		runtimeValidation: {
			validateResponses: false,
		},
		baseUrl: customBaseUrl,
	}).listLanguages();

	// execute query so that http service is called and request headers are captured
	const { response } = await query.fetchPageSafe();

	it("uses the custom base URL", () => {
		const { origin } = new URL(response?.meta?.url ?? "n/a");
		expect(origin).toEqual(`${customBaseUrl.protocol}://${customBaseUrl.host}`);
	});
});
