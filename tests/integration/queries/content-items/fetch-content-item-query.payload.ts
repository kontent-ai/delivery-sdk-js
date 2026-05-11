import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { FetchContentItemPayload } from "../../../../lib/queries/content-items/models/content-item.models.js";

export default {
	item: {
		system: {
			id: "d7862a9a-0333-491c-9db9-ee91a7828a84",
			name: "Brad Pitt",
			codename: "brad_pitt",
			language: "default",
			type: "star",
			collection: "default",
			sitemap_locations: [],
			last_modified: "2026-04-07T10:20:15.7816154Z",
			workflow: "default",
			workflow_step: "published",
		},
		elements: {
			firstname: {
				type: "text",
				name: "Firstname",
				value: "Brad",
			},
			lastname: {
				type: "text",
				name: "Lastname",
				value: "Pitt",
			},
		},
	},
	modular_content: {},
} satisfies FetchContentItemPayload<DeliveryClientSchema>;
