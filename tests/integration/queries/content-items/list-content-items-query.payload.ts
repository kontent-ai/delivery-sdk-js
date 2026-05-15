import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ListContentItemsPayload } from "../../../../lib/queries/content-items/models/content-item.models.js";

export default {
	items: [
		{
			system: {
				id: "f87989d8-ac15-4b87-b43a-37d85e0002f6",
				name: "Avengers: Endgame",
				codename: "avengers__endgame",
				language: "default",
				type: "movie",
				collection: "default",
				sitemap_locations: [],
				last_modified: "2026-04-07T10:25:39.8815857Z",
				workflow: "default",
				workflow_step: "published",
			},
			elements: {
				just_a_number_and_required: {
					type: "number",
					name: "just a number and required",
					value: null,
				},
				title: {
					type: "text",
					name: "Title",
					value: "Avengers: Endgame",
				},
				length_in_minutes: {
					type: "number",
					name: "Length in minutes",
					value: 181,
				},
				description: {
					type: "rich_text",
					name: "Description",
					images: {},
					links: {},
					modular_content: [],
					value: "<p>After the devastating events of Avengers: Infinity War, the remaining Avengers assemble one final time to undo Thanos' destruction and restore the universe. The epic conclusion to the Infinity Saga.</p>",
				},
				is_blockbuster: {
					type: "multiple_choice",
					name: "Is blockbuster",
					value: [
						{
							name: "yes",
							codename: "yes",
						},
					],
				},
				release_date: {
					type: "date_time",
					name: "Release date",
					value: "2019-04-26T00:00:00Z",
					display_timezone: null,
				},
				cover: {
					type: "asset",
					name: "Cover",
					value: [],
				},
				category: {
					type: "taxonomy",
					name: "Category",
					taxonomy_group: "movie_type",
					value: [
						{
							name: "Action",
							codename: "action",
						},
					],
				},
				url: {
					type: "url_slug",
					name: "Url",
					value: "avengers-endgame",
				},
				metadata__metadata_description: {
					type: "text",
					name: "Metadata description",
					value: "The highest-grossing film of all time upon release, Avengers: Endgame is the culmination of 22 Marvel Cinematic Universe films.",
				},
				cast: {
					type: "modular_content",
					name: "Cast",
					value: ["chris_evans", "scarlett_johansson", "robert_downey_jr_", "jeremy_renner"],
				},
				custom: {
					type: "custom",
					name: "Custom",
					value: null,
				},
			},
		},
		{
			system: {
				id: "292468fe-ac5a-4505-b6f1-83cbbee89687",
				name: "Black Panther",
				codename: "black_panther",
				language: "default",
				type: "movie",
				collection: "default",
				sitemap_locations: [],
				last_modified: "2026-04-07T10:25:53.6784162Z",
				workflow: "default",
				workflow_step: "published",
			},
			elements: {
				just_a_number_and_required: {
					type: "number",
					name: "just a number and required",
					value: null,
				},
				title: {
					type: "text",
					name: "Title",
					value: "Black Panther",
				},
				length_in_minutes: {
					type: "number",
					name: "Length in minutes",
					value: 134,
				},
				description: {
					type: "rich_text",
					name: "Description",
					images: {},
					links: {},
					modular_content: [],
					value: "<p>T'Challa returns home to the African nation of Wakanda to take his rightful place as king. When a powerful enemy with ties to his past threatens to destroy the country, he must rally his allies and release the full power of the Black Panther.</p>",
				},
				is_blockbuster: {
					type: "multiple_choice",
					name: "Is blockbuster",
					value: [
						{
							name: "yes",
							codename: "yes",
						},
					],
				},
				release_date: {
					type: "date_time",
					name: "Release date",
					value: "2018-02-16T00:00:00Z",
					display_timezone: null,
				},
				cover: {
					type: "asset",
					name: "Cover",
					value: [],
				},
				category: {
					type: "taxonomy",
					name: "Category",
					taxonomy_group: "movie_type",
					value: [
						{
							name: "Action",
							codename: "action",
						},
					],
				},
				url: {
					type: "url_slug",
					name: "Url",
					value: "black-panther",
				},
				metadata__metadata_description: {
					type: "text",
					name: "Metadata description",
					value: "Marvel's Black Panther became a cultural phenomenon and was nominated for 7 Academy Awards including Best Picture.",
				},
				cast: {
					type: "modular_content",
					name: "Cast",
					value: ["chadwick_boseman", "lupita_nyong_o"],
				},
				custom: {
					type: "custom",
					name: "Custom",
					value: null,
				},
			},
		},
	],
	modular_content: {
		chadwick_boseman: {
			system: {
				id: "831a6311-5e6a-40ee-bb2e-a1a51439b1e1",
				name: "Chadwick Boseman",
				codename: "chadwick_boseman",
				language: "default",
				type: "star",
				collection: "default",
				sitemap_locations: [],
				last_modified: "2026-04-07T10:21:12.1866334Z",
				workflow: "default",
				workflow_step: "published",
			},
			elements: {
				firstname: {
					type: "text",
					name: "Firstname",
					value: "Chadwick",
				},
				lastname: {
					type: "text",
					name: "Lastname",
					value: "Boseman",
				},
			},
		},
		chris_evans: {
			system: {
				id: "7a6f289c-3c2f-4b8d-a66e-f7361e8a2a6f",
				name: "Chris Evans",
				codename: "chris_evans",
				language: "default",
				type: "star",
				collection: "default",
				sitemap_locations: [],
				last_modified: "2026-04-07T10:21:20.9296898Z",
				workflow: "default",
				workflow_step: "published",
			},
			elements: {
				firstname: {
					type: "text",
					name: "Firstname",
					value: "Chris",
				},
				lastname: {
					type: "text",
					name: "Lastname",
					value: "Evans",
				},
			},
		},
		jeremy_renner: {
			system: {
				id: "d87ce611-4f91-451e-8fa2-24f0922ba71c",
				name: "Jeremy Renner",
				codename: "jeremy_renner",
				language: "default",
				type: "star",
				collection: "default",
				sitemap_locations: [],
				last_modified: "2026-04-07T10:21:55.7508643Z",
				workflow: "default",
				workflow_step: "published",
			},
			elements: {
				firstname: {
					type: "text",
					name: "Firstname",
					value: "Jeremy",
				},
				lastname: {
					type: "text",
					name: "Lastname",
					value: "Renner",
				},
			},
		},
		lupita_nyong_o: {
			system: {
				id: "2c71df49-6390-453f-b2dd-12467406b350",
				name: "Lupita Nyong'o",
				codename: "lupita_nyong_o",
				language: "default",
				type: "star",
				collection: "default",
				sitemap_locations: [],
				last_modified: "2026-04-07T10:21:13.5243957Z",
				workflow: "default",
				workflow_step: "published",
			},
			elements: {
				firstname: {
					type: "text",
					name: "Firstname",
					value: "Lupita",
				},
				lastname: {
					type: "text",
					name: "Lastname",
					value: "Nyong'o",
				},
			},
		},
		robert_downey_jr_: {
			system: {
				id: "bbc14c55-9d5b-4c75-a968-6e17799987a7",
				name: "Robert Downey Jr.",
				codename: "robert_downey_jr_",
				language: "default",
				type: "star",
				collection: "default",
				sitemap_locations: [],
				last_modified: "2026-04-07T10:22:45.6740229Z",
				workflow: "default",
				workflow_step: "published",
			},
			elements: {
				firstname: {
					type: "text",
					name: "Firstname",
					value: "Robert",
				},
				lastname: {
					type: "text",
					name: "Lastname",
					value: "Downey Jr.",
				},
			},
		},
		scarlett_johansson: {
			system: {
				id: "70c23859-845e-40d6-86f7-2c1865ff828d",
				name: "Scarlett Johansson",
				codename: "scarlett_johansson",
				language: "default",
				type: "star",
				collection: "default",
				sitemap_locations: [],
				last_modified: "2026-04-07T10:20:20.2541643Z",
				workflow: "default",
				workflow_step: "published",
			},
			elements: {
				firstname: {
					type: "text",
					name: "Firstname",
					value: "Scarlett",
				},
				lastname: {
					type: "text",
					name: "Lastname",
					value: "Johansson",
				},
			},
		},
	},
	pagination: {
		skip: 0,
		limit: 2,
		count: 2,
		next_page: "https://deliver.kontent.ai/6bdd84fc-f71e-01a0-0ba6-79ce07af7f9b/items?system.type=movie&limit=2&skip=2",
	},
} satisfies ListContentItemsPayload<DeliveryClientSchema>;
