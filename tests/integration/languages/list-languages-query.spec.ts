import { describe, expect, it } from "vitest";
import { createDeliveryClient } from "../../../lib/client/delivery-client.js";
import { listLanguagesPayload } from "../../../lib/queries/languages/language.models.js";
import { getIntegrationTestConfig } from "../../integration-tests.config.js";
import { isPagingQuery } from "../../utils/test.utils.js";

describe("List languages query", async () => {
	const config = getIntegrationTestConfig();
	const client = createDeliveryClient(config.env.id).withUnknownSchema().publicApi().create({
		baseUrl: config.env.deliveryBaseUrl,
	});

	const { response, success, error } = await client.listLanguages().toPromise();

	it("Query should be a paging query", () => {
		expect(isPagingQuery(client.listLanguages())).toBeTruthy();
	});

	it("Response should be successful", () => {
		expect(success).toBeTruthy();
		expect(error).toBeUndefined();
	});

	it("Response payload should match schema", async () => {
		const { error: parseError, success: parseSuccess } = await listLanguagesPayload({}).safeParseAsync(response?.payload);
		expect(parseSuccess).toBeTruthy();
		expect(parseError).toBeUndefined();
	});

	it("Response should contain at least one language", () => {
		expect(response?.payload?.languages?.length).toBeGreaterThanOrEqual(1);
	});
});
