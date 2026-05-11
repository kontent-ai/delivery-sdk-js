import { describe } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ItemsFeedPayload } from "../../../../lib/queries/content-items/content-item.models.js";
import { itemsFeedSchema } from "../../../../lib/queries/content-items/content-item.schemas.js";
import { getIntegrationTestsSchema, runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import unitTestPayload from "./items-feed-query.payload.js";

describe("Items feed query", async () => {
	await runQueryTestsAsync<ItemsFeedPayload<DeliveryClientSchema>>({
		endpoint: "items-feed",
		unitTestPayload,
		selectQuery: (client) => client.itemsFeed(),
		expectedSchema: itemsFeedSchema(getIntegrationTestsSchema()),
	});
});
