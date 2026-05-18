import { describe, expect, it } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ContentTypePayload } from "../../../../lib/queries/content-types/models/content-type.models.js";
import { contentTypeSchema } from "../../../../lib/queries/content-types/schemas/content-type.schemas.js";
import { runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import rawPayload from "./fetch-content-type-query.payload.js";

describe("Fetch content type query", async () => {
	const codename = "movie";
	await runQueryTestsAsync<ContentTypePayload<DeliveryClientSchema>>({
		endpoint: `types/${codename}`,
		rawPayload,
		selectQuery: (client) => client.fetchContentType({ codename: codename }),
		expectedSchema: contentTypeSchema(),
	});
});

describe("Fetch Content Type Query — Extra Field in Element", async () => {
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

	const { success } = await contentTypeSchema().safeParseAsync(payload);

	it("parses successfully when extra fields are present in an element", () => {
		expect(success).toBeTruthy();
	});
});

describe("Fetch Content Type Query — Invalid Field Type in Element", async () => {
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

	const { success } = await contentTypeSchema().safeParseAsync(payload);

	it("fails to parse when an invalid field type is present in element", () => {
		expect(success).toBeFalsy();
	});
});

describe("Fetch Content Type Query — Missing System Field", async () => {
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

	const { success } = await contentTypeSchema().safeParseAsync(payload);

	it("fails to parse when the system field is missing", () => {
		expect(success).toBeFalsy();
	});
});
