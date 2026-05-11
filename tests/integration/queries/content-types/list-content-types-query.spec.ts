import { describe } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ListContentTypesPayload } from "../../../../lib/queries/content-types/content-type.models.js";
import { listContentTypesSchema } from "../../../../lib/queries/content-types/content-type.schemas.js";
import { getIntegrationTestsSchema, runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import unitTestPayload from "./list-content-types-query.payload.js";

describe("List content types query", async () => {
	await runQueryTestsAsync<ListContentTypesPayload<DeliveryClientSchema>>({
		endpoint: "types",
		unitTestPayload,
		selectQuery: (client) => client.listContentTypes(),
		expectedSchema: listContentTypesSchema(getIntegrationTestsSchema()),
	});
});
