import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ListContentTypesPayload } from "../../../../lib/queries/content-types/models/content-type.models.js";

export default {
	types: [
		{
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
				},
				length_in_minutes: {
					type: "number",
					name: "Length in minutes",
				},
				description: {
					type: "rich_text",
					name: "Description",
				},
				is_blockbuster: {
					type: "multiple_choice",
					name: "Is blockbuster",
					options: [
						{
							name: "yes",
							codename: "yes",
						},
					],
				},
				release_date: {
					type: "date_time",
					name: "Release date",
				},
				cover: {
					type: "asset",
					name: "Cover",
				},
				category: {
					type: "taxonomy",
					name: "Category",
					taxonomy_group: "movie_type",
				},
				url: {
					type: "url_slug",
					name: "Url",
				},
				metadata__metadata_description: {
					type: "text",
					name: "Metadata description",
				},
				cast: {
					type: "modular_content",
					name: "Cast",
				},
			},
		},
		{
			system: {
				id: "068c2ea7-144f-4472-ac0a-70e6f53034bf",
				name: "Star",
				codename: "star",
				last_modified: "2026-02-26T14:02:20.3307783Z",
			},
			elements: {
				firstname: {
					type: "text",
					name: "Firstname",
				},
				lastname: {
					type: "text",
					name: "Lastname",
				},
			},
		},
	],
	pagination: {
		skip: 0,
		limit: 0,
		count: 2,
		next_page: "",
	},
} satisfies ListContentTypesPayload<DeliveryClientSchema>;
