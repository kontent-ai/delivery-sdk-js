import { describe } from "vitest";
import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ContentTypeElementPayload } from "../../../../lib/queries/content-types/models/content-type.models.js";
import { contentTypeElementSchema } from "../../../../lib/queries/content-types/schemas/content-type.schemas.js";
import { getIntegrationTestsSchema, runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import payloads from "./fetch-content-type-element-query.payload.js";

describe("Fetch content type element query", async () => {
	const typeCodename = "movie";

	const tests: readonly Promise<void>[] = payloads.map(async (payload) =>
		runQueryTestsAsync<ContentTypeElementPayload<DeliveryClientSchema>>({
			endpoint: `types/${typeCodename}/elements/${payload.codename}`,
			unitTestPayload: payload,
			selectQuery: (client) => client.fetchContentTypeElement({ typeCodename, elementCodename: payload.codename }),
			expectedSchema: contentTypeElementSchema(getIntegrationTestsSchema()),
		}),
	);

	await Promise.all(tests);
});
