import { describe, expect, it } from "vitest";
import { DeliverySdkError } from "../../../../lib/models/error.models.js";
import {
	listContentItemsSchema,
	listContentItemsSchemaExtended,
} from "../../../../lib/queries/content-items/schemas/content-item.schemas.js";
import {
	createFailingClient,
	createIntegrationClient,
	createMockedClient,
	expectToMatchSchema,
	getExpectedUrl,
} from "../../../utils/integration-test.utils.js";
import { isPagedFetchQueryWithExpectedFunctions } from "../../../utils/test.utils.js";
import {
	expectMovieCastItemsToBeResolvedStars,
	expectMovieDescriptionItemsToBeResolved,
	getAllItems,
	getMovies,
} from "../../models/integration-test.extra-tests.js";
import type { IntegrationTestProjectSchema } from "../../models/integration-test.schema.js";
import rawPayload from "./list-content-items-query.payload.js";

describe("List content items query", () => {
	const schema = listContentItemsSchema<IntegrationTestProjectSchema>();

	describe("with mocked response", () => {
		const client = createMockedClient<IntegrationTestProjectSchema>(rawPayload);
		const query = client.listContentItems().raw({ schema });

		it("requests the 'items' endpoint", () => {
			expect(query.inspect().data?.url).toEqual(getExpectedUrl(client, "items"));
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
		const client = createIntegrationClient<IntegrationTestProjectSchema>();
		const query = client.listContentItems().raw({ schema });

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
		const { error } = await createFailingClient().listContentItems().fetchPageSafe();
		expect(error).toBeInstanceOf(DeliverySdkError);
	});
});

describe("List content items query - extended", () => {
	const schema = listContentItemsSchemaExtended<IntegrationTestProjectSchema>();

	describe("against integration environment", () => {
		const client = createIntegrationClient<IntegrationTestProjectSchema>();
		const query = client.listContentItems({ config: { schema } });

		it("requests the 'items' endpoint", () => {
			expect(query.inspect().data?.url).toEqual(getExpectedUrl(client, "items"));
		});

		it("is a paged fetch query", () => {
			expect(isPagedFetchQueryWithExpectedFunctions(query)).toBe(true);
		});

		it("fetchAllPages returns pages that all match the extended schema", async () => {
			const { responses } = await query.fetchAllPages();
			expect(responses.length).toBeGreaterThan(0);
			for (const { payload } of responses) {
				await expectToMatchSchema(schema, payload);
			}
		});

		it("returns at least one movie across all pages", async () => {
			const { responses } = await query.fetchAllPages();
			expect(getMovies(getAllItems(responses.map((r) => r.payload))).length).toBeGreaterThan(0);
		});

		it("resolves movie cast items as Star items matching the extended item schema", async () => {
			const { responses } = await query.fetchAllPages();
			expectMovieCastItemsToBeResolvedStars(getMovies(getAllItems(responses.map((r) => r.payload))));
		});

		it("resolves movie rich-text description items matching the extended item schema", async () => {
			const { responses } = await query.fetchAllPages();
			expectMovieDescriptionItemsToBeResolved(getMovies(getAllItems(responses.map((r) => r.payload))));
		});
	});

	it("wraps request failures in DeliverySdkError", async () => {
		const { error } = await createFailingClient<IntegrationTestProjectSchema>()
			.listContentItems({ config: { schema } })
			.fetchPageSafe();
		expect(error).toBeInstanceOf(DeliverySdkError);
	});
});
