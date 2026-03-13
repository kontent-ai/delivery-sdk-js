import { getTestHttpServiceWithJsonResponse } from "@kontent-ai/core-sdk/testkit";
import { describe, expect, it } from "vitest";
import { createDeliveryClient } from "../../../lib/public_api.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

describe("Custom base URL API", async () => {
	const customBaseUrl = "https://domain.com";

	const query = createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
		schema: {
			languageCodenames: [],
			taxonomyCodenames: [],
		},
		httpService: getTestHttpServiceWithJsonResponse({
			jsonResponse: {},
			statusCode: 200,
		}),
		baseUrl: customBaseUrl,
	}).listLanguages();

	// execute query so that http service is called and request headers are captured
	const { response } = await query.fetchPageSafe();

	it("URL should point to custom base URL", () => {
		const { origin } = new URL(response?.meta?.url ?? "n/a");
		expect(origin).toEqual(customBaseUrl);
	});
});
