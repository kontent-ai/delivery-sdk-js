import { getDefaultHttpAdapter, getDefaultHttpService, isDefined, type Header, type KnownHeaderName } from "@kontent-ai/core-sdk";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createDeliveryClient } from "../../../lib/public_api.js";
import { stubFetchWithJsonResponse, unitEnvironmentId } from "../../utils/test.utils.js";


describe("Authorization token in custom mode",  () => {
	afterEach(() => {
		vi.resetAllMocks();
	});

	stubFetchWithJsonResponse({
		jsonResponse: {},
		statusCode: 200,
		continuationToken: "x",
	});

	const secureApiKey = "y";

	const requestHeaders: readonly Header[] = createDeliveryClient({
		environmentId: unitEnvironmentId,
    deliveryApiKey: secureApiKey,
    baseUrl: {
      host: "domain.com",
		 protocol: "https"
		}
	}).listContentItems().inspect().data?.requestHeaders.filter(isDefined) ?? [];


	it("includes an authorization header when custom base url and deliveryApiKey is present", () => {
		const authorizationHeader = requestHeaders.find((header) => header.name === ("Authorization" satisfies KnownHeaderName));
		expect(authorizationHeader?.value).toEqual(`Bearer ${secureApiKey}`);
	});
});
