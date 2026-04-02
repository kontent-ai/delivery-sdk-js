import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ListLanguagesPayload } from "../../../../lib/queries/languages/language.models.js";

export default {
	languages: [
		{
			system: {
				id: "00000000-0000-0000-0000-000000000000",
				name: "Default project language",
				codename: "default",
			},
		},
	],
	pagination: {
		skip: 0,
		limit: 0,
		count: 1,
		next_page: "",
	},
} satisfies ListLanguagesPayload<DeliveryClientSchema>;
