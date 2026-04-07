import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ListContentItemsPayload } from "../../../../lib/queries/content-items/content-item.models.js";

export default {
	items: [
		{
			system: {
				id: "d56bff34-5ce8-4ac1-9cb8-547848b3a22b",
				name: "Al Pacino",
				codename: "al_pacino",
				language: "default",
				type: "star",
				collection: "default",
				sitemap_locations: [],
				last_modified: "2026-04-07T10:20:25.6499619Z",
				workflow: "default",
				workflow_step: "published",
			},
			elements: {
				firstname: {
					type: "text",
					name: "Firstname",
					value: "Al",
				},
				lastname: {
					type: "text",
					name: "Lastname",
					value: "Pacino",
				},
			},
		},
		{
			system: {
				id: "b25e6ed1-0a3f-4975-bb84-4c7efefa70d0",
				name: "Amy Adams",
				codename: "amy_adams",
				language: "default",
				type: "star",
				collection: "default",
				sitemap_locations: [],
				last_modified: "2026-04-07T10:21:17.8650469Z",
				workflow: "default",
				workflow_step: "published",
			},
			elements: {
				firstname: {
					type: "text",
					name: "Firstname",
					value: "Amy",
				},
				lastname: {
					type: "text",
					name: "Lastname",
					value: "Adams",
				},
			},
		},
	],
	modular_content: {},
	pagination: {
		skip: 0,
		limit: 2,
		count: 2,
		next_page: "",
	},
} satisfies ListContentItemsPayload<DeliveryClientSchema>;
