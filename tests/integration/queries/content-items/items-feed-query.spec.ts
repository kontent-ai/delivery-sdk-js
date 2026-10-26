import { describe } from "vitest";
import type { ItemsFeedPayloadExtended } from "../../../../lib/queries/content-items/models/content-item.models.js";
import { itemsFeedSchema, itemsFeedSchemaExtended } from "../../../../lib/queries/content-items/schemas/content-item.schemas.js";
import { runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import { registerExtendedItemsTests } from "../../models/integration-test.extra-tests.js";
import type { IntegrationTestProjectSchema } from "../../models/integration-test.schema.js";
import unitTestPayload from "./items-feed-query.payload.js";

describe("Items feed query", async () => {
	await runQueryTestsAsync({
		endpoint: "items-feed",
		rawPayload: unitTestPayload,
		selectQuery: (client, schema) => client.itemsFeed().raw({ schema }),
		expectedSchema: itemsFeedSchema(),
	});
});

describe("Items feed query - extended", async () => {
	await runQueryTestsAsync<ItemsFeedPayloadExtended<IntegrationTestProjectSchema>, IntegrationTestProjectSchema>({
		endpoint: "items-feed",
		rawPayload: undefined,
		selectQuery: (client, schema) => client.itemsFeed({ config: { schema } }),
		expectedSchema: itemsFeedSchemaExtended<IntegrationTestProjectSchema>(),
		extraTests: (payload) => {
			registerExtendedItemsTests(payload.items, payload.modular_content);
		},
	});
});
