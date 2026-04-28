import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ItemsReferencingItemPayload } from "../../../../lib/queries/content-items/content-item.models.js";

export default {
	items: [
		{
			system: {
				id: "21586dc9-9c04-4c9e-a9e4-83b8cd65baef",
				name: "The Dark Knight",
				codename: "the_dark_knight",
				language: "default",
				type: "movie",
				collection: "default",
				workflow: "default",
				workflow_step: "published",
				last_modified: "2026-04-07T10:36:42.4587906Z",
			},
		},
	],
} satisfies ItemsReferencingItemPayload<DeliveryClientSchema>;
