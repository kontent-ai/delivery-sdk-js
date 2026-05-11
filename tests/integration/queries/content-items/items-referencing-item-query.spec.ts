import { describe } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ItemsReferencingItemPayload } from "../../../../lib/queries/content-items/content-item.models.js";
import { itemsReferencingItemSchema } from "../../../../lib/queries/content-items/content-item.schemas.js";
import { getIntegrationTestsSchema, runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import unitTestPayload from "./items-referencing-item-query.payload.js";

describe("Items referencing item query", async () => {
	const itemCodename = "the_dark_knight";
	await runQueryTestsAsync<ItemsReferencingItemPayload<DeliveryClientSchema>>({
		endpoint: `items/${itemCodename}/used-in`,
		unitTestPayload,
		selectQuery: (client) => client.itemsReferencingItem({ codename: itemCodename }),
		expectedSchema: itemsReferencingItemSchema(getIntegrationTestsSchema()),
	});
});
