import { describe, expect, it } from "vitest";
import { DeliverySdkError } from "../../../../lib/models/error.models.js";
import {
	fetchContentItemSchema,
	fetchContentItemSchemaExtended,
} from "../../../../lib/queries/content-items/schemas/content-item.schemas.js";
import {
	createFailingClient,
	createIntegrationClient,
	createMockedClient,
	expectToMatchSchema,
	getExpectedUrl,
} from "../../../utils/integration-test.utils.js";
import { isFetchQueryWithExpectedFunctions } from "../../../utils/test.utils.js";
import { type IntegrationTestProjectSchema, isMovie, isStar } from "../../models/integration-test.schema.js";
import rawPayload from "./fetch-content-item-query.payload.js";

describe("Fetch content item query", () => {
	const codename = rawPayload.item.system.codename;
	const schema = fetchContentItemSchema<IntegrationTestProjectSchema>();

	describe("with mocked response", () => {
		const client = createMockedClient<IntegrationTestProjectSchema>(rawPayload);
		const query = client.fetchContentItem({ codename }).raw({ schema });

		it(`requests the 'items/${codename}' endpoint`, () => {
			expect(query.inspect().data?.url).toEqual(getExpectedUrl(client, `items/${codename}`));
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
		const client = createIntegrationClient<IntegrationTestProjectSchema>();
		const query = client.fetchContentItem({ codename }).raw({ schema });

		it("fetch returns a payload matching the schema", async () => {
			const { payload } = await query.fetch();
			await expectToMatchSchema(schema, payload);
		});
	});

	it("wraps request failures in DeliverySdkError", async () => {
		const { error } = await createFailingClient().fetchContentItem({ codename }).fetchSafe();
		expect(error).toBeInstanceOf(DeliverySdkError);
	});
});

describe("Fetch content item query - extended", () => {
	const codename = rawPayload.item.system.codename;
	const schema = fetchContentItemSchemaExtended<IntegrationTestProjectSchema>();

	describe("against integration environment", () => {
		const client = createIntegrationClient<IntegrationTestProjectSchema>();
		const query = client.fetchContentItem({ codename, config: { schema } });

		it(`requests the 'items/${codename}' endpoint`, () => {
			expect(query.inspect().data?.url).toEqual(getExpectedUrl(client, `items/${codename}`));
		});

		it("is a fetch query", () => {
			expect(isFetchQueryWithExpectedFunctions(query)).toBe(true);
		});

		it("fetch returns a payload matching the extended schema", async () => {
			const { payload } = await query.fetch();
			await expectToMatchSchema(schema, payload);
		});

		it("returns a movie whose cast items have the same codenames as the raw 'cast' value", async () => {
			const { payload } = await query.fetch();
			const item = payload.item;

			expect(isMovie(item)).toBe(true);
			if (!isMovie(item)) {
				return;
			}
			expect(item.elements.cast.items.map((m) => m.system.codename).toSorted()).toEqual(
				rawPayload.item.elements.cast.value.toSorted(),
			);
		});

		it("resolves cast items as Star items with defined elements", async () => {
			const { payload } = await query.fetch();
			const item = payload.item;

			expect(isMovie(item)).toBe(true);
			if (!isMovie(item)) {
				return;
			}
			for (const star of item.elements.cast.items) {
				expect(isStar(star)).toBe(true);
				expect(star.elements.firstname).toBeDefined();
				expect(star.elements.lastname).toBeDefined();
			}
		});
	});

	it("wraps request failures in DeliverySdkError", async () => {
		const { error } = await createFailingClient<IntegrationTestProjectSchema>()
			.fetchContentItem({ codename, config: { schema } })
			.fetchSafe();
		expect(error).toBeInstanceOf(DeliverySdkError);
	});
});
