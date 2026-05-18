import { describe } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ListContentTypesPayload } from "../../../../lib/queries/content-types/models/content-type.models.js";
import { listContentTypesSchema } from "../../../../lib/queries/content-types/schemas/content-type.schemas.js";
import { runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import rawPayload from "./list-content-types-query.payload.js";

describe("List content types query", async () => {
	await runQueryTestsAsync<ListContentTypesPayload<DeliveryClientSchema>>({
		endpoint: "types",
		rawPayload,
		selectQuery: (client) => client.listContentTypes(),
		expectedSchema: listContentTypesSchema(),
	});
});
