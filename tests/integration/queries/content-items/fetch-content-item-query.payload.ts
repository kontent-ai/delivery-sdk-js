import type { FetchContentItemPayload } from "../../../../lib/queries/content-items/models/content-item.models.js";
import type { IntegrationTestProjectSchema } from "../../models/integration-test.schema.js";

export default {
	item: {
		system: {
			id: "21586dc9-9c04-4c9e-a9e4-83b8cd65baef",
			name: "The Dark Knight",
			codename: "the_dark_knight",
			language: "default",
			type: "movie",
			collection: "default",
			sitemap_locations: [],
			last_modified: "2026-05-04T10:30:48.5100633Z",
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
				value: "The Dark Knight",
			},
			length_in_minutes: {
				type: "number",
				name: "Length in minutes",
				value: 152,
			},
			description: {
				type: "rich_text",
				name: "Description",
				images: {},
				links: {},
				modular_content: [],
				value: "<p>Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, he sets out to dismantle the remaining criminal organizations that plague Gotham City. But the emergence of the Joker creates chaos.</p>",
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
				value: "2008-07-18T00:00:00Z",
				display_timezone: null,
			},
			cover: {
				type: "asset",
				name: "Cover",
				value: [
					{
						name: "The_Dark_Knight_(2008_film).jpg",
						description: null,
						type: "image/jpeg",
						size: 52188,
						url: "https://assets-eu-01.kc-usercontent.com:443/6bdd84fc-f71e-01a0-0ba6-79ce07af7f9b/1ee1e759-4af3-4f0a-acfc-b61a88c1eafe/The_Dark_Knight_%282008_film%29.jpg",
						width: 259,
						height: 383,
						renditions: {
							default: {
								rendition_id: "467ed3c4-6c7a-4cb3-908b-f908f7b1e7dd",
								preset_id: "a6d98cd5-8b2c-4e50-99c9-15192bce2490",
								width: 150,
								height: 150,
								query: "w=150&h=150&fit=clip&rect=54,122,150,150",
							},
						},
					},
				],
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
				value: "the-dark-knight",
			},
			metadata__metadata_description: {
				type: "text",
				name: "Metadata description",
				value: "Christopher Nolan's The Dark Knight is widely regarded as one of the greatest superhero films ever made.",
			},
			cast: {
				type: "modular_content",
				name: "Cast",
				value: ["christian_bale", "gary_oldman"],
			},
			custom: {
				type: "custom",
				name: "Custom",
				value: null,
			},
		},
	},
	modular_content: {
		christian_bale: {
			system: {
				id: "2630c0c1-f25a-46df-9dd2-f258ff0d3c60",
				name: "Christian Bale",
				codename: "christian_bale",
				language: "default",
				type: "star",
				collection: "default",
				sitemap_locations: [],
				last_modified: "2026-04-07T10:20:23.6060976Z",
				workflow: "default",
				workflow_step: "published",
			},
			elements: {
				firstname: {
					type: "text",
					name: "Firstname",
					value: "Christian",
				},
				lastname: {
					type: "text",
					name: "Lastname",
					value: "Bale",
				},
			},
		},
		gary_oldman: {
			system: {
				id: "55b225d8-9d62-4306-9a8f-16feea53a3ac",
				name: "Gary Oldman",
				codename: "gary_oldman",
				language: "default",
				type: "star",
				collection: "default",
				sitemap_locations: [],
				last_modified: "2026-04-07T10:23:57.9327818Z",
				workflow: "default",
				workflow_step: "published",
			},
			elements: {
				firstname: {
					type: "text",
					name: "Firstname",
					value: "Gary",
				},
				lastname: {
					type: "text",
					name: "Lastname",
					value: "Oldman",
				},
			},
		},
	},
} satisfies FetchContentItemPayload<IntegrationTestProjectSchema>;
