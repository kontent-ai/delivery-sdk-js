import { describe, expect, it } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import { type ContentTypePayload, contentTypePayload } from "../../../../lib/queries/content-types/content-type.models.js";
import { getIntegrationTestsSchema, runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import unitTestPayload from "./fetch-content-type-query.payload.js";

describe("Fetch content type query", async () => {
	const codename = "movie";
	await runQueryTestsAsync<ContentTypePayload<DeliveryClientSchema>>({
		endpoint: `types/${codename}`,
		unitTestPayload,
		selectQuery: (client) => client.fetchContentType({ codename: codename }),
		expectedSchema: contentTypePayload(getIntegrationTestsSchema()),
	});
});

describe("Fetch content type query with extra field in element", async () => {
	const payload = {
		system: {
			id: "445da25c-d991-4b0e-bece-c572124d91f5",
			name: "Movie",
			codename: "movie",
			last_modified: "2026-02-26T14:02:39.320664Z",
		},
		elements: {
			title: {
				type: "text",
				name: "Title",
				extra: "Field",
			},
		},
	};

	const { success } = await contentTypePayload(getIntegrationTestsSchema()).safeParseAsync(payload);

	it("Parsing should be successful when extra field is present in element", () => {
		expect(success).toBeTruthy();
	});
});

describe("Fetch content type query with invalid field type in element should fail", async () => {
	const payload = {
		system: {
			id: "445da25c-d991-4b0e-bece-c572124d91f5",
			name: "Movie",
			codename: "movie",
			last_modified: "2026-02-26T14:02:39.320664Z",
		},
		elements: {
			title: {
				type: "invalid_field",
				name: "Title",
			},
		},
	};

	const { success } = await contentTypePayload(getIntegrationTestsSchema()).safeParseAsync(payload);

	it("Parsing should fail when invalid field type is present in element", () => {
		expect(success).toBeFalsy();
	});
});

describe("Fetch query with missing system field should fail", async () => {
	const payload = {
		system: {
			id: "445da25c-d991-4b0e-bece-c572124d91f5",
			name: "Movie",
			codename: "movie",
		},
		elements: {
			title: {
				type: "invalid_field",
				name: "Title",
			},
		},
	};

	const { success } = await contentTypePayload(getIntegrationTestsSchema()).safeParseAsync(payload);

	it("Parsing should fail when system field is missing", () => {
		expect(success).toBeFalsy();
	});
});
