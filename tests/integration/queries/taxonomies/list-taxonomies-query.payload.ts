import type { ListTaxonomiesPayload } from "../../../../lib/queries/taxonomies/models/taxonomy.models.js";
import type { IntegrationTestProjectSchema, MovieTaxonomyTerms } from "../../models/integration-test.schema.js";

export default {
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
} satisfies ListTaxonomiesPayload<IntegrationTestProjectSchema, MovieTaxonomyTerms>;
