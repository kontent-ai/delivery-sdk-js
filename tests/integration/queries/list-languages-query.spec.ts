import { describe } from "vitest";
import type { DeliveryClientTypes } from "../../../lib/models/core.models.js";
import { type ListLanguagesPayload, listLanguagesPayload } from "../../../lib/queries/languages/language.models.js";
import { runQueryTestsAsync } from "../../utils/integration-test.utils.js";

describe("List languages query", async () => {
	await runQueryTestsAsync<ListLanguagesPayload<DeliveryClientTypes>>({
		endpoint: "languages",
		unitTestPayload: {
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
		},
		selectQuery: (client) => client.listLanguages(),
		expectedSchema: listLanguagesPayload({}),
	});
});
