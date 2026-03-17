import { describe } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import { type TaxonomyPayload, taxonomyPayload } from "../../../../lib/queries/taxonomies/taxonomy.models.js";
import { getIntegrationTestsSchema, runQueryTestsAsync } from "../../../utils/integration-test.utils.js";

describe("Fetch taxonomy query", async () => {
	const taxonomyCodename = "movie_type";
	await runQueryTestsAsync<TaxonomyPayload<DeliveryClientSchema>>({
		endpoint: `taxonomies/${taxonomyCodename}`,
		unitTestPayload: {
			system: {
				id: "b7f516a3-36b9-4108-919f-ed83ea91926e",
				name: "Movie type",
				codename: "movie_type",
				last_modified: "2026-02-26T10:12:41.5176081Z",
			},
			terms: [
				{
					name: "Drama",
					codename: "drama",
					terms: [],
				},
				{
					name: "Comedy",
					codename: "comedy",
					terms: [
						{
							name: "Sitcom",
							codename: "sitcom",
							terms: [],
						},
						{
							name: "Stand-up",
							codename: "stand_up",
							terms: [],
						},
					],
				},
				{
					name: "Action",
					codename: "action",
					terms: [],
				},
			],
		},
		selectQuery: (client) => client.fetchTaxonomy({ codename: taxonomyCodename }),
		expectedSchema: taxonomyPayload(getIntegrationTestsSchema()),
	});
});
