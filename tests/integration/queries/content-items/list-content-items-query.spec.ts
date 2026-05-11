import { describe } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ListContentItemsPayload } from "../../../../lib/queries/content-items/models/content-item.models.js";
import { listContentItemsSchema } from "../../../../lib/queries/content-items/schemas/content-item.schemas.js";
import { runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import unitTestPayload from "./list-content-items-query.payload.js";

describe("List content items query", async () => {
	await runQueryTestsAsync<ListContentItemsPayload<DeliveryClientSchema>>({
		endpoint: "items",
		unitTestPayload,
		selectQuery: (client) => client.listContentItems(),
		expectedSchema: listContentItemsSchema(),
	});
});
