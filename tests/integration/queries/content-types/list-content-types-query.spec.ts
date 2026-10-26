import { describe, expect, it } from "vitest";
import { DeliverySdkError } from "../../../../lib/models/error.models.js";
import { listContentTypesSchema } from "../../../../lib/queries/content-types/schemas/content-type.schemas.js";
import {
	createFailingClient,
	createIntegrationClient,
	createMockedClient,
	expectToMatchSchema,
	getExpectedUrl,
} from "../../../utils/integration-test.utils.js";
import { isPagedFetchQueryWithExpectedFunctions } from "../../../utils/test.utils.js";
import rawPayload from "./list-content-types-query.payload.js";

describe("List content types query", () => {
	const schema = listContentTypesSchema();

	describe("with mocked response", () => {
		const client = createMockedClient(rawPayload);
		const query = client.listContentTypes({ config: { schema } });

		it("requests the 'types' endpoint", () => {
			expect(query.inspect().data?.url).toEqual(getExpectedUrl(client, "types"));
		});

		it("is a paged fetch query", () => {
			expect(isPagedFetchQueryWithExpectedFunctions(query)).toBe(true);
		});

		it("fetchPage returns the mocked payload", async () => {
			const { payload } = await query.fetchPage();
			expect(payload).toEqual(rawPayload);
		});

		it("fetchAllPages returns the mocked payload as the first page", async () => {
			const { responses } = await query.fetchAllPages();
			expect(responses[0]?.payload).toEqual(rawPayload);
		});

		it("pages() yields the mocked payload as the first page", async () => {
			const { value } = await query.pages().next();
			expect(value?.payload).toEqual(rawPayload);
		});
	});

	describe("against integration environment", () => {
		const client = createIntegrationClient();
		const query = client.listContentTypes({ config: { schema } });

		it("fetchPage returns a payload matching the schema", async () => {
			const { payload } = await query.fetchPage();
			await expectToMatchSchema(schema, payload);
		});

		it("fetchAllPages returns pages that all match the schema", async () => {
			const { responses } = await query.fetchAllPages();
			expect(responses.length).toBeGreaterThan(0);
			for (const { payload } of responses) {
				await expectToMatchSchema(schema, payload);
			}
		});
	});

	it("wraps request failures in DeliverySdkError", async () => {
		const { error } = await createFailingClient().listContentTypes().fetchPageSafe();
		expect(error).toBeInstanceOf(DeliverySdkError);
	});
});
