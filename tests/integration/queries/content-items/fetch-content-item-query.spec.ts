import { describe } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { FetchContentItemPayload } from "../../../../lib/queries/content-items/models/content-item.models.js";
import { fetchContentItemSchemaExtended } from "../../../../lib/queries/content-items/schemas/content-item.schemas.js";
import { runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import unitTestPayload from "./fetch-content-item-query.payload.js";

describe("Fetch content item query", async () => {
	const codename = unitTestPayload.item.system.codename;
	await runQueryTestsAsync<FetchContentItemPayload<DeliveryClientSchema>>({
		endpoint: `items/${codename}`,
		unitTestPayload,
		selectQuery: (client) => client.fetchContentItem({ codename }),
		expectedSchema: fetchContentItemSchemaExtended(),
	});
});
