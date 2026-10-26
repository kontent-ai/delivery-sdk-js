import { describe, expect, it } from "vitest";
import { DeliverySdkError } from "../../../../lib/models/error.models.js";
import { contentTypeSchema } from "../../../../lib/queries/content-types/schemas/content-type.schemas.js";
import {
	createFailingClient,
	createIntegrationClient,
	createMockedClient,
	expectToMatchSchema,
	getExpectedUrl,
} from "../../../utils/integration-test.utils.js";
import { isFetchQueryWithExpectedFunctions } from "../../../utils/test.utils.js";
import rawPayload from "./fetch-content-type-query.payload.js";

describe("Fetch content type query", () => {
	const codename = "movie";
	const schema = contentTypeSchema();

	describe("with mocked response", () => {
		const client = createMockedClient(rawPayload);
		const query = client.fetchContentType({ codename, config: { schema } });

		it(`requests the 'types/${codename}' endpoint`, () => {
			expect(query.inspect().data?.url).toEqual(getExpectedUrl(client, `types/${codename}`));
		});

		it("is a fetch query", () => {
			expect(isFetchQueryWithExpectedFunctions(query)).toBe(true);
		});

		it("fetch returns the mocked payload", async () => {
			const { payload } = await query.fetch();
			expect(payload).toEqual(rawPayload);
		});
	});

	describe("against integration environment", () => {
		const client = createIntegrationClient();
		const query = client.fetchContentType({ codename, config: { schema } });

		it("fetch returns a payload matching the schema", async () => {
			const { payload } = await query.fetch();
			await expectToMatchSchema(schema, payload);
		});
	});

	it("wraps request failures in DeliverySdkError", async () => {
		const { error } = await createFailingClient().fetchContentType({ codename }).fetchSafe();
		expect(error).toBeInstanceOf(DeliverySdkError);
	});
});

describe("Content type schema", () => {
	const system = {
		id: "445da25c-d991-4b0e-bece-c572124d91f5",
		name: "Movie",
		codename: "movie",
		last_modified: "2026-02-26T14:02:39.320664Z",
	};

	it("parses successfully when extra fields are present in an element", async () => {
		const { success } = await contentTypeSchema().safeParseAsync({
			system,
			elements: { title: { type: "text", name: "Title", extra: "Field" } },
		});
		expect(success).toBe(true);
	});

	it("fails to parse when an invalid field type is present in an element", async () => {
		const { success } = await contentTypeSchema().safeParseAsync({
			system,
			elements: { title: { type: "invalid_field", name: "Title" } },
		});
		expect(success).toBe(false);
	});

	it("fails to parse when the system 'last_modified' field is missing", async () => {
		const { success } = await contentTypeSchema().safeParseAsync({
			system: { id: system.id, name: system.name, codename: system.codename },
			elements: { title: { type: "text", name: "Title" } },
		});
		expect(success).toBe(false);
	});
});
