import { describe, expect, it } from "vitest";
import { getDeliveryClient } from "../../../lib/client/delivery-client.js";
import { listLanguagesPayloadSchema } from "../../../lib/queries/languages/language.models.js";
import { getIntegrationTestConfig } from "../../integration-tests.config.js";

describe("List languages query", async () => {
	const config = getIntegrationTestConfig();
	const client = getDeliveryClient(config.env.id).publicApi().create({
		baseUrl: config.env.deliveryBaseUrl,
	});

	const { response } = await client.listLanguages().toPromise();

	it("Response payload should match schema", async () => {
		const parseResult = await listLanguagesPayloadSchema.safeParseAsync(response?.payload);
		expect(parseResult.error).toBeUndefined();
		expect(parseResult.success).toBeTruthy();
	});

	it("Response should contain at least one language", () => {
		expect(response?.payload.languages.length).toBeGreaterThanOrEqual(1);
	});
});
