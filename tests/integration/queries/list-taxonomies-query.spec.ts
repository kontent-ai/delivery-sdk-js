import { describe } from "vitest";
import type { DeliveryClientSchema } from "../../../lib/models/core.models.js";
import { type ListTaxonomiesPayload, listTaxonomiesPayload } from "../../../lib/queries/taxonomies/taxonomy.models.js";
import { getIntegrationTestsSchema, runQueryTestsAsync } from "../../utils/integration-test.utils.js";

describe("List taxonomies query", async () => {
	await runQueryTestsAsync<ListTaxonomiesPayload<DeliveryClientSchema>>({
		endpoint: "taxonomies",
		unitTestPayload: {
			taxonomies: [
				{
					system: {
						id: "b7f516a3-36b9-4108-919f-ed83ea91926e",
						name: "Movie type",
						codename: "movie_type",
						last_modified: "2026-02-26T10:12:21.5095299Z",
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
			],
			pagination: {
				skip: 0,
				limit: 0,
				count: 1,
				next_page: "",
			},
		},
		selectQuery: (client) => client.listTaxonomies(),
		expectedSchema: listTaxonomiesPayload(getIntegrationTestsSchema()),
	});
});
