import { describe, expect, it } from "vitest";
import { createDeliveryClient } from "../../../lib/public_api.js";
import { unitEnvironmentId } from "../../utils/test.utils.js";

describe("Query parameters", () => {
	const client = createDeliveryClient({
		apiMode: "public",
		environmentId: unitEnvironmentId,
	});

	it("Skip and limit query parameters should be added to the url", () => {
		const { url } = client.listTaxonomies({
			query: {
				skip: 5,
				limit: 10,
			},
		});
		const parsedUrl = new URL(url);
		expect(parsedUrl.searchParams.get("skip")).toBe("5");
		expect(parsedUrl.searchParams.get("limit")).toBe("10");
	});
});
