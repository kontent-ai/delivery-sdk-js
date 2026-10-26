import { describe, expect, it } from "vitest";
import { DeliverySdkError } from "../../../../lib/models/error.models.js";
import { taxonomySchema } from "../../../../lib/queries/taxonomies/schemas/taxonomy.schemas.js";
import {
	createFailingClient,
	createIntegrationClient,
	createMockedClient,
	expectToMatchSchema,
	getExpectedUrl,
} from "../../../utils/integration-test.utils.js";
import { isFetchQueryWithExpectedFunctions } from "../../../utils/test.utils.js";
import rawPayload from "./fetch-taxonomy-query.payload.js";

describe("Fetch taxonomy query", () => {
	const codename = "movie_type";
	const schema = taxonomySchema();

	describe("with mocked response", () => {
		const client = createMockedClient(rawPayload);
		const query = client.fetchTaxonomy({ codename, config: { schema } });

		it(`requests the 'taxonomies/${codename}' endpoint`, () => {
			expect(query.inspect().data?.url).toEqual(getExpectedUrl(client, `taxonomies/${codename}`));
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
		const query = client.fetchTaxonomy({ codename, config: { schema } });

		it("fetch returns a payload matching the schema", async () => {
			const { payload } = await query.fetch();
			await expectToMatchSchema(schema, payload);
		});
	});

	it("wraps request failures in DeliverySdkError", async () => {
		const { error } = await createFailingClient().fetchTaxonomy({ codename }).fetchSafe();
		expect(error).toBeInstanceOf(DeliverySdkError);
	});
});
