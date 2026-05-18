import { describe } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import { createDeliveryClient } from "../../../../lib/public_api.js";
import type { FetchContentItemPayload } from "../../../../lib/queries/content-items/models/content-item.models.js";
import {
	fetchContentItemSchema,
	fetchContentItemSchemaExtended,
} from "../../../../lib/queries/content-items/schemas/content-item.schemas.js";
import { getIntegrationTestConfig } from "../../../integration-tests.config.js";
import { runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import rawPayload from "./fetch-content-item-query.payload.js";

describe("Fetch content item query", async () => {
	const codename = rawPayload.item.system.codename;
	await runQueryTestsAsync<FetchContentItemPayload<DeliveryClientSchema>>({
		endpoint: `items/${codename}`,
		rawPayload,
		selectQuery: (client) => client.fetchContentItem({ codename }).raw(),
		expectedSchema: fetchContentItemSchema(),
		extendedQuery: {
			expectedSchema: fetchContentItemSchemaExtended(),
			selectQuery: (client) => client.fetchContentItem({ codename }),
		},
	});

	const client = createDeliveryClient({ apiMode: "public", environmentId: getIntegrationTestConfig().env.id });
	const { payload } = await client.fetchContentItem({ codename }).fetch();

	if (payload.item.elements.cast?.type === "modular_content") {
		console.log(payload.item.elements.cast.items);
	}
});
