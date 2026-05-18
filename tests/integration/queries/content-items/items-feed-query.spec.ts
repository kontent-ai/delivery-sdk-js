import { describe } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ItemsFeedPayload } from "../../../../lib/queries/content-items/models/content-item.models.js";
import { itemsFeedSchema } from "../../../../lib/queries/content-items/schemas/content-item.schemas.js";
import { runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import unitTestPayload from "./items-feed-query.payload.js";

describe("Items feed query", async () => {
	await runQueryTestsAsync<ItemsFeedPayload<DeliveryClientSchema>>({
		endpoint: "items-feed",
		rawPayload: unitTestPayload,
		selectQuery: (client) => client.itemsFeed().raw(),
		expectedSchema: itemsFeedSchema(),
	});
});

describe("Items feed query - extended", async () => {
	await runQueryTestsAsync({
		endpoint: "items-feed",
		rawPayload: undefined,
		selectQuery: (client) => client.itemsFeed(),
		expectedSchema: itemsFeedSchema(),
	});
});
